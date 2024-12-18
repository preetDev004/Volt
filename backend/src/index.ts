import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import { cors } from "hono/cors";
import OpenAI from "openai";
import { zValidator } from "@hono/zod-validator";
import { chatSchema, promptSchema } from "../utils/schema.js";
import { BASE_PROMPT, BASE_PROMPT_NODE, BASE_PROMPT_REACT } from "./prompts.js";
import { z } from "zod";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

// Load environment variables
dotenv.config();

// Create a new Hono app
const app = new Hono();
// Create a new OpenAI instance
const openai = new OpenAI();

// Enable CORS
app.use(
  "*",
  cors({
    origin: "*", // Update with your actual domain in production
    allowMethods: ["GET", "POST"], // Add POST method
  })
);

// Define a POST handler for the /template route
app.post(
  "/template",
  zValidator("json", promptSchema, (result, c) => {
    if (!result.success) {
      // Return a custom error response if validation fails
      return c.json(
        { error: "Invalid input", message: result.error.issues[0].message },
        400
      );
    }
  }),
  async (c) => {
    const { message } = c.req.valid("json");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
        },
        { role: "user", content: message },
      ],
      temperature: 0, // closer to 0 for analytical and 1 for creative
      max_tokens: 100,
    });
    const project = (response.choices[0]?.message?.content || "") as string;
    console.log("Received data:", project);
    if (project === "react") {
      return c.json(
        {
          prompts: [
            BASE_PROMPT,
            `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${BASE_PROMPT_REACT}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
          ],
          uiPrompts: [BASE_PROMPT_REACT],
        },
        200
      );
    }
    if (project === "node") {
      return c.json(
        {
          prompts: [
            `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${BASE_PROMPT_NODE}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
          ],
          uiPrompts: [BASE_PROMPT_NODE],
        },
        200
      );
    }
    return c.json({ message: "You Can't Access This!" }, 403);
  }
);

app.get(
  "/chat",
  zValidator("json", chatSchema, (result, c) => {
    if (!result.success) {
      // Return a custom error response if validation fails
      return c.json(
        { error: "Invalid input", message: result.error.issues[0].message },
        400
      );
    }
  }),
  async (c) => {
    const  messages = c.req.valid("json");
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages as ChatCompletionMessageParam[],
      temperature: 0, // closer to 0 for analytical and 1 for creative
      max_tokens: 100,
      stream: true,
    });
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
    // return new Response(
    //   new ReadableStream({
    //     async start(controller) {
    //       try {
    //         for await (const chunk of stream) {
    //           const content = chunk.choices[0]?.delta?.content || ''
    //           if (content) {
    //             controller.enqueue(content)
    //           }
    //         }
    //         controller.close()
    //       } catch (error) {
    //         controller.error(error)
    //       }
    //     }
    //   }),
    //   {
    //     headers: {
    //       'Content-Type': 'text/plain',
    //       'Transfer-Encoding': 'chunked'
    //     }
    //   }
    // )
    // return c.json(response);
  }
);

const port = 3000;
console.log(`Server is running on http://localhost:${port}\n`);

serve({
  fetch: app.fetch,
  port,
});
