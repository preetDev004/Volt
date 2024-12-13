import type { MetaFunction } from "@remix-run/node";
import ChatInput from "../components/ChatInput";

export const meta: MetaFunction = () => {
  return [
    { title: "Volt" },
    { name: "description", content: "An app to code apps!" },
  ];
};

export async function action({ request } : { request: Request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const response = await fetch("http://localhost:3000/template", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Response("Failed to submit data", { status: response.status });
  }

  return Response.json({ success: true });
}


export default function Index() {
  return (
    <div className="relative min-h-screen">
      <h1 className="pt-4 text-4xl">v<span className="text-purple-500 font-semibold">O</span>lt</h1>
      <ChatInput />
    </div>
  );
}
