import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" }
  ];
};

export default function Index() {
  return (
    <main className="w-full h-screen bg-white grid place-content-center">
      <h1 className="text-4xl">Build with Remix</h1>
    </main>
  );
}
