import { useState, useRef, useEffect, useCallback } from "react";

const QR_API = (text, size, color, bg, errorLevel) =>
  `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=${size}x${size}&color=${color.replace("#","")}&bgcolor=${bg.replace("#","")}&ecc=${errorLevel}&format=png&margin=1`;

const PRESETS = [
  { label: "URL", icon: "🔗", placeholder: "https://yourwebsite.com" },
  { label: "Email", icon: "✉️", placeholder: "mailto:hello@example.com" },
  { label: "Phone", icon: "📞", placeholder: "tel:+1234567890" },
  { label: "Text", icon: "📝", placeholder: "Enter any text here..." },
  { label: "WiFi", icon: "📶", placeholder: "WIFI:T:WPA;S:NetworkName;P:password;;" },
  { label: "vCard", icon: "👤", placeholder: "BEGIN:VCARD\nFN:John Doe\nTEL:+1234567890\nEND:VCARD" },
];

const ERROR_LEVELS = ["L", "M", "Q", "H"];
const SIZES = [128, 256, 512, 1024];

const COLOR_PALETTES = [
  { fg: "#000000", bg: "#FFFFFF", label: "Classic" },
  { fg: "#1a1a2e", bg: "#FFFFFF", label: "Navy" },
  { fg: "#0f766e", bg: "#f0fdfa", label: "Teal" },
  { fg: "#7c3aed", bg: "#faf5ff", label: "Purple" },
  { fg: "#b45309", bg: "#fffbeb", label: "Amber" },
  { fg: "#be123c", bg: "#fff1f2", label: "Rose" },
];

export default function QRCodeGenerator() {
  const [input, setInput] = useState("https://yourwebsite.com");
  const [activePreset, setActivePreset] = useState(0);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [size, setSize] = useState(512);
  const [errorLevel, setErrorLevel] = useState("M");
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);
  const debounceRef = useRef(null);

  const generate = useCallback(() => {
    if (!input.trim()) return;
    setLoading(true);
    setGenerated(false);
    const url = QR_API(input, size, fgColor, bgColor, errorLevel);
    setQrUrl(url);
  }, [input, size, fgColor, bgColor, errorLevel]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(generate, 500);
    return () => clearTimeout(debounceRef.current);
  }, [generate]);

  const handleDownload = async () => {
    if (!qrUrl) return;
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `qrcode-${Date.now()}.png`;
    link.click();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPalette = (p) => {
    setFgColor(p.fg);
    setBgColor(p.bg);
  };

  return (
    <div className="min-h-screen bg-white font-['DM_Sans',sans-serif]">
      {/* Import fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .qr-img { transition: opacity 0.3s, transform 0.3s; }
        .qr-img.loaded { opacity: 1; transform: scale(1); }
        .qr-img.loading { opacity: 0.4; transform: scale(0.97); }
        .preset-btn { transition: all 0.15s ease; }
        .preset-btn:hover { transform: translateY(-1px); }
        .preset-btn.active { background: #000; color: #fff; }
        .palette-dot { transition: all 0.15s; cursor: pointer; }
        .palette-dot:hover { transform: scale(1.15); }
        .palette-dot.active { ring: 2px; outline: 2px solid #000; outline-offset: 2px; }
        .control-row { display: flex; align-items: center; gap: 12px; }
        .tag { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.08em; }
        .shimmer { background: linear-gradient(90deg, #f0f0f0 25%, #fafafa 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        input[type=range] { -webkit-appearance: none; height: 3px; background: #e5e7eb; border-radius: 9999px; outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #000; cursor: pointer; }
        input[type=color] { -webkit-appearance: none; border: none; padding: 0; cursor: pointer; width: 28px; height: 28px; border-radius: 6px; overflow: hidden; background: none; }
        input[type=color]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type=color]::-webkit-color-swatch { border: none; border-radius: 6px; }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 500; letter-spacing: 0.03em; }
        .download-btn { transition: all 0.15s ease; }
        .download-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .download-btn:active { transform: translateY(0); }
        textarea:focus, input:focus { outline: none; }
        .section-divider { height: 1px; background: #f3f4f6; margin: 20px 0; }
      `}</style>


      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 text-center">
        <div className="mb-1">
          <span className="badge bg-gray-900 text-cyan-500 tag">QR GENERATOR</span>
        </div>
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mt-3 mb-2 leading-tight">
          Generate beautiful QR codes<br/>
          <span className="text-cyan-600">in seconds.</span>
        </h1>
        <p className="text-gray-500 text-base">No account. No watermark. Just clean, scannable QR codes.</p>
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

          {/* Left: Controls */}
          <div className="space-y-5">

            {/* Type Selector */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider tag block mb-3">Content Type</label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.label}
                    className={`preset-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium border ${
                      activePreset === i
                        ? "active border-black"
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                    onClick={() => {
                      setActivePreset(i);
                      setInput(p.placeholder);
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{p.icon}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider tag block mb-3">Content</label>
              <textarea
                className="w-full resize-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-gray-400 focus:bg-white transition-all font-['DM_Mono',monospace]"
                rows={4}
                placeholder={PRESETS[activePreset].placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">{input.length} characters</span>
                <button
                  onClick={() => setInput("")}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider tag block mb-3">Colors</label>

              <div className="flex flex-wrap gap-2 mb-4">
                {COLOR_PALETTES.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => applyPalette(p)}
                    title={p.label}
                    className="palette-dot w-8 h-8 rounded-full border-2 border-gray-200 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${p.fg} 50%, ${p.bg} 50%)`,
                      outline: fgColor === p.fg && bgColor === p.bg ? "2px solid #000" : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200">
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
                  <div>
                    <p className="text-[11px] text-gray-400 tag">Foreground</p>
                    <p className="text-sm font-medium text-gray-700 font-mono">{fgColor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                  <div>
                    <p className="text-[11px] text-gray-400 tag">Background</p>
                    <p className="text-sm font-medium text-gray-700 font-mono">{bgColor}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Size & Error */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider tag block mb-3">Export Size</label>
                  <div className="flex gap-2 flex-wrap">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          size === s
                            ? "bg-black text-white border-black"
                            : "border-gray-200 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {s}px
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider tag block mb-3">Error Correction</label>
                  <div className="flex gap-2">
                    {ERROR_LEVELS.map((l) => (
                      <button
                        key={l}
                        onClick={() => setErrorLevel(l)}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-all ${
                          errorLevel === l
                            ? "bg-black text-white border-black"
                            : "border-gray-200 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">
                    {errorLevel === "L" && "7% recovery"}
                    {errorLevel === "M" && "15% recovery"}
                    {errorLevel === "Q" && "25% recovery"}
                    {errorLevel === "H" && "30% recovery"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: QR Preview */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider tag">Preview</label>
                {input && (
                  <span className="badge bg-green-50 text-green-700" style={{ fontSize: 11 }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                    Live
                  </span>
                )}
              </div>

              {/* QR Display */}
              <div
                className="rounded-xl overflow-hidden mb-4 flex items-center justify-center"
                style={{ background: bgColor, aspectRatio: "1/1", minHeight: 260 }}
              >
                {input.trim() ? (
                  <img
                    key={qrUrl}
                    src={qrUrl}
                    alt="QR Code"
                    className="qr-img w-full h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                    onLoad={(e) => {
                      e.target.classList.remove("loading");
                      e.target.classList.add("loaded");
                      setLoading(false);
                      setGenerated(true);
                    }}
                    onLoadStart={(e) => {
                      e.target.classList.remove("loaded");
                      e.target.classList.add("loading");
                    }}
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="text-5xl mb-3 opacity-20">⬛</div>
                    <p className="text-sm text-gray-400">Enter content to generate</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleDownload}
                  disabled={!generated}
                  className="download-btn w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PNG ({size}×{size})
                </button>

                <button
                  onClick={handleCopyUrl}
                  disabled={!generated}
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy image URL
                    </>
                  )}
                </button>
              </div>

              {/* Meta */}
              <div className="section-divider" />
              <div className="space-y-2">
                {[
                  ["Format", "PNG"],
                  ["Resolution", `${size} × ${size}px`],
                  ["Error Level", `${errorLevel} — ${
                    errorLevel === "L" ? "Low" : errorLevel === "M" ? "Medium" : errorLevel === "Q" ? "Quartile" : "High"
                  }`],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 tag">{k}</span>
                    <span className="text-xs text-gray-700 font-medium font-mono">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <p className="text-xs font-medium text-gray-500 tag uppercase tracking-wider mb-2">Tips</p>
              <ul className="space-y-1.5 text-xs text-gray-500">
                <li>• Use Error Level H if you'll add a logo overlay</li>
                <li>• Ensure contrast ratio ≥ 3:1 for reliable scanning</li>
                <li>• Test scan before printing at scale</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}