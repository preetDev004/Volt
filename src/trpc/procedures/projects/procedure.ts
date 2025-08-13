import prisma from '@/lib/prisma';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { generateSlug } from 'random-word-slugs';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { inngest } from '@/inngest/client';

export const projectsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({ id: z.string().min(1, { message: 'Project ID is required' }) })
    )
    .query(async ({ input }) => {
      try {
        return await prisma.project.findUnique({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
          cause: error,
        });
      }
    }),
  getMany: baseProcedure.query(async () => {
    try {
      return await prisma.project.findMany({
        orderBy: {
          updatedAt: 'desc',
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Projects not found',
        cause: error,
      });
    }
  }),

  create: baseProcedure
    .input(
      z.object({
        prompt: z
          .string()
          .min(1, { message: 'Prompt is required' })
          .max(10000, { message: 'Prompt is too long' }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Use transaction for atomic operations
        const result = await prisma.$transaction(async tx => {
          const newProject = await tx.project.create({
            data: {
              name: generateSlug(3, { format: 'kebab' }),
              messages: {
                create: {
                  content: input.prompt,
                  role: 'USER',
                  type: 'RESULT',
                },
              },
            },
          });

          // Send to Inngest for background processing
          await inngest.send({
            name: 'code-agent-sandbox/run',
            data: {
              message: input.prompt,
              projectId: newProject.id,
            },
          });

          return newProject;
        });

        return result;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create project',
          cause: error,
        });
      }
    }),
});
