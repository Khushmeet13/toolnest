import { useState, useCallback } from "react";

/* ─── data field types ──────────────────────────────────── */
const FIELD_TYPES = [
  { id: "fullName",    label: "Full Name",      icon: "👤", cat: "person"   },
  { id: "email",       label: "Email",          icon: "✉️",  cat: "person"   },
  { id: "phone",       label: "Phone",          icon: "📞", cat: "person"   },
  { id: "address",     label: "Address",        icon: "📍", cat: "location" },
  { id: "city",        label: "City",           icon: "🏙️",  cat: "location" },
  { id: "country",     label: "Country",        icon: "🌍", cat: "location" },
  { id: "company",     label: "Company",        icon: "🏢", cat: "business" },
  { id: "jobTitle",    label: "Job Title",      icon: "💼", cat: "business" },
  { id: "username",    label: "Username",       icon: "🔑", cat: "digital"  },
  { id: "password",    label: "Password",       icon: "🔒", cat: "digital"  },
  { id: "ipAddress",   label: "IP Address",     icon: "🌐", cat: "digital"  },
  { id: "creditCard",  label: "Credit Card",    icon: "💳", cat: "finance"  },
  { id: "price",       label: "Price",          icon: "💰", cat: "finance"  },
  { id: "date",        label: "Date",           icon: "📅", cat: "misc"     },
  { id: "uuid",        label: "UUID",           icon: "🔷", cat: "misc"     },
  { id: "loremText",   label: "Lorem Text",     icon: "📝", cat: "misc"     },
];

const CATEGORIES = ["person", "location", "business", "digital", "finance", "misc"];
const CAT_LABELS  = { person: "Person", location: "Location", business: "Business", digital: "Digital", finance: "Finance", misc: "Misc" };

const FORMATS   = ["JSON", "CSV", "SQL", "TSV"];
const ROW_OPTS  = [5, 10, 25, 50, 100];

/* ─── tiny checkbox pill ────────────────────────────────── */
function FieldPill({ field, selected, onToggle }) {
  return (
    <button
      onClick={() => onToggle(field.id)}
      className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all duration-150 cursor-pointer border
        ${selected
          ? "bg-emerald-400/[0.12] border-emerald-400/50 text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.12)]"
          : "bg-white/[0.03] border-white/[0.07] text-slate-500 hover:border-emerald-400/25 hover:text-slate-400"}`}>
      <span className={`w-3 h-3 rounded-sm border flex items-center justify-center shrink-0 transition-all duration-150
        ${selected ? "bg-emerald-400 border-emerald-400" : "border-slate-600 group-hover:border-slate-500"}`}>
        {selected && (
          <svg className="w-2 h-2 text-[#0a0f0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7"/>
          </svg>
        )}
      </span>
      <span className="text-[10px]">{field.icon}</span>
      {field.label}
    </button>
  );
}

/* ─── output table cell ─────────────────────────────────── */
function DataTable({ rows, fields }) {
  if (!rows.length) return null;
  const selectedFields = FIELD_TYPES.filter(f => fields.includes(f.id));
  return (
    <div className="overflow-x-auto rounded-xl border border-emerald-400/[0.15] bg-black/30">
      <table className="w-full text-[11px] font-mono">
        <thead>
          <tr className="border-b border-emerald-400/[0.15]">
            <th className="px-3 py-2 text-left text-emerald-600 font-bold tracking-widest uppercase text-[9px] w-10">#</th>
            {selectedFields.map(f => (
              <th key={f.id} className="px-3 py-2 text-left text-emerald-500 font-bold tracking-wider uppercase text-[9px] whitespace-nowrap">{f.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b border-white/[0.04] transition-colors ${i % 2 === 0 ? "bg-white/[0.01]" : ""} hover:bg-emerald-400/[0.04]`}>
              <td className="px-3 py-2 text-slate-700 select-none">{i + 1}</td>
              {selectedFields.map(f => (
                <td key={f.id} className="px-3 py-2 text-slate-300 whitespace-nowrap max-w-[180px] truncate">{row[f.id] ?? "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── MAIN ──────────────────────────────────────────────── */
export default function FakeDataGenerator() {
  const [selectedFields, setSelectedFields] = useState(["fullName", "email", "company", "jobTitle"]);
  const [rows,     setRows]     = useState(10);
  const [format,   setFormat]   = useState("JSON");
  const [locale,   setLocale]   = useState("en_US");
  const [loading,  setLoading]  = useState(false);
  const [data,     setData]     = useState(null);      // { rows: [...], raw: string }
  const [copied,   setCopied]   = useState(false);
  const [view,     setView]     = useState("table");   // table | raw
  const [filter,   setFilter]   = useState("all");

  const toggleField = useCallback((id) => {
    setSelectedFields(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }, []);

  const generate = async () => {
    if (!selectedFields.length) return;
    setLoading(true);
    setData(null);

    const fieldList = FIELD_TYPES.filter(f => selectedFields.includes(f.id)).map(f => f.label).join(", ");
    const prompt = `Generate ${rows} rows of realistic fake data. Each row must have these fields: ${fieldList}.
Locale: ${locale}.
Return ONLY a valid JSON array of objects. Each object must have keys: ${selectedFields.join(", ")}.
No explanation, no markdown, just the JSON array. Make the data varied and realistic.`;

    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, messages: [{ role: "user", content: prompt }] }),
      });
      const apiData  = await res.json();
      const raw  = apiData.content?.map(c => c.text || "").join("").trim();
      const cleaned  = raw.replace(/```json|```/g, "").trim();
      const parsed   = JSON.parse(cleaned);

      let formatted = "";
      if (format === "JSON") {
        formatted = JSON.stringify(parsed, null, 2);
      } else if (format === "CSV" || format === "TSV") {
        const sep = format === "CSV" ? "," : "\t";
        const headers = selectedFields.join(sep);
        const bodyRows = parsed.map(r => selectedFields.map(f => `"${(r[f] ?? "").toString().replace(/"/g, '""')}"`).join(sep));
        formatted = [headers, ...bodyRows].join("\n");
      } else if (format === "SQL") {
        const table = "fake_data";
        const cols  = selectedFields.join(", ");
        const inserts = parsed.map(r => {
          const vals = selectedFields.map(f => `'${(r[f] ?? "").toString().replace(/'/g, "''")}'`).join(", ");
          return `INSERT INTO ${table} (${cols}) VALUES (${vals});`;
        });
        formatted = inserts.join("\n");
      }

      setData({ rows: parsed, raw: formatted });
      setView("table");
    } catch {
      setData({ rows: [], raw: "// Error generating data. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (!data?.raw) return;
    navigator.clipboard.writeText(data.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    if (!data?.raw) return;
    const ext = { JSON: "json", CSV: "csv", SQL: "sql", TSV: "tsv" }[format];
    const blob = new Blob([data.raw], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `fake-data.${ext}`; a.click();
  };

  const filteredTypes = filter === "all"
    ? FIELD_TYPES
    : FIELD_TYPES.filter(f => f.cat === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scanline  { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
        @keyframes glitch1   { 0%,100%{clip-path:inset(0 0 98% 0)} 20%{clip-path:inset(20% 0 60% 0)} 40%{clip-path:inset(50% 0 30% 0)} 60%{clip-path:inset(80% 0 5% 0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        .fade-up     { animation: fadeUp .3s ease both }
        .cursor-blink{ animation: blink 1s step-end infinite }
        .scan        { animation: scanline 4s linear infinite; pointer-events:none }
        .spinner     { animation: spin .7s linear infinite }
        .mono        { font-family:'JetBrains Mono',monospace }
        .outfit      { font-family:'Outfit',sans-serif }
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(52,211,153,0.2);border-radius:4px}
      `}</style>

      {/* ╔═══════════════════ CARD ═══════════════════╗ */}
      <div className="outfit relative rounded-2xl overflow-hidden bg-[#080d09] border border-emerald-900/40 shadow-[0_0_0_1px_rgba(52,211,153,0.05),0_32px_80px_rgba(0,0,0,0.7)]">

        {/* scanline shimmer */}
        <div className="scan absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent z-0" />

        {/* grid dot bg */}
        <div className="absolute inset-0 z-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #34d399 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        {/* top neon bar */}
        <div className="relative z-10 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-70" />

        <div className="relative z-10 p-7">

          {/* ── HEADER ── */}
          <div className="flex items-start justify-between mb-7">
            <div>
              {/* terminal badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <div className="mono text-[10px] text-emerald-600 tracking-widest ml-1">~/toolnest/fake-data</div>
              </div>
              <h2 className="outfit text-[22px] font-bold text-slate-50 tracking-tight leading-tight">
                Fake Data <span className="text-emerald-400">Generator</span>
              </h2>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="mono text-[11px] text-slate-600">$ generate --rows={rows} --format={format}</span>
                <span className="w-[6px] h-[13px] bg-emerald-400/70 cursor-blink" />
              </div>
            </div>

            {/* status badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full mono text-[10px] font-semibold border
              ${loading
                ? "bg-yellow-400/[0.08] border-yellow-400/30 text-yellow-400"
                : data
                ? "bg-emerald-400/[0.08] border-emerald-400/30 text-emerald-400"
                : "bg-white/[0.04] border-white/[0.08] text-slate-600"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${loading ? "bg-yellow-400 spinner" : data ? "bg-emerald-400" : "bg-slate-600"}`} />
              {loading ? "RUNNING" : data ? `${data.rows.length} ROWS READY` : "IDLE"}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">

            {/* ── LEFT: CONFIG ── */}
            <div className="flex flex-col gap-5">

              {/* Field selector */}
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                {/* header bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
                  <span className="mono text-[10px] font-bold tracking-widest text-emerald-600 uppercase">Select Fields</span>
                  <div className="flex items-center gap-1.5">
                    <span className="mono text-[10px] text-slate-600">{selectedFields.length} selected</span>
                    <button onClick={() => setSelectedFields(FIELD_TYPES.map(f => f.id))}
                      className="mono text-[9px] px-2 py-0.5 rounded border border-emerald-900/50 text-emerald-700 hover:text-emerald-400 hover:border-emerald-700/50 transition-colors cursor-pointer bg-transparent">
                      ALL
                    </button>
                    <button onClick={() => setSelectedFields([])}
                      className="mono text-[9px] px-2 py-0.5 rounded border border-white/[0.06] text-slate-600 hover:text-slate-400 hover:border-white/[0.15] transition-colors cursor-pointer bg-transparent">
                      NONE
                    </button>
                  </div>
                </div>

                {/* category filter tabs */}
                <div className="flex overflow-x-auto gap-0 border-b border-white/[0.06]">
                  {["all", ...CATEGORIES].map(cat => (
                    <button key={cat} onClick={() => setFilter(cat)}
                      className={`shrink-0 px-3 py-2 mono text-[9px] font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer border-b-2 border-transparent
                        ${filter === cat
                          ? "text-emerald-400 border-b-emerald-400 bg-emerald-400/[0.06]"
                          : "text-slate-600 hover:text-slate-400"}`}>
                      {cat === "all" ? "ALL" : CAT_LABELS[cat]}
                    </button>
                  ))}
                </div>

                {/* pills grid */}
                <div className="p-4 flex flex-wrap gap-2">
                  {filteredTypes.map(field => (
                    <FieldPill key={field.id} field={field} selected={selectedFields.includes(field.id)} onToggle={toggleField} />
                  ))}
                </div>
              </div>

              {/* Row count */}
              <div>
                <label className="mono text-[10px] font-bold tracking-widest text-slate-600 uppercase block mb-2.5">Row Count</label>
                <div className="flex gap-2">
                  {ROW_OPTS.map(n => (
                    <button key={n} onClick={() => setRows(n)}
                      className={`flex-1 py-2 rounded-lg mono text-xs font-bold cursor-pointer transition-all duration-150 border
                        ${rows === n
                          ? "bg-emerald-400/[0.12] border-emerald-400/50 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.1)]"
                          : "bg-white/[0.03] border-white/[0.06] text-slate-600 hover:border-emerald-900/60 hover:text-slate-400"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format + Locale row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mono text-[10px] font-bold tracking-widest text-slate-600 uppercase block mb-2.5">Output Format</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {FORMATS.map(f => (
                      <button key={f} onClick={() => setFormat(f)}
                        className={`py-2 rounded-lg mono text-[10px] font-bold cursor-pointer transition-all duration-150 border
                          ${format === f
                            ? "bg-emerald-400/[0.12] border-emerald-400/50 text-emerald-400"
                            : "bg-white/[0.03] border-white/[0.06] text-slate-600 hover:text-slate-400 hover:border-emerald-900/60"}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mono text-[10px] font-bold tracking-widest text-slate-600 uppercase block mb-2.5">Locale</label>
                  <select value={locale} onChange={e => setLocale(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg mono text-xs text-slate-300 bg-white/[0.03] border border-white/[0.07] outline-none cursor-pointer hover:border-emerald-900/60 transition-colors appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "14px" }}>
                    <option value="en_US">🇺🇸 English (US)</option>
                    <option value="en_GB">🇬🇧 English (UK)</option>
                    <option value="de_DE">🇩🇪 German</option>
                    <option value="fr_FR">🇫🇷 French</option>
                    <option value="es_ES">🇪🇸 Spanish</option>
                    <option value="ja_JP">🇯🇵 Japanese</option>
                    <option value="in_IN">🇮🇳 Indian</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── GENERATE BUTTON ── */}
          <button
            onClick={generate}
            disabled={loading || !selectedFields.length}
            className={`w-full mt-5 py-4 rounded-xl mono text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-200 border
              ${loading || !selectedFields.length
                ? "bg-white/[0.03] border-white/[0.06] text-slate-600 cursor-not-allowed"
                : "bg-emerald-400/[0.1] border-emerald-400/40 text-emerald-400 hover:bg-emerald-400/[0.16] hover:border-emerald-400/60 shadow-[0_0_20px_rgba(52,211,153,0.08)] hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]"}`}>
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 spinner" />
                Generating data...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"/>
                </svg>
                Run Generator
              </>
            )}
          </button>

          {/* ── OUTPUT ── */}
          {data && !loading && (
            <div className="mt-6 fade-up">
              {/* output header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="mono text-[10px] font-bold tracking-widest text-slate-600 uppercase">Output</span>
                  <div className="flex p-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06] gap-0.5">
                    {["table", "raw"].map(v => (
                      <button key={v} onClick={() => setView(v)}
                        className={`px-3 py-1 rounded-md mono text-[9px] font-bold uppercase tracking-widest cursor-pointer transition-all duration-150
                          ${view === v ? "bg-emerald-400/[0.12] text-emerald-400" : "text-slate-600 hover:text-slate-400"}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* action buttons */}
                <div className="flex gap-2">
                  <button onClick={copy}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg mono text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all duration-150 border
                      ${copied
                        ? "bg-emerald-400/[0.15] border-emerald-400/40 text-emerald-400"
                        : "bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-emerald-400 hover:border-emerald-900/60"}`}>
                    {copied
                      ? <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>Copied</>
                      : <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>Copy</>}
                  </button>
                  <button onClick={download}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg mono text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all duration-150 border bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-emerald-400 hover:border-emerald-900/60">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    .{format.toLowerCase()}
                  </button>
                  <button onClick={generate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg mono text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all duration-150 border bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-emerald-400 hover:border-emerald-900/60">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Regen
                  </button>
                </div>
              </div>

              {/* table view */}
              {view === "table" && <DataTable rows={data.rows} fields={selectedFields} />}

              {/* raw view */}
              {view === "raw" && (
                <div className="relative rounded-xl border border-emerald-900/40 bg-black/40 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-emerald-900/30 bg-white/[0.02]">
                    <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500/40"/><div className="w-2 h-2 rounded-full bg-yellow-400/40"/><div className="w-2 h-2 rounded-full bg-emerald-400/40"/></div>
                    <span className="mono text-[9px] text-slate-700">output.{format.toLowerCase()}</span>
                  </div>
                  <pre className="mono text-[11px] text-emerald-400/80 p-4 overflow-auto max-h-72 leading-relaxed">
                    {data.raw}
                  </pre>
                </div>
              )}

              {/* stat footer */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.05]">
                {[
                  { label: "Rows",   val: data.rows.length },
                  { label: "Fields", val: selectedFields.length },
                  { label: "Format", val: format },
                  { label: "Locale", val: locale },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <span className="mono text-[9px] text-slate-700 uppercase tracking-widest">{s.label}</span>
                    <span className="mono text-[10px] text-emerald-500 font-bold">{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* neon bottom bar */}
        <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />
      </div>
    </>
  );
}