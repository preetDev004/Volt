import { createAgent, openai } from '@inngest/agent-kit';
import { inngest } from './client';
import { Sandbox } from '@e2b/code-interpreter';
import { getSandbox } from './utils';

// test inngest function
export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    const sandbox_Id = await step.run('get-sandbox-id', async () => {
      const sandbox = await Sandbox.create('volt-nextjs-test');

      return sandbox.sandboxId;
    });

    // Create a new agent with a system prompt (you can add optional tools, too)
    const codeAgent = createAgent({
      name: 'code-agent',
      system:
        'You are an expert code agent who has experience in typescript and react and nextjs. You write code in for projects that is React, Nextjs, Typescript, Tailwind, Shadcn, and supabase. You write readable, maintainable, clean code. You are focused to write Next.js and react snippes!',
      model: openai({ model: 'gpt-4o-mini' }),
    });

    const { output } = await codeAgent.run(
      `Write code for: ${event.data.text}`
    );

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sandbox_Id);
      // get the url of the sandbox on port 3000 (as Next.js app runs on port 3000)
      const host = sandbox.getHost(3000);

      return `https://${host}`;
    });

    return { output, sandboxUrl };
  }
);
