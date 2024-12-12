import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Volt" },
    { name: "description", content: "An app to code apps!" },
  ];
};

export default function Index() {
  return (
    <div className="">
      <h1>Index</h1>
    </div>
  );
}