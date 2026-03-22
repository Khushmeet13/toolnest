import { useState } from "react";

// ─── Tailwind + Font injection ────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; margin: 0; }
    input:focus { outline: none; }
    button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both; }
    .spinner {
      display: inline-block; width: 17px; height: 17px;
      border: 2.5px solid rgba(255,255,255,0.3);
      border-top-color: white; border-radius: 50%;
      animation: spin 0.65s linear infinite;
      vertical-align: middle;
    }
    .big-spinner {
      width: 34px; height: 34px;
      border: 3px solid #cffafe;
      border-top-color: #06b6d4;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
  `}</style>
);

// ─── Color palettes ───────────────────────────────────────────────────────────
const PALETTES = [
  { primary: "#06b6d4", bg: "#ecfeff", light: "#cffafe", dark: "#0e7490" },
  { primary: "#8b5cf6", bg: "#f5f3ff", light: "#ede9fe", dark: "#6d28d9" },
  { primary: "#10b981", bg: "#ecfdf5", light: "#d1fae5", dark: "#065f46" },
  { primary: "#f43f5e", bg: "#fff1f2", light: "#ffe4e6", dark: "#9f1239" },
  { primary: "#f59e0b", bg: "#fffbeb", light: "#fef3c7", dark: "#92400e" },
  { primary: "#3b82f6", bg: "#eff6ff", light: "#dbeafe", dark: "#1e40af" },
];

// ─── SVG icon shapes ──────────────────────────────────────────────────────────
const SHAPES = [
  (c) => `
    <polygon points="40,8 72,26 72,62 40,80 8,62 8,26" fill="${c}" opacity="0.13"/>
    <polygon points="40,13 67,29 67,59 40,75 13,59 13,29" fill="none" stroke="${c}" stroke-width="3"/>
    <polygon points="45,22 32,46 41,46 35,64 54,38 45,38" fill="${c}"/>`,
  (c) => `
    <circle cx="40" cy="40" r="32" fill="${c}" opacity="0.12"/>
    <circle cx="40" cy="40" r="32" fill="none" stroke="${c}" stroke-width="3"/>
    <path d="M25,56 Q25,24 57,24 Q57,56 25,56Z" fill="${c}" opacity="0.85"/>
    <line x1="41" y1="55" x2="41" y2="65" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`,
  (c) => `
    <polygon points="40,5 75,40 40,75 5,40" fill="${c}" opacity="0.12"/>
    <polygon points="40,5 75,40 40,75 5,40" fill="none" stroke="${c}" stroke-width="3"/>
    <polygon points="40,20 60,40 40,60 20,40" fill="${c}" opacity="0.3"/>
    <polygon points="40,28 52,40 40,52 28,40" fill="${c}"/>`,
  (c) => `
    <circle cx="40" cy="40" r="32" fill="${c}" opacity="0.1"/>
    <circle cx="40" cy="40" r="32" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.4"/>
    <path d="M40,14 C47,18 53,28 53,38 L53,52 L40,60 L27,52 L27,38 C27,28 33,18 40,14Z" fill="${c}" opacity="0.88"/>
    <circle cx="40" cy="35" r="6" fill="white" opacity="0.65"/>
    <path d="M30,52 L22,62 L32,57Z" fill="${c}" opacity="0.65"/>
    <path d="M50,52 L58,62 L48,57Z" fill="${c}" opacity="0.65"/>`,
  (c) => `
    <path d="M40,7 L70,20 L70,42 C70,57 57,68 40,76 C23,68 10,57 10,42 L10,20 Z" fill="${c}" opacity="0.12"/>
    <path d="M40,7 L70,20 L70,42 C70,57 57,68 40,76 C23,68 10,57 10,42 L10,20 Z" fill="none" stroke="${c}" stroke-width="3"/>
    <path d="M27,40 L36,50 L54,28" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  (c) => `
    <rect x="8" y="8" width="64" height="64" rx="20" fill="${c}" opacity="0.1"/>
    <rect x="8" y="8" width="64" height="64" rx="20" fill="none" stroke="${c}" stroke-width="3"/>
    <path d="M22,40 C22,32 28,26 35,26 C42,26 42,40 49,40 C56,40 62,34 62,40 C62,46 56,54 49,54 C42,54 42,40 35,40 C28,40 22,48 22,40Z"
      fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>`,
];

const INDUSTRIES = ["Tech", "Finance", "Health", "Education", "Food", "Fashion", "Travel", "Gaming"];

// ─── Build SVG string ─────────────────────────────────────────────────────────
function buildSVG(name, shapeIdx, palette, size = 320) {
  const iconSize = Math.round(size * 0.25);
  const iconX = (size - 80) / 2;
  const iconY = size * 0.1;
  const scale = iconSize / 80;
  const fontSize =
    name.length > 9
      ? Math.round(size * 0.085)
      : name.length > 6
      ? Math.round(size * 0.097)
      : Math.round(size * 0.11);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bg}"/>
      <stop offset="100%" stop-color="${palette.light}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)" rx="${Math.round(size * 0.18)}"/>
  <g transform="translate(${iconX}, ${iconY}) scale(${scale})">
    ${SHAPES[shapeIdx % SHAPES.length](palette.primary)}
  </g>
  <text x="${size / 2}" y="${size * 0.68}"
    text-anchor="middle"
    font-family="'Syne','DM Sans',sans-serif"
    font-weight="800"
    font-size="${fontSize}"
    fill="${palette.primary}"
    letter-spacing="-1"
  >${name}</text>
  <text x="${size / 2}" y="${size * 0.81}"
    text-anchor="middle"
    font-family="'DM Sans',sans-serif"
    font-weight="500"
    font-size="${Math.round(size * 0.042)}"
    fill="${palette.primary}"
    opacity="0.45"
    letter-spacing="3"
  >${name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()} BRAND</text>
</svg>`;
}

// ─── Download helpers ─────────────────────────────────────────────────────────
function dlPNG(svgStr, name) {
  const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = 600;
    c.height = 600;
    c.getContext("2d").drawImage(img, 0, 0, 600, 600);
    URL.revokeObjectURL(url);
    const a = document.createElement("a");
    a.download = `${name}-logo.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  };
  img.src = url;
}

function dlSVG(svgStr, name) {
  const a = document.createElement("a");
  a.download = `${name}-logo.svg`;
  a.href = URL.createObjectURL(new Blob([svgStr], { type: "image/svg+xml" }));
  a.click();
}

// ─── Brand Card ───────────────────────────────────────────────────────────────
function BrandCard({ brand, index, showLogos }) {
  const pal = PALETTES[index % PALETTES.length];
  const svg = buildSVG(brand.name, index, pal);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(
      `Name: ${brand.name}\nTagline: ${brand.tagline}\nLogo idea: ${brand.logo_idea}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fade-up bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 0.06}s`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      {/* Top accent gradient bar */}
      <div
        className="h-[3px] w-full"
        style={{ background: `linear-gradient(90deg, ${pal.primary}, ${pal.dark})` }}
      />

      <div className="p-5">
        {/* Logo preview */}
        {showLogos && (
          <div
            className="w-full rounded-xl mb-4 flex items-center justify-center overflow-hidden py-5"
            style={{ background: pal.bg, border: `1px solid ${pal.light}` }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: buildSVG(brand.name, index, pal, 150) }}
              className="leading-none block"
            />
          </div>
        )}

        {/* Name */}
        <h3
          className="text-xl font-extrabold text-gray-900 mb-1 tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {brand.name}
        </h3>

        {/* Tagline */}
        <p className="text-sm text-gray-400 mb-3 leading-relaxed">{brand.tagline}</p>

        {/* Logo idea */}
        <div className="rounded-xl p-3 mb-4" style={{ background: pal.bg }}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Logo Idea
          </p>
          <p className="text-sm leading-relaxed font-medium" style={{ color: pal.dark }}>
            {brand.logo_idea}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Industry badge */}
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: pal.light, color: pal.dark }}
          >
            {brand.industry}
          </span>

          <div className="flex gap-2 items-center">
            {/* Copy button */}
            <button
              onClick={copy}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all font-medium bg-white"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>

            {/* Download dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white flex items-center gap-1.5 transition-all hover:opacity-90 border-0"
                style={{ background: pal.primary }}
              >
                ↓ Download
              </button>

              {open && (
                <div
                  className="absolute right-0 z-30 bg-white rounded-xl overflow-hidden"
                  style={{
                    bottom: "calc(100% + 6px)",
                    width: 148,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  }}
                >
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 bg-white"
                    onClick={() => { dlPNG(svg, brand.name); setOpen(false); }}
                  >
                    <span>🖼</span> PNG (600px)
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 bg-white border-0"
                    onClick={() => { dlSVG(svg, brand.name); setOpen(false); }}
                  >
                    <span>🎨</span> SVG Vector
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = () => <span className="spinner" />;

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function BrandNameGenerator() {
  const [keyword, setKeyword] = useState("");
  const [activeTags, setActiveTags] = useState(["Tech"]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLogos, setShowLogos] = useState(true);

  const toggleTag = (tag) =>
    setActiveTags((p) =>
      p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]
    );

  const generate = async () => {
    if (!keyword.trim()) {
      setError("Please describe your business first.");
      return;
    }
    setError("");
    setLoading(true);
    setBrands([]);

    const prompt = `You are a world-class branding expert. Generate exactly 6 unique brand name ideas for: "${keyword}". Industry: ${activeTags.join(", ") || "General"}.

Return ONLY valid JSON array (no markdown). Each item:
- "name": catchy 1-2 word brand name
- "tagline": max 7 words, punchy
- "logo_idea": describe icon + color (e.g. "Teal hexagon with lightning bolt")
- "industry": one word`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.find((b) => b.type === "text")?.text || "[]";
      setBrands(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white py-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <GlobalStyles />

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 ">

        {/* Hero section */}
        <div className="text-center mb-11">
          <h1
            className="font-medium text-4xl text-slate-900 leading-tight mb-2"
            
          >
            Brand Name + <span className="text-cyan-400">Logo</span> Generator
          </h1>
          <p className="text-slate-400 text-[15px] max-w-[420px] mx-auto leading-relaxed">
            AI se generate karo professional brand name, tagline aur downloadable logo — seconds mein.
          </p>
        </div>

        {/* Input card */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 mb-5 shadow-sm">

          {/* Business description label */}
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2.5">
            Business Describe Karein
          </p>

          {/* Input + Generate row */}
          <div className="flex gap-2.5 mb-5">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="e.g. online tutoring, fitness app, food delivery..."
              className="flex-1 h-11 px-4 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
            <button
              onClick={generate}
              disabled={loading}
              className="h-11 px-6 rounded-xl border-0 text-white text-sm font-semibold flex items-center gap-2 transition-all duration-200 hover:opacity-90 disabled:opacity-80"
              style={{ background: loading ? "#67e8f9" : "#06b6d4" }}
            >
              {loading ? <Spinner /> : "✦"} {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {/* Industry label */}
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2.5">
            Industry
          </p>

          {/* Industry tags */}
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="text-xs px-3.5 py-1.5 rounded-full font-medium transition-all duration-150 border"
                style={{
                  borderColor: activeTags.includes(tag) ? "#06b6d4" : "#e5e7eb",
                  background: activeTags.includes(tag) ? "#06b6d4" : "white",
                  color: activeTags.includes(tag) ? "white" : "#6b7280",
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Logo toggle — only visible after generation */}
          {brands.length > 0 && (
            <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-slate-50">
              <button
                onClick={() => setShowLogos((s) => !s)}
                className="w-[38px] h-[22px] rounded-full border-0 relative transition-all duration-200 flex-shrink-0"
                style={{ background: showLogos ? "#06b6d4" : "#d1d5db" }}
              >
                <span
                  className="absolute top-[3px] w-4 h-4 bg-white rounded-full transition-all duration-200 shadow"
                  style={{ left: showLogos ? 18 : 3 }}
                />
              </button>
              <span className="text-[13px] text-slate-500">
                Logo previews {showLogos ? "on" : "off"}
              </span>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center pt-16 gap-3.5">
            <div className="big-spinner" />
            <p className="text-sm text-slate-400">AI is crafting your brand identities...</p>
          </div>
        )}

        {/* Results grid */}
        {!loading && brands.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.1em]">
                {brands.length} brand identities generated
              </span>
              <button
                onClick={generate}
                className="text-[13px] font-semibold text-cyan-400 bg-transparent border-0"
              >
                Regenerate →
              </button>
            </div>

            <div
              className="grid gap-[18px]"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
            >
              {brands.map((b, i) => (
                <BrandCard key={`${b.name}-${i}`} brand={b} index={i} showLogos={showLogos} />
              ))}
            </div>

            <p className="text-center text-xs text-slate-300 mt-8">
              Har card mein ↓ Download se PNG ya SVG download karo
            </p>
          </>
        )}

        {/* Empty state */}
        {!loading && brands.length === 0 && !error && (
          <div className="text-center pt-16">
            <div className="text-5xl opacity-80 mb-3.5 text-cyan-600">✦</div>
            <p className="text-sm text-slate-300">Describe your business and generate</p>
          </div>
        )}
      </div>
    </div>
  );
}