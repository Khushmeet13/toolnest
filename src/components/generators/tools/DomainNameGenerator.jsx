import { useState, useCallback, useRef } from "react";

// ── Data ───────────────────────────────────────────────────────────────────────
const TLDS = [".com", ".io", ".co", ".net", ".app", ".dev", ".ai", ".xyz", ".org", ".tech"];

const PREFIXES = ["get", "try", "use", "go", "my", "the", "we", "hey", "join", "be", "meet", "hello"];
const SUFFIXES = ["hq", "hub", "app", "base", "labs", "ly", "ify", "fy", "io", "co", "pro", "plus", "now", "ai"];

const INDUSTRY_WORDS = {
  tech:     ["stack", "node", "loop", "flux", "byte", "grid", "sync", "core", "forge", "nest", "shift", "pulse", "spark", "wave"],
  finance:  ["vault", "ledger", "bloom", "grow", "yield", "mint", "coin", "fount", "atlas", "apex", "crest", "peak"],
  health:   ["vitae", "pulse", "calm", "zen", "bloom", "glow", "helio", "sera", "viva", "aura", "rise", "vita"],
  creative: ["craft", "canvas", "studio", "hue", "flow", "inkwell", "prism", "mosaic", "frame", "render", "brush"],
  ecom:     ["cart", "shelf", "crate", "market", "shop", "fetch", "haul", "depot", "trunk", "bay", "hub", "loot"],
  saas:     ["dash", "board", "track", "launch", "build", "deploy", "push", "pull", "ship", "send", "pipe", "relay"],
};

const ADJECTIVES = ["swift", "bright", "sharp", "clear", "bold", "fresh", "smart", "lean", "pure", "open", "solid", "neat", "sleek", "prime", "true"];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function titleCase(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function generateDomains({ keyword, industry, style, tlds, count }) {
  const industryPool = INDUSTRY_WORDS[industry] || INDUSTRY_WORDS.tech;
  const base = keyword.toLowerCase().trim().replace(/\s+/g, "") || pick(industryPool);
  const results = new Set();

  const generators = {
    brandable: () => {
      const combos = [
        () => titleCase(pick(PREFIXES)) + titleCase(base),
        () => titleCase(base) + titleCase(pick(SUFFIXES)),
        () => titleCase(pick(ADJECTIVES)) + titleCase(base),
        () => titleCase(base) + titleCase(pick(industryPool)),
        () => titleCase(pick(industryPool)) + titleCase(base),
        () => titleCase(base) + titleCase(pick(PREFIXES)),
      ];
      return pick(combos)();
    },
    short: () => {
      const combos = [
        () => base.slice(0, 5) + pick(["ly", "co", "fy", "io"]),
        () => pick(PREFIXES).slice(0, 2) + base.slice(0, 4),
        () => base.slice(0, 4) + pick(["x", "z", "q"]),
        () => pick(["a", "e", "i", "o", "u"]).replace(/./g, "") + base.slice(0, 5),
        () => base.slice(0, 3) + pick(industryPool).slice(0, 3),
      ];
      return pick(combos)();
    },
    keyword: () => {
      const combos = [
        () => base + pick(industryPool),
        () => pick(industryPool) + base,
        () => base + pick(SUFFIXES),
        () => pick(PREFIXES) + base,
        () => base + pick(ADJECTIVES),
        () => pick(ADJECTIVES) + base,
      ];
      return pick(combos)();
    },
    creative: () => {
      const vowels = "aeiou";
      const combos = [
        () => base.replace(/[aeiou]/gi, pick([..."aeiou"])).slice(0, 8),
        () => pick(industryPool).slice(0, 3) + base.slice(-3) + pick(["a", "o", "e"]),
        () => titleCase(pick(ADJECTIVES).slice(0, 4)) + titleCase(pick(industryPool).slice(0, 4)),
        () => base.split("").reverse().slice(0, 4).join("") + pick(SUFFIXES),
        () => pick(PREFIXES) + pick(industryPool).slice(0, 4) + pick(["a", "o", "i"]),
      ];
      return pick(combos)();
    },
  };

  const gen = generators[style] || generators.brandable;
  let attempts = 0;
  while (results.size < count && attempts < count * 10) {
    attempts++;
    const name = gen().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (name.length >= 3 && name.length <= 16) results.add(name);
  }

  return Array.from(results).flatMap(name =>
    tlds.slice(0, Math.ceil(tlds.length / 2) + 1).map(tld => ({
      id: `${name}${tld}-${Math.random()}`,
      name,
      tld,
      full: `${name}${tld}`,
      available: Math.random() > 0.35,
      price: tld === ".com" ? 12.99 : tld === ".io" ? 39 : tld === ".ai" ? 79 : tld === ".dev" ? 14 : tld === ".app" ? 14 : Math.floor(Math.random() * 25) + 8,
    }))
  ).slice(0, count * 2);
}

// ── Icons ──────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2 9V2.5A.5.5 0 012.5 2H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 6.5L5 9.5L11 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill={filled ? "currentColor" : "none"}>
    <path d="M6.5 11S1.5 7.5 1.5 4.5a2.5 2.5 0 015-0c0 0 0 0 0 0a2.5 2.5 0 015 0C11.5 7.5 6.5 11 6.5 11z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const RefreshIcon = ({ spinning }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={spinning ? "animate-spin" : ""}>
    <path d="M1.5 7A5.5 5.5 0 107 1.5a5.47 5.47 0 00-3.5 1.26" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M3.5 1v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
    <ellipse cx="7" cy="7" rx="2.5" ry="5.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.5 7h11M1.5 4.5h11M1.5 9.5h11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);
const CartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M1 1.5h1.5l1.5 6h5.5l1-4H4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5" cy="11" r="1" fill="currentColor" />
    <circle cx="9.5" cy="11" r="1" fill="currentColor" />
  </svg>
);
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 3.5h10M4 7h6M6 10.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5v2M7 10.5v2M1.5 7h2M10.5 7h2M3.2 3.2l1.4 1.4M9.4 9.4l1.4 1.4M3.2 10.8l1.4-1.4M9.4 4.6l1.4-1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const ChevronIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M2 4l3.5 3.5L9 4" stroke="#999" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── DomainCard ─────────────────────────────────────────────────────────────────
function DomainCard({ domain, saved, onSave, copied, onCopy, index }) {
  const isAvail = domain.available;
  return (
    <div
      className={[
        "fade-up group flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-150",
        isAvail
          ? "bg-white border-neutral-150 hover:border-neutral-300 hover:shadow-sm"
          : "bg-neutral-50 border-neutral-100 opacity-60",
      ].join(" ")}
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Availability dot */}
        <span className={["w-2 h-2 rounded-full flex-shrink-0 mt-0.5", isAvail ? "bg-emerald-400" : "bg-neutral-300"].join(" ")} />

        <div className="min-w-0">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[15px] font-black tracking-tight text-neutral-900 truncate">{domain.name}</span>
            <span className={["text-[14px] font-bold", isAvail ? "text-blue-500" : "text-neutral-400"].join(" ")}>{domain.tld}</span>
          </div>
          <div className={["text-[11px] font-semibold mt-0.5", isAvail ? "text-emerald-600" : "text-neutral-400"].join(" ")}>
            {isAvail ? `$${domain.price}/yr` : "Taken"}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {isAvail && (
          <button
            onClick={() => onSave(domain)}
            className={["w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
              saved ? "text-rose-400 bg-rose-50" : "text-neutral-300 hover:text-rose-400 hover:bg-rose-50 opacity-0 group-hover:opacity-100",
            ].join(" ")}
            title="Save"
          >
            <HeartIcon filled={saved} />
          </button>
        )}
        <button
          onClick={() => onCopy(domain)}
          className={["w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
            copied ? "text-green-500 bg-green-50" : "text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100 opacity-0 group-hover:opacity-100",
          ].join(" ")}
          title="Copy"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
        {isAvail && (
          <button className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-700 transition-colors ml-1">
            <CartIcon /> Register
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function DomainNameGenerator() {
  const [keyword, setKeyword]   = useState("");
  const [industry, setIndustry] = useState("tech");
  const [style, setStyle]       = useState("brandable");
  const [selectedTlds, setSelectedTlds] = useState([".com", ".io", ".co", ".net", ".app"]);
  const [count, setCount]       = useState(8);
  const [filterAvail, setFilterAvail] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const [domains, setDomains]   = useState([]);
  const [saved, setSaved]       = useState([]);
  const [copied, setCopied]     = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading]   = useState(false);

  const inputRef = useRef(null);

  const generate = useCallback(() => {
    setSpinning(true);
    setLoading(true);
    setTimeout(() => {
      const result = generateDomains({ keyword, industry, style, tlds: selectedTlds, count });
      setDomains(result);
      setGenerated(true);
      setSpinning(false);
      setLoading(false);
      setActiveTab("all");
    }, 600);
  }, [keyword, industry, style, selectedTlds, count]);

  const handleKeyDown = (e) => { if (e.key === "Enter") generate(); };

  const toggleTld = (tld) => {
    setSelectedTlds(prev =>
      prev.includes(tld)
        ? prev.length > 1 ? prev.filter(t => t !== tld) : prev
        : [...prev, tld]
    );
  };

  const toggleSave = (domain) => {
    setSaved(prev =>
      prev.find(d => d.id === domain.id) ? prev.filter(d => d.id !== domain.id) : [...prev, domain]
    );
  };

  const handleCopy = (domain) => {
    navigator.clipboard.writeText(domain.full);
    setCopied(domain.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const visibleDomains = domains
    .filter(d => activeTab === "saved" ? saved.find(s => s.id === d.id) : true)
    .filter(d => !filterAvail || d.available);

  const availCount = domains.filter(d => d.available).length;

  const industries = [
    { key: "tech",     label: "Tech" },
    { key: "saas",     label: "SaaS" },
    { key: "finance",  label: "Finance" },
    { key: "health",   label: "Health" },
    { key: "creative", label: "Creative" },
    { key: "ecom",     label: "E-com" },
  ];

  const styles = [
    { key: "brandable", label: "Brandable", desc: "Prefix/suffix combos" },
    { key: "short",     label: "Short",     desc: "≤8 characters" },
    { key: "keyword",   label: "Keyword",   desc: "Based on input" },
    { key: "creative",  label: "Creative",  desc: "Unexpected blends" },
  ];

  const cardCls = "bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm";

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }
        .fade-up { animation: fadeUp 0.24s ease forwards; }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 400px 100%;
          animation: shimmer 1.2s infinite;
          border-radius: 8px;
        }
        input[type=range] { accent-color: #0f172a; }
      `}</style>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-20 bg-white border-b border-neutral-100 h-14 px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center text-white text-xs font-black">T</span>
          <span className="font-bold text-[15px] tracking-tight">ToolNest</span>
          <span className="text-neutral-300 mx-1.5 text-sm">/</span>
          <span className="text-[13px] font-semibold text-neutral-500">Domain Name Generator</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600 tracking-wide">Free Tool</span>
          <button className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors">All Tools</button>
          <button className="text-[13px] font-bold px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-700 transition-colors">Get Pro</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="max-w-2xl mx-auto text-center pt-12 pb-8 px-6">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-sky-500 bg-sky-50 px-3 py-1.5 rounded-full mb-5 tracking-wide">
          <GlobeIcon /> Domain Name Generator
        </span>
        <h1 className="text-[42px] font-black tracking-[-1.6px] leading-[1.08] text-neutral-950 mb-3.5">
          Find the perfect domain<br />
          <span className="text-neutral-400 font-black">for your next idea</span>
        </h1>
        <p className="text-[15px] text-neutral-400 leading-relaxed">
          Enter a keyword, pick your style, and instantly discover available domain names across every major TLD.
        </p>
      </div>

      {/* ── Search bar ── */}
      <div className="max-w-2xl mx-auto px-5 mb-8">
        <div className="flex gap-3 items-center bg-white border border-neutral-200 rounded-2xl p-2 shadow-sm">
          <div className="flex items-center gap-3 flex-1 px-3">
            <span className="text-neutral-300"><SearchIcon /></span>
            <input
              ref={inputRef}
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter keyword, brand name, or idea…"
              className="flex-1 text-[15px] font-medium text-neutral-900 placeholder-neutral-300 outline-none bg-transparent py-2"
            />
            {keyword && (
              <button onClick={() => setKeyword("")} className="text-neutral-300 hover:text-neutral-500 transition-colors text-lg leading-none">×</button>
            )}
          </div>
          <button
            onClick={generate}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white text-[14px] font-bold hover:bg-neutral-700 active:scale-[0.98] transition-all"
          >
            <RefreshIcon spinning={spinning} />
            Generate
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-[1100px] mx-auto px-5 pb-16">
        <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "280px 1fr" }}>

          {/* ── Filters sidebar ── */}
          <div className="space-y-4">

            {/* Industry */}
            <div className={cardCls}>
              <div className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3">Industry</div>
              <div className="grid grid-cols-2 gap-1.5">
                {industries.map(ind => (
                  <button
                    key={ind.key}
                    onClick={() => setIndustry(ind.key)}
                    className={[
                      "text-[12px] font-semibold px-3 py-2 rounded-lg border transition-all duration-150",
                      industry === ind.key
                        ? "bg-neutral-900 border-neutral-900 text-white"
                        : "bg-transparent border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50",
                    ].join(" ")}
                  >{ind.label}</button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className={cardCls}>
              <div className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3">Name Style</div>
              <div className="space-y-1.5">
                {styles.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setStyle(s.key)}
                    className={[
                      "w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-150",
                      style === s.key
                        ? "bg-neutral-900 border-neutral-900 text-white"
                        : "bg-transparent border-neutral-100 text-neutral-600 hover:border-neutral-200 hover:bg-neutral-50",
                    ].join(" ")}
                  >
                    <div className={["text-[13px] font-semibold", style === s.key ? "text-white" : "text-neutral-800"].join(" ")}>{s.label}</div>
                    <div className={["text-[11px] mt-0.5", style === s.key ? "text-neutral-400" : "text-neutral-400"].join(" ")}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* TLDs */}
            <div className={cardCls}>
              <div className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3">Extensions</div>
              <div className="flex flex-wrap gap-1.5">
                {TLDS.map(tld => (
                  <button
                    key={tld}
                    onClick={() => toggleTld(tld)}
                    className={[
                      "text-[12px] font-bold px-2.5 py-1 rounded-lg border transition-all duration-150",
                      selectedTlds.includes(tld)
                        ? "bg-neutral-900 border-neutral-900 text-white"
                        : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400",
                    ].join(" ")}
                  >{tld}</button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div className={cardCls}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] font-black uppercase tracking-widest text-neutral-400">Results per TLD</div>
                <span className="text-[13px] font-black text-neutral-900">{count}</span>
              </div>
              <input
                type="range" min="4" max="20" step="1" value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-neutral-200"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-medium mt-1.5">
                <span>4</span><span>20</span>
              </div>
            </div>

            {/* Saved quick-view */}
            {saved.length > 0 && (
              <div className={cardCls + " border-amber-200 bg-amber-50"}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] font-black uppercase tracking-widest text-amber-600">Saved</div>
                  <span className="text-[11px] font-bold text-amber-500 bg-amber-100 px-2 py-0.5 rounded-full">{saved.length}</span>
                </div>
                <div className="space-y-1.5">
                  {saved.slice(0, 4).map(d => (
                    <div key={d.id} className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-amber-800">{d.full}</span>
                      <span className="text-[11px] text-amber-500">${d.price}/yr</span>
                    </div>
                  ))}
                  {saved.length > 4 && (
                    <div className="text-[11px] text-amber-500 font-semibold">+{saved.length - 4} more</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Results panel ── */}
          <div>

            {/* Results header */}
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">

              {/* Tabs + filter bar */}
              <div className="flex items-center justify-between px-5 border-b border-neutral-100">
                <div className="flex">
                  {[
                    { key: "all",   label: `All${domains.length > 0 ? ` (${domains.length})` : ""}` },
                    { key: "saved", label: `Saved${saved.length > 0 ? ` (${saved.length})` : ""}` },
                  ].map(t => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={[
                        "text-[13px] font-semibold px-4 py-3.5 -mb-px border-b-2 transition-all duration-150",
                        activeTab === t.key
                          ? "text-neutral-900 border-neutral-900"
                          : "text-neutral-300 border-transparent hover:text-neutral-500",
                      ].join(" ")}
                    >{t.label}</button>
                  ))}
                </div>

                {generated && (
                  <div className="flex items-center gap-3 pr-1">
                    {/* Available only toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <button
                        onClick={() => setFilterAvail(v => !v)}
                        className={["w-8 h-5 rounded-full relative transition-colors duration-200", filterAvail ? "bg-emerald-500" : "bg-neutral-200"].join(" ")}
                      >
                        <span className={["absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200", filterAvail ? "left-3.5" : "left-0.5"].join(" ")} />
                      </button>
                      <span className="text-[12px] font-semibold text-neutral-500">Available only</span>
                    </label>

                    {/* Regenerate */}
                    <button onClick={generate}
                      className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors">
                      <RefreshIcon spinning={false} /> Regenerate
                    </button>
                  </div>
                )}
              </div>

              {/* Stats bar */}
              {generated && domains.length > 0 && (
                <div className="flex items-center gap-6 px-5 py-3 bg-neutral-50 border-b border-neutral-100 text-[12px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-bold text-neutral-700">{availCount}</span>
                    <span className="text-neutral-400">available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-neutral-300" />
                    <span className="font-bold text-neutral-700">{domains.length - availCount}</span>
                    <span className="text-neutral-400">taken</span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="text-neutral-400">Showing</span>
                    <span className="font-bold text-neutral-700">{visibleDomains.length}</span>
                    <span className="text-neutral-400">domains</span>
                  </div>
                </div>
              )}

              {/* Results body */}
              <div className="p-4">
                {loading ? (
                  /* Skeleton loader */
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-neutral-100">
                        <div className="flex items-center gap-3">
                          <div className="shimmer w-2 h-2 rounded-full" />
                          <div className="shimmer h-4 w-36 rounded" />
                        </div>
                        <div className="shimmer h-7 w-20 rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : !generated ? (
                  /* Empty state */
                  <div className="text-center py-20 px-5">
                    <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto mb-4">
                      <span className="text-sky-400"><GlobeIcon /></span>
                    </div>
                    <p className="text-[15px] font-bold text-neutral-300 mb-1">No domains yet</p>
                    <p className="text-[13px] text-neutral-300">
                      Enter a keyword above and hit{" "}
                      <strong className="text-neutral-400 font-semibold">Generate</strong>
                    </p>
                  </div>
                ) : visibleDomains.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-[14px] text-neutral-300">No domains match your filter.</p>
                    <button onClick={() => setFilterAvail(false)} className="mt-2 text-[13px] font-semibold text-neutral-400 underline underline-offset-2">Clear filter</button>
                  </div>
                ) : (
                  /* Domain grid — group by TLD */
                  (() => {
                    const groups = {};
                    visibleDomains.forEach(d => {
                      if (!groups[d.tld]) groups[d.tld] = [];
                      groups[d.tld].push(d);
                    });
                    return Object.entries(groups).map(([tld, items]) => (
                      <div key={tld} className="mb-5">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400">{tld}</span>
                          <div className="flex-1 h-px bg-neutral-100" />
                          <span className="text-[10px] font-bold text-neutral-300">{items.filter(d => d.available).length} available</span>
                        </div>
                        <div className="space-y-1.5">
                          {items.map((domain, i) => (
                            <DomainCard
                              key={domain.id}
                              domain={domain}
                              saved={!!saved.find(s => s.id === domain.id)}
                              onSave={toggleSave}
                              copied={copied === domain.id}
                              onCopy={handleCopy}
                              index={i}
                            />
                          ))}
                        </div>
                      </div>
                    ));
                  })()
                )}
              </div>
            </div>

            {/* Pro tip banner */}
            {generated && availCount > 0 && (
              <div className="fade-up mt-4 flex items-center gap-3 px-5 py-4 rounded-xl bg-sky-50 border border-sky-100">
                <SparkleIcon />
                <p className="text-[13px] text-sky-700 font-medium">
                  <strong className="font-bold">Pro tip:</strong> {".com"} domains register fastest — grab available ones before they're gone.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Feature strip ── */}
        <div className="grid grid-cols-4 gap-3 mt-8">
          {[
            { icon: "⚡", title: "Instant results",    desc: "Hundreds of ideas in seconds" },
            { icon: "🌐", title: "10+ TLD extensions", desc: ".com .io .ai .dev and more" },
            { icon: "💚", title: "Availability check", desc: "Green = likely available" },
            { icon: "❤️", title: "Save favourites",    desc: "Shortlist your top picks" },
          ].map((f, i) => (
            <div key={i} className="p-4 bg-white rounded-xl border border-neutral-100 shadow-sm">
              <div className="text-lg mb-1.5">{f.icon}</div>
              <div className="text-[13px] font-bold text-neutral-800 mb-0.5">{f.title}</div>
              <div className="text-[12px] text-neutral-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-100 py-5 text-center text-[12px] text-neutral-300">
        ToolNest · Domain Name Generator · Free forever · No signup required
      </footer>
    </div>
  );
}