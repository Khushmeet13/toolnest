import { useState, useCallback } from "react";

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15);
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const FORMATS = ["Standard", "Uppercase", "No Dashes", "Braces", "URN"];

function formatUUID(uuid, fmt) {
  switch (fmt) {
    case "Uppercase": return uuid.toUpperCase();
    case "No Dashes": return uuid.replace(/-/g, "");
    case "Braces": return `{${uuid.toUpperCase()}}`;
    case "URN": return `urn:uuid:${uuid}`;
    default: return uuid;
  }
}

const SEG_COLORS = [
  "text-emerald-400",
  "text-sky-400",
  "text-violet-400",
  "text-amber-400",
  "text-rose-400",
];

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState("Standard");
  const [copied, setCopied] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const generate = useCallback(() => {
    const newUUIDs = Array.from({ length: count }, () => generateUUID());
    setUuids(newUUIDs);
    setAnimKey((k) => k + 1);
    setCopied(null);
  }, [count]);

  const copyOne = (uuid, idx) => {
    navigator.clipboard.writeText(formatUUID(uuid, format));
    setCopied(idx);
    setTimeout(() => setCopied(null), 1800);
  };

  const copyAll = () => {
    const all = uuids.map((u) => formatUUID(u, format)).join("\n");
    navigator.clipboard.writeText(all);
    setCopied("all");
    setTimeout(() => setCopied(null), 1800);
  };

  const renderSegmented = (uuid) => {
    const parts = uuid.split("-");
    return (
      <span>
        {parts.map((part, i) => (
          <span key={i}>
            <span className={SEG_COLORS[i]}>{part}</span>
            {i < parts.length - 1 && <span className="text-zinc-600">-</span>}
          </span>
        ))}
      </span>
    );
  };

  const renderFormatted = (uuid) => {
    const f = formatUUID(uuid, format);
    if (format === "Standard") return renderSegmented(uuid);
    if (format === "Uppercase") {
      const parts = uuid.toUpperCase().split("-");
      return (
        <span>
          {parts.map((p, i) => (
            <span key={i}>
              <span className={SEG_COLORS[i]}>{p}</span>
              {i < parts.length - 1 && <span className="text-zinc-600">-</span>}
            </span>
          ))}
        </span>
      );
    }
    return <span className="text-emerald-400">{f}</span>;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden "
    >
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .uuid-row { animation: fadeSlideIn 0.25s ease both; }
        .gen-btn:hover { background: #22c55e !important; color: #000 !important; }
        .gen-btn:active { transform: scale(0.98); }
        .gen-btn { transition: all 0.15s ease; }
        .fmt-btn { transition: all 0.15s ease; }
        .copy-btn:hover { border-color: #3f3f46 !important; color: #a1a1aa !important; }
        .copy-btn { transition: all 0.12s ease; }
      `}</style>

      {/* Glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "15%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "300px",
          background: "radial-gradient(ellipse, rgba(34,197,94,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="w-full max-w-2xl relative z-10">

        {/* Header */}
        <div className="mb-10">

          <h1
            className="text-4xl font-medium text-gray-900 mb-3 leading-none"

          >
            UUID
            <span className="text-cyan-600"> /</span>
            <br />
            Generator
          </h1>
          <p className="text-sm text-zinc-500 font-light leading-relaxed max-w-sm">
            Cryptographically random universally unique identifiers.<br />
            <span className="text-zinc-600">128-bit · collision-resistant · RFC compliant.</span>
          </p>
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Count Selector */}
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-900 rounded-xl px-4 py-2">
            <span className="text-xs text-white mr-1">Count</span>
            {[1, 5, 10, 25].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className="fmt-btn w-8 h-7 rounded-lg text-xs font-medium"
                style={{
                  background: count === n ? "#06b6d4" : "transparent", // cyan-400
                  color: count === n ? "#374151" : "#fff",
                  border: count === n ? "none" : "1px solid transparent",
                }}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Format Selector */}
          <div className="flex items-center gap-1 bg-gray-900 border border-zinc-800 rounded-xl px-3 py-2">
            {FORMATS.map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className="fmt-btn px-3 py-1 rounded-lg text-xs font-medium"
                style={{
                  background: format === f ? "#18181b" : "transparent",
                  color: format === f ? "#0891b2" : "#52525b",
                  border: format === f ? "1px solid #0891b2" : "1px solid transparent",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          className=" w-full py-4 rounded-xl text-sm font-medium tracking-widest uppercase mb-6 border border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white cursor-pointer"
        >
          ⟳ &nbsp; Generate {count > 1 ? `${count} UUIDs` : "UUID"}
        </button>

        {/* UUID Output */}
        {uuids.length > 0 && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
            {/* Terminal bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="text-xs text-zinc-600 ml-2">output.txt</span>
              </div>
              <button
                onClick={copyAll}
                className="copy-btn text-xs px-3 py-1 rounded-lg border text-zinc-500 border-zinc-700 cursor-pointer"
                style={{ background: "transparent" }}
              >
                {copied === "all" ? "✓ All copied" : `Copy all`}
              </button>
            </div>

            <div className="divide-y divide-zinc-900">
              {uuids.map((uuid, idx) => (
                <div
                  key={`${animKey}-${idx}`}
                  className="uuid-row flex items-center justify-between px-5 py-3.5 group"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="text-zinc-700 text-xs w-5 text-right shrink-0">{idx + 1}</span>
                    <code
                      className="text-sm leading-none tracking-wider truncate"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {renderFormatted(uuid)}
                    </code>
                  </div>
                  <button
                    onClick={() => copyOne(uuid, idx)}
                    className="copy-btn shrink-0 ml-4 text-xs px-3 py-1.5 rounded-lg border text-zinc-600 border-zinc-800 opacity-0 group-hover:opacity-100"
                    style={{ background: "transparent" }}
                  >
                    {copied === idx ? "✓" : "copy"}
                  </button>
                </div>
              ))}
            </div>

            {/* Segment legend */}
            <div className="px-5 py-3.5 border-t border-zinc-900 flex flex-wrap gap-x-5 gap-y-1.5">
              {[
                { label: "time_low", color: "text-emerald-400" },
                { label: "time_mid", color: "text-sky-400" },
                { label: "time_hi", color: "text-violet-400" },
                { label: "clock_seq", color: "text-amber-400" },
                { label: "node", color: "text-rose-400" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${color.replace("text-", "bg-")}`} />
                  <span className={`text-xs ${color} opacity-60`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {uuids.length === 0 && (
          <div className="border border-dashed border-zinc-800 rounded-2xl py-16 flex flex-col items-center justify-center gap-3">
            <div className="text-4xl opacity-20">⬡</div>
            <p className="text-xs text-zinc-600 tracking-widest uppercase">Awaiting generation</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {[
              { label: "8", desc: "time_low" },
              { label: "4", desc: "time_mid" },
              { label: "4", desc: "time_hi" },
              { label: "4", desc: "clock" },
              { label: "12", desc: "node" },
            ].map(({ label, desc }, i) => (
              <div key={i} className="text-center">
                <div className="text-xs font-bold text-zinc-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
                <div className="text-xs text-zinc-700">{desc}</div>
              </div>
            ))}
          </div>
          <span className="text-xs text-zinc-700">128 bits total</span>
        </div>

      </div>
    </div>
  );
}