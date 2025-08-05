import { PROMPT } from '@/prompt';
import { createAgent, openai } from '@inngest/agent-kit';
import { createOrUpdateFile, readFile, terminal } from './tools';
import { lastAssistantMessageContent } from './utils';
import Sandbox from '@e2b/code-interpreter';

export interface AgentState {
  summary: string;
  files: { [path: string]: string };
  sandbox: Sandbox;
}
// Create a new agent with a system prompt (you can add optional tools, too)
export const codeAgent = createAgent<AgentState>({
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
        network.state.data.summary = lastAssistanantMessageText
          .split('<task_summary>')[1]
          .split('</task_summary>')[0];
      }
      return result;
    },
  },
});
