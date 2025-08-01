import { Sandbox } from '@e2b/code-interpreter';
import { createTool } from '@inngest/agent-kit';
import { z } from 'zod';

export const terminal = createTool({
  name: 'terminal',
  description: 'Use this to run commands in the terminal',
  parameters: z.object({
    command: z.string().describe('The command to run in the terminal'),
  }),
  handler: async ({ command }, { step, network }) => {
    return await step?.run('terminal', async () => {
      const buffer = { stdout: '', stderr: '' };
      try {
        if (!network.state.data.sandbox) {
          throw new Error('Sandbox not initialized');
        }
        const sandbox = network.state.data.sandbox as Sandbox;
        const result = await sandbox.commands.run(command, {
          onStdout: (data: string) => {
            buffer.stdout += data;
          },
          onStderr: (data: string) => {
            buffer.stderr += data;
          },
        });
        return result.stdout;
      } catch (error) {
        console.error(
          `Command failed: ${error} \n stdout: ${buffer.stdout} \n stderr: ${buffer.stderr}`
        );
        return `Command failed: ${error} \n stdout: ${buffer.stdout} \n stderr: ${buffer.stderr}`;
      }
    });
  },
});

export const createOrUpdateFile = createTool({
  name: 'createOrUpdateFile',
  description: 'Use this to create or update a file in the sandbox',
  parameters: z.object({
    files: z
      .array(
        z.object({
          path: z.string().describe('The file path'),
          content: z.string().describe('The file content'),
        })
      )
      .describe('Array of files to create or update'),
  }),
  handler: async ({ files }, { step, network }) => {
    const newFiles = await step?.run('createOrUpdateFile', async () => {
      try {
        if (!network.state.data.sandbox) {
          throw new Error('Sandbox not initialized');
        }
        const sandbox = network.state.data.sandbox as Sandbox;
        const updatedFiles = network.state.data.files || {};

        for (const file of files) {
          await sandbox.files.write(file.path, file.content);
          updatedFiles[file.path] = file.content;
        }
        return updatedFiles;
      } catch (error) {
        console.error(`Failed to create or update file: ${error}`);
        return `Failed to create or update file: ${error}`;
      }
    });
    if (typeof newFiles === 'object') {
      network.state.data.files = newFiles;
    }
  },
});

export const readFile = createTool({
  name: 'readFile',
  description: 'Use this to read a file in the sandbox',
  parameters: z.object({
    files: z
      .array(
        z.object({
          path: z.string().describe('The file path to read'),
        })
      )
      .describe('Array of files to read'),
  }),
  handler: async ({ files }, { step, network }) => {
    return await step?.run('readFile', async () => {
      try {
        if (!network.state.data.sandbox) {
          throw new Error('Sandbox not initialized');
        }
        const sandbox = network.state.data.sandbox as Sandbox;
        const contents = [];

        for (const file of files) {
          const content = await sandbox.files.read(file.path);
          contents.push({
            path: file.path,
            content: content,
          });
        }
        return JSON.stringify(contents);
      } catch (error) {
        console.error(`Failed to read file: ${error}`);
        return `Failed to read file: ${error}`;
      }
    });
  },
});
