import { inngest } from './client';

// test inngest function
export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    await step.sleep('wait-a-moment', '20s');
    await step.sleep('wait-another-moment', '5s');
    return { message: `Hello ${event.data.email}!` };
  }
);
