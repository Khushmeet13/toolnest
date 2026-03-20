import { useState, useCallback } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2 9.5V2.5A.5.5 0 012.5 2H9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const RefreshIcon = ({ spinning }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={spinning ? "animate-spin" : ""}>
    <path d="M1.5 7A5.5 5.5 0 107 1.5a5.47 5.47 0 00-3.5 1.26" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M3.5 1L3.5 4L6.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2v7M4.5 6.5L7 9l2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 3.5h9M5 3.5V2.5A.5.5 0 015.5 2h2a.5.5 0 01.5.5v1M10 3.5l-.5 7a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5L3 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill={filled ? "currentColor" : "none"}>
    <path d="M6.5 1.5l1.3 2.6 2.9.4-2.1 2 .5 2.9-2.6-1.4-2.6 1.4.5-2.9-2.1-2 2.9-.4z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
  </svg>
);
const DiceIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1.5" y="1.5" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="4.5" cy="4.5" r="1" fill="currentColor" />
    <circle cx="7.5" cy="7.5" r="1" fill="currentColor" />
    <circle cx="10.5" cy="10.5" r="1" fill="currentColor" />
    <circle cx="10.5" cy="4.5" r="1" fill="currentColor" />
    <circle cx="4.5" cy="10.5" r="1" fill="currentColor" />
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────────
function generateNumbers({ min, max, count, unique, decimals, sorted }) {
  if (unique && count > max - min + 1) count = max - min + 1;

  const pool = [];
  const used = new Set();

  while (pool.length < count) {
    let raw = Math.random() * (max - min) + min;
    let num = decimals > 0 ? parseFloat(raw.toFixed(decimals)) : Math.floor(raw);
    if (unique) {
      if (used.has(num)) continue;
      used.add(num);
    }
    pool.push(num);
  }

  return sorted ? [...pool].sort((a, b) => a - b) : pool;
}

function getStats(nums) {
  if (!nums.length) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = sum / nums.length;
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    sum: parseFloat(sum.toFixed(4)),
    mean: parseFloat(mean.toFixed(4)),
    median: parseFloat(median.toFixed(4)),
  };
}

// number → pastel hue based on value range position
function numHue(num, min, max) {
  const ratio = max === min ? 0.5 : (num - min) / (max - min);
  return Math.round(ratio * 240); // blue (low) → red (high) via hue
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function RandomNumberGenerator() {
  const [min, setMin]         = useState(1);
  const [max, setMax]         = useState(100);
  const [count, setCount]     = useState(5);
  const [unique, setUnique]   = useState(false);
  const [decimals, setDecimals] = useState(0);
  const [sorted, setSorted]   = useState(false);

  const [numbers, setNumbers]   = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [copied, setCopied]     = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState("results");
  const [error, setError]       = useState("");

  const generate = useCallback(() => {
    setError("");
    if (isNaN(min) || isNaN(max) || isNaN(count)) return setError("Please enter valid numbers.");
    if (Number(min) >= Number(max)) return setError("Min must be less than Max.");
    if (Number(count) < 1 || Number(count) > 1000) return setError("Count must be between 1 and 1000.");

    setSpinning(true);
    setTimeout(() => setSpinning(false), 500);
    const result = generateNumbers({ min: Number(min), max: Number(max), count: Number(count), unique, decimals: Number(decimals), sorted });
    setNumbers(result);
    setGenerated(true);
    setActiveTab("results");
  }, [min, max, count, unique, decimals, sorted]);

  const copyNum = (num, idx) => {
    navigator.clipboard.writeText(String(num));
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(numbers.join(", "));
    setCopied("all");
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleFav = (num) => {
    setFavorites(prev => prev.includes(num) ? prev.filter(f => f !== num) : [...prev, num]);
  };

  const downloadTxt = () => {
    const blob = new Blob([numbers.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "numbers.txt";
    a.click();
  };

  const stats = getStats(numbers);
  const countOptions = [1, 5, 10, 20, 50];
  const decimalOptions = [0, 1, 2, 3];

  const cardCls = "bg-white border border-neutral-200 rounded-xl p-7 shadow-sm";

  const features = [
    { icon: "🎲", title: "True random",       desc: "Cryptographically seeded" },
    { icon: "🔢", title: "Decimal support",   desc: "Up to 3 decimal places" },
    { icon: "🔀", title: "Unique mode",       desc: "No duplicate values" },
    { icon: "📊", title: "Live statistics",   desc: "Min, max, mean & more" },
  ];

  return (
    <div className=" bg-white text-neutral-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.22s ease forwards; }
        @keyframes popIn {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.06); }
          100% { transform: scale(1);    opacity: 1; }
        }
        .pop-in { animation: popIn 0.3s ease forwards; }
      `}</style>

     

      {/* ── Hero ── */}
      <div className="max-w-lg mx-auto text-center pt-14 pb-8 px-6">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-cyan-500 bg-cyan-50 px-3 py-1.5 rounded-full mb-5 tracking-wide">
          🎲 Random Number Generator
        </span>
        <h1 className="text-[42px] font-medium tracking-[-1.5px] leading-[1.1] text-neutral-950 mb-3.5">
          Generate <span className="text-cyan-600">numbers</span> <br />on demand
        </h1>
        <p className="text-[15px] text-neutral-400 leading-relaxed">
          Instantly generate random numbers with full control over range, count, decimals, and uniqueness.
        </p>
      </div>

      {/* ── Main Grid ── */}
      <div className="max-w-[820px] mx-auto px-5 pb-16">
        <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "320px 1fr" }}>

          {/* ── Controls Card ── */}
          <div className={cardCls}>

            {/* Min / Max */}
            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-2.5">Range</label>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <label className="block text-[11px] text-neutral-400 mb-1 font-medium">Min</label>
                  <input
                    type="number"
                    value={min}
                    onChange={e => setMin(e.target.value)}
                    className="w-full text-[14px] font-semibold px-3 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                  />
                </div>
                <span className="text-neutral-300 mt-5 font-bold">→</span>
                <div className="flex-1">
                  <label className="block text-[11px] text-neutral-400 mb-1 font-medium">Max</label>
                  <input
                    type="number"
                    value={max}
                    onChange={e => setMax(e.target.value)}
                    className="w-full text-[14px] font-semibold px-3 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Count */}
            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-2.5">Count</label>
              <div className="flex gap-1.5 flex-wrap">
                {countOptions.map(n => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={[
                      "px-3.5 py-2 rounded-lg border text-[13px] font-semibold transition-all duration-150",
                      count === n
                        ? "bg-cyan-600 border-cyan-600 text-white"
                        : "bg-transparent border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50",
                    ].join(" ")}
                  >{n}</button>
                ))}
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={count}
                  onChange={e => setCount(e.target.value)}
                  placeholder="Custom"
                  className="w-20 text-[13px] font-semibold px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Decimal Places */}
            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-2.5">Decimal Places</label>
              <div className="flex gap-1.5">
                {decimalOptions.map(d => (
                  <button
                    key={d}
                    onClick={() => setDecimals(d)}
                    className={[
                      "w-10 h-10 rounded-lg border text-[13px] font-semibold flex items-center justify-center transition-all duration-150",
                      decimals === d
                        ? "bg-cyan-600 border-cyan-600 text-white"
                        : "bg-transparent border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50",
                    ].join(" ")}
                  >{d}</button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="mb-5 space-y-3">
              {[
                { label: "Unique numbers only", desc: "No duplicates in results", val: unique, set: setUnique },
                { label: "Sort results",         desc: "Ascending order",          val: sorted, set: setSorted },
              ].map(t => (
                <div key={t.label} className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div>
                    <div className="text-[13px] font-semibold text-neutral-800">{t.label}</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">{t.desc}</div>
                  </div>
                  <button
                    onClick={() => t.set(v => !v)}
                    className={[
                      "w-10 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0",
                      t.val ? "bg-cyan-600" : "bg-neutral-200",
                    ].join(" ")}
                  >
                    <span className={[
                      "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200",
                      t.val ? "left-5" : "left-1",
                    ].join(" ")} />
                  </button>
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-rose-50 border border-rose-100 text-[12px] font-semibold text-rose-500">
                ⚠ {error}
              </div>
            )}

            {/* CTA */}
            <button
              onClick={generate}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-600 text-white text-[14px] font-bold tracking-tight hover:bg-cyan-700 active:scale-[0.99] transition-all duration-150"
            >
              <RefreshIcon spinning={spinning} />
              Generate Numbers
            </button>

            {/* Stats */}
            {generated && stats && (
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {[
                  { label: "Sum",    val: stats.sum },
                  { label: "Mean",   val: stats.mean },
                  { label: "Median", val: stats.median },
                  { label: "Range",  val: `${stats.min} – ${stats.max}` },
                ].map(s => (
                  <div key={s.label} className="bg-neutral-50 rounded-xl p-3">
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">{s.label}</div>
                    <div className="text-[16px] font-black tracking-tight text-neutral-900 mt-0.5 truncate">{s.val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Results Card ── */}
          <div className={cardCls}>

            {/* Tabs */}
            <div className="flex border-b border-neutral-100 mb-5">
              {[
                { key: "results",   label: `Results${numbers.length > 0 ? ` (${numbers.length})` : ""}` },
                { key: "favorites", label: `Favorites${favorites.length > 0 ? ` (${favorites.length})` : ""}` },
                { key: "stats",     label: "Statistics" },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={[
                    "text-[13px] font-semibold px-4 py-2.5 -mb-px border-b-2 transition-all duration-150",
                    activeTab === t.key
                      ? "text-cyan-600 border-cyan-600"
                      : "text-neutral-300 border-transparent hover:text-neutral-500",
                  ].join(" ")}
                >{t.label}</button>
              ))}
            </div>

            {/* ── Results Tab ── */}
            {activeTab === "results" && (
              <>
                {numbers.length > 0 && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {[
                      { label: copied === "all" ? "Copied!" : "Copy All", icon: copied === "all" ? <CheckIcon /> : <CopyIcon />, onClick: copyAll },
                      { label: "Download .txt", icon: <DownloadIcon />, onClick: downloadTxt },
                      { label: "Regenerate",    icon: <RefreshIcon spinning={false} />, onClick: generate },
                    ].map(btn => (
                      <button key={btn.label} onClick={btn.onClick}
                        className="flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 transition-colors">
                        {btn.icon}{btn.label}
                      </button>
                    ))}
                  </div>
                )}

                {numbers.length === 0 ? (
                  <div className="text-center py-16 px-5">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-300">
                      <DiceIcon />
                    </div>
                    <p className="text-[14px] text-neutral-300">
                      Set your range and click{" "}
                      <strong className="text-neutral-400 font-semibold">Generate Numbers</strong>
                    </p>
                  </div>
                ) : (
                  /* Grid of number chips */
                  <div className="flex flex-wrap gap-2">
                    {numbers.map((num, i) => {
                      const hue = numHue(num, stats.min, stats.max);
                      const isFav = favorites.includes(num);
                      return (
                        <div
                          key={i}
                          className="pop-in group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-150 cursor-default select-none"
                          style={{
                            animationDelay: `${i * 0.03}s`,
                            background: `hsl(${hue},70%,95%)`,
                            borderColor: `hsl(${hue},50%,88%)`,
                          }}
                        >
                          <span
                            className="text-[15px] font-bold tracking-tight"
                            style={{ color: `hsl(${hue},55%,30%)` }}
                          >{num}</span>

                          {/* Hover actions */}
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-1">
                            <button
                              onClick={() => toggleFav(num)}
                              className={["w-5 h-5 rounded flex items-center justify-center transition-colors",
                                isFav ? "text-amber-400" : "text-neutral-400 hover:text-amber-400",
                              ].join(" ")}
                            ><StarIcon filled={isFav} /></button>
                            <button
                              onClick={() => copyNum(num, i)}
                              className={["w-5 h-5 rounded flex items-center justify-center transition-colors",
                                copied === i ? "text-green-500" : "text-neutral-400 hover:text-neutral-700",
                              ].join(" ")}
                            >{copied === i ? <CheckIcon /> : <CopyIcon />}</button>
                            <button
                              onClick={() => setNumbers(prev => prev.filter((_, idx) => idx !== i))}
                              className="w-5 h-5 rounded flex items-center justify-center text-neutral-300 hover:text-rose-400 transition-colors"
                            ><TrashIcon /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ── Favorites Tab ── */}
            {activeTab === "favorites" && (
              <>
                {favorites.length === 0 ? (
                  <div className="text-center py-16 px-5">
                    <div className="text-4xl opacity-20 mb-3">★</div>
                    <p className="text-[14px] text-neutral-300">Hover a number and click ★ to save it here</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {favorites.map((num, i) => (
                      <div
                        key={i}
                        className="fade-up group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-100 bg-amber-50 transition-all duration-150"
                        style={{ animationDelay: `${i * 0.04}s` }}
                      >
                        <span className="text-[15px] font-bold tracking-tight text-amber-700">{num}</span>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button
                            onClick={() => { navigator.clipboard.writeText(String(num)); setCopied(`fav-${i}`); setTimeout(() => setCopied(null), 2000); }}
                            className={["w-5 h-5 rounded flex items-center justify-center transition-colors",
                              copied === `fav-${i}` ? "text-green-500" : "text-neutral-400 hover:text-neutral-700",
                            ].join(" ")}
                          >{copied === `fav-${i}` ? <CheckIcon /> : <CopyIcon />}</button>
                          <button
                            onClick={() => setFavorites(prev => prev.filter(f => f !== num))}
                            className="w-5 h-5 rounded flex items-center justify-center text-neutral-300 hover:text-rose-400 transition-colors"
                          ><TrashIcon /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Stats Tab ── */}
            {activeTab === "stats" && (
              <>
                {!generated || !stats ? (
                  <div className="text-center py-16 px-5">
                    <div className="text-4xl opacity-20 mb-3">📊</div>
                    <p className="text-[14px] text-neutral-300">Generate numbers to see statistics</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      { label: "Count",             val: numbers.length, desc: "Total numbers generated" },
                      { label: "Minimum",           val: stats.min,      desc: "Smallest value in set" },
                      { label: "Maximum",           val: stats.max,      desc: "Largest value in set" },
                      { label: "Sum",               val: stats.sum,      desc: "Total of all values" },
                      { label: "Arithmetic Mean",   val: stats.mean,     desc: "Average of all values" },
                      { label: "Median",            val: stats.median,   desc: "Middle value when sorted" },
                      { label: "Range",             val: stats.max - stats.min, desc: "Difference between max and min" },
                    ].map((s, i) => (
                      <div
                        key={s.label}
                        className="fade-up flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-100"
                        style={{ animationDelay: `${i * 0.04}s` }}
                      >
                        <div>
                          <div className="text-[13px] font-semibold text-neutral-800">{s.label}</div>
                          <div className="text-[11px] text-neutral-400 mt-0.5">{s.desc}</div>
                        </div>
                        <div className="text-[18px] font-black tracking-tight text-neutral-900">{s.val}</div>
                      </div>
                    ))}

                    {/* Distribution bar */}
                    <div className="mt-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                      <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-3">Distribution preview</div>
                      <div className="flex gap-1 items-end h-16">
                        {(() => {
                          const bucketCount = Math.min(numbers.length, 10);
                          const range = stats.max - stats.min || 1;
                          const buckets = Array(bucketCount).fill(0);
                          numbers.forEach(n => {
                            const idx = Math.min(Math.floor(((n - stats.min) / range) * bucketCount), bucketCount - 1);
                            buckets[idx]++;
                          });
                          const maxB = Math.max(...buckets, 1);
                          return buckets.map((b, i) => {
                            const hue = Math.round((i / bucketCount) * 240);
                            return (
                              <div key={i} className="flex-1 rounded-t-md transition-all duration-300" style={{
                                height: `${(b / maxB) * 100}%`,
                                background: `hsl(${hue},65%,72%)`,
                                minHeight: b > 0 ? "4px" : "0",
                              }} title={`${b} number(s)`} />
                            );
                          });
                        })()}
                      </div>
                      <div className="flex justify-between mt-1.5 text-[10px] text-neutral-400 font-medium">
                        <span>{stats.min}</span><span>{stats.max}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>


      </div>

    </div>
  );
}