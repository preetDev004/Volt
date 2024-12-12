import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = new Hono();
const openai = new OpenAI();

app.get("/", (c) => {
  return c.json({ message: "Hello world!" });
});

app.get("/chat", async (c) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "What is 8*9/3+2?" }],
    temperature: 0, // closer to 0 for analytical and 1 for creative
    max_tokens: 100,
  });
  return c.json(response);
  // TODO: Stream the response to the client.
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
