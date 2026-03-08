import { useState } from "react";

const examples = [
  {
    mode: "Formal",
    modeColor: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
    input: "Our app helps people write faster.",
    output:
      "Our platform empowers professionals to significantly accelerate their writing workflows, delivering measurable improvements in productivity and content quality across all communication channels.",
    inputLabel: "Original",
    outputLabel: "Formalized",
  },
  {
    mode: "Casual",
    modeColor: "bg-amber-50 text-amber-700 border-amber-200",
    dotColor: "bg-amber-400",
    input: "The quarterly financial report indicates substantial revenue growth.",
    output:
      "Great news — we had a really strong quarter! Revenue shot up big time, which means the business is doing way better than expected. Things are looking pretty exciting from here.",
    inputLabel: "Original",
    outputLabel: "Casual version",
  },
  {
    mode: "Expand",
    modeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    input: "AI saves time.",
    output:
      "Artificial intelligence dramatically reduces the time professionals spend on repetitive, manual tasks — from drafting emails to summarizing reports — freeing up valuable hours for higher-impact, strategic work that actually moves the needle.",
    inputLabel: "Original",
    outputLabel: "Expanded",
  },
];

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" />
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function ExampleSection() {
  const [copied, setCopied] = useState(null);
  const [active, setActive] = useState(0);

  const handleCopy = (text, i) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="relative bg-gray-50 py-16 px-6 overflow-hidden">

      <div className="relative z-20 max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-medium text-gray-900 tracking-tight leading-tight">
            See the <span className="text-cyan-600">difference</span> it makes
          </h2>
          <p className="mt-2 text-base text-gray-500 max-w-lg mx-auto leading-relaxed">
            Real inputs transformed in seconds. Pick a mode, paste your text — done.
          </p>
        </div>

        {/* Mode tabs */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                active === i
                  ? "bg-gray-900 text-white border-gray-900 shadow-md"
                  : "bg-white text-gray-500 border-gray-200 hover:border-cyan-600 hover:text-gray-700"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${active === i ? "bg-cyan-600" : "bg-gray-300"}`} />
              {ex.mode}
            </button>
          ))}
        </div>

        {/* Active example card */}
        {examples.map((ex, i) => (
          <div
            key={i}
            className={`transition-all duration-300 ${active === i ? "block" : "hidden"}`}
          >
            <div className="grid md:grid-cols-2 gap-px bg-gray-200 rounded-lg overflow-hidden border border-gray-200 shadow-sm">

              {/* Input side */}
              <div className="bg-white p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-gray-400">
                    {ex.inputLabel}
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.1em] uppercase text-gray-300 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                    Input
                  </span>
                </div>
                <p className="text-gray-700 text-[15px] leading-relaxed font-light">
                  "{ex.input}"
                </p>
              </div>

              {/* Output side */}
              <div className="bg-gray-50 p-8 relative group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-gray-400">
                      {ex.outputLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full border ${ex.modeColor}`}>
                      <SparkleIcon />
                      {ex.mode}
                    </span>
                    <button
                      onClick={() => handleCopy(ex.output, i)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-emerald-700 hover:border-emerald-300 transition-all duration-150 cursor-pointer"
                      title="Copy"
                    >
                      {copied === i ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </div>
                <p className="text-gray-800 text-[15px] leading-relaxed">
                  {ex.output}
                </p>

                {/* Subtle green glow on output */}
                <div className="absolute inset-0 rounded-r-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 80% 20%, rgba(29,107,68,0.04) 0%, transparent 60%)" }}
                />
              </div>
            </div>

            {/* Arrow connector label */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="text-xs text-gray-400">Input</span>
              <div className="flex items-center gap-1.5 text-cyan-600">
                <ArrowIcon />
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 bg-cyan-50 border border-cyan-600 px-3 py-1 rounded-full">
                <SparkleIcon />
                AI transforms in &lt;2s
              </span>
              <div className="flex items-center gap-1.5 text-cyan-600">
                <ArrowIcon />
              </div>
              <span className="text-xs text-gray-400">Output</span>
            </div>
          </div>
        ))}

        {/* Bottom stat pills */}
        {/* <div className="flex flex-wrap justify-center gap-3 mt-14">
          {[
            "⚡ Generates in under 2 seconds",
            "🎯 4 transform modes",
            "📋 One-click copy",
            "🔒 Never stored",
          ].map((item, i) => (
            <span
              key={i}
              className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full"
            >
              {item}
            </span>
          ))}
        </div> */}

      </div>
    </section>
  );
}
