import { useState, useCallback } from "react";

// ─── Color Math Utilities ────────────────────────────────────────────────────
function parseColor(str) {
  str = str.trim();
  if (!str) return null;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillStyle = str;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  if (d[3] === 0 && str.toLowerCase() !== "transparent") {
    ctx.fillStyle = "#000";
    ctx.fillStyle = str;
    if (!["black", "#000", "#000000"].includes(str.toLowerCase()) && ctx.fillStyle === "#000000")
      return null;
    ctx.fillRect(0, 0, 1, 1);
    const d2 = ctx.getImageData(0, 0, 1, 1).data;
    return { r: d2[0], g: d2[1], b: d2[2] };
  }
  return { r: d[0], g: d[1], b: d[2] };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return "#" + f(0) + f(8) + f(4);
}

function hslToRgb(h, s, l) {
  const hex = hslToHex(h, s, l);
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function luminance(r, g, b) { return 0.299 * r + 0.587 * g + 0.114 * b; }

// ─── Shade Generation ────────────────────────────────────────────────────────
function generateShades(h, s, l, steps, mode) {
  const arr = [];
  if (mode === "palette") {
    const lightnesses = [97, 93, 85, 74, 60, 46, 35, 25, 17, 11, 7];
    const labels = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
    lightnesses.slice(0, steps).forEach((lVal, i) => {
      const sVal = Math.min(s, 95);
      const hex = hslToHex(h, sVal, lVal).toUpperCase();
      const rgb = hslToRgb(h, sVal, lVal);
      arr.push({ label: labels[i], hex, lVal, sVal, rgb });
    });
  } else if (mode === "tints") {
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const lVal = Math.round(l + (97 - l) * t);
      const sVal = Math.round(s - s * t * 0.5);
      const hex = hslToHex(h, sVal, lVal).toUpperCase();
      const rgb = hslToRgb(h, sVal, lVal);
      arr.push({ label: `${Math.round(t * 100)}%`, hex, lVal, sVal, rgb });
    }
  } else if (mode === "shades") {
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const lVal = Math.round(l - l * t * 0.92);
      const sVal = Math.round(s - s * t * 0.3);
      const hex = hslToHex(h, sVal, lVal).toUpperCase();
      const rgb = hslToRgb(h, sVal, lVal);
      arr.push({ label: `${Math.round(t * 100)}%`, hex, lVal, sVal, rgb });
    }
  } else if (mode === "tones") {
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const sVal = Math.round(s * (1 - t));
      const hex = hslToHex(h, sVal, l).toUpperCase();
      const rgb = hslToRgb(h, sVal, l);
      arr.push({ label: `${Math.round(t * 100)}%`, hex, lVal: l, sVal, rgb });
    }
  }
  return arr;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const SWATCHES = [
  "#E24B4A", "#EF9F27", "#97C459", "#1D9E75",
  "#3B82F6", "#7F77DD", "#D4537E", "#EC4899",
  "#F97316", "#14B8A6",
];

const MODES = ["palette", "tints", "shades", "tones"];
const TABS = ["visual", "tailwind", "css"];

// ─── Component ───────────────────────────────────────────────────────────────
export default function ColorShadesGenerator() {
  const [inputVal, setInputVal] = useState("#3B82F6");
  const [hsl, setHsl] = useState({ h: 214, s: 89, l: 60 });
  const [steps, setSteps] = useState(10);
  const [mode, setMode] = useState("palette");
  const [tab, setTab] = useState("visual");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const processColor = useCallback((val) => {
    setInputVal(val);
    const rgb = parseColor(val);
    if (!rgb) { setError("Invalid color — try #hex, rgb(), hsl(), or a named color"); return; }
    setError("");
    setHsl(rgbToHsl(rgb.r, rgb.g, rgb.b));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1500);
  };

  const copyText = (text, msg = "Copied!") => {
    navigator.clipboard.writeText(text).then(() => showToast(msg));
  };

  const shades = generateShades(hsl.h, hsl.s, hsl.l, steps, mode);

  // Tailwind config output
  const twLabels =
    mode === "palette"
      ? ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"].slice(0, steps)
      : shades.map((_, i) => String(i + 1));
  const tailwindCode =
    `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        primary: {\n` +
    shades.map((sh, i) => `          ${twLabels[i]}: '${sh.hex}',`).join("\n") +
    `\n        },\n      },\n    },\n  },\n};`;

  // CSS variables output
  const cssCode =
    `:root {\n` +
    shades.map((sh, i) => `  --color-primary-${mode === "palette" ? twLabels[i] : i * 100}: ${sh.hex};`).join("\n") +
    `\n}`;

  const pickerHex =
    "#" + [hsl]
      .map(() => hslToHex(hsl.h, hsl.s, hsl.l).replace("#", ""))
      .join("");

  return (
    <div className=" py-16 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-medium text-gray-900 mb-1">Color <span className="text-cyan-600">Shades</span>  Generator</h1>
        <p className="text-sm text-gray-500 mb-6">
          Generate tints, shades, tones, or a full Tailwind-style palette from any base color.
        </p>

        {/* Controls Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex flex-wrap gap-4 items-end mb-3">
            {/* Text Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Base color</label>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => processColor(e.target.value)}
                placeholder="#hex · rgb() · hsl() · name"
                className="h-9 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition w-56"
              />
            </div>
            {/* Color Picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Pick</label>
              <input
                type="color"
                value={hslToHex(hsl.h, hsl.s, hsl.l)}
                onChange={(e) => processColor(e.target.value)}
                className="h-9 w-11 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
              />
            </div>
            {/* Steps */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Steps: <span className="font-medium text-gray-800">{steps}</span></label>
              <input
                type="range" min={5} max={mode === "palette" ? 11 : 20} step={1}
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-28 accent-blue-500"
              />
            </div>
            {/* Mode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Mode</label>
              <div className="flex gap-1.5">
                {MODES.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); if (m === "palette" && steps > 11) setSteps(11); }}
                    className={`px-3 py-1.5 text-xs rounded-lg border capitalize transition-all ${
                      mode === m
                        ? "bg-white border-cyan-600 text-cyan-600 font-medium"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

          {/* Swatches */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Quick swatches</p>
            <div className="flex gap-2 flex-wrap">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  title={c}
                  onClick={() => processColor(c)}
                  className="w-7 h-7 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Output Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-xs rounded-lg border capitalize transition-all ${
                  tab === t
                    ? "bg-white border-gray-300 text-gray-900 font-medium shadow-sm"
                    : "bg-transparent border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "tailwind" ? "Tailwind Config" : t === "css" ? "CSS Variables" : "Visual"}
              </button>
            ))}
          </div>

          {/* Visual Tab */}
          {tab === "visual" && (
            <>
              <div className="flex justify-end mb-3">
                <button
                  onClick={() => copyText(shades.map((s) => s.hex).join("\n"), "All HEX values copied!")}
                  className="text-xs text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition"
                >
                  Copy all HEX
                </button>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                {shades.map((shade, i) => {
                  const lum = luminance(shade.rgb.r, shade.rgb.g, shade.rgb.b);
                  return (
                    <div
                      key={i}
                      className="flex items-stretch cursor-pointer hover:brightness-95 transition-all"
                      onClick={() => copyText(shade.hex, `${shade.hex} copied!`)}
                      title={`Click to copy ${shade.hex}`}
                    >
                      {/* Swatch */}
                      <div
                        className="w-16 flex-shrink-0"
                        style={{ background: shade.hex, minHeight: 52 }}
                      />
                      {/* Info */}
                      <div className="flex-1 flex items-center justify-between px-4 py-2 bg-white border-t border-gray-100">
                        <span className="text-sm font-medium text-gray-800 w-16">{shade.label}</span>
                        <div className="flex gap-6 flex-1">
                          <span className="font-mono text-xs text-gray-700">{shade.hex}</span>
                          <span className="font-mono text-xs text-gray-500 hidden sm:block">
                            rgb({shade.rgb.r}, {shade.rgb.g}, {shade.rgb.b})
                          </span>
                          <span className="font-mono text-xs text-gray-400 hidden md:block">
                            hsl({hsl.h}, {shade.sVal}%, {shade.lVal}%)
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 ml-4">copy</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Tailwind Tab */}
          {tab === "tailwind" && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400">tailwind.config.js · extend.colors</span>
                <button
                  onClick={() => copyText(tailwindCode, "Tailwind config copied!")}
                  className="text-xs text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-white transition"
                >
                  Copy
                </button>
              </div>
              <pre className="font-mono text-xs text-gray-600 whitespace-pre-wrap break-all leading-relaxed">
                {tailwindCode}
              </pre>
            </div>
          )}

          {/* CSS Variables Tab */}
          {tab === "css" && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400">CSS custom properties</span>
                <button
                  onClick={() => copyText(cssCode, "CSS variables copied!")}
                  className="text-xs text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-white transition"
                >
                  Copy
                </button>
              </div>
              <pre className="font-mono text-xs text-gray-600 whitespace-pre-wrap break-all leading-relaxed">
                {cssCode}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg animate-fade-in z-50">
          {toast}
        </div>
      )}
    </div>
  );
}