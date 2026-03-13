import { useState, useRef, useEffect, useCallback } from "react";
import JsBarcode from "jsbarcode";

const FORMATS = [
  { id: "CODE128",    label: "CODE 128", desc: "Universal alphanumeric",   example: "HELLO-WORLD-123" },
  { id: "EAN13",      label: "EAN-13",   desc: "Retail product scanning",  example: "5901234123457"   },
  { id: "EAN8",       label: "EAN-8",    desc: "Small product labels",     example: "96385074"        },
  { id: "UPC",        label: "UPC-A",    desc: "North American retail",    example: "042100005264"    },
  { id: "CODE39",     label: "CODE 39",  desc: "Industrial & logistics",   example: "CODE-39-DEMO"    },
  { id: "ITF14",      label: "ITF-14",   desc: "Shipping & logistics",     example: "12345678901231"  },
  { id: "MSI",        label: "MSI",      desc: "Inventory management",     example: "1234567"         },
  { id: "pharmacode", label: "Pharma",   desc: "Pharmaceutical packaging", example: "1234"            },
];

const THEMES = [
  { label: "Ink",     bar: "#0a0a0a", bg: "#ffffff" },
  { label: "Slate",   bar: "#1e293b", bg: "#f8fafc" },
  { label: "Crimson", bar: "#9f1239", bg: "#fff1f2" },
  { label: "Forest",  bar: "#14532d", bg: "#f0fdf4" },
  { label: "Navy",    bar: "#1e3a5f", bg: "#eff6ff" },
  { label: "Amber",   bar: "#78350f", bg: "#fffbeb" },
];

const HEIGHTS = [40, 60, 80, 100, 120];

export default function BarcodeGenerator() {
  const [format, setFormat]       = useState(FORMATS[0]);
  const [input, setInput]         = useState("HELLO-WORLD-123");
  const [theme, setTheme]         = useState(THEMES[0]);
  const [height, setHeight]       = useState(80);
  const [showText, setShowText]   = useState(true);
  const [fontSize, setFontSize]   = useState(14);
  const [margin, setMargin]       = useState(10);
  const [error, setError]         = useState("");
  const [copied, setCopied]       = useState(false);
  const [rendered, setRendered]   = useState(false);
  const [lineWidth, setLineWidth] = useState(2);

  const svgRef   = useRef(null);
  const debounce = useRef(null);

 const renderBarcode = useCallback(() => {
  if (!svgRef.current) return;

  setError("");
  setRendered(false);

  try {
    JsBarcode(svgRef.current, input || " ", {
      format: format.id,
      lineColor: theme.bar,
      background: theme.bg,
      width: lineWidth,
      height: height,
      displayValue: showText,
      fontSize: fontSize,
      margin: margin,
    });

    setRendered(true);
  } catch (e) {
    setError(e.message || "Generation failed");
  }
}, [input, format, theme, height, showText, fontSize, margin, lineWidth]);

  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(renderBarcode, 350);
    return () => clearTimeout(debounce.current);
  }, [renderBarcode]);

  const handleFormatChange = (f) => {
    setFormat(f);
    setInput(f.example);
    setError("");
  };

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const blob = new Blob([svgRef.current.outerHTML], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `barcode-${format.id}-${Date.now()}.svg`;
    a.click();
  };

  const downloadPNG = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const canvas = document.createElement("canvas");
    const scale = 3;
    canvas.width  = svg.width.baseVal.value  * scale;
    canvas.height = svg.height.baseVal.value * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const a = document.createElement("a");
      a.download = `barcode-${format.id}-${Date.now()}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg))));
  };

  const copySVG = () => {
    if (!svgRef.current) return;
    navigator.clipboard.writeText(svgRef.current.outerHTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── only non-Tailwind styles: range input skin + keyframes ── */
  const globalCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Syne+Mono&display=swap');
    .syne { font-family:'Syne',sans-serif; }
    .syne-mono { font-family:'Syne Mono',monospace; }
    input[type=range]{ -webkit-appearance:none; height:2px; background:#e8e8e5; border-radius:2px; outline:none; cursor:pointer; width:100%; }
    input[type=range]::-webkit-slider-thumb{ -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#111; cursor:pointer; border:2px solid #fff; box-shadow:0 0 0 1px #111; }
    @keyframes pulse{ 0%,100%{opacity:1} 50%{opacity:.4} }
    .pulse{ animation:pulse 2s infinite; }
  `;

  return (
    <>
      <style>{globalCSS}</style>
      <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js" />

      <div className="syne min-h-screen bg-white text-neutral-900">

        {/* ── HERO ── */}
        <div className="bg-white border-b border-stone-200 px-7 pt-9 pb-7 text-center">
          <div className="max-w-5xl mx-auto text-center">
          
            <h1 className="text-4xl font-medium  text-neutral-900 mb-2">
              Generate print-ready<br />
              <span className="text-cyan-600">barcodes instantly.</span>
            </h1>
            <p className="text-sm text-stone-500">8 formats · SVG &amp; PNG export · Zero watermarks · 100% free</p>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className=" max-w-5xl mx-auto px-7 py-7 pb-16 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">

          {/* ══ LEFT COLUMN ══ */}
          <div className="flex flex-col gap-4">

            {/* FORMAT CARD */}
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100">
                <span className="syne-mono text-[10px] tracking-[0.12em] uppercase text-stone-400">Format</span>
                {/* status dot */}
                <span className="syne-mono flex items-center gap-1.5 text-[11px]">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${error ? "bg-rose-500" : rendered ? "bg-emerald-500 pulse" : "bg-stone-300"}`}
                  />
                  <span className={error ? "text-rose-500" : rendered ? "text-emerald-500" : "text-stone-300"}>
                    {error ? "error" : rendered ? "live" : "idle"}
                  </span>
                </span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FORMATS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleFormatChange(f)}
                      className={`text-left rounded-xl px-3 py-3 border transition-all duration-150
                        ${format.id === f.id
                          ? "bg-neutral-900 border-neutral-900"
                          : "bg-stone-50 border-stone-200 hover:border-stone-400 hover:bg-white hover:-translate-y-px"}`}
                    >
                      <div className={`syne-mono text-[11px] font-bold tracking-[-0.02em] mb-1 ${format.id === f.id ? "text-white" : "text-neutral-900"}`}>
                        {f.label}
                      </div>
                      <div className={`text-[10px] leading-snug ${format.id === f.id ? "text-stone-400" : "text-stone-400"}`}>
                        {f.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CONTENT CARD */}
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100">
                <span className="syne-mono text-[10px] tracking-[0.12em] uppercase text-stone-400">Content</span>
                <span className="syne-mono text-[10px] text-stone-300">{input.length} chars</span>
              </div>
              <div className="p-5">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={format.example}
                  spellCheck={false}
                  className={`syne-mono w-full bg-stone-50 border rounded-xl px-4 py-3 text-[15px] font-medium text-neutral-900 tracking-[0.03em] transition-all outline-none
                    ${error
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-stone-200 focus:border-neutral-900 focus:bg-white"}`}
                />
                {error && (
                  <div className="flex items-center gap-1.5 mt-2 text-rose-500 text-xs font-medium">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="5.5" stroke="#e11d48" />
                      <path d="M6 3.5v3M6 8.5v.5" stroke="#e11d48" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    {error}
                  </div>
                )}
                <div className="flex gap-2 mt-3 flex-wrap">
                  <button
                    onClick={() => setInput(format.example)}
                    className="syne-mono text-[10px] text-stone-500 bg-stone-100 border border-stone-200 rounded-md px-3 py-1 tracking-[0.05em] hover:border-stone-400 transition-colors cursor-pointer"
                  >
                    Use example
                  </button>
                  <button
                    onClick={() => setInput("")}
                    className="syne-mono text-[10px] text-stone-300 border border-stone-100 rounded-md px-3 py-1 hover:text-stone-500 transition-colors cursor-pointer bg-transparent"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* APPEARANCE CARD */}
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-100">
                <span className="syne-mono text-[10px] tracking-[0.12em] uppercase text-stone-400">Appearance</span>
              </div>
              <div className="p-5">

                {/* Color themes */}
                <div className="mb-5">
                  <div className="syne-mono text-[9px] tracking-[0.12em] text-stone-300 uppercase mb-3">Color Theme</div>
                  <div className="flex gap-2 flex-wrap">
                    {THEMES.map((t) => (
                      <button
                        key={t.label}
                        title={t.label}
                        onClick={() => setTheme(t)}
                        style={{
                          background: t.bg,
                          outline: theme.label === t.label ? "2px solid #111" : "none",
                          outlineOffset: 2,
                        }}
                        className="w-9 h-9 rounded-lg border-2 border-stone-200 overflow-hidden hover:scale-110 transition-transform"
                      >
                        <div className="w-full h-full flex">
                          <div className="w-1/2 h-full" style={{ background: t.bar }} />
                          <div className="w-1/2 h-full" style={{ background: t.bg }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bar height presets */}
                <div className="mb-5">
                  <div className="syne-mono text-[9px] tracking-[0.12em] text-stone-300 uppercase mb-3">Bar Height</div>
                  <div className="flex gap-2 flex-wrap">
                    {HEIGHTS.map((h) => (
                      <button
                        key={h}
                        onClick={() => setHeight(h)}
                        className={`syne-mono text-[11px] border rounded-lg px-3 py-1.5 transition-all cursor-pointer
                          ${height === h
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-400"}`}
                      >
                        {h}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4 mb-5">
                  {[
                    { label: "Bar Width", value: lineWidth, min: 1, max: 4,  step: 0.5, unit: "px", set: setLineWidth },
                    { label: "Margin",    value: margin,    min: 0, max: 30, step: 2,   unit: "px", set: setMargin    },
                    { label: "Font Size", value: fontSize,  min: 8, max: 24, step: 1,   unit: "px", set: setFontSize  },
                  ].map(({ label, value, min, max, step, unit, set }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="syne-mono text-[10px] tracking-[0.08em] text-stone-400 uppercase w-16 flex-shrink-0">
                        {label}
                      </span>
                      <input
                        type="range"
                        min={min} max={max} step={step}
                        value={value}
                        onChange={(e) => set(parseFloat(e.target.value))}
                      />
                      <span className="syne-mono text-[11px] text-stone-500 w-8 text-right">
                        {value}{unit}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Toggle */}
                <div
                  className="flex items-center gap-3 cursor-pointer select-none"
                  onClick={() => setShowText(!showText)}
                >
                  <div className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${showText ? "bg-neutral-900" : "bg-stone-200"}`}>
                    <div className={`absolute top-[3px] left-[3px] w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${showText ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                  <span className="text-sm text-stone-500 font-medium">Show text below barcode</span>
                </div>

              </div>
            </div>
          </div>

          {/* ══ RIGHT COLUMN — Preview ══ */}
          <div className="lg:sticky lg:top-5 flex flex-col gap-3">

            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
              {/* card header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100">
                <span className="syne-mono text-[10px] tracking-[0.12em] uppercase text-stone-400">Preview</span>
                <span className="syne-mono text-[10px] text-stone-300">{format.label}</span>
              </div>

              {/* barcode canvas */}
              <div
                className="mx-3 my-3 rounded-xl flex items-center justify-center min-h-[200px] overflow-hidden transition-colors duration-300"
                style={{ background: theme.bg }}
              >
                <svg ref={svgRef} className="max-w-full h-auto block" />
              </div>

              {/* download actions */}
              <div className="px-5 pb-5 flex flex-col gap-2">
                <button
                  onClick={downloadPNG}
                  disabled={!rendered}
                  className="syne w-full flex items-center justify-center gap-2 bg-neutral-900 text-white rounded-xl py-3 text-[13px] font-bold tracking-[0.01em] hover:bg-neutral-700 hover:-translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Download PNG (3× retina)
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={downloadSVG}
                    disabled={!rendered}
                    className="syne flex items-center justify-center gap-1.5 bg-stone-50 text-stone-600 border border-stone-200 rounded-xl py-2.5 text-xs font-semibold hover:border-stone-400 hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    SVG
                  </button>
                  <button
                    onClick={copySVG}
                    disabled={!rendered}
                    className="syne flex items-center justify-center gap-1.5 bg-stone-50 text-stone-600 border border-stone-200 rounded-xl py-2.5 text-xs font-semibold hover:border-stone-400 hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                        Copy SVG
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* meta grid */}
              <div className="grid grid-cols-2 gap-2.5 px-5 py-4 border-t border-stone-100">
                {[
                  ["Format",    format.label],
                  ["Height",    `${height}px`],
                  ["Bar width", `${lineWidth}px`],
                  ["Color",     theme.label],
                  ["Export",    "SVG + PNG"],
                  ["Watermark", "None"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="syne-mono text-[9px] tracking-[0.12em] text-stone-300 uppercase mb-0.5">{k}</div>
                    <div className="syne-mono text-[12px] text-stone-600 font-medium">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FORMAT GUIDE */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5">
              <div className="syne-mono text-[9px] tracking-[0.15em] uppercase text-stone-300 mb-3">Format Guide</div>
              <ul className="space-y-1.5 text-[12px] text-stone-500">
                {[
                  ["CODE 128", "most flexible, any ASCII"],
                  ["EAN-13 / UPC-A", "retail products"],
                  ["CODE 39", "uppercase letters + digits"],
                  ["ITF-14", "outer carton shipping labels"],
                  ["Pharma", "numeric only, 1–8 digits"],
                ].map(([name, tip]) => (
                  <li key={name} className="flex gap-2">
                    <span className="syne-mono text-stone-300">—</span>
                    <span><span className="font-semibold text-stone-700">{name}</span> · {tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}