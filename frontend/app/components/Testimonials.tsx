import { testimonials } from "../data/testimonials";

export function Testimonials() {
  return (
    <section className="py-24">
      <h2 className="mb-12 text-center text-4xl font-bold">
        <span className="text-white/90">
          Trusted by Industry DEVs
        </span>
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="relative rounded-2xl border border-purple-500/10 bg-black/30 p-6 backdrop-blur-sm"
          >
            <div className="mb-4 flex items-center gap-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-white">{testimonial.name}</h3>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-300">{testimonial.quote}</p>
          </div>
        ))}
      </div>
    </section>
  );
}