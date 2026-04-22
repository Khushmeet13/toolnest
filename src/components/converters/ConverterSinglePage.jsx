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

// ─── Placeholder tool components by slug ──────────────────────────────────────
// Replace these with your actual tool components
const toolComponents = {
  // "length-converter": LengthConverter,
  // etc.
};

// ─── Static content helpers ────────────────────────────────────────────────────
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
  {
    num: "01",
    title: "Enter your value",
    desc: `Type or paste the value you want to convert into the input field.`,
  },
  {
    num: "02",
    title: "Select units",
    desc: "Choose your source and target units from the dropdown menus.",
  },
  {
    num: "03",
    title: "Get results instantly",
    desc: "Results appear in real time as you type — no button needed.",
  },
  {
    num: "04",
    title: "Copy & use",
    desc: "One-click copy to clipboard. Paste it wherever you need.",
  },
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
    a: `Yes, completely free. No account, no subscription, no hidden charges. Just open and use.`,
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

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatPill({ value, label }) {
  return (
    <div className="flex flex-col items-center px-6 py-3 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur border border-gray-100 dark:border-white/10">
      <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{value}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</span>
    </div>
  );
}

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
      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-cyan-50 dark:hover:bg-cyan-500/20 text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-200"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="border-b border-gray-100 dark:border-white/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className={`text-sm font-medium transition-colors ${open ? "text-cyan-600 dark:text-cyan-400" : "text-gray-800 dark:text-gray-200"}`}>
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${open ? "rotate-180 text-cyan-500" : ""}`}
        />
      </button>
      {open && (
        <p className="text-sm text-gray-500 dark:text-gray-400 pb-5 leading-relaxed pr-8">
          {a}
        </p>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ConverterSinglePage() {
  const { slug } = useParams();
  const ToolComponent = toolComponents[slug];

  const tool = converters.find((t) => slugify(t.title) === slug);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Tool not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">We couldn't find a tool matching this URL.</p>
          <Link to="/converters" className="text-cyan-600 hover:underline font-medium">
            ← Browse all converters
          </Link>
        </div>
      </div>
    );
  }

  const features = getFeatures(tool);
  const steps = getSteps(tool);
  const examples = getExamples(tool.category);
  const faqs = getFaqs(tool);
  const relatedTools = converters
    .filter((t) => t.category === tool.category && t.id !== tool.id)
    .slice(0, 4);

  const titleWords = tool.title.split(" ");
  const lastWord = titleWords[titleWords.length - 1];
  const titleWithoutLast = titleWords.slice(0, -1).join(" ");

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* ═══════════════════════════════════════════════
          HERO / HEADER SECTION
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 pt-12 pb-20">

        {/* Grid texture */}
        <div
          className="absolute inset-0 -z-10 opacity-40 dark:opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right,rgba(8,145,178,0.08) 1px,transparent 1px),linear-gradient(to bottom,rgba(8,145,178,0.08) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow blob */}
        <div className="absolute -top-32 right-1/4 -z-10 w-[600px] h-[400px] bg-cyan-400/10 dark:bg-cyan-500/10 blur-[100px] rounded-full" />
        <div className="absolute top-10 left-1/4 -z-10 w-[300px] h-[300px] bg-blue-400/10 dark:bg-blue-500/8 blur-[80px] rounded-full" />

        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 mb-10">
            <Link to="/" className="hover:text-cyan-600 transition-colors">Home</Link>
            <ChevronRightIcon className="w-3.5 h-3.5" />
            <Link to="/converters" className="hover:text-cyan-600 transition-colors">Converters</Link>
            <ChevronRightIcon className="w-3.5 h-3.5" />
            <span className="text-cyan-600 dark:text-cyan-400">{tool.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: Text content */}
            <div>
              {/* Category pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-500/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                {tool.category} · Free Tool
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-semibold leading-[1.15] tracking-tight">
                {titleWithoutLast}{" "}
                <span className="relative inline-block text-cyan-600 dark:text-cyan-400">
                  {lastWord}
                  <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                    <path d="M0 5 Q50 0 100 4 Q150 8 200 3" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
                  </svg>
                </span>
              </h1>

              {/* Description */}
              <p className="mt-5 text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-md">
                {tool.description} Fast, free, and works right in your browser — no signup needed.
              </p>

              {/* CTA row */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#tool"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:-translate-y-0.5"
                >
                  <ArrowRightLeft size={15} />
                  Start Converting
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:border-cyan-300 dark:hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-200"
                >
                  How it works
                  <ArrowRight size={13} />
                </a>
              </div>

              {/* Quick-nav links */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {["Features", "How it works", "Examples", "FAQ"].map((label) => (
                  <a
                    key={label}
                    href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-xs text-gray-400 dark:text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    {label} ↓
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Stats card */}
            <div className="hidden lg:flex flex-col gap-4 items-end">
              <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-xl shadow-gray-100/60 dark:shadow-none">

                {/* Decorative header bar */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-auto text-xs text-gray-300 dark:text-gray-600 font-mono">
                    {tool.title.toLowerCase().replace(/\s/g, "_")}.js
                  </div>
                </div>

                {/* Fake code preview */}
                <div className="font-mono text-xs space-y-1.5 text-gray-400 dark:text-gray-500">
                  <div><span className="text-purple-400">const</span> <span className="text-cyan-500">result</span> = convert(</div>
                  <div className="pl-4 text-amber-400">"<span className="text-green-400">input value</span>",</div>
                  <div className="pl-4 text-amber-400">"<span className="text-green-400">from_unit</span>",</div>
                  <div className="pl-4 text-amber-400">"<span className="text-green-400">to_unit</span>"</div>
                  <div>);</div>
                  <div className="pt-1 text-gray-300 dark:text-gray-600">// ✓ Result: <span className="text-cyan-400">42.0</span></div>
                </div>

                {/* Stats row */}
                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/10 grid grid-cols-3 gap-3 text-center">
                  {[
                    { v: "100%", l: "Free" },
                    { v: "0ms", l: "Latency" },
                    { v: "∞", l: "Uses" },
                  ].map(({ v, l }) => (
                    <div key={l}>
                      <div className="text-lg font-bold text-gray-800 dark:text-white">{v}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust row */}
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                <div className="flex -space-x-1">
                  {["bg-cyan-400", "bg-blue-400", "bg-purple-400", "bg-pink-400"].map((c, i) => (
                    <div key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-white dark:border-gray-950`} />
                  ))}
                </div>
                <span>Trusted by 50,000+ users</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TOOL SECTION
      ═══════════════════════════════════════════════ */}
      <section id="tool" className="py-16 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{tool.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Results update as you type</p>
          </div>

          {ToolComponent ? (
            <ToolComponent />
          ) : (
            /* Generic fallback converter UI */
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-white/10">

                {/* Input panel */}
                <div className="p-6">
                  <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                    From
                  </label>
                  <select className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option>Select unit</option>
                  </select>
                  <textarea
                    rows={4}
                    placeholder="Enter value to convert..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  />
                </div>

                {/* Output panel */}
                <div className="p-6 relative">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      To
                    </label>
                    <CopyButton text="result" />
                  </div>
                  <select className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option>Select unit</option>
                  </select>
                  <div className="w-full h-[104px] px-4 py-3 rounded-xl border border-dashed border-cyan-200 dark:border-cyan-500/20 bg-cyan-50/50 dark:bg-cyan-500/5 text-sm text-gray-400 dark:text-gray-500 flex items-center justify-center">
                    Result will appear here
                  </div>

                  {/* Swap button */}
                  <button className="absolute top-1/2 -left-5 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-md hover:shadow-lg hover:border-cyan-300 dark:hover:border-cyan-500/40 text-gray-400 hover:text-cyan-600 transition-all duration-200">
                    <ArrowRightLeft size={14} />
                  </button>
                </div>
              </div>

              {/* Action bar */}
              <div className="px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/3 flex items-center justify-between gap-4">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  <span className="text-green-500">●</span> Live conversion · No data stored
                </p>
                <button className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition-all duration-200">
                  <ArrowRightLeft size={13} />
                  Convert
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════════════════════ */}
      <section id="features" className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          <div className="max-w-xl mb-14">
            <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3">Why use this tool</p>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white leading-tight">
              Built for speed,<br />
              <span className="text-cyan-600 dark:text-cyan-400">designed for simplicity</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative p-6 rounded-2xl border border-gray-100 dark:border-white/8 hover:border-cyan-200 dark:hover:border-cyan-500/20 bg-white dark:bg-white/3 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={18} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/8">
            {[
              { value: "50K+", label: "Monthly users" },
              { value: "1M+", label: "Conversions done" },
              { value: "4.9★", label: "Average rating" },
              { value: "0ms", label: "Response time" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white dark:bg-gray-950 py-8 text-center">
                <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS SECTION
      ═══════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900/40">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3">Simple process</p>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
              How to use the {tool.title}
            </h2>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Get your conversion done in seconds. No learning curve required.
            </p>
          </div>

          {/* Steps */}
          <div className="relative grid md:grid-cols-4 gap-8">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-cyan-300 dark:via-cyan-600 to-transparent -z-0" />

            {steps.map(({ num, title, desc }) => (
              <div key={num} className="relative text-center flex flex-col items-center">
                {/* Step circle */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-white dark:bg-gray-900 border-2 border-cyan-200 dark:border-cyan-600/40 flex items-center justify-center shadow-md shadow-cyan-100/50 dark:shadow-none mb-5">
                  <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{num}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-[180px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          EXAMPLES SECTION
      ═══════════════════════════════════════════════ */}
      <section id="examples" className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3">Live examples</p>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                See it in action
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Real conversions from our most common use cases.
              </p>
            </div>
            <a
              href="#tool"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline whitespace-nowrap"
            >
              Try it yourself <ArrowRight size={13} />
            </a>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {examples.map(({ input, output, label }, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-gray-100 dark:border-white/8 bg-gray-50 dark:bg-white/3 p-5 hover:border-cyan-200 dark:hover:border-cyan-500/20 hover:shadow-md hover:shadow-cyan-500/5 transition-all duration-300 overflow-hidden"
              >
                {/* Subtle top accent */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <span className="inline-block mb-4 text-xs px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-mono">
                  {label}
                </span>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Input</p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 rounded-lg px-3 py-2 border border-gray-100 dark:border-white/8">
                      {input}
                    </p>
                  </div>

                  <div className="flex items-center justify-center text-cyan-400 dark:text-cyan-600">
                    <ArrowRightLeft size={14} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Output</p>
                    <div className="flex items-center gap-2">
                      <p className="flex-1 text-sm font-mono font-semibold text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 rounded-lg px-3 py-2 border border-cyan-100 dark:border-cyan-500/20">
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

      {/* ═══════════════════════════════════════════════
          USE CASES SECTION
      ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/40 dark:to-gray-950">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3">Use cases</p>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Who uses the {tool.title}?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { emoji: "👩‍💻", role: "Developers", desc: "Quickly convert values during testing, API integration, or data formatting tasks." },
              { emoji: "📊", role: "Data analysts", desc: "Clean and transform datasets with consistent unit conversions across large tables." },
              { emoji: "🎓", role: "Students", desc: "Solve homework and exam problems involving unit or value conversions in seconds." },
              { emoji: "✈️", role: "Travelers", desc: "Convert currencies, distances, and temperatures while on the go." },
              { emoji: "🏗️", role: "Engineers", desc: "Perform precise technical conversions for design, construction, and calculations." },
              { emoji: "🛒", role: "Everyday users", desc: "Handle everyday tasks like cooking, shopping, or comparing product specs easily." },
            ].map(({ emoji, role, desc }) => (
              <div key={role} className="flex gap-4 p-5 rounded-2xl border border-gray-100 dark:border-white/8 bg-white dark:bg-white/3 hover:border-cyan-200 dark:hover:border-cyan-500/20 transition-colors duration-200">
                <span className="text-2xl flex-shrink-0">{emoji}</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{role}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          RELATED TOOLS SECTION
      ═══════════════════════════════════════════════ */}
      {relatedTools.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-white/5">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div>
                <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3">
                  <TrendingUp size={11} className="inline mr-1" />
                  Related tools
                </p>
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                  More {tool.category} converters
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Explore other tools in the same category.
                </p>
              </div>
              <Link
                to="/converters"
                className="inline-flex items-center gap-2 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline whitespace-nowrap"
              >
                View all converters <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedTools.map((t) => (
                <Link
                  key={t.id}
                  to={`/converters/${slugify(t.title)}`}
                  className="group flex flex-col gap-3 p-5 rounded-2xl border border-gray-100 dark:border-white/8 bg-gray-50 dark:bg-white/3 hover:border-cyan-200 dark:hover:border-cyan-500/20 hover:bg-white dark:hover:bg-white/5 hover:shadow-md hover:shadow-cyan-500/5 transition-all duration-250"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400">
                      {t.category}
                    </span>
                    <ArrowRight size={12} className="text-gray-300 dark:text-gray-600 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors duration-150">
                    {t.title}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2">
                    {t.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          FAQ SECTION
      ═══════════════════════════════════════════════ */}
      <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">

          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Everything you need to know about the {tool.title}.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 px-8 py-2 shadow-sm">
            {faqs.map((faq, i) => (
              <FAQItem key={i} {...faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA BOTTOM SECTION
      ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="relative rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 p-12 overflow-hidden">
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-6">
                <Zap size={12} />
                Ready to convert?
              </div>
              <h2 className="text-3xl font-semibold text-white mb-4">
                Start using the {tool.title} now
              </h2>
              <p className="text-cyan-100 text-sm leading-relaxed max-w-md mx-auto mb-8">
                Free, fast, and works instantly. No registration, no downloads, no hassle.
              </p>
              <a
                href="#tool"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-cyan-700 text-sm font-bold hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                <ArrowRightLeft size={15} />
                Open {tool.title}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}