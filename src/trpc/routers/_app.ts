import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { inngest } from '../../inngest/client';
import { NextResponse } from 'next/server';

export const appRouter = createTRPCRouter({
  greet: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(opts => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),

  inngest_test: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: 'test/hello.world',
        data: {
          email: input.text,
        },
      });

      return { message: 'Event sent!' };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
