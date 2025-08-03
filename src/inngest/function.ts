import prisma from '@/lib/prisma';
import { Sandbox } from '@e2b/code-interpreter';
import { createNetwork } from '@inngest/agent-kit';
import { AgentState, codeAgent } from './agents';
import { inngest } from './client';
import { getSandbox } from './utils';

export const codeAgentFunction = inngest.createFunction(
  { id: 'code-agent-sandbox' },
  { event: 'code-agent-sandbox/run' },
  async ({ event, step }) => {
    // Create a new sandbox
    const sandbox_Id = await step.run('get-sandbox-id', async () => {
      const sandbox = await Sandbox.create('volt-nextjs-test');
      return sandbox.sandboxId;
    });
    // Get the sandbox from the sandbox ID
    const sandbox = await getSandbox(sandbox_Id);

    // Create a new network of agents (currently only one agent)
    const network = createNetwork<AgentState>({
      name: 'code-agent-network',
      agents: [codeAgent],
      maxIter: 10, // max number of iterations (10 calls)
      router: async ({ network }) => {
        // routes to the proper agent in the network based on the output of the previous agent.
        const summary = network.state.data.summary;
        if (summary) return;
        return codeAgent;
      },
    });

    // Initialize network state with sandbox for tools to access
    network.state.data.sandbox = sandbox;

    // Run the network
    const result = await network.run(`Write code for: ${event.data.message}`);

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      // get the url of the sandbox on port 3000 (as Next.js app runs on port 3000)
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run('save-to-db', async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            content: 'Something went wrong. Please try again.',
            role: 'ASSISTANT',
            type: 'ERROR',
          },
        });
      }
      return await prisma.message.create({
        data: {
          content: result.state.data.summary,
          role: 'ASSISTANT',
          type: 'RESULT',
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: 'fragment',
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: 'fragment',
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
