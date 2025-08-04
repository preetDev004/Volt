import { messagesRouter } from '@/trpc/procedures/messages/procedure';
import { projectsRouter } from '@/trpc/procedures/projects/procedure';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  projects: projectsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
