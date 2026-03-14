import { useState } from "react";

// ─── Font injection ───────────────────────────────────────────────────────────
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; }
    .syne { font-family: 'Syne', sans-serif !important; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both; }
    input:focus { outline: none; }
    button { cursor: pointer; }
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

// ─── SVG icon paths (per shape index) ────────────────────────────────────────
const SHAPES = [
  // Hexagon + lightning
  (c) => `
    <polygon points="40,8 72,26 72,62 40,80 8,62 8,26" fill="${c}" opacity="0.13"/>
    <polygon points="40,13 67,29 67,59 40,75 13,59 13,29" fill="none" stroke="${c}" stroke-width="3"/>
    <polygon points="45,22 32,46 41,46 35,64 54,38 45,38" fill="${c}"/>`,

  // Circle + leaf
  (c) => `
    <circle cx="40" cy="40" r="32" fill="${c}" opacity="0.12"/>
    <circle cx="40" cy="40" r="32" fill="none" stroke="${c}" stroke-width="3"/>
    <path d="M25,56 Q25,24 57,24 Q57,56 25,56Z" fill="${c}" opacity="0.85"/>
    <line x1="41" y1="55" x2="41" y2="65" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`,

  // Diamond
  (c) => `
    <polygon points="40,5 75,40 40,75 5,40" fill="${c}" opacity="0.12"/>
    <polygon points="40,5 75,40 40,75 5,40" fill="none" stroke="${c}" stroke-width="3"/>
    <polygon points="40,20 60,40 40,60 20,40" fill="${c}" opacity="0.3"/>
    <polygon points="40,28 52,40 40,52 28,40" fill="${c}"/>`,

  // Rocket
  (c) => `
    <circle cx="40" cy="40" r="32" fill="${c}" opacity="0.1"/>
    <circle cx="40" cy="40" r="32" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.4"/>
    <path d="M40,14 C47,18 53,28 53,38 L53,52 L40,60 L27,52 L27,38 C27,28 33,18 40,14Z" fill="${c}" opacity="0.88"/>
    <circle cx="40" cy="35" r="6" fill="white" opacity="0.65"/>
    <path d="M30,52 L22,62 L32,57Z" fill="${c}" opacity="0.65"/>
    <path d="M50,52 L58,62 L48,57Z" fill="${c}" opacity="0.65"/>`,

  // Shield + check
  (c) => `
    <path d="M40,7 L70,20 L70,42 C70,57 57,68 40,76 C23,68 10,57 10,42 L10,20 Z" fill="${c}" opacity="0.12"/>
    <path d="M40,7 L70,20 L70,42 C70,57 57,68 40,76 C23,68 10,57 10,42 L10,20 Z" fill="none" stroke="${c}" stroke-width="3"/>
    <path d="M27,40 L36,50 L54,28" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,

  // Infinity loop
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
  const fontSize = name.length > 9 ? Math.round(size * 0.085) : name.length > 6 ? Math.round(size * 0.097) : Math.round(size * 0.11);

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
  >${name.replace(/[^A-Za-z]/g,"").slice(0,2).toUpperCase()} BRAND</text>
</svg>`;
}

// ─── Download helpers ─────────────────────────────────────────────────────────
function dlPNG(svgStr, name) {
  const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = 600; c.height = 600;
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
    navigator.clipboard.writeText(`Name: ${brand.name}\nTagline: ${brand.tagline}\nLogo idea: ${brand.logo_idea}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fade-up bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 0.06}s`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <div style={{ height: 3, background: `linear-gradient(90deg, ${pal.primary}, ${pal.dark})` }} />

      <div className="p-5">
        {/* Logo preview */}
        {showLogos && (
          <div
            className="w-full rounded-xl mb-4 flex items-center justify-center overflow-hidden"
            style={{ background: pal.bg, border: `1px solid ${pal.light}`, padding: "20px 0" }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: buildSVG(brand.name, index, pal, 150) }}
              style={{ lineHeight: 0, display: "block" }}
            />
          </div>
        )}

        {/* Name & tagline */}
        <h3 className="syne text-xl font-extrabold text-gray-900 mb-1 tracking-tight">{brand.name}</h3>
        <p className="text-sm text-gray-400 mb-3 leading-relaxed">{brand.tagline}</p>

        {/* Logo idea */}
        <div className="rounded-xl p-3 mb-4" style={{ background: pal.bg }}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Logo Idea</p>
          <p className="text-sm leading-relaxed font-medium" style={{ color: pal.dark }}>{brand.logo_idea}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: pal.light, color: pal.dark }}
          >
            {brand.industry}
          </span>

          <div className="flex gap-2 items-center">
            <button
              onClick={copy}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all font-medium"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>

            {/* Download dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white flex items-center gap-1.5 transition-all hover:opacity-90"
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
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50"
                    onClick={() => { dlPNG(svg, brand.name); setOpen(false); }}
                  >
                    <span>🖼</span> PNG (600px)
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
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
const Spinner = () => (
  <span style={{
    display: "inline-block", width: 17, height: 17,
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderTopColor: "white", borderRadius: "50%",
    animation: "spin 0.65s linear infinite",
    verticalAlign: "middle",
  }} />
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BrandNameGenerator() {
  const [keyword, setKeyword] = useState("");
  const [activeTags, setActiveTags] = useState(["Tech"]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLogos, setShowLogos] = useState(true);

  const toggleTag = (tag) =>
    setActiveTags((p) => p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]);

  const generate = async () => {
    if (!keyword.trim()) { setError("Please describe your business first."); return; }
    setError(""); setLoading(true); setBrands([]);

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
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      <FontStyle />

      {/* Top stripe */}
      <div style={{ height: 3, background: "linear-gradient(90deg,#06b6d4,#0891b2,#0e7490)" }} />

      {/* Navbar */}
      <nav style={{ background: "white", borderBottom: "1px solid #f1f5f9", padding: "14px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#06b6d4", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>B</span>
            </div>
            <span className="syne" style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>BrandForge</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#0891b2", background: "#ecfeff", border: "1px solid #a5f3fc", padding: "4px 12px", borderRadius: 99 }}>
            AI-Powered ✦
          </span>
        </div>
      </nav>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "48px 16px 64px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <h1 className="syne" style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.15, marginBottom: 14 }}>
            Brand Name + <span style={{ color: "#06b6d4" }}>Logo</span> Generator
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15, maxWidth: 420, margin: "0 auto", lineHeight: 1.7 }}>
            AI se generate karo professional brand name, tagline aur downloadable logo — seconds mein.
          </p>
        </div>

        {/* Input card */}
        <div style={{ background: "white", borderRadius: 20, border: "1px solid #f1f5f9", padding: 24, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
            Business Describe Karein
          </p>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="e.g. online tutoring, fitness app, food delivery..."
              style={{
                flex: 1, height: 44, padding: "0 16px", fontSize: 14,
                background: "#f8fafc", border: "1px solid #e2e8f0",
                borderRadius: 12, color: "#0f172a", transition: "all 0.2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#06b6d4"; e.target.style.boxShadow = "0 0 0 3px rgba(6,182,212,0.12)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
            />
            <button
              onClick={generate}
              disabled={loading}
              style={{
                height: 44, padding: "0 24px", borderRadius: 12, border: "none",
                background: loading ? "#67e8f9" : "#06b6d4",
                color: "white", fontSize: 14, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 8,
                transition: "background 0.2s", fontFamily: "'DM Sans',sans-serif",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? <Spinner /> : "✦"} {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
            Industry
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {INDUSTRIES.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  fontSize: 12, padding: "6px 14px", borderRadius: 99,
                  border: `1px solid ${activeTags.includes(tag) ? "#06b6d4" : "#e5e7eb"}`,
                  background: activeTags.includes(tag) ? "#06b6d4" : "white",
                  color: activeTags.includes(tag) ? "white" : "#6b7280",
                  fontWeight: 500, transition: "all 0.15s", fontFamily: "'DM Sans',sans-serif",
                }}
              >{tag}</button>
            ))}
          </div>

          {/* Logo toggle */}
          {brands.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18, paddingTop: 16, borderTop: "1px solid #f8fafc" }}>
              <button
                onClick={() => setShowLogos((s) => !s)}
                style={{
                  width: 38, height: 22, borderRadius: 99, border: "none",
                  background: showLogos ? "#06b6d4" : "#d1d5db",
                  position: "relative", transition: "background 0.2s",
                }}
              >
                <span style={{
                  position: "absolute", top: 3,
                  left: showLogos ? 18 : 3,
                  width: 16, height: 16, background: "white",
                  borderRadius: "50%", transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </button>
              <span style={{ fontSize: 13, color: "#64748b" }}>Logo previews {showLogos ? "on" : "off"}</span>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c", fontSize: 14, borderRadius: 12, padding: "10px 16px", marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 0", gap: 14 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              border: "3px solid #cffafe", borderTopColor: "#06b6d4",
              animation: "spin 0.7s linear infinite",
            }} />
            <p style={{ fontSize: 14, color: "#94a3b8" }}>AI is crafting your brand identities...</p>
          </div>
        )}

        {/* Results grid */}
        {!loading && brands.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {brands.length} brand identities generated
              </span>
              <button
                onClick={generate}
                style={{ fontSize: 13, fontWeight: 600, color: "#06b6d4", background: "none", border: "none", fontFamily: "'DM Sans',sans-serif" }}
              >
                Regenerate →
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
              {brands.map((b, i) => (
                <BrandCard key={`${b.name}-${i}`} brand={b} index={i} showLogos={showLogos} />
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: 12, color: "#cbd5e1", marginTop: 32 }}>
              Har card mein ↓ Download se PNG ya SVG download karo
            </p>
          </>
        )}

        {/* Empty */}
        {!loading && brands.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div style={{ fontSize: 48, opacity: 0.12, marginBottom: 14 }}>✦</div>
            <p style={{ fontSize: 14, color: "#cbd5e1" }}>Apni business describe karo aur Generate karo</p>
          </div>
        )}
      </div>
    </div>
  );
}