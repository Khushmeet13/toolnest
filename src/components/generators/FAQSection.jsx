import { useState } from "react";

const faqs = [
  {
    q: "Is this tool free to use?",
    a: "Yes — completely free. No credit card, no trial period, no hidden fees. Every tool on ToolNest is free to use and will remain free for all core features.",
  },
  {
    q: "Can I use it unlimited times?",
    a: "There are no daily limits, generation caps, or cooldown timers. Generate as much text as you need, whenever you need it.",
  },
  {
    q: "Do I need to sign up or create an account?",
    a: "No account required. Open the tool and start generating immediately. No email, no signup — zero friction.",
  },
  {
    q: "How accurate and natural does the output sound?",
    a: "Our AI is built on state-of-the-art language models optimized for natural, context-aware writing. The output is designed to read like a human wrote it.",
  },
  {
    q: "Is my text stored or used to train the AI?",
    a: "No. Your inputs are never logged, stored, or used for model training. Every session is fully isolated and private.",
  },
  {
    q: "What writing modes does the generator support?",
    a: "The tool supports four modes: Formal, Casual, Expand, and Shorten. Each mode transforms your input while preserving the original meaning and intent.",
  },
];

const ChevronDown = ({ open }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative bg-gray-50 py-16 px-6 overflow-hidden">


      <div className="relative z-20 max-w-7xl mx-auto px-20">

        {/* Two-column: left header, right accordion */}
        <div className="grid lg:grid-cols-[480px_1fr] gap-20 items-start">

          {/* Left — sticky */}
          <div className="lg:sticky ">
            <h2 className="text-4xl font-medium text-gray-900 tracking-tight leading-tight">
              Frequently <span className="text-cyan-700">asked</span>  questions
            </h2>

            <p className="mt-2 text-[15px] text-gray-500 leading-relaxed">
              Everything you need to know about the AI text generator.
            </p>

            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-2">
              <p className="text-sm text-gray-500">Still have questions?</p>
              <a
                href="/contact"
                className="text-sm font-semibold text-cyan-600 hover:text-cyan-600/80 transition-colors hover:underline"
              >
                Contact our team →
              </a>
            </div>

            {/* Clean stats */}
            <div className="mt-10 space-y-1">
              {[
                { label: "Free to use", value: "Always" },
                { label: "Account required", value: "Never" },
                { label: "Usage limit", value: "None" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">{s.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — accordion */}
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer group"
                >
                  <span className={`text-[15px] font-semibold leading-snug transition-colors duration-150 ${open === i ? "text-cyan-600" : "text-gray-900 group-hover:text-gray-700"}`}>
                    {faq.q}
                  </span>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    open === i
                      ? "bg-cyan-600 border-cyan-600 text-white"
                      : "bg-white border-gray-300 text-gray-400 group-hover:border-gray-500"
                  }`}>
                    <ChevronDown open={open === i} />
                  </span>
                </button>

                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: open === i ? "200px" : "0px" }}
                >
                  <p className="pb-5 text-sm text-gray-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}