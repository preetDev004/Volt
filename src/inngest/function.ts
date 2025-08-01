import { Sandbox } from '@e2b/code-interpreter';
import { createNetwork } from '@inngest/agent-kit';
import { inngest } from './client';
import { getSandbox } from './utils';
import { codeAgent } from './agents';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    // Create a new sandbox
    const sandbox_Id = await step.run('get-sandbox-id', async () => {
      const sandbox = await Sandbox.create('volt-nextjs-test');
      return sandbox.sandboxId;
    });
    // Get the sandbox from the sandbox ID
    const sandbox = await getSandbox(sandbox_Id);

    // Create a new network of agents (currently only one agent)
    const network = createNetwork({
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
    const result = await network.run(`Write code for: ${event.data.text}`);

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      // get the url of the sandbox on port 3000 (as Next.js app runs on port 3000)
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return {
      url: sandboxUrl,
      title: 'fragment',
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
