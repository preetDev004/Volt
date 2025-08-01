import { PROMPT } from '@/prompt';
import { createAgent, openai } from '@inngest/agent-kit';
import { createOrUpdateFile, readFile, terminal } from './tools';
import { lastAssistantMessageContent } from './utils';

// Create a new agent with a system prompt (you can add optional tools, too)
export const codeAgent = createAgent({
  name: 'code-agent',
  system: PROMPT,
  description: 'An expert coding Agent',
  model: openai({
    model: 'gpt-4.1',
    defaultParameters: { temperature: 0.2 },
  }),
  tools: [terminal, createOrUpdateFile, readFile],
  lifecycle: {
    onResponse: async ({ result, network }) => {
      const lastAssistanantMessageText =
        await lastAssistantMessageContent(result);
      if (
        lastAssistanantMessageText &&
        network &&
        lastAssistanantMessageText.includes('<task_summary>')
      ) {
        network.state.data.summary = lastAssistanantMessageText;
      }
      return result;
    },
  },
});
