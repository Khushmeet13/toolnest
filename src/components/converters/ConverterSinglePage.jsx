import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import converters from "../../data/converterTools";
import {
  ChevronRightIcon,
  ArrowRightLeft,
  Zap,
  Shield,
  Clock,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  RefreshCw,
  Star,
  TrendingUp,
} from "lucide-react";

const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-");

const toolComponents = {};

const getFeatures = (tool) => [
  {
    icon: Zap,
    title: "Lightning fast",
    desc: "Instant results with zero loading time. No server round-trips needed.",
  },
  {
    icon: Shield,
    title: "100% private",
    desc: "All conversions happen in your browser. Your data never leaves your device.",
  },
  {
    icon: RefreshCw,
    title: "Bidirectional",
    desc: `Convert ${tool.title.replace(" Converter", "").replace(" Calculator", "")} values in both directions effortlessly.`,
  },
  {
    icon: Clock,
    title: "Always available",
    desc: "No account, no signup, no limits. Use it anytime, completely free.",
  },
];

const getSteps = (tool) => [
  { num: "01", title: "Enter your value", desc: "Type or paste the value you want to convert into the input field." },
  { num: "02", title: "Select units", desc: "Choose your source and target units from the dropdown menus." },
  { num: "03", title: "Get results instantly", desc: "Results appear in real time as you type — no button needed." },
  { num: "04", title: "Copy & use", desc: "One-click copy to clipboard. Paste it wherever you need." },
];

const getExamples = (category) => {
  const map = {
    Unit: [
      { input: "1 kilometer", output: "0.621371 miles", label: "km → mi" },
      { input: "100 meters", output: "328.084 feet", label: "m → ft" },
      { input: "5 inches", output: "12.7 centimeters", label: "in → cm" },
    ],
    Finance: [
      { input: "$1,000 USD", output: "€921.40 EUR", label: "USD → EUR" },
      { input: "1 BTC", output: "$43,250.00", label: "BTC → USD" },
      { input: "₹100,000", output: "$1,198.50", label: "INR → USD" },
    ],
    Time: [
      { input: "9:00 AM EST", output: "2:00 PM GMT", label: "EST → GMT" },
      { input: "180 minutes", output: "3 hours", label: "min → hr" },
      { input: "Born 1995", output: "29 years old", label: "Age calc" },
    ],
    Developer: [
      { input: "1010101", output: "85 (decimal)", label: "Binary → Dec" },
      { input: "#FF5733", output: "rgb(255,87,51)", label: "HEX → RGB" },
      { input: '{"name":"test"}', output: "<name>test</name>", label: "JSON → XML" },
    ],
    File: [
      { input: "photo.jpg (2.4 MB)", output: "photo.png (3.1 MB)", label: "JPG → PNG" },
      { input: "invoice.pdf (8 MB)", output: "invoice.pdf (1.2 MB)", label: "Compressed" },
      { input: "video.mp4 (45 MB)", output: "audio.mp3 (4.2 MB)", label: "MP4 → MP3" },
    ],
    Content: [
      { input: "Hello World!", output: "HELLO WORLD!", label: "→ Uppercase" },
      { input: "1,200 characters", output: "214 words", label: "Char count" },
      { input: "youtube.com/watch?v=...", output: "HD thumbnail downloaded", label: "Thumbnail" },
    ],
    Health: [
      { input: "Height: 5'10\" / Weight: 75kg", output: "BMI: 23.8 (Normal)", label: "BMI" },
      { input: "Age 28, Active male", output: "2,650 kcal/day", label: "Calories" },
      { input: "Neck: 38, Waist: 85", output: "Body fat: 18.2%", label: "Body fat" },
    ],
    AI: [
      { input: "Hello, how are you?", output: "🔊 Audio generated", label: "TTS" },
      { input: "🎤 Audio clip (30s)", output: "Transcribed text", label: "STT" },
      { input: "Image uploaded", output: "Extracted text (OCR)", label: "OCR" },
    ],
  };
  return map[category] || map["Unit"];
};

const getFaqs = (tool) => [
  {
    q: `Is the ${tool.title} free to use?`,
    a: "Yes, completely free. No account, no subscription, no hidden charges. Just open and use.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. All conversions are processed client-side in your browser. We never store or transmit your input data.",
  },
  {
    q: "How accurate are the results?",
    a: `Our ${tool.title} uses precise, up-to-date formulas and reference values. Results are accurate to several decimal places.`,
  },
  {
    q: "Can I use this on mobile?",
    a: "Yes, it's fully responsive and works seamlessly on all screen sizes — phone, tablet, or desktop.",
  },
  {
    q: "Does it work offline?",
    a: "Once the page is loaded, most conversions work without an internet connection since everything runs in your browser.",
  },
];

// ─── Inline styles ─────────────────────────────────────────────────────────────
const injectStyles = () => {
  const id = "csp-styles";
  if (document.getElementById(id)) return;
  const el = document.createElement("style");
  el.id = id;
  el.textContent = `
  

   
    @keyframes csp-float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-12px) rotate(1deg); }
      66% { transform: translateY(-6px) rotate(-1deg); }
    }
    @keyframes csp-pulse-ring {
      0% { transform: scale(1); opacity: 0.4; }
      100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes csp-shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes csp-ticker {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes csp-fade-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes csp-spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .csp-float { animation: csp-float 6s ease-in-out infinite; }
    .csp-float-delay { animation: csp-float 8s ease-in-out 1.5s infinite; }
    .csp-fade-up { animation: csp-fade-up 0.6s ease forwards; }
    .csp-spin-slow { animation: csp-spin-slow 20s linear infinite; }

    .csp-shimmer-text {
      background: linear-gradient(90deg, #0891b2 0%, #22d3ee 40%, #67e8f9 50%, #22d3ee 60%, #0891b2 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: csp-shimmer 3s linear infinite;
    }

    .csp-ticker-track { display: flex; animation: csp-ticker 60s linear infinite; width: max-content; }

    .csp-card-hover {
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease;
    }
    .csp-card-hover:hover {
      transform: translateY(-4px) scale(1.01);
    }

    .csp-feature-card {
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
    }
    .csp-feature-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 20px;
      padding: 1px;
      background: linear-gradient(135deg, transparent, rgba(8,145,178,0.3), transparent);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .csp-feature-card:hover::before { opacity: 1; }
    .csp-feature-card:hover { transform: translateY(-6px); }

    .csp-step-num {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 4rem;
      line-height: 1;
      -webkit-text-stroke: 1px rgba(8,145,178,0.3);
      color: transparent;
      position: absolute;
      top: -10px;
      right: -10px;
    }

    .csp-glass {
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    .dark .csp-glass {
      background: rgba(17,24,39,0.7);
    }

    .csp-tool-panel {
      background: linear-gradient(135deg, rgba(8,145,178,0.03) 0%, rgba(255,255,255,1) 60%);
    }
    .dark .csp-tool-panel {
      background: linear-gradient(135deg, rgba(8,145,178,0.08) 0%, rgba(17,24,39,1) 60%);
    }

    .csp-input {
      transition: all 0.25s ease;
      border: 1.5px solid rgba(0,0,0,0.08);
    }
    .dark .csp-input { border-color: rgba(255,255,255,0.08); }
    .csp-input:focus {
      border-color: #0891b2;
      box-shadow: 0 0 0 4px rgba(8,145,178,0.12);
      outline: none;
    }

    .csp-btn-primary {
      background: linear-gradient(135deg, #0891b2, #0e7490);
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 4px 20px rgba(8,145,178,0.35);
    }
    .csp-btn-primary:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 30px rgba(8,145,178,0.45);
    }
    .csp-btn-primary:active { transform: translateY(0) scale(0.99); }

    .csp-stat-box { transition: all 0.3s ease; }
    .csp-stat-box:hover { background: rgba(8,145,178,0.08); }

    .csp-orbit {
      position: absolute;
      border-radius: 50%;
      border: 1px dashed rgba(8,145,178,0.2);
    }

    .csp-example-card {
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .csp-example-card:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 20px 40px rgba(8,145,178,0.12);
    }

    .csp-faq-item {
      transition: background 0.2s ease;
      border-radius: 12px;
    }
    .csp-faq-item:hover { background: rgba(8,145,178,0.03); }

    .csp-related-card {
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .csp-related-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(8,145,178,0.1);
    }

    .csp-noise {
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
      opacity: 0.5;
    }

    .csp-hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 100px;
      background: linear-gradient(135deg, rgba(8,145,178,0.1), rgba(14,116,144,0.15));
      border: 1px solid rgba(8,145,178,0.2);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #0891b2;
    }
    .dark .csp-hero-badge { color: #22d3ee; border-color: rgba(34,211,238,0.2); background: rgba(8,145,178,0.15); }

    .csp-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(8,145,178,0.3), transparent);
    }

    .csp-tag {
      font-family: 'DM Mono', monospace;
      font-size: 10px;
      font-weight: 500;
      padding: 3px 10px;
      border-radius: 100px;
      background: rgba(8,145,178,0.08);
      color: #0891b2;
      border: 1px solid rgba(8,145,178,0.15);
    }
    .dark .csp-tag { color: #67e8f9; background: rgba(8,145,178,0.15); border-color: rgba(8,145,178,0.25); }
  `;
  document.head.appendChild(el);
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
      style={{
        background: copied ? "rgba(8,145,178,0.12)" : "rgba(0,0,0,0.04)",
        color: copied ? "#0891b2" : "#9ca3af",
        border: `1px solid ${copied ? "rgba(8,145,178,0.25)" : "rgba(0,0,0,0.06)"}`,
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="csp-faq-item px-4 py-1 mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className={`text-sm font-semibold transition-colors ${open ? "text-cyan-600 dark:text-cyan-400" : "text-gray-800 dark:text-gray-200"}`}
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {q}
        </span>
        <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${open ? "bg-cyan-500 text-white rotate-180" : "bg-gray-100 dark:bg-white/8 text-gray-400"}`}>
          <ChevronDown size={13} />
        </div>
      </button>
      {open && (
        <p className="text-sm text-gray-500 dark:text-gray-400 pb-5 leading-relaxed pr-10">
          {a}
        </p>
      )}
    </div>
  );
}

function TickerBar() {
  const items = ["Free forever", "No signup", "100% private", "Instant results", "Mobile ready", "Works offline", "Open source", "Zero latency"];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-3" style={{ background: "linear-gradient(90deg, rgba(8,145,178,0.06), rgba(14,116,144,0.08))", borderTop: "1px solid rgba(8,145,178,0.1)", borderBottom: "1px solid rgba(8,145,178,0.1)" }}>
      <div className="csp-ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 mx-6 text-xs font-semibold text-cyan-700 dark:text-cyan-400 whitespace-nowrap uppercase tracking-widest">
            <span className="w-1 h-1 rounded-full bg-cyan-400 flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ConverterSinglePage() {
  injectStyles();
  const { slug } = useParams();
  const ToolComponent = toolComponents[slug];
  const tool = converters.find((t) => slugify(t.title) === slug);

  if (!tool) {
    return (
      <div className="csp-root min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Tool not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">We couldn't find a tool matching this URL.</p>
          <Link to="/converters" className="text-cyan-600 hover:underline font-medium">← Browse all converters</Link>
        </div>
      </div>
    );
  }

  const features = getFeatures(tool);
  const steps = getSteps(tool);
  const examples = getExamples(tool.category);
  const faqs = getFaqs(tool);
  const relatedTools = converters.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 4);
  const titleWords = tool.title.split(" ");
  const lastWord = titleWords[titleWords.length - 1];
  const titleWithoutLast = titleWords.slice(0, -1).join(" ");

  return (
    <div className="csp-root bg-white dark:bg-gray-950 text-gray-900 dark:text-white" >

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden py-20" style={{ background: "linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 30%, #ffffff 70%)" }}>
        {/* Noise overlay */}
        <div className="csp-noise absolute inset-0 pointer-events-none" />

        {/* Decorative orbits */}
        <div className="csp-orbit csp-spin-slow" style={{ width: 500, height: 500, top: -200, right: -150, opacity: 0.4 }} />
        <div className="csp-orbit" style={{ width: 300, height: 300, top: -80, right: -50, opacity: 0.3, animationDirection: "reverse" }} />

        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-[700px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse at top right, rgba(8,145,178,0.12) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse at bottom left, rgba(14,116,144,0.08) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-10">


          <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">
            {/* Left */}
            <div>
              {/* Breadcrumb */}
              <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Link to="/" className="hover:text-cyan-600">Home</Link>

                <ChevronRightIcon className="w-4 h-4 mx-1" />

                <Link to="/generators" className="hover:text-cyan-600">Generators</Link>

                <ChevronRightIcon className="w-4 h-4 mx-1" />

                <span className="text-cyan-600 dark:text-gray-200">{tool.title}</span>
              </div>
              <div className="csp-hero-badge mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse inline-block" />
                {tool.category} · Free Tool
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold leading-[1.15] tracking-tight mb-2" >
                {titleWithoutLast}{" "}
                <span class="relative inline-block text-cyan-600 dark:text-cyan-400">{lastWord}<svg class="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none"><path d="M0 5 Q50 0 100 4 Q150 8 200 3" fill="none" stroke="currentColor" stroke-width="2" opacity="0.4"></path></svg></span>
              </h1>

              <p className="text-base text-gray-500 leading-relaxed max-w-lg mb-8" style={{ fontWeight: 300 }}>
                {tool.description} Fast, free, and works right in your browser — no signup needed.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <a href="#tool" className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-cyan-700 transition">
                  <ArrowRightLeft size={15} />
                  Start Converting
                </a>
                <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-lg border border-cyan-600 px-4 py-2.5 text-sm font-semibold text-cyan-600 shadow  transition">
                  How it works
                  <ArrowRight size={13} />
                </a>
              </div>

              {/* Nav pills */}
              <div className="flex flex-wrap gap-2">
                {["Features", "How it works", "Examples", "FAQ"].map((label) => (
                  <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-400 hover:text-cyan-600 transition-all duration-200 border border-gray-300 hover:border-cyan-600"
                   >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: floating card */}
            <div className="hidden lg:block relative">
              {/* Floating decorative element */}
              <div className="csp-float absolute z-10 -top-6 -right-4 w-12 h-12 rounded-xl flex items-center justify-center text-3xl shadow-xl"
                style={{ background: "linear-gradient(135deg, #cffafe, #a5f3fc)", border: "1px solid rgba(8,145,178,0.2)" }}>
                ⚡
              </div>
              <div className="csp-float-delay absolute z-10 -bottom-4 -left-7 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                style={{ background: "linear-gradient(135deg, #e0f2fe, #bae6fd)", border: "1px solid rgba(8,145,178,0.15)" }}>
                🔄
              </div>

              <div className="csp-glass rounded-3xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(8,145,178,0.15)" }}>
                {/* Code header */}
                <div className="px-5 py-4 flex items-center gap-2" style={{ background: "rgba(8,145,178,0.06)", borderBottom: "1px solid rgba(8,145,178,0.1)" }}>
                  <div className="flex gap-1.5">
                    {["#fc5c65", "#fed330", "#26de81"].map((c) => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
                  </div>
                  <span className="ml-auto text-xs text-gray-400 font-mono">{tool.title.toLowerCase().replace(/\s/g, "_")}.js</span>
                </div>

                {/* Code body */}
                <div className="p-6 font-mono text-xs space-y-1.5 text-gray-400">
                  <div><span style={{ color: "#c084fc" }}>const</span> <span style={{ color: "#22d3ee" }}>result</span> = convert(</div>
                  <div className="pl-5" style={{ color: "#fbbf24" }}>"<span style={{ color: "#4ade80" }}>input value</span>",</div>
                  <div className="pl-5" style={{ color: "#fbbf24" }}>"<span style={{ color: "#4ade80" }}>from_unit</span>",</div>
                  <div className="pl-5" style={{ color: "#fbbf24" }}>"<span style={{ color: "#4ade80" }}>to_unit</span>"</div>
                  <div>);</div>
                  <div className="pt-2 text-gray-400">{"// ✓ Result: "}<span style={{ color: "#22d3ee" }}>42.00</span></div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 divide-x" style={{ borderTop: "1px solid rgba(8,145,178,0.1)", divideBorderColor: "rgba(8,145,178,0.1)" }}>
                  {[{ v: "100%", l: "Free" }, { v: "0ms", l: "Latency" }, { v: "∞", l: "Uses" }].map(({ v, l }) => (
                    <div key={l} className="csp-stat-box py-5 text-center" style={{ borderRight: "1px solid rgba(8,145,178,0.1)" }}>
                      <div className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Syne', sans-serif" }}>{v}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>

                {/* Trust row */}
                <div className="px-5 py-4 flex items-center gap-3" style={{ background: "rgba(8,145,178,0.04)", borderTop: "1px solid rgba(8,145,178,0.08)" }}>
                  <div className="flex -space-x-2">
                    {["#22d3ee", "#60a5fa", "#a78bfa", "#f472b6"].map((c, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white" style={{ background: c }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 flex-1">50,000+ users</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} style={{ fill: "#fbbf24", color: "#fbbf24" }} />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, white)" }} />
      </section>

      {/* ═══ TICKER ═══ */}
      <TickerBar />

      {/* ═══ TOOL SECTION ═══ */}
      <section id="tool" className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(8,145,178,0.05) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <p className="csp-tag mb-3 inline-block">Converter</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-3" style={{ fontFamily: "'Syne', sans-serif" }}>{tool.title}</h2>
            <p className="text-sm text-gray-400 mt-2">Results update as you type · No data stored</p>
          </div>

          {ToolComponent ? (
            <ToolComponent />
          ) : (
            <div className="csp-tool-panel rounded-3xl overflow-hidden shadow-xl" style={{ border: "1px solid rgba(8,145,178,0.12)" }}>
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: "rgba(8,145,178,0.1)" }}>
                {/* Input */}
                <div className="p-8">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">From</label>
                  <select className="csp-input w-full mb-5 px-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-700 font-medium appearance-none cursor-pointer">
                    <option>Select unit</option>
                  </select>
                  <textarea
                    rows={5}
                    placeholder="Enter value to convert..."
                    className="csp-input w-full px-4 py-4 rounded-xl bg-gray-50 text-sm text-gray-800 placeholder-gray-300 resize-none"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                {/* Output */}
                <div className="p-8 relative">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">To</label>
                    <CopyButton text="result" />
                  </div>
                  <select className="csp-input w-full mb-5 px-4 py-3 rounded-xl bg-gray-50 text-sm text-gray-700 font-medium appearance-none cursor-pointer">
                    <option>Select unit</option>
                  </select>
                  <div className="w-full rounded-xl px-4 py-5 flex flex-col items-center justify-center gap-2 min-h-[130px]"
                    style={{ background: "linear-gradient(135deg, rgba(8,145,178,0.06), rgba(14,116,144,0.04))", border: "1.5px dashed rgba(8,145,178,0.25)" }}>
                    <ArrowRightLeft size={20} className="text-cyan-300" />
                    <p className="text-sm text-gray-400">Result will appear here</p>
                  </div>

                  {/* Swap */}
                  <button className="absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg hover:shadow-xl text-gray-400 hover:text-cyan-600 hover:scale-110 transition-all duration-300"
                    style={{ border: "1.5px solid rgba(8,145,178,0.15)" }}>
                    <ArrowRightLeft size={15} />
                  </button>
                </div>
              </div>

              {/* Action bar */}
              <div className="px-8 py-5 flex items-center justify-between gap-4" style={{ background: "rgba(8,145,178,0.04)", borderTop: "1px solid rgba(8,145,178,0.1)" }}>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live conversion · 100% client-side
                </div>
                <button className="csp-btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold">
                  <ArrowRightLeft size={13} />
                  Convert
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-center mb-20">
            <div>
              <p className="csp-tag mb-4 inline-block">Why this tool</p>
              <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mt-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                Built for speed,<br />
                <span className="csp-shimmer-text">designed for simplicity</span>
              </h2>
            </div>
            <p className="text-base text-gray-400 leading-relaxed" style={{ fontWeight: 300 }}>
              Every detail is crafted to make conversions feel effortless. No distractions, no friction — just fast, accurate results whenever you need them.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="csp-feature-card p-7 rounded-2xl" style={{
                background: "linear-gradient(160deg, #f8fafc 0%, #ffffff 100%)",
                border: "1px solid rgba(0,0,0,0.06)",
                animationDelay: `${i * 0.1}s`
              }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, rgba(8,145,178,0.12), rgba(14,116,144,0.08))" }}>
                  <Icon size={20} className="text-cyan-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "50K+", label: "Monthly users", emoji: "👥" },
              { value: "1M+", label: "Conversions done", emoji: "⚡" },
              { value: "4.9★", label: "Average rating", emoji: "⭐" },
              { value: "0ms", label: "Response time", emoji: "🚀" },
            ].map(({ value, label, emoji }) => (
              <div key={label} className="csp-card-hover rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)", border: "1px solid rgba(8,145,178,0.12)" }}>
                <div className="text-2xl mb-2">{emoji}</div>
                <div className="text-3xl font-extrabold text-cyan-600 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{value}</div>
                <div className="text-xs text-gray-400 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)" }}>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(8,145,178,0.06) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="csp-tag mb-4 inline-block">Simple process</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              How to use the {tool.title}
            </h2>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed" style={{ fontWeight: 300 }}>
              Get your conversion done in seconds. No learning curve required.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(8,145,178,0.4), rgba(8,145,178,0.4), transparent)" }} />

            {steps.map(({ num, title, desc }, i) => (
              <div key={num} className="csp-card-hover relative text-center flex flex-col items-center p-8 rounded-3xl bg-white" style={{ border: "1px solid rgba(8,145,178,0.1)", boxShadow: "0 4px 20px rgba(8,145,178,0.06)" }}>
                <span className="csp-step-num">{num}</span>
                <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg" style={{ background: "linear-gradient(135deg, #0891b2, #0e7490)", boxShadow: "0 8px 24px rgba(8,145,178,0.3)" }}>
                  <span className="text-xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EXAMPLES ═══ */}
      <section id="examples" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div>
              <p className="csp-tag mb-4 inline-block">Live examples</p>
              <h2 className="text-4xl font-extrabold text-gray-900 mt-4" style={{ fontFamily: "'Syne', sans-serif" }}>See it in action</h2>
              <p className="mt-3 text-sm text-gray-400" style={{ fontWeight: 300 }}>Real conversions from our most common use cases.</p>
            </div>
            <a href="#tool" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 hover:gap-3 transition-all duration-200 whitespace-nowrap">
              Try it yourself <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {examples.map(({ input, output, label }, i) => (
              <div key={i} className="csp-example-card group relative rounded-2xl p-6 bg-white overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                {/* Hover accent */}
                <div className="absolute top-0 inset-x-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" style={{ background: "linear-gradient(90deg, #0891b2, #22d3ee)" }} />

                <span className="csp-tag inline-block mb-5">{label}</span>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Input</p>
                    <p className="text-sm font-mono text-gray-700 px-3 py-2.5 rounded-xl" style={{ background: "#f8fafc", border: "1px solid rgba(0,0,0,0.06)" }}>
                      {input}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-400" style={{ background: "rgba(8,145,178,0.08)" }}>
                      <ArrowRightLeft size={14} />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Output</p>
                    <div className="flex items-center gap-2">
                      <p className="flex-1 text-sm font-mono font-bold px-3 py-2.5 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(8,145,178,0.08), rgba(14,116,144,0.05))", color: "#0891b2", border: "1px solid rgba(8,145,178,0.15)" }}>
                        {output}
                      </p>
                      <CopyButton text={output} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ USE CASES ═══ */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="csp-tag mb-4 inline-block">Use cases</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              Who uses the {tool.title}?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: "👩‍💻", role: "Developers", desc: "Quickly convert values during testing, API integration, or data formatting tasks." },
              { emoji: "📊", role: "Data analysts", desc: "Clean and transform datasets with consistent unit conversions across large tables." },
              { emoji: "🎓", role: "Students", desc: "Solve homework and exam problems involving unit or value conversions in seconds." },
              { emoji: "✈️", role: "Travelers", desc: "Convert currencies, distances, and temperatures while on the go." },
              { emoji: "🏗️", role: "Engineers", desc: "Perform precise technical conversions for design, construction, and calculations." },
              { emoji: "🛒", role: "Everyday users", desc: "Handle everyday tasks like cooking, shopping, or comparing product specs easily." },
            ].map(({ emoji, role, desc }) => (
              <div key={role} className="csp-card-hover group flex gap-4 p-6 rounded-2xl bg-white" style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)" }}>
                  {emoji}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{role}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DIVIDER ═══ */}
      <div className="csp-divider mx-10" />

      {/* ═══ RELATED TOOLS ═══ */}
      {relatedTools.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
              <div>
                <p className="csp-tag mb-4 inline-block">
                  <TrendingUp size={10} className="inline mr-1" />Related tools
                </p>
                <h2 className="text-4xl font-extrabold text-gray-900 mt-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                  More {tool.category} converters
                </h2>
                <p className="mt-2 text-sm text-gray-400" style={{ fontWeight: 300 }}>Explore other tools in the same category.</p>
              </div>
              <Link to="/converters" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 hover:gap-3 transition-all duration-200 whitespace-nowrap">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedTools.map((t) => (
                <Link key={t.id} to={`/converters/${slugify(t.title)}`} className="csp-related-card group flex flex-col gap-4 p-6 rounded-2xl bg-white"
                  style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
                  <div className="flex items-center justify-between">
                    <span className="csp-tag">{t.category}</span>
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:bg-cyan-50"
                      style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
                      <ArrowRight size={11} className="text-gray-300 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-cyan-700 transition-colors leading-snug" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {t.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{t.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-24" style={{ background: "linear-gradient(180deg, #f0f9ff 0%, #f8fafc 100%)" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="csp-tag mb-4 inline-block">FAQ</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              Frequently asked questions
            </h2>
            <p className="mt-4 text-sm text-gray-400" style={{ fontWeight: 300 }}>
              Everything you need to know about the {tool.title}.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden bg-white p-4" style={{ border: "1px solid rgba(8,145,178,0.1)", boxShadow: "0 4px 30px rgba(8,145,178,0.06)" }}>
            {faqs.map((faq, i) => (
              <FAQItem key={i} {...faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BOTTOM ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden p-14 text-center"
            style={{ background: "linear-gradient(135deg, #0891b2 0%, #0e7490 40%, #164e63 100%)" }}>
            {/* Noise */}
            <div className="csp-noise absolute inset-0 pointer-events-none" />
            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            {/* Glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ background: "rgba(255,255,255,0.08)" }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-bold text-white uppercase tracking-wider" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <Zap size={11} />
                Ready to convert?
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                Start using the {tool.title} now
              </h2>
              <p className="text-cyan-100 text-sm leading-relaxed max-w-md mx-auto mb-10" style={{ fontWeight: 300 }}>
                Free, fast, and works instantly. No registration, no downloads, no hassle.
              </p>
              <a href="#tool" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-cyan-700 text-sm font-black shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
                style={{ fontFamily: "'Syne', sans-serif" }}>
                <ArrowRightLeft size={16} />
                Open {tool.title}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}