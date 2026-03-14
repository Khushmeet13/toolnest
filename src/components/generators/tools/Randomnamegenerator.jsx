import { useState, useCallback } from "react";

const firstNames = {
  any: ["Aiden","Blake","Cameron","Devon","Emery","Finley","Gray","Harper","Indigo","Jordan","Kendall","Logan","Morgan","Nova","Oakley","Parker","Quinn","Reese","Sage","Taylor","Uriel","Vale","Winter","Xen","Yael","Zephyr"],
  male: ["Alexander","Benjamin","Charles","Daniel","Ethan","Felix","George","Henry","Isaac","James","Kevin","Liam","Marcus","Nathan","Oliver","Patrick","Quentin","Ryan","Samuel","Thomas","Umar","Victor","William","Xavier","Zachary","Adrian"],
  female: ["Amelia","Beatrice","Clara","Diana","Eleanor","Florence","Grace","Hannah","Isabella","Julia","Katherine","Luna","Mia","Nora","Olivia","Penelope","Quinn","Rose","Sophia","Tessa","Uma","Vivienne","Wren","Xara","Yasmine","Zoe"],
};

const lastNames = ["Anderson","Brooks","Carter","Davis","Evans","Fletcher","Garcia","Hayes","Irving","Jensen","Klein","Lewis","Morgan","Nash","Owens","Pierce","Quinn","Rivera","Stone","Turner","Upton","Vance","Walsh","Xavier","Young","Zhang","Alvarez","Bennett","Collins","Dawson"];

const origins = {
  western:  { first: ["James","Oliver","William","Emma","Charlotte","Amelia","Liam","Noah","Elijah","Ava"],        last: ["Anderson","Thompson","Wilson","Johnson","Williams","Brown","Jones","Miller","Davis"] },
  nordic:   { first: ["Bjorn","Sigrid","Leif","Astrid","Erik","Freya","Gunnar","Helga","Ivar","Ingrid"],           last: ["Eriksson","Andersen","Magnusson","Karlsson","Lindgren","Johansson","Berg","Strand"] },
  japanese: { first: ["Hiroshi","Yuki","Kenji","Sakura","Takeshi","Aiko","Riku","Hana","Sora","Nao"],              last: ["Tanaka","Yamamoto","Nakamura","Ito","Kobayashi","Kato","Suzuki","Sato","Watanabe"] },
  latin:    { first: ["Carlos","Lucia","Miguel","Sofia","Diego","Isabella","Rafael","Valentina","Mateo","Camila"], last: ["Garcia","Rodriguez","Martinez","Lopez","Hernandez","Gonzalez","Perez","Sanchez"] },
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function generateName({ gender, origin, count }) {
  return Array.from({ length: count }, () => {
    if (origin !== "any") {
      const pool = origins[origin];
      return { first: pick(pool.first), last: pick(pool.last) };
    }
    const firstPool = firstNames[gender] || firstNames.any;
    return { first: pick(firstPool), last: pick(lastNames) };
  });
}

const avatarHue = (name) => (name.charCodeAt(0) * 7) % 360;

// ── Icons ──────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M2 9.5V2.5A.5.5 0 012.5 2H9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const RefreshIcon = ({ spinning }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={spinning ? "animate-spin" : ""}>
    <path d="M1.5 7A5.5 5.5 0 107 1.5a5.47 5.47 0 00-3.5 1.26" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M3.5 1L3.5 4L6.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2v7M4.5 6.5L7 9l2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 3.5h9M5 3.5V2.5A.5.5 0 015.5 2h2a.5.5 0 01.5.5v1M10 3.5l-.5 7a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5L3 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const StarIcon = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill={filled ? "currentColor" : "none"}>
    <path d="M6.5 1.5l1.3 2.6 2.9.4-2.1 2 .5 2.9-2.6-1.4-2.6 1.4.5-2.9-2.1-2 2.9-.4z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
  </svg>
);

// ── Main ───────────────────────────────────────────────────────────────────────
export default function RandomNameGenerator() {
  const [gender, setGender]       = useState("any");
  const [origin, setOrigin]       = useState("any");
  const [count, setCount]         = useState(5);
  const [names, setNames]         = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [copied, setCopied]       = useState(null);
  const [spinning, setSpinning]   = useState(false);
  const [generated, setGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState("results");

  const generate = useCallback(() => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 500);
    setNames(generateName({ gender, origin, count }));
    setGenerated(true);
    setActiveTab("results");
  }, [gender, origin, count]);

  const copyName = (name, idx) => {
    navigator.clipboard.writeText(`${name.first} ${name.last}`);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(names.map(n => `${n.first} ${n.last}`).join("\n"));
    setCopied("all");
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleFav = (name) => {
    const full = `${name.first} ${name.last}`;
    setFavorites(prev => prev.includes(full) ? prev.filter(f => f !== full) : [...prev, full]);
  };

  const downloadTxt = () => {
    const blob = new Blob([names.map(n => `${n.first} ${n.last}`).join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "names.txt";
    a.click();
  };

  const genderOptions = [
    { value: "any",    label: "Any" },
    { value: "male",   label: "Male" },
    { value: "female", label: "Female" },
  ];

  const originOptions = [
    { value: "any",      label: "Any Origin" },
    { value: "western",  label: "Western" },
    { value: "nordic",   label: "Nordic" },
    { value: "japanese", label: "Japanese" },
    { value: "latin",    label: "Latin" },
  ];

  const countOptions = [1, 5, 10, 20];

  const features = [
    { icon: "⚡", title: "Instant generation", desc: "Names in milliseconds" },
    { icon: "🌍", title: "Multiple origins",   desc: "4 cultural backgrounds" },
    { icon: "★",  title: "Save favorites",     desc: "Star names you love" },
    { icon: "↓",  title: "Export as .txt",     desc: "Download your list" },
  ];

  // shared card shadow
  const cardCls = "bg-white border border-neutral-200 rounded-2xl p-7 shadow-sm";

  return (
    <div className="min-h-screen bg-white text-neutral-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.22s ease forwards; }
      `}</style>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-10 bg-white border-b border-neutral-100 h-14 px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center text-white text-xs font-black">
            T
          </span>
          <span className="font-bold text-[15px] tracking-tight">ToolNest</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600 tracking-wide">
            Free Tool
          </span>
          <button className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors">
            All Tools
          </button>
          <button className="text-[13px] font-bold px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-700 transition-colors">
            Get Pro
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="max-w-lg mx-auto text-center pt-14 pb-8 px-6">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full mb-5 tracking-wide">
          ✦ Random Name Generator
        </span>
        <h1 className="text-[42px] font-black tracking-[-1.5px] leading-[1.1] text-neutral-950 mb-3.5">
          Generate perfect<br />names instantly
        </h1>
        <p className="text-[15px] text-neutral-400 leading-relaxed">
          Create unique names for characters, projects, brands, or anything —
          filtered by gender and cultural origin.
        </p>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[780px] mx-auto px-5 pb-16">

        <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "300px 1fr" }}>

          {/* ── Controls ── */}
          <div className={cardCls}>

            {/* Gender */}
            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-2.5">
                Gender
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {genderOptions.map(o => (
                  <button
                    key={o.value}
                    onClick={() => setGender(o.value)}
                    className={[
                      "text-[13px] font-medium px-4 py-2 rounded-lg border transition-all duration-150",
                      gender === o.value
                        ? "bg-neutral-900 border-neutral-900 text-white"
                        : "bg-transparent border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50",
                    ].join(" ")}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Origin */}
            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-2.5">
                Cultural Origin
              </label>
              <div className="relative">
                <select
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  className="w-full text-[13px] font-medium px-3.5 py-2.5 pr-8 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800 appearance-none outline-none cursor-pointer hover:border-neutral-300 transition-colors"
                >
                  {originOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {/* chevron */}
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Count */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-2.5">
                Count
              </label>
              <div className="flex gap-2">
                {countOptions.map(n => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={[
                      "w-9 h-9 rounded-lg border text-[13px] font-semibold flex items-center justify-center transition-all duration-150",
                      count === n
                        ? "bg-neutral-900 border-neutral-900 text-white"
                        : "bg-transparent border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50",
                    ].join(" ")}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={generate}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-neutral-900 text-white text-[14px] font-bold tracking-tight hover:bg-neutral-700 active:scale-[0.99] transition-all duration-150"
            >
              <RefreshIcon spinning={spinning} />
              Generate Names
            </button>

            {/* Stats */}
            {generated && (
              <div className="flex gap-3 mt-4">
                {[
                  { val: names.length,     label: "Generated" },
                  { val: favorites.length, label: "Favorites" },
                ].map(s => (
                  <div key={s.label} className="flex-1 bg-neutral-50 rounded-xl p-3.5">
                    <div className="text-[22px] font-black tracking-tight text-neutral-900">{s.val}</div>
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Results ── */}
          <div className={cardCls}>

            {/* Tabs */}
            <div className="flex border-b border-neutral-100 mb-5">
              {[
                { key: "results",   label: `Results${names.length     > 0 ? ` (${names.length})`     : ""}` },
                { key: "favorites", label: `Favorites${favorites.length > 0 ? ` (${favorites.length})` : ""}` },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={[
                    "text-[13px] font-semibold px-4 py-2.5 -mb-px border-b-2 transition-all duration-150",
                    activeTab === t.key
                      ? "text-neutral-900 border-neutral-900"
                      : "text-neutral-300 border-transparent hover:text-neutral-500",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Results Tab ── */}
            {activeTab === "results" && (
              <>
                {/* Action buttons */}
                {names.length > 0 && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {[
                      { label: copied === "all" ? "Copied!" : "Copy All", icon: copied === "all" ? <CheckIcon /> : <CopyIcon />, onClick: copyAll },
                      { label: "Download .txt", icon: <DownloadIcon />, onClick: downloadTxt },
                      { label: "Regenerate",    icon: <RefreshIcon spinning={false} />, onClick: generate },
                    ].map(btn => (
                      <button
                        key={btn.label}
                        onClick={btn.onClick}
                        className="flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 transition-colors"
                      >
                        {btn.icon}
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Empty */}
                {names.length === 0 && (
                  <div className="text-center py-12 px-5">
                    <div className="text-4xl opacity-25 mb-3">✦</div>
                    <p className="text-[14px] text-neutral-300">
                      Configure your options and click{" "}
                      <strong className="text-neutral-400 font-semibold">Generate Names</strong>{" "}
                      to get started
                    </p>
                  </div>
                )}

                {/* Name rows */}
                {names.map((name, i) => {
                  const hue   = avatarHue(name.first);
                  const isFav = favorites.includes(`${name.first} ${name.last}`);
                  return (
                    <div
                      key={i}
                      className="fade-up flex items-center justify-between px-4 py-3 rounded-xl border border-neutral-100 bg-neutral-50 mb-2 hover:bg-neutral-100 hover:border-neutral-200 transition-all duration-150 group"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      {/* Left: avatar + name */}
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                          style={{ background: `hsl(${hue},60%,93%)`, color: `hsl(${hue},50%,33%)` }}
                        >
                          {name.first[0]}{name.last[0]}
                        </span>
                        <span className="text-[15px] font-semibold text-neutral-900 tracking-tight">
                          {name.first} {name.last}
                        </span>
                      </div>

                      {/* Right: action icons — visible on hover */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        {/* Star */}
                        <button
                          onClick={() => toggleFav(name)}
                          title="Favorite"
                          className={[
                            "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                            isFav
                              ? "text-amber-400 hover:text-amber-500"
                              : "text-neutral-300 hover:text-neutral-600 hover:bg-neutral-200",
                          ].join(" ")}
                        >
                          <StarIcon filled={isFav} />
                        </button>

                        {/* Copy */}
                        <button
                          onClick={() => copyName(name, i)}
                          title="Copy"
                          className={[
                            "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                            copied === i
                              ? "text-green-500"
                              : "text-neutral-300 hover:text-neutral-600 hover:bg-neutral-200",
                          ].join(" ")}
                        >
                          {copied === i ? <CheckIcon /> : <CopyIcon />}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setNames(prev => prev.filter((_, idx) => idx !== i))}
                          title="Remove"
                          className="w-7 h-7 rounded-md flex items-center justify-center text-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* ── Favorites Tab ── */}
            {activeTab === "favorites" && (
              <>
                {favorites.length === 0 ? (
                  <div className="text-center py-12 px-5">
                    <div className="text-4xl opacity-20 mb-3">★</div>
                    <p className="text-[14px] text-neutral-300">
                      Star names from your results<br />to save them here
                    </p>
                  </div>
                ) : (
                  favorites.map((name, i) => (
                    <div
                      key={i}
                      className="fade-up flex items-center justify-between px-4 py-3 rounded-xl border border-neutral-100 bg-neutral-50 mb-2 hover:bg-neutral-100 hover:border-neutral-200 transition-all duration-150 group"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-[12px] font-bold text-amber-500 flex-shrink-0">
                          {name.split(" ").map(w => w[0]).join("")}
                        </span>
                        <span className="text-[15px] font-semibold text-neutral-900 tracking-tight">{name}</span>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(name);
                            setCopied(`fav-${i}`);
                            setTimeout(() => setCopied(null), 2000);
                          }}
                          className={[
                            "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                            copied === `fav-${i}`
                              ? "text-green-500"
                              : "text-neutral-300 hover:text-neutral-600 hover:bg-neutral-200",
                          ].join(" ")}
                        >
                          {copied === `fav-${i}` ? <CheckIcon /> : <CopyIcon />}
                        </button>
                        <button
                          onClick={() => setFavorites(prev => prev.filter(f => f !== name))}
                          className="w-7 h-7 rounded-md flex items-center justify-center text-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Feature Strip ── */}
        <div className="grid grid-cols-4 gap-3 mt-5">
          {features.map((f, i) => (
            <div key={i} className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="text-lg mb-1.5 leading-none">{f.icon}</div>
              <div className="text-[13px] font-bold text-neutral-800 mb-0.5">{f.title}</div>
              <div className="text-[12px] text-neutral-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-100 py-5 text-center text-[12px] text-neutral-300">
        ToolNest · Random Name Generator · Free forever · No signup required
      </footer>
    </div>
  );
}