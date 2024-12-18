import { features } from "../data/features";

export function Features() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div
            key={index}
            className="group relative rounded-xl border border-purple-500/60 bg-black/50 p-6 backdrop-blur-sm transition-all hover:border-purple-500/80"
          >
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-400 opacity-0 blur-sm transition duration-300 group-hover:opacity-30"></div>
            <div className="relative">
              <div className="mb-4 inline-block rounded-lg bg-purple-900/30 p-3">
                <Icon />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}