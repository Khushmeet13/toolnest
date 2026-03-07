import { useState } from "react";

const toolFeatures = [
    {
        icon: "⚡",
        title: "Lightning Fast",
        description: "Generate high-quality text in under 2 seconds. Our optimized pipeline ensures zero waiting time even at scale.",
        tag: "Speed",
    },
    {
        icon: "🎯",
        title: "Context Aware",
        description: "The AI understands tone, audience, and purpose — producing output that actually fits your use case every time.",
        tag: "Intelligence",
    },
    {
        icon: "🔄",
        title: "Multiple Modes",
        description: "Switch between Formal, Casual, Expand, and Shorten modes with a single click. One input, infinite variations.",
        tag: "Flexibility",
    },
    {
        icon: "🔒",
        title: "Private by Default",
        description: "Your inputs are never stored or used for training. Every session is isolated and fully encrypted end-to-end.",
        tag: "Privacy",
    },
    {
        icon: "📋",
        title: "One-Click Copy",
        description: "Copy generated text instantly to clipboard. Designed for seamless integration into your existing workflow.",
        tag: "Productivity",
    },
    {
        icon: "∞",
        title: "Unlimited Usage",
        description: "No daily caps, no paywalls on core features. Generate as much as you need, whenever you need it.",
        tag: "Access",
    },
];

const stats = [
    { num: "4", suffix: "×", label: "Transform modes" },
    { num: "< 2", suffix: "s", label: "Avg. response time" },
    { num: "100", suffix: "%", label: "Private & secure" },
];

export default function FeatureSection() {
    const [hovered, setHovered] = useState(null);

    return (
        <section className="relative bg-gray-50 py-16">

            <div className="relative z-20 max-w-6xl mx-auto">

                {/* ── Header ── */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-mono text-cyan-600 bg-cyan-50 border border-cyan-200 px-4 py-1.5 rounded-full mb-5">
                        <span className="w-4 h-px bg-cyan-600 opacity-50 inline-block" />
                        What's included
                        <span className="w-4 h-px bg-cyan-600 opacity-50 inline-block" />
                    </div>

                    <h2 className="text-4xl font-medium text-gray-900 leading-tight tracking-tight">
                        Built for <span className="text-cyan-600">serious</span> writers
                    </h2>
                    <p className="mt-2 text-base text-gray-500 max-w-lg leading-relaxed">
                        Everything you need to generate AI text quickly, confidently, and at scale.
                    </p>
                </div>

                {/* ── Stats row ── */}
                {/* <div className="flex justify-center gap-12 flex-wrap mb-14">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
                {s.num}<span className="text-emerald-700">{s.suffix}</span>
              </div>
              <div className="mt-1 text-[9px] font-mono tracking-[0.18em] uppercase text-gray-400">
                {s.label}
              </div>
            </div>
          ))}
        </div> */}

                {/* ── Feature grid ── */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden shadow-sm shadow-cyan-100">
                    {toolFeatures.map((feature, i) => (
                        <div
                            key={i}
                            className="group relative bg-white p-6 overflow-hidden transition-colors duration-300 cursor-default"
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            {/* Top accent line */}
                            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Tag */}
                            <span className="block font-mono text-xs tracking-[0.2em] uppercase text-cyan-600 transition-colors duration-300 mb-5">
                                {feature.tag}
                            </span>

                            {/* Icon */}
                            <div className=" text-xl flex items-center gap-2 mb-2">
                                {feature.icon}
                                <h3 className="text-base font-bold text-gray-900 tracking-tight ">
                                    {feature.title}
                                </h3>
                            </div>

                            {/* Title */}


                            {/* Description */}
                            <p className="text-sm text-gray-400 group-hover:text-gray-500 leading-relaxed transition-colors duration-200">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
