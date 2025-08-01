import { Sandbox } from '@e2b/code-interpreter';
import { AgentResult, TextMessage } from '@inngest/agent-kit';

export const getSandbox = async (sandboxId: string) => {
  const sandbox = await Sandbox.connect(sandboxId);

  return sandbox;
};

export const lastAssistantMessageContent = async (result: AgentResult) => {
  const lastMessageIndex = result.output.findLastIndex(
    message => message.role === 'assistant'
  );

  if (lastMessageIndex === -1) {
    return undefined;
  }

  const message = result.output[lastMessageIndex] as TextMessage | undefined;

  return message?.content
    ? typeof message.content === 'string'
      ? message.content
      : message.content.map(item => item.text).join('')
    : undefined;
};
