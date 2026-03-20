import { useState, useCallback, useEffect, useRef } from "react";

/* ── helpers ── */
const hexToHsl = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) { case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break; case g: h = ((b - r) / d + 2) / 6; break; case b: h = ((r - g) / d + 4) / 6; break; }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};
const hslToHex = (h, s, l) => {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => { const k = (n + h / 30) % 12; const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(255 * c).toString(16).padStart(2, '0'); };
  return `#${f(0)}${f(8)}${f(4)}`;
};
const randomHsl = () => [Math.floor(Math.random() * 360), 55 + Math.floor(Math.random() * 35), 40 + Math.floor(Math.random() * 30)];
const isLight = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
};
const contrastText = (hex) => isLight(hex) ? "#1a1a1a" : "#ffffff";

const HARMONY_MODES = ["Random", "Analogous", "Complementary", "Triadic", "Split", "Monochrome"];

const generateHarmony = (mode, count = 5) => {
  const [baseH, baseS, baseL] = randomHsl();
  const palettes = [];
  for (let i = 0; i < count; i++) {
    let h = baseH, s = baseS, l = baseL;
    switch (mode) {
      case "Analogous": h = (baseH + i * 30 - 30) % 360; break;
      case "Complementary": h = i % 2 === 0 ? baseH : (baseH + 180) % 360; s = baseS - i * 3; l = baseL + i * 4 - 8; break;
      case "Triadic": h = (baseH + i * (360 / 3)) % 360; s = baseS - i * 2; break;
      case "Split": h = (baseH + [0, 150, 210, 330, 60][i]) % 360; break;
      case "Monochrome": s = baseS; l = 20 + i * 14; break;
      default: [h, s, l] = randomHsl();
    }
    palettes.push({ id: i, hex: hslToHex(Math.abs(h) % 360, Math.max(10, Math.min(100, s)), Math.max(15, Math.min(85, l))), locked: false });
  }
  return palettes;
};

const EXPORT_FORMATS = ["HEX", "RGB", "HSL", "CSS Variables", "Tailwind", "JSON"];
const hexToRgb = hex => { const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); return `rgb(${r}, ${g}, ${b})`; };
const hexToHslStr = hex => { const [h, s, l] = hexToHsl(hex); return `hsl(${h}, ${s}%, ${l}%)`; };
const PALETTES_STARTER = generateHarmony("Random", 5);

/* ════════════════════════════════════════════════════ */
export default function ColorPaletteGenerator() {
  const [palette, setPalette] = useState(PALETTES_STARTER);
  const [harmony, setHarmony] = useState("Random");
  const [copiedId, setCopiedId] = useState(null);
  const [exportFmt, setExportFmt] = useState("HEX");
  const [showExport, setShowExport] = useState(false);
  const [history, setHistory] = useState([PALETTES_STARTER]);
  const [histIdx, setHistIdx] = useState(0);
  const [dragging, setDragging] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const toastRef = useRef(null);

  const pushHistory = (p) => {
    const next = history.slice(0, histIdx + 1).concat([p]);
    setHistory(next); setHistIdx(next.length - 1);
  };

  const generate = useCallback(() => {
    const next = palette.map((s, i) => {
      if (s.locked) return s;
      return { ...s, hex: generateHarmony(harmony, palette.length)[i].hex };
    });
    setPalette(next); pushHistory(next);
    // eslint-disable-next-line
  }, [palette, harmony]);

  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Space" && !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
        e.preventDefault(); generate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [generate]);

  const toggleLock = (id) => setPalette(p => p.map(s => s.id === id ? { ...s, locked: !s.locked } : s));
  const changeColor = (id, hex) => { const n = palette.map(s => s.id === id ? { ...s, hex } : s); setPalette(n); pushHistory(n); };
  const addSwatch = () => { if (palette.length >= 8) return; const [h, s, l] = randomHsl(); const n = [...palette, { id: Date.now(), hex: hslToHex(h, s, l), locked: false }]; setPalette(n); pushHistory(n); };
  const removeSwatch = (id) => { if (palette.length <= 2) return; const n = palette.filter(s => s.id !== id); setPalette(n); pushHistory(n); };
  const undo = () => { if (histIdx > 0) { const i = histIdx - 1; setHistIdx(i); setPalette(history[i]); } };
  const redo = () => { if (histIdx < history.length - 1) { const i = histIdx + 1; setHistIdx(i); setPalette(history[i]); } };
  const copyHex = (id, hex) => { navigator.clipboard.writeText(hex); setCopiedId(id); setTimeout(() => setCopiedId(null), 1800); };
  const toast = (msg) => { setToastMsg(msg); clearTimeout(toastRef.current); toastRef.current = setTimeout(() => setToastMsg(""), 2200); };

  const exportText = () => {
    switch (exportFmt) {
      case "HEX": return palette.map(s => s.hex).join("\n");
      case "RGB": return palette.map(s => hexToRgb(s.hex)).join("\n");
      case "HSL": return palette.map(s => hexToHslStr(s.hex)).join("\n");
      case "CSS Variables": return `:root {\n${palette.map((s, i) => `  --color-${i + 1}: ${s.hex};`).join("\n")}\n}`;
      case "Tailwind": return `colors: {\n${palette.map((s, i) => `  'brand-${i + 1}': '${s.hex}',`).join("\n")}\n}`;
      case "JSON": return JSON.stringify(palette.map(s => s.hex), null, 2);
      default: return "";
    }
  };
  const copyExport = () => { navigator.clipboard.writeText(exportText()); toast("Copied to clipboard!"); };

  const onDragStart = (id) => setDragging(id);
  const onDragOver = (e, id) => {
    e.preventDefault();
    if (dragging === null || dragging === id) return;
    const from = palette.findIndex(s => s.id === dragging), to = palette.findIndex(s => s.id === id);
    const next = [...palette]; const [item] = next.splice(from, 1); next.splice(to, 0, item); setPalette(next);
  };
  const onDragEnd = () => { setDragging(null); pushHistory(palette); };

  /* Only non-Tailwind styles: hover expand, vertical text, color input skin, keyframes */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&display=swap');
    .ins { font-family:'Instrument Sans',sans-serif; }
    .swatch-col { transition: flex 0.35s cubic-bezier(.4,0,.2,1); }
    .swatch-col:hover { flex: 1.45 !important; }
    .hex-badge { opacity:0; transform:translateY(6px); transition:opacity .2s,transform .2s; }
    .swatch-col:hover .hex-badge { opacity:1; transform:translateY(0); }
    .lock-btn { opacity:0; transition:opacity .15s; }
    .swatch-col:hover .lock-btn, .swatch-col .lock-btn.locked { opacity:1; }
    .rm-btn { opacity:0; transition:opacity .15s; }
    .swatch-col:hover .rm-btn { opacity:1; }
    .vtext { writing-mode:vertical-rl; text-orientation:mixed; transform:rotate(180deg); }
    input[type=color]{ -webkit-appearance:none; border:none; background:none; padding:0; cursor:pointer; width:28px; height:28px; border-radius:6px; overflow:hidden; }
    input[type=color]::-webkit-color-swatch-wrapper{ padding:0; }
    input[type=color]::-webkit-color-swatch{ border:none; border-radius:6px; }
    @keyframes fadeUp{ from{opacity:0;transform:translateY(8px)translateX(-50%)} to{opacity:1;transform:translateY(0)translateX(-50%)} }
    .toast-anim{ animation:fadeUp .2s ease; }
  `;

  return (
    <>
      <style>{css}</style>

      <div className="ins max-w-6xl mx-auto min-h-screen bg-white flex flex-col py-16">

        <div className="">
          <h1 className="text-4xl font-medium text-gray-900 text-center mb-8">
            Color palette <span className="text-cyan-700">generator</span>
          </h1>
        </div>


        {/* ── TOOLBAR ── */}
        <div className="bg-white border-b border-gray-200 flex flex-wrap items-center gap-2.5 px-6 py-3">

          {/* harmony pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {HARMONY_MODES.map(m => (
              <button key={m}
                onClick={() => setHarmony(m)}
                className={`text-xs font-medium px-3 py-1 rounded-full border cursor-pointer transition-all
                  ${harmony === m
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "border-gray-200 text-gray-500 hover:border-gray-400 bg-transparent"}`}
              >{m}</button>
            ))}
          </div>

          <div className="w-px h-5 bg-gray-100 mx-0.5 hidden sm:block" />

          {/* generate button */}
          <button onClick={generate}
            className="flex items-center gap-2 bg-cyan-600 text-white text-[13px] font-semibold px-5 py-2 rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer border-0"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
            </svg>
            Generate
          </button>

          {/* undo / redo */}
          <div className="flex gap-1">
            {[{ lbl: "↩", fn: undo, dis: histIdx === 0, t: "Undo" }, { lbl: "↪", fn: redo, dis: histIdx === history.length - 1, t: "Redo" }].map(({ lbl, fn, dis, t }) => (
              <button key={t} onClick={fn} disabled={dis} title={t}
                className={`w-8 h-8 border border-gray-200 rounded-lg bg-gray-50 text-sm transition-colors
                  ${dis ? "opacity-40 cursor-not-allowed" : "hover:border-gray-400 cursor-pointer"}`}
              >{lbl}</button>
            ))}
          </div>

          {/* add swatch */}
          <button onClick={addSwatch} disabled={palette.length >= 8} title="Add swatch"
            className={`w-8 h-8 border border-dashed border-gray-300 rounded-lg text-lg text-gray-400 bg-transparent transition-colors
              ${palette.length >= 8 ? "opacity-40 cursor-not-allowed" : "hover:border-gray-500 hover:text-gray-600 cursor-pointer"}`}
          >+</button>

          {/* right side: mini preview + export */}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex rounded-md overflow-hidden h-7" style={{ width: palette.length * 22 }}>
              {palette.map(s => (
                <div key={s.id} className="flex-1" style={{ background: s.hex, minWidth: 0 }} />
              ))}
            </div>
            <button onClick={() => setShowExport(!showExport)}
              className={`flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer
                ${showExport
                  ? "bg-cyan-600 text-white border-cyan-600"
                  : "bg-gray-50 text-cyan-600 border-cyan-600 hover:border-cyan-600"}`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* ── SWATCH AREA ── */}
        <div className="flex flex-1" style={{ minHeight: 460 }}>
          {palette.map((swatch) => {
            const fg = contrastText(swatch.hex);
            const [h, s, l] = hexToHsl(swatch.hex);
            return (
              <div
                key={swatch.id}
                className="swatch-col relative flex flex-col justify-between cursor-grab active:cursor-grabbing"
                style={{ flex: 1, background: swatch.hex }}
                draggable
                onDragStart={() => onDragStart(swatch.id)}
                onDragOver={e => onDragOver(e, swatch.id)}
                onDragEnd={onDragEnd}
              >
                {/* top controls */}
                <div className="flex items-start justify-between p-3">
                  <button
                    className={`lock-btn ${swatch.locked ? "locked" : ""} flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border backdrop-blur-sm transition-opacity`}
                    style={{ borderColor: `${fg}22`, background: `${fg}11`, color: fg }}
                    onClick={() => toggleLock(swatch.id)}
                    title={swatch.locked ? "Unlock" : "Lock"}
                  >
                    {swatch.locked ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" />
                      </svg>
                    )}
                  </button>
                  <button
                    className="rm-btn flex items-center justify-center w-6 h-6 rounded-md cursor-pointer border text-sm leading-none"
                    style={{ borderColor: `${fg}22`, background: `${fg}11`, color: fg }}
                    onClick={() => removeSwatch(swatch.id)}
                    title="Remove"
                  >×</button>
                </div>

                {/* center: vertical HSL */}
                <div className="flex-1 flex items-center justify-center">
                  <span
                    className="vtext text-[10px] tracking-[0.15em]"
                    style={{ color: `${fg}55`, fontFamily: "'Courier New',monospace" }}
                  >
                    {h}° {s}% {l}%
                  </span>
                </div>

                {/* bottom: hex + picker */}
                <div className="p-4 flex flex-col items-center gap-2">
                  <div className="hex-badge flex flex-col items-center gap-2">
                    <button
                      onClick={() => copyHex(swatch.id, swatch.hex)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider cursor-pointer border backdrop-blur-sm transition-all"
                      style={{ fontFamily: "'Courier New',monospace", color: fg, background: `${fg}11`, borderColor: `${fg}22` }}
                      title="Click to copy"
                    >
                      {copiedId === swatch.id ? "✓ Copied" : swatch.hex.toUpperCase()}
                    </button>
                    <label className="cursor-pointer" title="Pick color">
                      <input type="color" value={swatch.hex} onChange={e => changeColor(swatch.id, e.target.value)} />
                    </label>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${fg}33` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── EXPORT PANEL ── */}
        {showExport && (
          <div className="bg-white border-t border-gray-200 px-6 pt-5 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[15px] text-gray-900">Export Palette</h3>
              <button onClick={() => setShowExport(false)}
                className="text-gray-300 hover:text-gray-600 text-xl leading-none bg-transparent border-0 cursor-pointer transition-colors"
              >×</button>
            </div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {EXPORT_FORMATS.map(f => (
                <button key={f} onClick={() => setExportFmt(f)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg border cursor-pointer transition-all
                    ${exportFmt === f
                      ? "bg-cyan-600 text-white border-cyan-600"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400"}`}
                >{f}</button>
              ))}
            </div>
            <div className="relative">
              <textarea
                readOnly
                className="w-full bg-stone-50 border border-gray-200 rounded-xl p-4 text-gray-700 outline-none text-xs resize-none"
                style={{ fontFamily: "'Courier New',monospace" }}
                rows={["CSS Variables", "Tailwind", "JSON"].includes(exportFmt) ? 8 : 5}
                value={exportText()}
              />
              <button onClick={copyExport}
                className="absolute top-2.5 right-2.5 bg-cyan-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-gray-700 cursor-pointer border-0 transition-colors"
              >Copy</button>
            </div>
            {/* color strip */}
            <div className="flex rounded-xl overflow-hidden mt-3.5" style={{ height: 34 }}>
              {palette.map(s => (
                <div key={s.id} className="flex-1 flex items-center justify-center" style={{ background: s.hex }}>
                  <span className="text-[9px] font-bold tracking-wider" style={{ fontFamily: "'Courier New',monospace", color: contrastText(s.hex) }}>
                    {s.hex.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BOTTOM BAR ── */}
        <div className="bg-white border-t border-gray-200 px-6 py-2.5 flex items-center gap-5 overflow-x-auto flex-shrink-0">
          {palette.map(s => {
            const [h, sat, l] = hexToHsl(s.hex);
            return (
              <div key={s.id} className="flex items-center gap-2 flex-shrink-0 text-xs text-gray-400">
                <div className="w-3.5 h-3.5 rounded border border-gray-200" style={{ background: s.hex }} />
                <span className="text-gray-500" style={{ fontFamily: "'Courier New',monospace" }}>{s.hex.toUpperCase()}</span>
                <span className="text-gray-200">·</span>
                <span>H{h} S{sat} L{l}</span>
                {s.locked && <span className="text-amber-400 text-[11px]">🔒</span>}
              </div>
            );
          })}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
            <span>{palette.length} swatches</span>
            <span className="text-gray-200">|</span>
            <span>{harmony}</span>
          </div>
        </div>

        {/* ── TOAST ── */}
        {toastMsg && (
          <div
            className="toast-anim fixed bottom-7 left-1/2 bg-gray-900 text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl pointer-events-none z-50"
            style={{ transform: "translateX(-50%)" }}
          >
            {toastMsg}
          </div>
        )}
      </div>
    </>
  );
}