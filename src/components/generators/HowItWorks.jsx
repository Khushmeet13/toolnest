import { useState, useEffect } from "react";

const slides = [
    {
        prompt: "Write a cold email to a potential client about project timelines.",
        result:
            "I'd love to connect about how we approach project timelines to guarantee on-time delivery. Our process is built around providing you with complete visibility at every stage.",
    },
    {
        prompt: "Generate a caption for a graphic designer's latest logo reveal.",
        result:
            "Excited to unveil my latest creation! 🌸✨ Here's the new logo that captures the essence of [Client's Name/Brand]. Can't wait to see it in action! #LogoDesign #GraphicDesign #CreativeProcess",
    },
    {
        prompt: "Explain blockchain technology to a beginner.",
        result:
            "Blockchain technology enables secure, transparent transactions across a distributed network. Think of each 'block,' which is linked to the previous one, forming an unbreakable chain of records.",
    },
];

const SparkleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="currentColor" />
        <path d="M19 15L19.9 17.1L22 18L19.9 18.9L19 21L18.1 18.9L16 18L18.1 17.1L19 15Z" fill="currentColor" opacity="0.5" />
    </svg>
);

const ChevronLeft = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
    </svg>
);

const ChevronRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

// Card position styles — kept as inline objects since Tailwind can't handle
// dynamic translate/scale/blur values like translateX(-300px) or blur(1.5px)
const cardStyles = {
    center: {
        transform: "translateX(0) scale(1)",
        opacity: 1,
        zIndex: 20,
        filter: "none",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 60px -10px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
    },
    left: {
        transform: "translateX(-300px) scale(0.88)",
        opacity: 0.45,
        zIndex: 10,
        filter: "blur(1.5px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    },
    right: {
        transform: "translateX(300px) scale(0.88)",
        opacity: 0.45,
        zIndex: 10,
        filter: "blur(1.5px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    },
};

export default function HowItWorks() {
    const [active, setActive] = useState(1);
    const [animating, setAnimating] = useState(false);

    const go = (idx) => {
        if (animating || idx === active) return;
        setAnimating(true);
        setTimeout(() => {
            setActive(idx);
            setAnimating(false);
        }, 200);
    };

    const prev = () => go((active - 1 + slides.length) % slides.length);
    const next = () => go((active + 1) % slides.length);

    useEffect(() => {
        const t = setInterval(() => go((active + 1) % slides.length), 4000);
        return () => clearInterval(t);
    }, [active]);

    const getPos = (i) => {
        if (i === active) return "center";
        const total = slides.length;
        if (i === (active - 1 + total) % total) return "left";
        if (i === (active + 1) % total) return "right";
        return "hidden";
    };

    return (
        <>
            {/* Pulse animation for eyebrow dot — minimal keyframe only */}
            <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
        .animate-pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
      `}</style>

            <section
                className="relative py-16 px-6 overflow-hidden bg-white"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            >
                <div className="max-w-5xl mx-auto text-center relative z-10">


                    {/* Title */}
                    <h2 className="text-4xl font-medium text-[#1a2318] leading-tight tracking-tight mb-2">
                        See how it works
                    </h2>
                    <p className="text-base text-[#6b7c69] font-light leading-relaxed">
                        Get inspired by these text generation prompts:
                    </p>

                    {/* Slider */}
                    <div className="relative mt-16 h-[340px] flex items-center justify-center">

                        {/* Left arrow */}
                        <button
                            onClick={prev}
                            className="absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white border border-black/10 rounded-full flex items-center justify-center text-[#374535] shadow-md transition-all duration-200 hover:bg-emerald-700 hover:text-white hover:border-emerald-700 hover:scale-105 cursor-pointer"
                            style={{ left: "calc(50% - 260px)" }}
                        >
                            <ChevronLeft />
                        </button>

                        {/* Right arrow */}
                        <button
                            onClick={next}
                            className="absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white border border-black/10 rounded-full flex items-center justify-center text-[#374535] shadow-md transition-all duration-200 hover:bg-emerald-700 hover:text-white hover:border-emerald-700 hover:scale-105 cursor-pointer"
                            style={{ right: "calc(50% - 260px)" }}
                        >
                            <ChevronRight />
                        </button>

                        {/* Cards */}
                        {slides.map((slide, i) => {
                            const pos = getPos(i);
                            if (pos === "hidden") return null;
                            return (
                                <div
                                    key={i}
                                    onClick={() => pos !== "center" && go(i)}
                                    className="absolute w-[360px] bg-white rounded-2xl p-7 border border-black/[0.06] cursor-pointer select-none transition-all duration-[450ms]"
                                    style={{
                                        transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                                        ...cardStyles[pos],
                                    }}
                                >
                                    {/* Prompt bubble */}
                                    <div className="inline-block bg-[#f0f5ef] border border-[#d8e8d4] rounded-full px-4 py-2 text-[13px] font-medium text-[#2a3d28] mb-5 text-left leading-snug">
                                        {slide.prompt}
                                    </div>

                                    {/* Result */}
                                    <div className="flex items-start gap-3 text-left">
                                        <div
                                            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-emerald-700 mt-0.5"
                                            style={{ background: "linear-gradient(135deg, #d4f0e0, #a8dfc0)" }}
                                        >
                                            <SparkleIcon />
                                        </div>
                                        <p className="text-[13.5px] text-[#374535] leading-7 font-light">
                                            {slide.result}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center items-center gap-2 mt-10">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => go(i)}
                                className={`h-[7px] rounded-full border-none cursor-pointer transition-all duration-300 ${i === active
                                        ? "w-7 bg-emerald-700"
                                        : "w-[7px] bg-[#c8d5c6] hover:bg-[#97b594]"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-12">
                        <button
                            className="group relative inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white text-[15px] font-semibold px-9 py-3.5 rounded-full cursor-pointer tracking-wide transition-all duration-200 overflow-hidden hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-800/40 border-0"
                            style={{ boxShadow: "0 4px 24px rgba(29,107,68,0.3)" }}
                        >
                            {/* Shimmer sweep */}
                            <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-[left] duration-[400ms]" />
                            Try AI text generator
                            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                        </button>
                    </div>

                </div>
            </section>
        </>
    );
}
