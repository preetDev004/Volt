import { inngest } from '@/inngest/client';
import prisma from '@/lib/prisma';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import z from 'zod';

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: 'Project ID is required' }),
      })
    )
    .query(async ({ input }) => {
      try {
        return await prisma.message.findMany({
          where: {
            projectId: input.projectId,
          },
          include: {
            fragment: true,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch messages',
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
        projectId: z.string().min(1, { message: 'Project ID is required' }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Use transaction for atomic operations
        const result = await prisma.$transaction(async tx => {
          const newMessage = await tx.message.create({
            data: {
              content: input.prompt,
              role: 'USER',
              type: 'RESULT',
              projectId: input.projectId,
            },
          });

          // Send to Inngest for background processing
          await inngest.send({
            name: 'code-agent-sandbox/run',
            data: {
              message: input.prompt,
              projectId: input.projectId,
            },
          });

          return newMessage;
        });

        return result;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create message',
          cause: error,
        });
      }
    }),
});
