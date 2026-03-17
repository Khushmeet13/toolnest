import { useState, useCallback } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const NETWORKS = {
  Visa: { prefix: ["4"], len: 16, cvv: 3, light: false, mcCircles: false },
  Mastercard: { prefix: ["51", "52", "53", "54", "55"], len: 16, cvv: 3, light: false, mcCircles: true },
  Amex: { prefix: ["34", "37"], len: 15, cvv: 4, light: false, mcCircles: false },
  Discover: { prefix: ["6011", "644", "645", "646", "647", "648", "649", "65"], len: 16, cvv: 3, light: true, mcCircles: false },
};

const THEMES = {
  Minimal: {
    front: (net) => {
      const g = { Visa: "linear-gradient(135deg,#1a1a2e,#0f3460)", Mastercard: "linear-gradient(135deg,#1c1c1c,#2d2d2d)", Amex: "linear-gradient(135deg,#006994,#003a54)", Discover: "linear-gradient(135deg,#f5f0e8,#e0d4b8)" };
      return g[net] || g.Visa;
    },
    chip: { Visa: "#d4af6a", Mastercard: "#c0c0c0", Amex: "#a8d8ea", Discover: "#d4a843" },
    glow: false,
  },
  Neon: {
    front: () => "linear-gradient(135deg,#0d0d0d 0%,#111 100%)",
    chip: { Visa: "#00ff88", Mastercard: "#ff3366", Amex: "#00cfff", Discover: "#ffcc00" },
    glow: true,
    accent: { Visa: "#00ff88", Mastercard: "#ff3366", Amex: "#00cfff", Discover: "#ffcc00" },
  },
  Glass: {
    front: (net) => {
      const g = { Visa: "linear-gradient(135deg,rgba(30,60,120,0.55),rgba(15,52,96,0.7))", Mastercard: "linear-gradient(135deg,rgba(40,40,40,0.55),rgba(20,20,20,0.7))", Amex: "linear-gradient(135deg,rgba(0,100,148,0.55),rgba(0,58,84,0.7))", Discover: "linear-gradient(135deg,rgba(220,200,160,0.6),rgba(200,175,120,0.75))" };
      return g[net] || g.Visa;
    },
    chip: { Visa: "rgba(212,175,106,0.8)", Mastercard: "rgba(192,192,192,0.8)", Amex: "rgba(168,216,234,0.8)", Discover: "rgba(212,168,67,0.8)" },
    glow: false,
    glass: true,
  },
};

const FIRST = ["James", "Emma", "Oliver", "Sophia", "Liam", "Ava", "Noah", "Isabella", "Lucas", "Mia", "Ethan", "Charlotte", "Mason", "Amelia", "Logan", "Zoe", "Ryan", "Harper", "Caleb", "Aria"];
const LAST = ["Johnson", "Williams", "Brown", "Garcia", "Miller", "Davis", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Lee", "Walker", "Hall", "Allen", "Young"];

const TABS = ["Generator", "Bulk", "Validator", "Export"];
const TAB_ICONS = { Generator: "✦", Bulk: "⊞", Validator: "⊛", Export: "⬡" };

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[rand(0, arr.length - 1)];

function luhn(partial) {
  const d = partial.split("").map(Number); let s = 0;
  for (let i = d.length - 1; i >= 0; i--) { let v = d[i]; if ((d.length - i) % 2 === 0) { v *= 2; if (v > 9) v -= 9; } s += v; }
  return ((10 - (s % 10)) % 10).toString();
}

function genCard(net) {
  const cfg = NETWORKS[net];
  const pre = pick(cfg.prefix);
  let num = pre;
  while (num.length < cfg.len - 1) num += rand(0, 9);
  num += luhn(num);
  return {
    network: net, number: num,
    expMonth: String(rand(1, 12)).padStart(2, "0"),
    expYear: String(rand(new Date().getFullYear() + 1, new Date().getFullYear() + 5)).slice(-2),
    cvv: Array.from({ length: cfg.cvv }, () => rand(0, 9)).join(""),
    name: `${pick(FIRST)} ${pick(LAST)}`.toUpperCase(),
    id: Math.random().toString(36).slice(2, 8),
  };
}

function fmtNum(n, net) {
  if (net === "Amex") return `${n.slice(0, 4)} ${n.slice(4, 10)} ${n.slice(10)}`;
  return n.match(/.{1,4}/g).join(" ");
}

function luhnCheck(num) {
  const d = num.replace(/\D/g, "").split("").reverse().map(Number);
  if (d.length < 13) return false;
  let s = 0;
  for (let i = 0; i < d.length; i++) { let v = d[i]; if (i % 2 === 1) { v *= 2; if (v > 9) v -= 9; } s += v; }
  return s % 10 === 0;
}

function detectNetwork(num) {
  const n = num.replace(/\D/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^(6011|64[4-9]|65)/.test(n)) return "Discover";
  return null;
}

// ─── CARD CANVAS DOWNLOAD ────────────────────────────────────────────────────
function downloadCard(card, theme) {
  const W = 800, H = 504, cfg = NETWORKS[card.network];
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  const thm = THEMES[theme];
  const gr = ctx.createLinearGradient(0, 0, W, H);
  const bg = thm.front(card.network);
  const stops = bg.match(/rgba?\([^)]+\)|#[0-9a-f]{3,8}|[a-z]+/gi).filter(c => /^(#|rgb)/.test(c));
  if (stops[0]) { gr.addColorStop(0, stops[0]); gr.addColorStop(1, stops[1] || stops[0]); }
  ctx.fillStyle = gr;
  ctx.beginPath(); ctx.roundRect(0, 0, W, H, 32); ctx.fill();
  if (thm.glass) {
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath(); ctx.roundRect(0, 0, W, H, 32); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(1, 1, W - 2, H - 2, 31); ctx.stroke();
  }
  if (thm.glow) {
    const acc = thm.accent[card.network] || "#00ff88";
    ctx.shadowColor = acc; ctx.shadowBlur = 60;
    ctx.strokeStyle = acc; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(2, 2, W - 4, H - 4, 30); ctx.stroke();
    ctx.shadowBlur = 0;
  }
  const isLight = cfg.light && theme === "Minimal";
  const tc = isLight ? "#1a1a1a" : "#fff";
  const sc = isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)";
  const neonAcc = thm.glow ? (thm.accent[card.network] || "#00ff88") : null;
  ctx.font = "600 20px sans-serif"; ctx.fillStyle = sc; ctx.fillText(card.network.toUpperCase(), 56, 76);
  ctx.font = "300 16px sans-serif"; ctx.fillStyle = isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.35)"; ctx.fillText("Test Card", 56, 100);
  const chipCol = thm.chip[card.network] || "#d4af6a";
  const cg = ctx.createLinearGradient(56, 140, 148, 212);
  cg.addColorStop(0, chipCol); cg.addColorStop(1, chipCol + "aa");
  ctx.fillStyle = cg; ctx.beginPath(); ctx.roundRect(56, 140, 92, 72, 10); ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1; ctx.stroke();
  ctx.font = `600 36px 'Courier New',monospace`;
  ctx.fillStyle = neonAcc || tc;
  if (neonAcc) { ctx.shadowColor = neonAcc; ctx.shadowBlur = 18; }
  ctx.fillText(fmtNum(card.number, card.network), 56, 306);
  ctx.shadowBlur = 0;
  ctx.font = "500 16px sans-serif"; ctx.fillStyle = sc; ctx.fillText("CARD HOLDER", 56, 354);
  ctx.font = "600 20px 'Courier New',monospace"; ctx.fillStyle = neonAcc || tc;
  if (neonAcc) { ctx.shadowColor = neonAcc; ctx.shadowBlur = 10; }
  ctx.fillText(card.name, 56, 382); ctx.shadowBlur = 0;
  ctx.font = "500 16px sans-serif"; ctx.fillStyle = sc; ctx.fillText("EXPIRES", 56, 426);
  ctx.font = "600 20px 'Courier New',monospace"; ctx.fillStyle = neonAcc || tc;
  ctx.fillText(`${card.expMonth}/${card.expYear}`, 56, 454);
  if (card.network === "Mastercard") {
    ctx.beginPath(); ctx.arc(W - 120, H - 60, 44, 0, Math.PI * 2); ctx.fillStyle = "rgba(235,0,27,0.9)"; ctx.fill();
    ctx.beginPath(); ctx.arc(W - 84, H - 60, 44, 0, Math.PI * 2); ctx.fillStyle = "rgba(247,158,27,0.9)"; ctx.fill();
  }
  if (card.network === "Visa") { ctx.font = "italic bold 52px 'Times New Roman',serif"; ctx.fillStyle = "#fff"; ctx.fillText("VISA", W - 130, H - 38); }
  else if (card.network === "Amex") { ctx.font = "800 22px sans-serif"; ctx.fillStyle = "#fff"; ctx.fillText("AMEX", W - 110, H - 42); }
  else if (card.network === "Discover") { ctx.font = "800 18px sans-serif"; ctx.fillStyle = "#333"; ctx.fillText("DISCOVER", W - 160, H - 42); }
  ctx.font = "300 13px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillText("FOR TESTING ONLY — NOT A REAL CARD", W / 2 - 150, H - 14);
  const a = document.createElement("a");
  a.download = `card-${card.network.toLowerCase()}-${card.id}.png`;
  a.href = canvas.toDataURL("image/png"); a.click();
}

// ─── CHIP SVG ─────────────────────────────────────────────────────────────────
function Chip({ color = "#d4af6a" }) {
  return (
    <svg width="44" height="34" viewBox="0 0 46 36" fill="none">
      <rect x="1" y="1" width="44" height="34" rx="5" fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="0.5" />
      <line x1="15" y1="1" x2="15" y2="35" stroke="rgba(0,0,0,0.14)" strokeWidth="2" />
      <line x1="31" y1="1" x2="31" y2="35" stroke="rgba(0,0,0,0.14)" strokeWidth="2" />
      <line x1="1" y1="12" x2="45" y2="12" stroke="rgba(0,0,0,0.14)" strokeWidth="2" />
      <line x1="1" y1="24" x2="45" y2="24" stroke="rgba(0,0,0,0.14)" strokeWidth="2" />
      <rect x="17" y="13" width="12" height="10" rx="2" fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
    </svg>
  );
}

// ─── CARD FACE ────────────────────────────────────────────────────────────────
function CardFace({ card, theme, flipped }) {
  const cfg = NETWORKS[card.network];
  const thm = THEMES[theme];
  const bg = thm.front(card.network);
  const chipCol = thm.chip[card.network] || "#d4af6a";
  const isLight = cfg.light && theme === "Minimal";
  const tc = isLight ? "#1a1a1a" : "#fff";
  const sc = isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)";
  const neonAcc = thm.glow ? (thm.accent[card.network] || "#00ff88") : null;

  const glassStyle = thm.glass ? {
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.18)",
  } : {};

  const neonBorder = neonAcc
    ? { boxShadow: `0 0 0 1.5px ${neonAcc}44, 0 0 32px ${neonAcc}22, 0 20px 60px rgba(0,0,0,0.5)` }
    : { boxShadow: "0 28px 64px rgba(0,0,0,0.24), 0 8px 20px rgba(0,0,0,0.12)" };

  return (
    <div className="w-full max-w-sm mx-auto" style={{ perspective: "1200px" }}>
      <div
        className="relative w-full"
        style={{
          paddingBottom: "60%",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.55s cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: bg, ...glassStyle, ...neonBorder }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="absolute -bottom-16 -left-8 w-56 h-56 rounded-full" style={{ background: "rgba(255,255,255,0.02)" }} />

          {/* Mastercard circles */}
          {cfg.mcCircles && (
            <div className="absolute bottom-4 right-5 flex">
              <div className="w-10 h-10 rounded-full" style={{ background: "rgba(235,0,27,0.9)" }} />
              <div className="w-10 h-10 rounded-full -ml-3.5" style={{ background: "rgba(247,158,27,0.9)" }} />
            </div>
          )}

          {/* Top row */}
          <div className="flex justify-between items-center relative z-10">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color: sc }}>{card.network}</div>
              {neonAcc && <div className="text-[9px] mt-0.5 tracking-wider" style={{ color: neonAcc }}>NEON EDITION</div>}
            </div>
            <svg width="18" height="20" viewBox="0 0 20 22" fill="none">
              {[6, 10, 14].map((r, i) => (
                <path key={i} d={`M${10 - r * 0.6} ${11 + r * 0.5} A${r} ${r} 0 0 1 ${10 + r * 0.6} ${11 + r * 0.5}`} stroke={neonAcc || sc} strokeWidth="1.5" strokeLinecap="round" opacity={1 - i * 0.25} />
              ))}
              <circle cx="10" cy="14" r="1.5" fill={neonAcc || sc} />
            </svg>
          </div>

          <Chip color={chipCol} />

          {/* Card Number */}
          <div className="relative z-10">
            <div
              className="text-lg font-semibold leading-none tracking-widest"
              style={{ fontFamily: "'IBM Plex Mono',monospace", color: neonAcc || tc, textShadow: neonAcc ? `0 0 12px ${neonAcc}88` : "none" }}
            >
              {fmtNum(card.number, card.network)}
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex justify-between items-end relative z-10">
            <div>
              <div className="text-[8px] tracking-widest mb-0.5" style={{ color: sc }}>CARD HOLDER</div>
              <div className="text-xs font-semibold tracking-wider" style={{ fontFamily: "'IBM Plex Mono',monospace", color: neonAcc || tc }}>
                {card.name}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[8px] tracking-widest mb-0.5" style={{ color: sc }}>EXPIRES</div>
              <div className="text-xs font-semibold" style={{ fontFamily: "'IBM Plex Mono',monospace", color: neonAcc || tc }}>
                {card.expMonth}/{card.expYear}
              </div>
            </div>
            {!cfg.mcCircles && (
              card.network === "Visa"
                ? <span className="text-2xl font-bold italic" style={{ fontFamily: "'Times New Roman',serif", color: neonAcc || "#fff", textShadow: neonAcc ? `0 0 10px ${neonAcc}` : "none" }}>VISA</span>
                : card.network === "Amex"
                  ? <span className="text-xs font-extrabold tracking-widest" style={{ color: neonAcc || "#fff" }}>AMEX</span>
                  : <span className="text-[10px] font-extrabold tracking-widest" style={{ color: neonAcc || "#333" }}>DISCOVER</span>
            )}
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col justify-center"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: bg, transform: "rotateY(180deg)", boxShadow: "0 28px 64px rgba(0,0,0,0.24)", ...glassStyle }}
        >
          <div className="h-11 mb-4" style={{ background: "rgba(0,0,0,0.8)" }} />
          <div className="mx-6 flex items-center gap-2.5">
            <div className="flex-1 h-10 rounded flex items-center pl-2.5" style={{ background: "repeating-linear-gradient(90deg,#f5f5f5 0,#fff 2px,#eee 4px)" }}>
              <span className="text-base opacity-70" style={{ fontFamily: "'Brush Script MT',cursive", color: "#333" }}>
                {card.name.split(" ")[0]}
              </span>
            </div>
            <div
              className="rounded-lg px-3 py-1.5 text-center"
              style={{ background: neonAcc ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.1)", border: neonAcc ? `1px solid ${neonAcc}66` : "none" }}
            >
              <div className="text-[8px] mb-0.5 tracking-widest" style={{ color: neonAcc || "rgba(255,255,255,0.5)" }}>CVV</div>
              <div className="text-base font-bold tracking-widest" style={{ fontFamily: "'IBM Plex Mono',monospace", color: neonAcc || "#fff", textShadow: neonAcc ? `0 0 8px ${neonAcc}` : "none" }}>
                {card.cvv}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("Generator");
  const [net, setNet] = useState("Visa");
  const [theme, setTheme] = useState("Minimal");
  const [card, setCard] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(null);
  const [dlLoading, setDlLoading] = useState(false);

  const [bulkNet, setBulkNet] = useState("Visa");
  const [bulkCount, setBulkCount] = useState(5);
  const [bulkCards, setBulkCards] = useState([]);
  const [bulkCopied, setBulkCopied] = useState(null);

  const [valInput, setValInput] = useState("");
  const [valResult, setValResult] = useState(null);
  const [exportSrc, setExportSrc] = useState("single");

  const generate = useCallback(() => {
    setFlipped(false);
    setTimeout(() => { setCard(genCard(net)); setCopied(null); }, 80);
  }, [net]);

  const copyField = (val, field) => {
    navigator.clipboard.writeText(val);
    setCopied(field);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleDownload = () => {
    if (!card) return;
    setDlLoading(true);
    setTimeout(() => { downloadCard(card, theme); setDlLoading(false); }, 120);
  };

  const handleValidate = () => {
    const clean = valInput.replace(/\D/g, "");
    if (!clean) return;
    const valid = luhnCheck(clean);
    const detNet = detectNetwork(clean);
    setValResult({ valid, network: detNet, length: clean.length, input: clean });
  };

  const exportData = (format) => {
    const src = exportSrc === "bulk" ? bulkCards : (card ? [card] : []);
    if (!src.length) return;
    if (format === "json") {
      const data = src.map(c => ({ network: c.network, number: c.number, expiry: `${c.expMonth}/${c.expYear}`, cvv: c.cvv, name: c.name }));
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "cards.json"; a.click();
    } else {
      const header = "Network,Number,Expiry,CVV,Name\n";
      const rows = src.map(c => `${c.network},${c.number},${c.expMonth}/${c.expYear},${c.cvv},"${c.name}"`).join("\n");
      const blob = new Blob([header + rows], { type: "text/csv" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "cards.csv"; a.click();
    }
  };

  const fields = card ? [
    { label: "Card Number", val: fmtNum(card.number, card.network), raw: card.number, field: "number", mono: true },
    { label: "Cardholder", val: card.name, raw: card.name, field: "name", mono: false },
    { label: "Expiry", val: `${card.expMonth}/${card.expYear}`, raw: `${card.expMonth}/${card.expYear}`, field: "expiry", mono: true },
    { label: "CVV", val: card.cvv, raw: card.cvv, field: "cvv", mono: true },
  ] : [];

  const netEmoji = { Visa: "💙", Mastercard: "🔴", Amex: "🟦", Discover: "🟠" };
  const themeEmoji = { Minimal: "🌑", Neon: "⚡", Glass: "🔮" };

  return (
    <>
      <div className="pt-16">
        <h1 className="text-4xl font-medium text-gray-900 text-center mb-2">
          Credit card <span className="text-cyan-700">generator</span>
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto  mb-8">
          Generate valid-format credit card numbers for testing and development purposes.
        </p>
      </div>

      <div className="flex max-w-4xl mx-auto mb-16 border border-blue-200 rounded-xl">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

        <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        .appear { animation: fadeUp 0.25s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        .tab-item { cursor: pointer; transition: background 0.15s, border 0.15s; }
        .tab-item:hover { background: rgba(99,102,241,0.08) !important; }
        .field-row { cursor: pointer; transition: background 0.1s; }
        .field-row:hover { background: #f9f8f6; }
        .action-btn { cursor: pointer; transition: opacity 0.15s, transform 0.1s; }
        .action-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .action-btn:active:not(:disabled) { transform: translateY(0); }
        .net-pill { cursor: pointer; transition: all 0.15s; }
        .net-pill:hover { opacity: 0.85; }
        .theme-card { cursor: pointer; transition: all 0.15s; }
        .theme-card:hover { opacity: 0.88; }
      `}</style>



        {/* ── SIDEBAR ── */}
        <div className="w-56 flex flex-col py-7 rounded-l-xl flex-shrink-0" style={{ background: "#13121a" }}>

          {/* Nav */}
          <div className="px-2.5 flex-1">
            {TABS.map(t => {
              const active = tab === t;
              return (
                <div
                  key={t}
                  className={`tab-item flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 ${active ? "border border-cyan-600 bg-cyan-600/10 text-cyan-600" : "1px solid transparent"}`}
                  onClick={() => setTab(t)}
                  
                >
                  <span className="text-sm text-cyan-600" style={{ opacity: active ? 1 : 0.4 }}>{TAB_ICONS[t]}</span>
                  <span className={`text-[13px] ${active ? " text-cyan-600" : "text-gray-500"}`} style={{ fontWeight: active ? 600 : 400, }}>
                    {t}
                  </span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-600"/>}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 pt-4 mt-auto border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.2)" }}>
              ⚠ Testing purposes only<br />No real financial data
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 overflow-auto p-8">

          {/* ══ GENERATOR TAB ══ */}
          {tab === "Generator" && (
            <div className="appear max-w-3xl">
              <div className="mb-7">
                <h1 className="text-2xl font-medium text-gray-900 mb-1">Card Generator</h1>
                <p className="text-sm font-light" style={{ color: "#999" }}>Generate a single Luhn-valid test card with custom theme</p>
              </div>

              <div className="grid grid-cols-2 gap-5 items-start">
                {/* Left column */}
                <div>
                  {/* Network */}
                  <div className="bg-white rounded-xl p-4 mb-3.5 border border-black/[0.06]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-3">Network</div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(NETWORKS).map(n => (
                        <button
                          key={n}
                          className="net-pill flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs"
                          onClick={() => setNet(n)}
                          style={{
                            border: net === n ? "1.5px solid #0891b2" : "1.5px solid #eee",
                            background: net === n ? "#eef2ff" : "#fafafa",
                            color: net === n ? "#0891b2" : "#555",
                            fontWeight: net === n ? 600 : 400,
                          }}
                        >
                          <span>{netEmoji[n]}</span>{n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme */}
                  <div className="bg-white rounded-xl p-4 mb-3.5 border border-black/[0.06]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-3">Card Theme</div>
                    <div className="flex gap-2">
                      {Object.keys(THEMES).map(t => {
                        const active = theme === t;
                        return (
                          <button
                            key={t}
                            className="theme-card flex-1 py-3 px-2 rounded-xl text-center"
                            onClick={() => setTheme(t)}
                            style={{
                              border: active ? "1.5px solid #0891b2" : "1.5px solid #eee",
                              background: active ? "#eef2ff" : "#fafafa",
                              boxShadow: active ? "0 4px 14px rgba(99,102,241,0.12)" : "0 2px 6px rgba(0,0,0,0.04)",
                            }}
                          >
                            <div className="text-xl mb-1">{themeEmoji[t]}</div>
                            <div className="text-[11px]" style={{ fontWeight: active ? 600 : 400, color: active ? "#0891b2" : "#666" }}>{t}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Generate */}
                  <button
                    className="action-btn w-full py-3.5 rounded-xl text-white text-[13px] font-bold tracking-wider border-none"
                    onClick={generate}
                    style={{ background: "linear-gradient(135deg,#0891b2,#06b6d4)", boxShadow: "0 6px 20px rgba(79,70,229,0.3)" }}
                  >
                    {card ? "↺  Regenerate Card" : "⚡  Generate Card"}
                  </button>
                </div>

                {/* Right column */}
                <div>
                  {card ? (
                    <>
                      <div className="mb-3.5">
                        <CardFace card={card} theme={theme} flipped={flipped} />
                      </div>

                      {/* Card action buttons */}
                      <div className="flex justify-center gap-2 mb-3.5">
                        <button
                          className="action-btn px-4 py-1.5 rounded-full text-[11px] font-medium text-gray-500 border border-gray-200 bg-stone-100"
                          onClick={() => setFlipped(f => !f)}
                        >
                          {flipped ? "↩ Front" : "↩ Back & CVV"}
                        </button>
                        <button
                          className="action-btn flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-semibold text-white border-none"
                          style={{ background: "#13121a" }}
                          onClick={handleDownload}
                        >
                          {dlLoading
                            ? <svg className="spin" width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="3" strokeDasharray="40" strokeDashoffset="15" strokeLinecap="round" /></svg>
                            : "⬇"
                          }
                          Download PNG
                        </button>
                      </div>

                      {/* Fields */}
                      <div className="bg-white rounded-xl border border-black/[0.06] overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                        <div className="px-4 py-3 border-b border-gray-50">
                          <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">Card Details</span>
                        </div>
                        {fields.map(({ label, val, raw, field, mono }, i) => (
                          <div
                            key={field}
                            className="field-row px-4 py-2.5 flex justify-between items-center"
                            style={{ borderBottom: i < fields.length - 1 ? "1px solid #f9f9f9" : "none" }}
                            onClick={() => copyField(raw, field)}
                          >
                            <div>
                              <div className="text-[10px] text-gray-300 mb-0.5">{label}</div>
                              <div
                                className="text-xs font-semibold text-gray-900"
                                style={{
                                  fontFamily: mono ? "'IBM Plex Mono',monospace" : "inherit",
                                  letterSpacing: field === "number" ? "0.08em" : field === "cvv" ? "0.12em" : "0",
                                }}
                              >
                                {val}
                              </div>
                            </div>
                            <div
                              className="text-[10px] font-medium px-2.5 py-1 rounded-md"
                              style={{
                                background: copied === field ? "#f0fdf4" : "#f5f3ef",
                                color: copied === field ? "#16a34a" : "#999",
                                border: copied === field ? "1px solid #bbf7d0" : "1px solid transparent",
                              }}
                            >
                              {copied === field ? "✓" : "Copy"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-72 rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed" style={{ background: "rgba(255,255,255,0.6)", borderColor: "#e0ddd8" }}>
                      <div className="text-5xl opacity-15">💳</div>
                      <p className="text-xs text-gray-300">Generate a card to preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ BULK TAB ══ */}
          {tab === "Bulk" && (
            <div className="appear max-w-3xl">
              <div className="mb-7">
                <h1 className="text-2xl font-medium text-gray-900 tracking-tight mb-1" >Bulk Generator</h1>
                <p className="text-sm font-light" style={{ color: "#999" }}>Generate multiple test cards at once</p>
              </div>

              <div className="bg-white rounded-xl p-5 mb-4 border border-black/[0.06] flex flex-wrap gap-4 items-center" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div>
                  <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-2">Network</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {[...Object.keys(NETWORKS), "Random"].map(n => (
                      <button
                        key={n}
                        className="net-pill px-3 py-1 rounded-lg text-[11px]"
                        onClick={() => setBulkNet(n)}
                        style={{
                          border: bulkNet === n ? "1.5px solid #0891b2" : "1.5px solid #e5e5e5",
                          background: bulkNet === n ? "#eef2ff" : "#fafafa",
                          color: bulkNet === n ? "#0891b2" : "#666",
                          fontWeight: bulkNet === n ? 600 : 400,
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-2">Count</div>
                  <div className="flex gap-1.5">
                    {[5, 10, 25, 50].map(n => (
                      <button
                        key={n}
                        className="net-pill px-3 py-1 rounded-lg text-[11px]"
                        onClick={() => setBulkCount(n)}
                        style={{
                          border: bulkCount === n ? "1.5px solid #0891b2" : "1.5px solid #e5e5e5",
                          background: bulkCount === n ? "#eef2ff" : "#fafafa",
                          color: bulkCount === n ? "#0891b2" : "#666",
                          fontWeight: bulkCount === n ? 600 : 400,
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  className="action-btn ml-auto px-5 py-2.5 rounded-xl text-white text-xs font-bold border-none"
                  style={{ background: "linear-gradient(135deg,#0891b2,#06b6d4)", boxShadow: "0 4px 14px rgba(79,70,229,0.25)" }}
                  onClick={() => {
                    const nets = bulkNet === "Random" ? Object.keys(NETWORKS) : null;
                    setBulkCards(Array.from({ length: bulkCount }, () => genCard(nets ? pick(nets) : bulkNet)));
                  }}
                >
                  ⚡ Generate {bulkCount}
                </button>
              </div>

              {bulkCards.length > 0 && (
                <div className="bg-white rounded-xl border border-black/[0.06] overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">{bulkCards.length} Cards Generated</span>
                    <button className="action-btn text-[10px] text-gray-300 bg-transparent border-none p-0" onClick={() => setBulkCards([])}>Clear all</button>
                  </div>
                  <div className="overflow-auto max-h-[440px]">
                    {bulkCards.map((c, i) => (
                      <div
                        key={c.id}
                        className="px-4 py-2.5 flex items-center gap-3"
                        style={{ borderBottom: i < bulkCards.length - 1 ? "1px solid #f9f9f9" : "none", background: i % 2 === 0 ? "#fff" : "#fdfcfb" }}
                      >
                        <span className="text-[10px] text-gray-300 w-5" style={{ fontFamily: "'IBM Plex Mono',monospace" }}>{i + 1}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 font-semibold min-w-[72px] text-center">{c.network}</span>
                        <span className="text-xs text-gray-700 flex-1 tracking-wider" style={{ fontFamily: "'IBM Plex Mono',monospace" }}>{fmtNum(c.number, c.network)}</span>
                        <span className="text-[11px] text-gray-400" style={{ fontFamily: "'IBM Plex Mono',monospace" }}>{c.expMonth}/{c.expYear}</span>
                        <span className="text-[11px] text-gray-300 min-w-[40px]" style={{ fontFamily: "'IBM Plex Mono',monospace" }}>{c.cvv}</span>
                        <button
                          className="action-btn text-[10px] px-2 py-0.5 rounded-md border-none"
                          onClick={() => { navigator.clipboard.writeText(c.number); setBulkCopied(i); setTimeout(() => setBulkCopied(null), 1500); }}
                          style={{
                            background: bulkCopied === i ? "#f0fdf4" : "#f5f3ef",
                            color: bulkCopied === i ? "#16a34a" : "#999",
                            border: bulkCopied === i ? "1px solid #bbf7d0" : "none",
                          }}
                        >
                          {bulkCopied === i ? "✓" : "Copy"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ VALIDATOR TAB ══ */}
          {tab === "Validator" && (
            <div className="appear max-w-lg">
              <div className="mb-7">
                <h1 className="text-2xl font-medium text-gray-900 tracking-tight mb-1">Card Validator</h1>
                <p className="text-sm font-light" style={{ color: "#999" }}>Check any card number using the Luhn algorithm</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-black/[0.06] mb-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-2.5">Card Number</div>
                <div className="flex gap-2.5">
                  <input
                    value={valInput}
                    onChange={e => { setValInput(e.target.value); setValResult(null); }}
                    placeholder="4532 0151 1283 0366"
                    className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-900 outline-none transition-all"
                    style={{
                      fontFamily: "'IBM Plex Mono',monospace",
                      letterSpacing: "0.06em",
                      background: "#fafafa",
                      border: "1.5px solid #e5e5e5",
                    }}
                    onFocus={e => e.target.style.borderColor = "#6366f1"}
                    onBlur={e => e.target.style.borderColor = "#e5e5e5"}
                    onKeyDown={e => e.key === "Enter" && handleValidate()}
                  />
                  <button
                    className="action-btn px-5 py-3 rounded-xl text-white text-[13px] font-bold border-none whitespace-nowrap"
                    style={{ background: "linear-gradient(135deg,#0891b2,#06b6d4)", boxShadow: "0 4px 14px rgba(79,70,229,0.25)" }}
                    onClick={handleValidate}
                  >
                    Validate
                  </button>
                </div>
              </div>

              {valResult && (
                <div
                  className="appear bg-white rounded-2xl overflow-hidden mb-4"
                  style={{ border: `2px solid ${valResult.valid ? "#86efac" : "#fca5a5"}`, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
                >
                  <div
                    className="px-5 py-4 flex items-center gap-2.5"
                    style={{
                      background: valResult.valid ? "#f0fdf4" : "#fef2f2",
                      borderBottom: `1px solid ${valResult.valid ? "#bbf7d0" : "#fecaca"}`,
                    }}
                  >
                    <span className="text-2xl">{valResult.valid ? "✅" : "❌"}</span>
                    <div>
                      <div className="text-[15px] font-bold" style={{ color: valResult.valid ? "#15803d" : "#dc2626" }}>
                        {valResult.valid ? "Valid Card Number" : "Invalid Card Number"}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: valResult.valid ? "#16a34a" : "#ef4444" }}>
                        Luhn checksum {valResult.valid ? "passed" : "failed"}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-3 gap-3">
                    {[
                      { label: "Network", val: valResult.network || "Unknown", icon: "🌐" },
                      { label: "Length", val: `${valResult.length} digits`, icon: "📏" },
                      { label: "Format", val: `****${valResult.input.slice(-4)}`, icon: "🔢" },
                    ].map(({ label, val, icon }) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-lg mb-1">{icon}</div>
                        <div className="text-[10px] text-gray-400 mb-0.5 tracking-wider uppercase">{label}</div>
                        <div className="text-[13px] font-semibold text-gray-800" style={{ fontFamily: "'IBM Plex Mono',monospace" }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-5 border border-black/[0.06]">
                <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-2.5">How Luhn Works</div>
                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  The Luhn algorithm validates card numbers by doubling every second digit from the right, subtracting 9 if greater than 9, summing all digits, and checking if the total is divisible by 10.
                </p>
              </div>
            </div>
          )}

          {/* ══ EXPORT TAB ══ */}
          {tab === "Export" && (
            <div className="appear max-w-xl">
              <div className="mb-7">
                <h1 className="text-2xl font-medium text-gray-900 tracking-tight mb-1">Export Data</h1>
                <p className="text-sm font-light" style={{ color: "#999" }}>Download your generated cards as JSON or CSV</p>
              </div>

              {/* Source */}
              <div className="bg-white rounded-xl p-5 border border-black/[0.06] mb-3.5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-3">Data Source</div>
                <div className="flex gap-2.5">
                  {[
                    { v: "single", label: "Single Card", desc: card ? `${card.network} ···${card.number.slice(-4)}` : "No card yet", icon: "💳" },
                    { v: "bulk", label: "Bulk Cards", desc: `${bulkCards.length} cards`, icon: "⊞" },
                  ].map(({ v, label, desc, icon }) => (
                    <button
                      key={v}
                      className="theme-card flex-1 p-3.5 rounded-xl text-left"
                      onClick={() => setExportSrc(v)}
                      style={{
                        border: exportSrc === v ? "1.5px solid #0891b2" : "1.5px solid #eee",
                        background: exportSrc === v ? "#eef2ff" : "#fafafa",
                        boxShadow: exportSrc === v ? "0 4px 14px rgba(99,102,241,0.12)" : "none",
                      }}
                    >
                      <span className="text-xl">{icon}</span>
                      <div className="mt-1.5 text-[13px] font-semibold" style={{ color: exportSrc === v ? "#0891b2" : "#333" }}>{label}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5" style={{ fontFamily: "'IBM Plex Mono',monospace" }}>{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export buttons */}
              <div className="grid grid-cols-2 gap-3 mb-3.5">
                {[
                  { fmt: "json", label: "JSON", icon: "{ }", desc: "Structured JSON array", color: "#f59e0b", bg: "#fffbeb" },
                  { fmt: "csv", label: "CSV", icon: "≡", desc: "Spreadsheet compatible", color: "#10b981", bg: "#ecfdf5" },
                ].map(({ fmt, label, icon, desc, color, bg }) => {
                  const hasData = exportSrc === "bulk" ? bulkCards.length > 0 : !!card;
                  return (
                    <button
                      key={fmt}
                      className="action-btn p-5 rounded-2xl text-left"
                      disabled={!hasData}
                      onClick={() => exportData(fmt)}
                      style={{
                        border: `1.5px solid ${hasData ? color + "44" : "#eee"}`,
                        background: hasData ? bg : "#fafafa",
                        opacity: hasData ? 1 : 0.5,
                        boxShadow: hasData ? `0 4px 16px ${color}18` : "none",
                      }}
                    >
                      <div className="text-3xl font-bold mb-1.5" style={{ fontFamily: "'IBM Plex Mono',monospace", color }}>{icon}</div>
                      <div className="text-sm font-bold text-gray-900 mb-0.5">Export as {label}</div>
                      <div className="text-[11px] text-gray-500">{desc}</div>
                      <div className="mt-2.5 text-[11px] font-semibold flex items-center gap-1" style={{ color }}>⬇ Download .{fmt}</div>
                    </button>
                  );
                })}
              </div>

              {/* Preview */}
              {(exportSrc === "single" ? card : bulkCards[0]) && (
                <div className="rounded-2xl p-5 border" style={{ background: "#13121a", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="text-[10px] tracking-widest uppercase mb-2.5" style={{ color: "rgba(255,255,255,0.3)" }}>Preview (first record)</div>
                  <pre className="text-[11px] leading-relaxed overflow-auto" style={{ fontFamily: "'IBM Plex Mono',monospace", color: "#a5b4fc" }}>
                    {JSON.stringify((() => {
                      const c = exportSrc === "single" ? card : bulkCards[0];
                      return { network: c.network, number: c.number, expiry: `${c.expMonth}/${c.expYear}`, cvv: c.cvv, name: c.name };
                    })(), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}