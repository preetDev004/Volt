import { messagesRouter } from '@/trpc/procedures/messages/procedure';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
