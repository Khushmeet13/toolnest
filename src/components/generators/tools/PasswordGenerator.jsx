import { useState, useCallback } from "react";

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function getStrength(password, options) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 12) score++;
  if (password.length >= 20) score++;
  if (options.uppercase) score++;
  if (options.numbers) score++;
  if (options.symbols) score++;
  return Math.min(score, 4);
}

const strengthConfig = [
  { label: "Too Weak", color: "text-red-400", bar: "bg-red-400", count: 1 },
  { label: "Weak", color: "text-orange-400", bar: "bg-orange-400", count: 2 },
  { label: "Fair", color: "text-yellow-400", bar: "bg-yellow-400", count: 3 },
  { label: "Strong", color: "text-teal-400", bar: "bg-teal-400", count: 4 },
  { label: "Very Strong", color: "text-green-500", bar: "bg-green-500", count: 5 },
];

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: false });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [history, setHistory] = useState([]);

  const generate = useCallback(() => {
    let chars = "";
    Object.entries(options).forEach(([key, val]) => { if (val) chars += CHAR_SETS[key]; });
    if (!chars) return;
    let pwd = "";
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    for (let i = 0; i < length; i++) pwd += chars[arr[i] % chars.length];
    setPassword(pwd);
    setGenerated(true);
    setCopied(false);
    setHistory((prev) => [pwd, ...prev.slice(0, 4)]);
  }, [length, options]);

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = getStrength(password, options);
  const sc = strengthConfig[strength];

  const toggleOption = (key) => {
    const next = { ...options, [key]: !options[key] };
    if (!Object.values(next).some(Boolean)) return;
    setOptions(next);
  };

  const optionList = [
    { key: "uppercase", label: "Uppercase", example: "A–Z" },
    { key: "lowercase", label: "Lowercase", example: "a–z" },
    { key: "numbers", label: "Numbers", example: "0–9" },
    { key: "symbols", label: "Symbols", example: "!@#$" },
  ];

  const pct = ((length - 4) / (64 - 4)) * 100;

  return (
    <div className=" bg-white flex items-center justify-center py-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <style>{`
        .pw-range { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 100px;
          background: linear-gradient(to right, #111 ${pct}%, #e0e0da ${pct}%); outline: none; cursor: pointer; }
        .pw-range::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
          background: #fff; border: 2px solid #111; box-shadow: 0 2px 6px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.1s; }
        .pw-range::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .pw-range::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 2px solid #111;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12); cursor: pointer; }
      `}</style>

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-medium text-stone-900 mb-1.5 tracking-tight">Password <span className="text-cyan-600">Generator</span> </h1>
          <p className="text-sm text-stone-400 font-light">Cryptographically secure. Zero logging.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-lg shadow-cyan-50 overflow-hidden">

          {/* Password Output */}
          <div className="px-6 pt-6 pb-5 border-b border-stone-100">
            <div className="bg-stone-50 rounded-lg border border-stone-200 p-2.5 flex items-center gap-3">
              <span
                className={`flex-1 text-sm leading-relaxed break-all tracking-wide ${password ? "text-stone-800 font-medium" : "text-stone-300 font-normal"}`}
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {password || "Click generate to create password"}
              </span>
              <button
                onClick={copy}
                disabled={!password}
                className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-medium border transition-all duration-150
                  ${!password ? "cursor-not-allowed text-stone-300 border-stone-200 bg-white" :
                    copied ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700 cursor-pointer"}`}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>

            {/* Strength */}
            {password && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-stone-400 uppercase tracking-widest">Strength</span>
                  <span className={`text-xs font-semibold ${sc.color}`}>{sc.label}</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= sc.count ? sc.bar : "bg-stone-150 "}`}
                      style={{ background: i <= sc.count ? undefined : "#ebebeb" }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Length Slider */}
          <div className="px-6 py-5 border-b border-stone-100">
            <div className="flex justify-between items-baseline mb-3.5">
              <label className="text-sm font-medium text-stone-600">Length</label>
              <div className="bg-stone-100 rounded-lg px-3 py-1 flex items-center gap-1">
                <span className="text-sm font-medium text-stone-900" style={{ fontFamily: "'DM Mono', monospace" }}>{length}</span>
                <span className="text-xs text-stone-400">chars</span>
              </div>
            </div>
            <input
              type="range"
              min={4}
              max={64}
              value={length}
              onChange={(e) => setLength(+e.target.value)}
              className="w-full accent-cyan-600 h-1.5"
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-stone-300" style={{ fontFamily: "'DM Mono', monospace" }}>4</span>
              <span className="text-xs text-stone-300" style={{ fontFamily: "'DM Mono', monospace" }}>64</span>
            </div>
          </div>

          {/* Character Sets */}
          <div className="px-6 py-5 border-b border-stone-100">
            <label className="text-sm font-medium text-stone-600 block mb-3">Character Sets</label>
            <div className="grid grid-cols-2 gap-2">
              {optionList.map(({ key, label, example }) => {
                const active = options[key];
                return (
                  <button
                    key={key}
                    onClick={() => toggleOption(key)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer
                      ${active ? "border-stone-300 bg-stone-50" : "border-stone-100 bg-white hover:border-stone-200"}`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border transition-all duration-150
                      ${active ? "bg-cyan-600 border-cyan-600" : "border-stone-300 bg-transparent"}`}>
                      {active && (
                        <svg width="9" height="7" viewBox="0 0 10 7" fill="none">
                          <path d="M1 3.5L3.8 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-medium leading-tight ${active ? "text-stone-800" : "text-stone-400"}`}>{label}</div>
                      <div className="text-xs text-stone-300 mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>{example}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <div className="px-6 py-5">
            <button
              onClick={generate}
              className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-600/80 active:bg-stone-800 text-white rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 cursor-pointer"
            >
              {generated ? "↺ Regenerate Password" : "⚡ Generate Password"}
            </button>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-4 bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-stone-100 flex justify-between items-center">
              <span className="text-xs font-medium text-stone-400 uppercase tracking-widest">Recent</span>
              <button onClick={() => setHistory([])} className="text-xs text-stone-500 hover:text-stone-500 transition-colors bg-transparent border-none cursor-pointer">
                Clear
              </button>
            </div>
            {history.map((pw, i) => (
              <div key={i} className={`px-5 py-2.5 flex items-center justify-between ${i < history.length - 1 ? "border-b border-stone-50" : ""}`}>
                <span
                  className={`text-xs flex-1 overflow-hidden text-ellipsis whitespace-nowrap mr-3 ${i === 0 ? "text-stone-500" : "text-stone-300"}`}
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {pw}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(pw)}
                  className="text-xs text-stone-400 hover:text-stone-500 transition-colors bg-transparent border-none cursor-pointer shrink-0"
                >
                  copy
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}