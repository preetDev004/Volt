import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import OpenAI from "openai";

import { cors } from "hono/cors";

dotenv.config();

const app = new Hono();
const openai = new OpenAI();

// Enable CORS
app.use('*', cors({
  origin: '*', // Update with your actual domain in production
  allowMethods: ['GET', 'POST'], // Add POST method
}));

// Define a POST handler for the /template route
app.post('/template', async (c) => {
  const data = await c.req.json();
  console.log('Received data:', data);

  // Example response
  return c.json({ success: true, message: 'Data received successfully!' });
});

app.get("/chat", async (c) => {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "can you tell me a joke" }],
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
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
