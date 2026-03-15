import { useState, useRef, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════
   TEMPLATES
══════════════════════════════════════════ */
const TEMPLATES = [
  { id: "classic",    label: "Classic",       emoji: "😂", desc: "Top & bottom text",    layout: "tb",    bg: "#e0f7fa", border: "#06b6d4" },
  { id: "drake",      label: "Drake",         emoji: "🤨", desc: "Reject / Accept",       layout: "2row",  bg: "#f0fdfa", border: "#0891b2" },
  { id: "brain",      label: "Brain Expand",  emoji: "🧠", desc: "4 levels of galaxy",    layout: "4row",  bg: "#ecfeff", border: "#22d3ee" },
  { id: "twobtns",    label: "Two Buttons",   emoji: "😰", desc: "Hard choice panic",     layout: "2col",  bg: "#f0f9ff", border: "#0e7490" },
  { id: "onedoesnot", label: "One Does Not",  emoji: "🧙", desc: "Simply...",             layout: "tb",    bg: "#e0f2fe", border: "#06b6d4" },
  { id: "catjudge",   label: "Cat Judge",     emoji: "🐱", desc: "Side-eye moment",       layout: "2col",  bg: "#f0fdfa", border: "#0891b2" },
  { id: "thisfine",   label: "This Is Fine",  emoji: "🔥", desc: "Everything burning",    layout: "tb",    bg: "#fff7ed", border: "#f97316" },
  { id: "success",    label: "Success Kid",   emoji: "✊", desc: "Tiny win flex",          layout: "tb",    bg: "#f0fdf4", border: "#22c55e" },
];

const CATEGORIES = [
  { id: "office",    label: "Office Life",    emoji: "💼" },
  { id: "student",   label: "Student Life",   emoji: "📚" },
  { id: "monday",    label: "Monday Mood",    emoji: "😩" },
  { id: "food",      label: "Foodie",         emoji: "🍕" },
  { id: "tech",      label: "Tech & Code",    emoji: "💻" },
  { id: "family",    label: "Family Drama",   emoji: "👨‍👩‍👧" },
  { id: "dating",    label: "Dating Life",    emoji: "💘" },
  { id: "gym",       label: "Gym Bro",        emoji: "💪" },
  { id: "desi",      label: "Desi Life",      emoji: "🇮🇳" },
  { id: "general",   label: "General",        emoji: "😂" },
];

const LANGUAGES = [
  { id: "english",  label: "English",  flag: "🇬🇧" },
  { id: "hinglish", label: "Hinglish", flag: "🇮🇳" },
];

/* ══════════════════════════════════════════
   CANVAS DRAWING
══════════════════════════════════════════ */
function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(" ");
  let line = "";
  const lines = [];
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = test;
    }
  }
  if (line.trim()) lines.push(line.trim());
  const totalH = lines.length * lineH;
  lines.forEach((l, i) => {
    ctx.strokeText(l.toUpperCase(), x, y - totalH / 2 + i * lineH + lineH / 2);
    ctx.fillText(l.toUpperCase(), x, y - totalH / 2 + i * lineH + lineH / 2);
  });
  return lines.length;
}

function drawMeme(canvas, tpl, top, bottom, textColor, strokeColor, fontSize) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  // bg
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // dot grid
  ctx.fillStyle = "#cffafe";
  for (let x = 0; x < W; x += 22) for (let y = 0; y < H; y += 22) {
    ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
  }

  // gradient wash
  const g = ctx.createRadialGradient(W*.5, H*.4, 0, W*.5, H*.5, W*.8);
  g.addColorStop(0, "rgba(6,182,212,0.09)"); g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // emoji art by layout
  const em = tpl.emoji;
  const eSize = Math.floor(H * 0.18);
  ctx.font = `${eSize}px serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";

  if (tpl.layout === "2row") {
    ctx.fillText("🙅", W * 0.3, H * 0.27);
    ctx.fillText("😏", W * 0.72, H * 0.73);
    ctx.save();
    ctx.strokeStyle = tpl.border + "44"; ctx.lineWidth = 2; ctx.setLineDash([10,6]);
    ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();
    ctx.restore();
  } else if (tpl.layout === "4row") {
    ["🧠","💡","🤯","✨"].forEach((e, i) => ctx.fillText(e, W*0.72, H/4*i + H/8));
  } else if (tpl.layout === "2col") {
    ctx.fillText("😰", W*0.27, H/2); ctx.fillText("🔘", W*0.73, H/2);
  } else {
    ctx.fillText(em, W/2, H*0.42);
  }

  // corner dots
  [[3,3],[W-14,3],[3,H-14],[W-14,H-14]].forEach(([x,y]) => {
    ctx.fillStyle = tpl.border;
    ctx.beginPath(); ctx.arc(x+5,y+5,5,0,Math.PI*2); ctx.fill();
  });

  // border
  ctx.strokeStyle = tpl.border; ctx.lineWidth = 3; ctx.setLineDash([]);
  ctx.strokeRect(2,2,W-4,H-4);

  // text helper
  const drawT = (text, cx, cy, maxW) => {
    if (!text.trim()) return;
    const fs = parseInt(fontSize)||42;
    ctx.font = `900 ${fs}px Impact,'Arial Black',sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.lineWidth = 6; ctx.strokeStyle = strokeColor||"#000";
    ctx.shadowColor="rgba(0,0,0,0.2)"; ctx.shadowBlur=8; ctx.shadowOffsetY=2;
    ctx.strokeText(text.toUpperCase(), cx, cy, maxW);
    ctx.fillStyle = textColor||"#fff";
    ctx.fillText(text.toUpperCase(), cx, cy, maxW);
    ctx.shadowBlur=0; ctx.shadowOffsetY=0;
  };

  const fs = parseInt(fontSize)||42;
  const pad = fs * 0.65;

  if (tpl.layout === "2row") {
    drawT(top,    W*0.3,  pad+fs*0.5, W*0.55);
    drawT(bottom, W*0.72, H-pad-fs*0.5, W*0.55);
  } else {
    drawT(top,    W/2, pad+fs*0.5,   W-40);
    drawT(bottom, W/2, H-pad-fs*0.5, W-40);
  }
}

/* ══════════════════════════════════════════
   AI JOKE GENERATOR
══════════════════════════════════════════ */
async function generateMemeJoke(category, language, template) {
  const langInstr = language === "hinglish"
    ? "Write in Hinglish (mix of Hindi and English, like how young Indians chat on WhatsApp). Use Roman script for Hindi words. Make it very relatable for Indians."
    : "Write in casual, punchy English.";

  const layoutInstr = {
    "tb":    "Setup line (top) and punchline (bottom). Keep each under 8 words.",
    "2row":  "Line 1: something people REJECT. Line 2: something they PREFER instead. Keep each under 7 words.",
    "4row":  "4 escalating lines showing galaxy brain thinking. Each line max 6 words. From normal to absurd.",
    "2col":  "Two contrasting options someone has to choose between. Keep each option under 6 words.",
  }[template.layout] || "Setup and punchline.";

  const prompt = `You are a meme text writer. Generate funny meme text for the "${category}" category.

Template: ${template.label}
Language: ${langInstr}
Format: ${layoutInstr}

CRITICAL RULES:
- Be genuinely funny, not cringe
- Very short, punchy text only
- NO quotation marks
- NO labels like "Top:" or "Bottom:"
- Return ONLY a JSON object like: {"top":"text here","bottom":"text here"}
- For 4row layout use: {"top":"line1 | line2 | line3 | line4","bottom":""}
- For 2col use: {"top":"option1","bottom":"option2"}`;

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
  const raw = data.content?.[0]?.text || '{"top":"When you generate memes","bottom":"And they actually slap"}';
  const clean = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : { top: "Something went wrong", bottom: "Try again lol" };
  }
}

/* ══════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════ */
export default function MemeGenerator() {
  const [template,    setTemplate]    = useState(TEMPLATES[0]);
  const [category,    setCategory]    = useState(CATEGORIES[0]);
  const [language,    setLanguage]    = useState(LANGUAGES[0]);
  const [topText,     setTopText]     = useState("");
  const [bottomText,  setBottomText]  = useState("");
  const [fontSize,    setFontSize]    = useState(40);
  const [textColor,   setTextColor]   = useState("#ffffff");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [generating,  setGenerating]  = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [error,       setError]       = useState("");
  const [history,     setHistory]     = useState([]);
  const [activeTab,   setActiveTab]   = useState("generate"); // generate | style | history
  const canvasRef = useRef(null);

  const redraw = useCallback(() => {
    drawMeme(canvasRef.current, template, topText, bottomText, textColor, strokeColor, fontSize);
  }, [template, topText, bottomText, textColor, strokeColor, fontSize]);

  useEffect(() => { redraw(); }, [redraw]);

  const handleGenerate = async () => {
    setGenerating(true); setError("");
    try {
      const result = await generateMemeJoke(category.id, language.id, template);
      let top = result.top || "";
      let bottom = result.bottom || "";

      // 4row: split pipe-separated lines
      if (template.layout === "4row" && top.includes("|")) {
        const parts = top.split("|").map(s => s.trim());
        top = parts[0] || "";
        bottom = parts.slice(1).join(" | ");
      }

      setTopText(top);
      setBottomText(bottom);
      // save to history
      setHistory(h => [{ top, bottom, template: template.label, category: category.label, lang: language.label, ts: Date.now() }, ...h.slice(0,9)]);
    } catch (e) {
      setError("Couldn't generate. Check your connection and try again!");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      const link = document.createElement("a");
      link.download = `meme-${template.id}-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
      setDownloading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 400);
  };

  const handleCopy = async () => {
    try {
      canvasRef.current.toBlob(async (blob) => {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
      });
    } catch { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const loadFromHistory = (item) => {
    const t = TEMPLATES.find(t => t.label === item.template) || TEMPLATES[0];
    setTemplate(t); setTopText(item.top); setBottomText(item.bottom);
    setActiveTab("generate");
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes pop { 0%{transform:scale(0.9);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes spin-slow { to{transform:rotate(360deg)} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .float { animation: float 3.5s ease-in-out infinite; }
        .pop   { animation: pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
        .shimmer-btn {
          background: linear-gradient(90deg,#06b6d4 0%,#22d3ee 40%,#06b6d4 80%);
          background-size: 400px 100%;
          animation: shimmer 2s linear infinite;
        }
        .canvas-glow { box-shadow: 0 8px 40px rgba(6,182,212,0.20), 0 2px 8px rgba(6,182,212,0.10); }
        input[type=range] { accent-color: #06b6d4; }
        ::-webkit-scrollbar { width:5px; background:#f0fdff; }
        ::-webkit-scrollbar-thumb { background:#a5f3fc; border-radius:4px; }
        .tab-active { border-bottom: 3px solid #06b6d4; color: #06b6d4; }
      `}</style>

      {/* BG blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-28 -right-28 w-[460px] h-[460px] rounded-full opacity-[0.14]" style={{ background:"radial-gradient(circle,#06b6d4,transparent 70%)" }} />
        <div className="absolute top-1/2 -left-20 w-64 h-64 rounded-full opacity-[0.09]" style={{ background:"radial-gradient(circle,#22d3ee,transparent 70%)" }} />
        <div className="absolute bottom-8 right-1/4 w-72 h-72 rounded-full opacity-[0.07]" style={{ background:"radial-gradient(circle,#0891b2,transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage:"radial-gradient(#06b6d4 1px,transparent 1px)", backgroundSize:"28px 28px" }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 bg-white/90 backdrop-blur-md border-b border-cyan-100 sticky top-0 shadow-sm shadow-cyan-50">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-md shadow-cyan-200 text-lg">
              😂
            </div>
            <span style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", letterSpacing:"0.07em", fontSize:"1.5rem" }} className="text-gray-900 font-black">
              MemeCraft
            </span>
            <span className="text-xs font-extrabold bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent ml-0.5">AI</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 bg-cyan-50 border border-cyan-200 rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-cyan-700">AI Powered · Real Jokes</span>
          </div>
          <button className="text-sm font-bold bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-5 py-2.5 rounded-full shadow-md shadow-cyan-200 hover:shadow-lg hover:shadow-cyan-300 transition-all">
            Sign Up Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 text-center py-10 px-6">
        <div className="float inline-block text-5xl mb-3">😂</div>
        <h1 style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", letterSpacing:"0.05em", fontSize:"clamp(2.8rem,8vw,5.5rem)" }} className="text-gray-900 font-black leading-none mb-2">
          AI MEME GENERATOR
        </h1>
        <p className="text-gray-400 font-medium text-base max-w-md mx-auto">
          Pick a category, language & template — AI generates the joke, you share the laugh!
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          {["🇬🇧 English","🇮🇳 Hinglish","10 Categories","Canvas Export"].map(l => (
            <span key={l} className="hidden md:inline text-[11px] font-bold text-cyan-600 bg-cyan-50 border border-cyan-100 rounded-full px-3 py-1">{l}</span>
          ))}
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid lg:grid-cols-[1fr_440px] gap-6 items-start">

          {/* ── LEFT ── */}
          <div className="space-y-5">

            {/* Language + Category row */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-50 p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-teal-500" />
                <h2 className="text-base font-extrabold text-gray-900">Language & Category</h2>
              </div>

              {/* Language toggle */}
              <div className="mb-5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2.5">Language</label>
                <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setLanguage(l)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all ${
                        language.id === l.id
                          ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-100"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <span>{l.flag}</span> {l.label}
                    </button>
                  ))}
                </div>
                {language.id === "hinglish" && (
                  <p className="text-xs text-cyan-600 font-medium mt-2 pop">
                    🇮🇳 Hinglish mode — desi jokes, Roman Hindi, pure dhamaka!
                  </p>
                )}
              </div>

              {/* Category grid */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2.5">Category</label>
                <div className="grid grid-cols-5 gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c)}
                      className={`p-3 rounded-2xl border-2 text-center transition-all ${
                        category.id === c.id
                          ? "border-cyan-400 bg-gradient-to-br from-cyan-50 to-teal-50 shadow-sm shadow-cyan-100"
                          : "border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/40"
                      }`}
                    >
                      <div className="text-xl mb-1">{c.emoji}</div>
                      <div className={`text-[10px] font-extrabold leading-tight ${category.id === c.id ? "text-cyan-700" : "text-gray-500"}`}>{c.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Template */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-50 p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-teal-500" />
                <h2 className="text-base font-extrabold text-gray-900">Meme Template</h2>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {TEMPLATES.map(t => {
                  const active = template.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t)}
                      className={`relative p-4 rounded-2xl border-2 text-center transition-all group ${
                        active
                          ? "border-cyan-400 bg-gradient-to-br from-cyan-50 to-teal-50 shadow-md shadow-cyan-100"
                          : "border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/40"
                      }`}
                    >
                      <div className="text-2xl mb-1.5">{t.emoji}</div>
                      <div className={`text-xs font-extrabold mb-0.5 ${active ? "text-cyan-700" : "text-gray-700"}`}>{t.label}</div>
                      <div className={`text-[9px] font-medium ${active ? "text-cyan-500" : "text-gray-400"}`}>{t.desc}</div>
                      {active && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center">
                          <span className="text-white text-[8px] font-black">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tabs for text / style / history */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-50 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {[
                  { id:"generate", label:"✏️ Text" },
                  { id:"style",    label:"🎨 Style" },
                  { id:"history",  label:`🕐 History ${history.length > 0 ? `(${history.length})` : ""}` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3.5 text-sm font-extrabold transition-all ${activeTab === tab.id ? "tab-active text-cyan-600 bg-cyan-50/50" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TEXT TAB */}
              {activeTab === "generate" && (
                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Top Text</label>
                    <input
                      type="text" value={topText} onChange={e => setTopText(e.target.value)}
                      placeholder="Setup / first line..."
                      className="w-full border-2 border-gray-200 focus:border-cyan-400 rounded-2xl px-4 py-3.5 text-gray-800 font-bold text-sm focus:outline-none placeholder-gray-300 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Bottom Text</label>
                    <input
                      type="text" value={bottomText} onChange={e => setBottomText(e.target.value)}
                      placeholder="Punchline / reaction..."
                      className="w-full border-2 border-gray-200 focus:border-cyan-400 rounded-2xl px-4 py-3.5 text-gray-800 font-bold text-sm focus:outline-none placeholder-gray-300 transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 font-semibold">
                      <span>⚠️</span> {error}
                    </div>
                  )}

                  {/* BIG AI GENERATE BUTTON */}
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="w-full py-5 rounded-2xl font-black text-white transition-all shimmer-btn shadow-xl shadow-cyan-200 hover:shadow-2xl hover:shadow-cyan-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", letterSpacing:"0.12em", fontSize:"1.3rem" }}
                  >
                    {generating ? (
                      <span className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full" style={{ animation:"spin-slow 0.8s linear infinite", borderWidth:"3px" }} />
                        Generating Joke...
                      </span>
                    ) : `✨ AI Generate ${language.flag} Joke`}
                  </button>
                  <p className="text-center text-xs text-gray-400 font-medium">
                    Powered by Claude AI · {category.emoji} {category.label} · {language.flag} {language.label}
                  </p>
                </div>
              )}

              {/* STYLE TAB */}
              {activeTab === "style" && (
                <div className="p-5 space-y-5">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Font Size</label>
                      <span className="text-sm font-extrabold text-cyan-600">{fontSize}px</span>
                    </div>
                    <input type="range" min="20" max="72" value={fontSize} onChange={e=>setFontSize(e.target.value)} className="w-full h-2 rounded-full" />
                    <div className="flex justify-between text-[10px] text-gray-300 font-bold mt-1"><span>Tiny</span><span>Big</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Text Color</label>
                      <div className="flex items-center gap-2 border-2 border-gray-200 hover:border-cyan-300 rounded-2xl px-3 py-2.5 transition-colors">
                        <input type="color" value={textColor} onChange={e=>setTextColor(e.target.value)} className="w-8 h-7 cursor-pointer border-0 bg-transparent p-0 rounded" />
                        <span className="text-xs font-mono text-gray-400 font-bold">{textColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Outline</label>
                      <div className="flex items-center gap-2 border-2 border-gray-200 hover:border-cyan-300 rounded-2xl px-3 py-2.5 transition-colors">
                        <input type="color" value={strokeColor} onChange={e=>setStrokeColor(e.target.value)} className="w-8 h-7 cursor-pointer border-0 bg-transparent p-0 rounded" />
                        <span className="text-xs font-mono text-gray-400 font-bold">{strokeColor}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Quick Presets</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label:"Classic White", t:"#ffffff", s:"#000000" },
                        { label:"Cyan Glow",     t:"#22d3ee", s:"#0c4a6e" },
                        { label:"Bold Black",    t:"#111827", s:"#ffffff" },
                        { label:"Gold Impact",   t:"#fbbf24", s:"#1c1917" },
                        { label:"Neon Teal",     t:"#14b8a6", s:"#ffffff" },
                        { label:"Hot Pink",      t:"#ec4899", s:"#000000" },
                      ].map(p => {
                        const active = textColor===p.t && strokeColor===p.s;
                        return (
                          <button key={p.label} onClick={()=>{setTextColor(p.t);setStrokeColor(p.s);}}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${active?"border-cyan-400 bg-cyan-50 text-cyan-700":"border-gray-100 text-gray-500 hover:border-cyan-200"}`}>
                            <span className="flex gap-1">
                              <span className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0" style={{background:p.t}} />
                              <span className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0" style={{background:p.s}} />
                            </span>
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* HISTORY TAB */}
              {activeTab === "history" && (
                <div className="p-5">
                  {history.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="text-4xl mb-3">📜</div>
                      <p className="text-gray-400 text-sm font-medium">No history yet.<br />Generate your first meme!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {history.map((item, i) => (
                        <div key={item.ts}
                          className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/30 cursor-pointer transition-all group"
                          onClick={() => loadFromHistory(item)}
                        >
                          <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center text-sm font-extrabold flex-shrink-0">
                            {i+1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-gray-800 truncate">{item.top}</div>
                            <div className="text-xs text-gray-500 truncate">{item.bottom}</div>
                            <div className="flex gap-1.5 mt-1.5">
                              <span className="text-[9px] font-bold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">{item.template}</span>
                              <span className="text-[9px] font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{item.lang}</span>
                            </div>
                          </div>
                          <span className="text-xs text-cyan-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">Load →</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Canvas + Actions ── */}
          <div className="lg:sticky lg:top-24 space-y-4">

            {/* Canvas card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/60 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-cyan-300" />
                  <div className="w-3 h-3 rounded-full bg-teal-300" />
                  <div className="w-3 h-3 rounded-full bg-sky-300" />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</span>
                <div className="flex items-center gap-1.5 bg-cyan-50 border border-cyan-100 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-extrabold text-cyan-700">LIVE</span>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden canvas-glow">
                <canvas ref={canvasRef} width={420} height={420} className="w-full block rounded-2xl" />
                {generating && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                    <div className="text-5xl mb-4" style={{ animation:"spin-slow 1s linear infinite" }}>✨</div>
                    <p className="text-cyan-700 font-extrabold text-lg">Generating joke...</p>
                    <p className="text-gray-400 text-sm mt-1">{language.flag} {category.emoji} {category.label}</p>
                  </div>
                )}
              </div>

              {/* Template + lang info */}
              <div className="mt-4 flex items-center gap-3 bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-100 rounded-2xl px-4 py-3">
                <span className="text-2xl">{template.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-extrabold text-gray-800">{template.label}</div>
                  <div className="text-xs text-gray-400">{category.emoji} {category.label} · {language.flag} {language.label}</div>
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-black">✓</span>
                </div>
              </div>
            </div>

            {/* Copy + Download */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleCopy}
                className={`py-4 rounded-2xl border-2 text-sm font-extrabold transition-all ${copied?"border-teal-400 bg-teal-50 text-teal-700 shadow-md shadow-teal-100":"border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-400"}`}>
                {copied ? "✓ Copied!" : "📋 Copy Image"}
              </button>
              <button onClick={handleDownload} disabled={downloading}
                className="py-4 rounded-2xl border-2 border-cyan-200 text-cyan-700 font-extrabold text-sm hover:bg-cyan-50 hover:border-cyan-400 transition-all disabled:opacity-50">
                {downloading ? "Saving…" : "💾 Download PNG"}
              </button>
            </div>

            {/* Main generate (shortcut from right panel too) */}
            <button onClick={handleGenerate} disabled={generating}
              className="w-full py-4 rounded-2xl font-black text-white shimmer-btn shadow-xl shadow-cyan-200 hover:shadow-2xl hover:shadow-cyan-300 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ fontFamily:"'Bebas Neue',Impact,sans-serif", letterSpacing:"0.1em", fontSize:"1.15rem" }}>
              {generating ? "🔄 Generating..." : `✨ Generate ${language.flag} Meme Joke`}
            </button>

            {saved && (
              <div className="pop flex items-center gap-2 justify-center py-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 text-sm font-bold">
                <span className="w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs">✓</span>
                Meme downloaded!
              </div>
            )}

            {/* Funny stats */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { e:"😂", label:"Funny", val:`${Math.floor(Math.random()*20)+80}%` },
                { e:"🔥", label:"Viral",  val:`${Math.floor(Math.random()*30)+65}%` },
                { e:"🎯", label:"Relatable", val:`${Math.floor(Math.random()*20)+78}%` },
              ].map(s => (
                <div key={s.label} className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100 rounded-2xl p-3 text-center">
                  <div className="text-xl mb-1">{s.e}</div>
                  <div className="text-base font-extrabold text-cyan-700">{s.val}</div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tip */}
            <div className="flex gap-3 bg-cyan-50 border border-cyan-100 rounded-2xl p-4">
              <span className="text-xl flex-shrink-0">💡</span>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                <span className="font-extrabold text-cyan-700">Pro tip:</span> Switch to <strong>Hinglish</strong> for desi dhamaka jokes — perfect for WhatsApp & Instagram reels!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Ticker */}
      <div className="relative z-10 border-t border-b border-cyan-100 bg-cyan-50/60 py-3 overflow-hidden">
        <div className="flex gap-10 whitespace-nowrap" style={{ animation:"marquee 24s linear infinite" }}>
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="text-xs font-extrabold text-cyan-400 tracking-wide">
              😂 AI GENERATES REAL JOKES &nbsp;·&nbsp; 🇮🇳 HINGLISH SUPPORT &nbsp;·&nbsp; 🎨 10 CATEGORIES &nbsp;·&nbsp; 💾 DOWNLOAD PNG FREE &nbsp;·&nbsp; 🔥 SHARE & GO VIRAL &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <footer className="relative z-10 border-t border-gray-100 py-7 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-sm">😂</div>
            © 2025 MemeCraft AI · Built for the internet generation
          </div>
          <div className="flex gap-5 text-sm font-semibold text-gray-400">
            {["Privacy","Terms","Contact"].map(l => (
              <a key={l} href="#" className="hover:text-cyan-600 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}