import { createAgent, openai } from '@inngest/agent-kit';
import { inngest } from './client';

// test inngest function
export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
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

    console.log(output);

    return { message: output };
  }
);
