import prisma from '@/lib/prisma';
import { Sandbox } from '@e2b/code-interpreter';
import { createNetwork } from '@inngest/agent-kit';
import { AgentState, codeAgent } from './agents';
import { inngest } from './client';
import { getSandbox } from './utils';
import { chromium } from 'playwright';
import { supabaseAdmin, SCREENSHOT_BUCKET } from '@/lib/supabase';

export const codeAgentFunction = inngest.createFunction(
  { id: 'code-agent-sandbox' },
  { event: 'code-agent-sandbox/run' },
  async ({ event, step }) => {
    // Validate required input data
    if (!event.data.message || !event.data.projectId) {
      console.error('Code agent: Missing required data', {
        projectId: !!event.data.projectId,
        hasMessage: !!event.data.message,
      });
      return 'Error: message and projectId are required';
    }

    try {
      // Create a new sandbox
      const sandboxId = await step.run('create-sandbox', async () => {
        try {
          const newSandbox = await Sandbox.create('volt-nextjs-test');
          return newSandbox.sandboxId;
        } catch (error) {
          console.error('Failed to create sandbox:', error);
          throw error;
        }
      });

      // Get the sandbox from the sandbox ID
      const sandbox = await getSandbox(sandboxId);

      // Create a new network of agents
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

      // Determine if there was an error
      const isError =
        !result.state.data.summary ||
        Object.keys(result.state.data.files || {}).length === 0;

      if (isError) {
        throw new Error('Code generation failed');
      }

      // Get sandbox URL
      const sandboxUrl = await step.run('get-sandbox-url', async () => {
        try {
          // get the url of the sandbox on port 3000 (as Next.js app runs on port 3000)
          const host = sandbox.getHost(3000);
          const url = `https://${host}`;
          return url;
        } catch (error) {
          console.error('Failed to get sandbox URL:', error);
          throw error;
        }
      });

      // Save results to database
      await step.run('save-to-db', async () => {
        try {
          return await prisma.message.create({
            data: {
              content: result.state.data.summary,
              role: 'ASSISTANT',
              type: 'RESULT',
              projectId: event.data.projectId,
              fragment: {
                create: {
                  sandboxUrl: sandboxUrl,
                  title: 'fragment',
                  files: result.state.data.files,
                },
              },
            },
          });
        } catch (error) {
          console.error('Failed to save to database:', error);
          throw error;
        }
      });

      inngest.send({
        name: 'screenshot-agent/run',
        data: {
          url: sandboxUrl,
          projectId: event.data.projectId,
        },
      });

      return {
        url: sandboxUrl,
        title: 'fragment',
        files: result.state.data.files,
        summary: result.state.data.summary,
      };
    } catch (error) {
      console.error('Code agent function failed:', error);

      // Save error message to database
      try {
        await prisma.message.create({
          data: {
            content: 'Something went wrong. Please try again.',
            role: 'ASSISTANT',
            type: 'ERROR',
            projectId: event.data.projectId,
          },
        });
      } catch (dbError) {
        console.error('Failed to save error message to database:', dbError);
      }

      return {
        error: 'Code generation failed',
        projectId: event.data.projectId,
      };
    }
  }
);

export const screenshotAgentFunction = inngest.createFunction(
  { id: 'screenshot-agent' },
  { event: 'screenshot-agent/run' },
  async ({ event, step }) => {
    // Validate required input data
    if (!event.data.url || !event.data.projectId) {
      console.error('Screenshot agent: Missing required data', {
        url: event.data.url,
        projectId: event.data.projectId,
      });
      return 'Error: URL and projectId are required';
    }

    const screenshotUrl = await step.run('take-screenshot', async () => {
      let browser = null;

      try {
        // Launch browser with optimized configuration for serverless environments
        browser = await chromium.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-extensions',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
            '--memory-pressure-off',
            '--max_old_space_size=4096',
          ],
        });

        const context = await browser.newContext({
          viewport: { width: 1920, height: 1080 },
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          ignoreHTTPSErrors: true,
          deviceScaleFactor: 1,
          // Add performance optimizations
          javaScriptEnabled: true,
          bypassCSP: true,
          extraHTTPHeaders: {
            'Accept-Language': 'en-US,en;q=0.9',
          },
        });

        const page = await context.newPage();

        // Optimize page performance
        await page.setExtraHTTPHeaders({
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        });

        // Block unnecessary resources to speed up loading
        await page.route('**/*', route => {
          const resourceType = route.request().resourceType();
          if (['image', 'media', 'font'].includes(resourceType)) {
            route.abort();
          } else {
            route.continue();
          }
        });

        // Configure aggressive timeouts
        page.setDefaultTimeout(15000); // Reduced from 30s
        page.setDefaultNavigationTimeout(15000);

        // Navigate with optimized wait strategy
        await page.goto(event.data.url, {
          waitUntil: 'domcontentloaded', // Faster than 'networkidle'
          timeout: 15000,
        });

        // Wait for critical content with shorter timeout
        await page.waitForTimeout(500); // Reduced from 1500ms

        // Capture screenshot with optimized settings
        const screenshotBuffer = await page.screenshot({
          type: 'jpeg', // Smaller file size than PNG
          quality: 85, // Good balance of quality and size
          fullPage: false,
        });

        // Upload to Supabase Storage with optimized settings
        const fileName = `screenshot-${event.data.projectId}-${Date.now()}.jpg`;

        const { data, error } = await supabaseAdmin.storage
          .from(SCREENSHOT_BUCKET)
          .upload(fileName, screenshotBuffer, {
            contentType: 'image/jpeg',
            cacheControl: '31536000', // 1 year cache
            upsert: false,
          });

        if (error) {
          console.error('Screenshot upload failed:', error);
          return null;
        }

        // Get the public URL
        const { data: urlData } = supabaseAdmin.storage
          .from(SCREENSHOT_BUCKET)
          .getPublicUrl(fileName);

        return urlData.publicUrl;
      } catch (error) {
        console.error('Screenshot capture failed:', error);
        return null;
      } finally {
        // Ensure browser is always closed
        if (browser) {
          try {
            await browser.close();
          } catch (closeError) {
            console.error('Failed to close browser:', closeError);
          }
        }
      }
    });

    // Save screenshot URL to database
    await step.run('save-to-db', async () => {
      if (!screenshotUrl) {
        console.error(
          'Screenshot capture failed for project:',
          event.data.projectId
        );
        return null;
      }

      try {
        return await prisma.project.update({
          where: { id: event.data.projectId },
          data: { screenshot: screenshotUrl },
        });
      } catch (error) {
        console.error('Failed to save screenshot URL to database:', error);
        return null;
      }
    });

    return {
      success: !!screenshotUrl,
      projectId: event.data.projectId,
      url: event.data.url,
      screenshotUrl: screenshotUrl,
    };
  }
);
