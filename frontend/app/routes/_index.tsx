import type { MetaFunction } from "@remix-run/node";
import { Features } from "../components/Features";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Testimonials } from "../components/Testimonials";

export const meta: MetaFunction = () => {
  return [
    { title: "Volt" },
    { name: "description", content: "An app to code apps!" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/5 via-black to-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <main className="flex min-h-screen flex-col">
          <section className="flex mt-32 sm:mt-48 justify-center">
            <Hero />
          </section>

          <section className="mt-24">
            <Features />
          </section>

          <Testimonials />
        </main>
      </div>

      <Footer />
    </div>
  );
}
