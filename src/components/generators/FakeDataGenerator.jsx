import { useState, useCallback, useRef } from "react";

const FIELD_TYPES = [
  { id: "fullName",   label: "Full Name",   icon: "👤", cat: "person" },
  { id: "email",      label: "Email",       icon: "✉️", cat: "person" },
  { id: "phone",      label: "Phone",       icon: "📞", cat: "person" },
  { id: "address",    label: "Address",     icon: "📍", cat: "location" },
  { id: "city",       label: "City",        icon: "🏙️", cat: "location" },
  { id: "country",    label: "Country",     icon: "🌍", cat: "location" },
  { id: "company",    label: "Company",     icon: "🏢", cat: "business" },
  { id: "jobTitle",   label: "Job Title",   icon: "💼", cat: "business" },
  { id: "username",   label: "Username",    icon: "🔑", cat: "digital" },
  { id: "password",   label: "Password",    icon: "🔒", cat: "digital" },
  { id: "ipAddress",  label: "IP Address",  icon: "🌐", cat: "digital" },
  { id: "creditCard", label: "Credit Card", icon: "💳", cat: "finance" },
  { id: "price",      label: "Price",       icon: "💰", cat: "finance" },
  { id: "date",       label: "Date",        icon: "📅", cat: "misc" },
  { id: "uuid",       label: "UUID",        icon: "🔷", cat: "misc" },
  { id: "loremText",  label: "Lorem Text",  icon: "📝", cat: "misc" },
];

const CATEGORIES = ["person", "location", "business", "digital", "finance", "misc"];
const CAT_LABELS  = { person:"Person", location:"Location", business:"Business", digital:"Digital", finance:"Finance", misc:"Misc" };
const FORMATS     = ["JSON","CSV","SQL","TSV"];
const ROW_OPTS    = [5,10,25,50,100];

/* ── Field Tag ───────────────────────────────────────────── */
function FieldTag({ field, selected, onToggle, custom }) {
  return (
    <button
      onClick={() => onToggle(field.id)}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border
        ${selected
          ? custom
            ? "bg-gray-900 border-gray-900 text-white shadow-sm"
            : "bg-cyan-600 border-cyan-600 text-white shadow-sm"
          : custom
            ? "bg-white border-violet-200 text-violet-500 hover:border-violet-400 hover:text-violet-700"
            : "bg-white border-gray-200 text-gray-500 hover:border-cyan-600 hover:text-cyan-600"}`}>
      <span className="text-[11px]">{field.icon}</span>
      {field.label}
    </button>
  );
}

/* ── Data Table ──────────────────────────────────────────── */
function DataTable({ rows, fields, allFields }) {
  if (!rows.length) return null;
  const cols = allFields.filter(f => fields.includes(f.id));
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-4 py-3 text-left text-gray-400 font-semibold tracking-widest text-[10px] uppercase w-10">#</th>
            {cols.map(f => (
              <th key={f.id} className="px-4 py-3 text-left text-gray-500 font-semibold tracking-wider text-[10px] uppercase whitespace-nowrap">
                {f.custom && <span className="mr-1 text-cyan-400">✦</span>}{f.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b border-gray-50 hover:bg-cyan-50/50 transition-colors ${i%2===1?"bg-gray-50/40":""}`}>
              <td className="px-4 py-2.5 text-gray-300 select-none font-mono text-[10px]">{i+1}</td>
              {cols.map(f => (
                <td key={f.id} className="px-4 py-2.5 text-gray-700 font-mono text-[11px] whitespace-nowrap max-w-[180px] truncate">{row[f.id] ?? "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── MAIN ────────────────────────────────────────────────── */
export default function FakeDataGenerator() {
  const [selectedFields, setSelectedFields] = useState(["fullName","email","company","jobTitle"]);
  const [rows,    setRows]    = useState(10);
  const [format,  setFormat]  = useState("JSON");
  const [locale,  setLocale]  = useState("en_US");
  const [loading, setLoading] = useState(false);
  const [data,    setData]    = useState(null);
  const [copied,  setCopied]  = useState(false);
  const [view,    setView]    = useState("table");
  const [filter,  setFilter]  = useState("all");

  // Custom fields state
  const [customFields, setCustomFields] = useState([]);
  const [customInput,  setCustomInput]  = useState("");
  const [customDesc,   setCustomDesc]   = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const inputRef = useRef(null);

  const allFields = [...FIELD_TYPES, ...customFields];

  const addCustomField = () => {
    const name = customInput.trim();
    if (!name) return;
    const id = "custom_" + name.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();
    const newField = { id, label: name, icon: "✦", cat: "custom", custom: true, description: customDesc.trim() };
    setCustomFields(p => [...p, newField]);
    setSelectedFields(p => [...p, id]);
    setCustomInput(""); setCustomDesc(""); setShowCustomForm(false);
  };

  const removeCustomField = (id) => {
    setCustomFields(p => p.filter(f => f.id !== id));
    setSelectedFields(p => p.filter(f => f !== id));
  };

  const toggleField = useCallback(id =>
    setSelectedFields(p => p.includes(id) ? p.filter(f=>f!==id) : [...p,id]), []);

  const generate = async () => {
    if (!selectedFields.length) return;
    setLoading(true); setData(null);
    const builtinList = FIELD_TYPES.filter(f=>selectedFields.includes(f.id)).map(f=>f.label).join(", ");
    const customList  = customFields.filter(f=>selectedFields.includes(f.id))
      .map(f => f.description ? `${f.label} (${f.description})` : f.label).join(", ");
    const fieldList = [builtinList, customList].filter(Boolean).join(", ");
    const allSelectedIds = selectedFields;
    const prompt = `Generate ${rows} rows of realistic fake data. Each row must have these fields: ${fieldList}. Locale: ${locale}. Return ONLY a valid JSON array of objects. Each object must have exactly these keys: ${allSelectedIds.join(", ")}. For custom fields, generate appropriate realistic values based on the field name/description. No explanation, no markdown, just the JSON array.`;
    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:4000, messages:[{role:"user",content:prompt}] }),
      });
      const api  = await res.json();
      const raw  = api.content?.map(c=>c.text||"").join("").trim();
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      let formatted = "";
      if (format==="JSON") formatted = JSON.stringify(parsed,null,2);
      else if (format==="CSV"||format==="TSV") {
        const sep = format==="CSV"?",":"\t";
        formatted = [selectedFields.join(sep), ...parsed.map(r=>selectedFields.map(f=>`"${(r[f]??"").toString().replace(/"/g,'""')}"`).join(sep))].join("\n");
      } else if (format==="SQL") {
        formatted = parsed.map(r=>`INSERT INTO fake_data (${selectedFields.join(", ")}) VALUES (${selectedFields.map(f=>`'${(r[f]??"").toString().replace(/'/g,"''")}'`).join(", ")});`).join("\n");
      }
      setData({ rows:parsed, raw:formatted }); setView("table");
    } catch {
      setData({ rows:[], raw:"// Error generating data. Please try again." });
    } finally { setLoading(false); }
  };

  const copy = () => {
    if (!data?.raw) return;
    navigator.clipboard.writeText(data.raw);
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  const download = () => {
    if (!data?.raw) return;
    const ext={JSON:"json",CSV:"csv",SQL:"sql",TSV:"tsv"}[format];
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([data.raw],{type:"text/plain"}));
    a.download=`fake-data.${ext}`; a.click();
  };

  const visibleFields = filter==="all"
    ? allFields
    : filter==="custom"
      ? customFields
      : FIELD_TYPES.filter(f=>f.cat===filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .mono-text { font-family: 'DM Mono', monospace; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.7} }
        .fade-up { animation: fadeUp .35s cubic-bezier(.16,1,.3,1) both }
        .spinner { animation: spin .7s linear infinite }
        .pulse-dot { animation: pulse-dot 1.2s ease-in-out infinite }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:6px}
        ::-webkit-scrollbar-thumb:hover{background:#9ca3af}
        select { -webkit-appearance:none; }
      `}</style>

      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-8 text-center">
         
            <h1 className="text-4xl font-medium text-gray-900">Fake data <span className="text-cyan-700">generator</span></h1>
            <p className="text-base text-gray-500 mt-1">Configure your schema, pick a format, and generate realistic test data instantly.</p>
          </div>

          {/* ── Card ── */}
          <div className="bg-gray-50 rounded-xl mt-12 border border-gray-200 shadow-sm shadow-cyan-200/80 overflow-hidden">

            {/* thin cyan accent top */}
            <div className="h-[3px] bg-gradient-to-r from-cyan-700 via-cyan-500 to-cyan-600" />

            <div className="p-6 space-y-7">

              {/* ── Fields Section ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">Select Fields</label>
                  <div className="flex gap-2">
                    <button onClick={()=>setSelectedFields(FIELD_TYPES.map(f=>f.id))}
                      className="text-[11px] font-semibold text-cyan-600 hover:text-cyan-700 transition-colors cursor-pointer bg-transparent border-0">
                      Select all
                    </button>
                    <span className="text-gray-200">|</span>
                    <button onClick={()=>setSelectedFields([])}
                      className="text-[11px] font-semibold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer bg-transparent border-0">
                      Clear
                    </button>
                  </div>
                </div>

                {/* Category tabs */}
                <div className="flex gap-1 overflow-x-auto pb-0.5 mb-4">
                  {["all",...CATEGORIES,"custom"].map(cat=>(
                    <button key={cat} onClick={()=>setFilter(cat)}
                      className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-150 cursor-pointer border
                        ${filter===cat
                          ? cat==="custom" ? "bg-gray-900 border-gray-900 text-white" : "bg-cyan-600 border-cyan-600 text-white"
                          : cat==="custom" ? "bg-white border-violet-200 text-gray-900 hover:border-gray-900 hover:text-gray-900" : "bg-white border-gray-200 text-gray-500 hover:border-cyan-200 hover:text-cyan-500"}`}>
                      {cat==="all"?"All":cat==="custom"?"✦ Custom":CAT_LABELS[cat]}
                      {cat==="custom" && customFields.length>0 && (
                        <span className="ml-1.5 bg-violet-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">{customFields.length}</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {visibleFields.map(f=>(
                    <div key={f.id} className="relative group">
                      <FieldTag field={f} selected={selectedFields.includes(f.id)} onToggle={toggleField} custom={f.custom} />
                      {f.custom && (
                        <button
                          onClick={()=>removeCustomField(f.id)}
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-400 hover:bg-red-500 text-white rounded-full text-[9px] font-bold hidden group-hover:flex items-center justify-center transition-all cursor-pointer border-0 leading-none">
                          ×
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add custom field button */}
                  <button
                    onClick={()=>{ setShowCustomForm(true); setTimeout(()=>inputRef.current?.focus(),50); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-dashed border-gray-800 text-gray-800 hover:border-gray-500 hover:text-cyan-600 hover:bg-gray-50 transition-all duration-200 cursor-pointer bg-transparent">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
                    </svg>
                    Add custom field
                  </button>
                </div>

                {/* Custom field form */}
                {showCustomForm && (
                  <div className="mt-4 p-4 rounded-lg border border-cyan-600/20 bg-gray-50/60 fade-up">
                    <p className="text-xs font-semibold text-cyan-700 mb-3 flex items-center gap-1.5">
                      <span>✦</span> New Custom Field
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        ref={inputRef}
                        value={customInput}
                        onChange={e=>setCustomInput(e.target.value)}
                        onKeyDown={e=>{ if(e.key==="Enter") addCustomField(); if(e.key==="Escape") setShowCustomForm(false); }}
                        placeholder="Field name  e.g. Pet Name"
                        className="flex-1 px-3 py-2 rounded-lg text-xs text-gray-700 bg-white border border-gray-200 outline-none focus:border-cyan-600 transition-colors placeholder-gray-300 font-medium"
                      />
                      <input
                        value={customDesc}
                        onChange={e=>setCustomDesc(e.target.value)}
                        onKeyDown={e=>{ if(e.key==="Enter") addCustomField(); if(e.key==="Escape") setShowCustomForm(false); }}
                        placeholder="Hint  e.g. a funny pet name  (optional)"
                        className="flex-1 px-3 py-2 rounded-lg text-xs text-gray-700 bg-white border border-gray-200 outline-none focus:border-cyan-600 transition-colors placeholder-gray-300 font-medium"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={addCustomField}
                          disabled={!customInput.trim()}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer
                            ${customInput.trim()
                              ? "bg-cyan-600 border-cyan-5600 text-white hover:bg-cyan-600/80"
                              : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"}`}>
                          Add
                        </button>
                        <button
                          onClick={()=>{ setShowCustomForm(false); setCustomInput(""); setCustomDesc(""); }}
                          className="px-4 py-2 rounded-lg text-xs font-semibold border bg-white border-gray-200 text-gray-500 hover:border-gray-300 transition-all cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-cyan-600 mt-2">Press Enter to add · Esc to cancel</p>
                  </div>
                )}

                {selectedFields.length>0 && (
                  <p className="text-[11px] text-gray-400 mt-3">
                    <span className="text-cyan-500 font-semibold">{selectedFields.length}</span> fields selected
                    {customFields.filter(f=>selectedFields.includes(f.id)).length>0 && (
                      <span className="ml-2 text-cyan-600">· <span className="font-semibold">{customFields.filter(f=>selectedFields.includes(f.id)).length}</span> custom</span>
                    )}
                  </p>
                )}
              </div>

              <div className="h-px bg-gray-100" />

              {/* ── Row count + Format + Locale ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                {/* Rows */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2.5">Row Count</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {ROW_OPTS.map(n=>(
                      <button key={n} onClick={()=>setRows(n)}
                        className={`w-12 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 border
                          ${rows===n
                            ? "bg-cyan-600 border-cyan-600 text-white"
                            : "bg-white border-gray-200 text-gray-500 hover:border-cyan-600 hover:text-cyan-600"}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2.5">Format</label>
                  <div className="flex gap-1.5">
                    {FORMATS.map(f=>(
                      <button key={f} onClick={()=>setFormat(f)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 border mono-text
                          ${format===f
                            ? "bg-cyan-600 border-cyan-600 text-white"
                            : "bg-white border-gray-200 text-gray-500 hover:border-cyan-600 hover:text-cyan-600"}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Locale */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2.5">Locale</label>
                  <div className="relative">
                    <select value={locale} onChange={e=>setLocale(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-xs text-gray-700 bg-white border border-gray-200 outline-none cursor-pointer hover:border-cyan-600 transition-colors pr-8 font-medium">
                      <option value="en_US">🇺🇸 English (US)</option>
                      <option value="en_GB">🇬🇧 English (UK)</option>
                      <option value="de_DE">🇩🇪 German</option>
                      <option value="fr_FR">🇫🇷 French</option>
                      <option value="es_ES">🇪🇸 Spanish</option>
                      <option value="ja_JP">🇯🇵 Japanese</option>
                      <option value="in_IN">🇮🇳 Indian</option>
                    </select>
                    <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* ── Generate Button ── */}
              <button
                onClick={generate}
                disabled={loading || !selectedFields.length}
                className={`w-full py-3.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-200 border
                  ${loading || !selectedFields.length
                    ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-600 hover:border-cyan-600 shadow-[0_4px_14px_rgba(6,182,212,0.35)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.45)]"}`}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white spinner" />
                    Generating data…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    Generate Data
                  </>
                )}
              </button>

            </div>{/* /inner padding */}

            {/* ── Output ── */}
            {data && !loading && (
              <div className="fade-up border-t border-gray-100 p-6">
                {/* output toolbar */}
                <div className="flex items-center justify-between mb-4">
                  {/* view toggle */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    {["table","raw"].map(v=>(
                      <button key={v} onClick={()=>setView(v)}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold capitalize cursor-pointer transition-all duration-150
                          ${view===v ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                        {v}
                      </button>
                    ))}
                  </div>

                  {/* actions */}
                  <div className="flex items-center gap-2">
                    <button onClick={copy}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer
                        ${copied
                          ? "bg-cyan-50 border-cyan-600 text-cyan-600"
                          : "bg-white border-gray-200 text-gray-500 hover:border-cyan-600 hover:text-cyan-600"}`}>
                      {copied
                        ? <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>Copied!</>
                        : <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>Copy</>}
                    </button>
                    <button onClick={download}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white border-gray-200 text-gray-500 hover:border-cyan-600 hover:text-cyan-600 transition-all duration-150 cursor-pointer">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      Download .{format.toLowerCase()}
                    </button>
                    <button onClick={generate}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-white border-gray-200 text-gray-500 hover:border-cyan-600 hover:text-cyan-600 transition-all duration-150 cursor-pointer">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                      Regenerate
                    </button>
                  </div>
                </div>

                {/* table */}
                {view==="table" && <DataTable rows={data.rows} fields={selectedFields} allFields={allFields} />}

                {/* raw */}
                {view==="raw" && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 bg-white">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/70"/>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70"/>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/70"/>
                      </div>
                      <span className="mono-text text-[10px] text-gray-400 ml-1">output.{format.toLowerCase()}</span>
                    </div>
                    <pre className="mono-text text-[11px] text-gray-700 p-5 overflow-auto max-h-72 leading-relaxed">
                      {data.raw}
                    </pre>
                  </div>
                )}

                {/* stat strip */}
                <div className="flex items-center gap-5 mt-4 pt-4 border-t border-gray-100">
                  {[
                    {label:"Rows",  val:data.rows.length},
                    {label:"Fields",val:selectedFields.length},
                    {label:"Format",val:format},
                    {label:"Locale",val:locale.replace("_"," ")},
                  ].map(s=>(
                    <div key={s.label} className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{s.label}</span>
                      <span className="text-[11px] text-cyan-600 font-bold mono-text">{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}