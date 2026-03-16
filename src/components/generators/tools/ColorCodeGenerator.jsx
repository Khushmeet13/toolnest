import { useState, useCallback } from "react";

// ─── Color Parsing ───────────────────────────────────────────────────────────
function parseColor(str) {
  str = str.trim();
  if (!str) return null;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillStyle = str;
  // If the style didn't change from transparent and input isn't "transparent"
  if (
    ctx.fillStyle === "rgba(0, 0, 0, 0)" &&
    str.toLowerCase() !== "transparent"
  ) {
    // Try once more with a black base to detect silent failures
    ctx.fillStyle = "#000";
    ctx.fillStyle = str;
    if (
      ctx.fillStyle === "#000000" &&
      !["black", "#000", "#000000"].includes(str.toLowerCase())
    )
      return null;
  }
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return { r: d[0], g: d[1], b: d[2], a: +(d[3] / 255).toFixed(3) };
}

function toHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
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

function rgbToHwb(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const hRaw =
    max === min ? 0
    : max === r ? ((g - b) / d) % 6
    : max === g ? (b - r) / d + 2
    : (r - g) / d + 4;
  return {
    h: Math.round(((hRaw * 60) + 360) % 360),
    w: Math.round(min * 100),
    b: Math.round((1 - max) * 100),
  };
}

function formatColor(r, g, b, a, fmt) {
  const { h, s, l } = rgbToHsl(r, g, b);
  const hw = rgbToHwb(r, g, b);
  switch (fmt) {
    case "hex":  return toHex(r, g, b);
    case "rgb":  return `rgb(${r}, ${g}, ${b})`;
    case "rgba": return `rgba(${r}, ${g}, ${b}, ${a})`;
    case "hsl":  return `hsl(${h}, ${s}%, ${l}%)`;
    case "hsla": return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    case "hwb":  return `hwb(${hw.h} ${hw.w}% ${hw.b}%)`;
    default:     return toHex(r, g, b);
  }
}

const ALL_FORMATS = ["hex", "rgb", "rgba", "hsl", "hsla", "hwb"];

const SWATCHES = [
  "#E24B4A", "#EF9F27", "#97C459", "#1D9E75",
  "#378ADD", "#7F77DD", "#D4537E", "#D85A30",
  "#888780", "#F0E6FF",
];

function luminance(r, g, b) { return 0.299 * r + 0.587 * g + 0.114 * b; }

// ─── Component ───────────────────────────────────────────────────────────────
export default function ColorCodeGenerator() {
  const [inputVal, setInputVal] = useState("#7F77DD");
  const [rgb, setRgb] = useState({ r: 127, g: 119, b: 221, a: 1 });
  const [activeFmt, setActiveFmt] = useState("hex");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null); // key of copied item

  const processColor = useCallback((val) => {
    setInputVal(val);
    const parsed = parseColor(val);
    if (!parsed) {
      setError("Invalid color — try #hex, rgb(), hsl(), or a named color");
      return;
    }
    setError("");
    setRgb(parsed);
  }, []);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1300);
    });
  };

  const bgColor = error ? "transparent" : inputVal;
  const textColor =
    !error && rgb ? (luminance(rgb.r, rgb.g, rgb.b) > 140 ? "#1a1a1a" : "#ffffff") : "#888";

  const result = rgb ? formatColor(rgb.r, rgb.g, rgb.b, rgb.a, activeFmt) : "";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-medium text-gray-900 mb-1">Color Converter</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter any CSS color — convert it to HEX, RGB, HSL, HWB and more.
        </p>

        {/* Preview Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
          {/* Color Preview */}
          <div
            className="w-full h-24 rounded-xl mb-4 flex items-center justify-center transition-colors duration-300"
            style={{ background: error ? "#f3f4f6" : bgColor }}
          >
            <span
              className="text-sm font-medium tracking-wide"
              style={{ color: textColor }}
            >
              {error ? "Invalid" : toHex(rgb.r, rgb.g, rgb.b)}
            </span>
          </div>

          {/* Input Row */}
          <div className="flex gap-3 items-end mb-1">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1.5">
                CSS color value
              </label>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => processColor(e.target.value)}
                placeholder="e.g. #7F77DD · rgb(100,200,50) · hsl(200,80%,50%)"
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">Pick</label>
              <input
                type="color"
                value={error ? "#000000" : toHex(rgb.r, rgb.g, rgb.b)}
                onChange={(e) => processColor(e.target.value)}
                className="h-9 w-11 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

          {/* Swatches */}
          <div className="mt-4">
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

        {/* Format Selector + Result */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-3">Select output format</p>
          <div className="grid grid-cols-3 gap-2 mb-4 sm:grid-cols-6">
            {ALL_FORMATS.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setActiveFmt(fmt)}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                  activeFmt === fmt
                    ? "border-violet-400 text-violet-600 bg-violet-50"
                    : "border-gray-200 text-gray-600 bg-gray-50 hover:bg-white hover:border-gray-300"
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Result */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <span className="font-mono text-base font-medium text-gray-800 break-all">
              {result || "—"}
            </span>
            <button
              onClick={() => handleCopy(result, "main")}
              disabled={!result}
              className="text-xs text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-white hover:text-gray-800 transition whitespace-nowrap disabled:opacity-40"
            >
              {copied === "main" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* All Formats */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 mb-3">All formats</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALL_FORMATS.map((fmt) => {
              const val = rgb ? formatColor(rgb.r, rgb.g, rgb.b, rgb.a, fmt) : "—";
              return (
                <div
                  key={fmt}
                  className="bg-gray-50 rounded-xl px-4 py-3"
                >
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    {fmt}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-gray-800 break-all">
                      {val}
                    </span>
                    <button
                      onClick={() => handleCopy(val, fmt)}
                      className="text-[11px] text-gray-400 hover:text-gray-700 transition whitespace-nowrap"
                    >
                      {copied === fmt ? "✓" : "copy"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}