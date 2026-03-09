import { useState, useRef, useCallback } from "react";

/* ─── constants ─────────────────────────────────────────── */
const TONES = [
  { id: "professional", label: "Professional", icon: "💼" },
  { id: "creative",     label: "Creative",     icon: "✦"  },
  { id: "executive",    label: "Executive",    icon: "◈"  },
  { id: "technical",    label: "Technical",    icon: "⌬"  },
];
const LENGTHS = [
  { id: "concise",  label: "Concise",  sub: "2–3 lines" },
  { id: "standard", label: "Standard", sub: "4–5 lines" },
  { id: "detailed", label: "Detailed", sub: "6–8 lines" },
];

/* ─── small reusable inputs ─────────────────────────────── */
function Field({ label, placeholder, value, onChange, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className={`text-[10px] font-bold tracking-[0.12em] uppercase transition-colors duration-200 ${focused ? "text-amber-300" : "text-slate-500"}`}>
        {label}{required && <span className="text-amber-300 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-200 bg-white/[0.03] text-slate-200 placeholder:text-slate-600
          ${focused
            ? "border border-amber-400/50 shadow-[0_0_0_3px_rgba(251,191,36,0.07)] bg-amber-400/[0.03]"
            : "border border-white/[0.07]"}`}
      />
    </div>
  );
}

function Textarea({ label, placeholder, value, onChange, rows = 3, maxLen = 500 }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className={`text-[10px] font-bold tracking-[0.12em] uppercase transition-colors duration-200 ${focused ? "text-amber-300" : "text-slate-500"}`}>
          {label}
        </label>
        <span className={`text-[10px] tabular-nums transition-colors ${value.length > maxLen * 0.85 ? "text-red-400" : "text-slate-700"}`}>
          {value.length}/{maxLen}
        </span>
      </div>
      <textarea
        rows={rows}
        maxLength={maxLen}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-200 bg-white/[0.03] text-slate-200 placeholder:text-slate-600 resize-none font-[inherit]
          ${focused
            ? "border border-amber-400/50 shadow-[0_0_0_3px_rgba(251,191,36,0.07)] bg-amber-400/[0.03]"
            : "border border-white/[0.07]"}`}
      />
    </div>
  );
}

/* ─── AI file parser ─────────────────────────────────────── */
async function extractFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(",")[1];
      const mediaType = file.type || "application/pdf";
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2000,
            messages: [{
              role: "user",
              content: [
                { type: "document", source: { type: "base64", media_type: mediaType, data: base64 } },
                { type: "text", text: `Extract info from this resume. Return ONLY valid JSON (no markdown):
{"name":"full name","role":"most recent job title","experience":"total years e.g. '5 years'","skills":"comma-separated top 6-8 skills","achievements":"2-3 key achievements in one short paragraph"}` }
              ]
            }]
          })
        });
        const data = await res.json();
        const raw = data.content?.map(c => c.text || "").join("").trim();
        resolve(JSON.parse(raw.replace(/```json|```/g, "").trim()));
      } catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
export default function ResumeSummaryTool() {
  const [mode, setMode]               = useState("upload");       // "upload" | "manual"
  const [uploadState, setUploadState] = useState("idle");         // idle | parsing | done | error
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver]       = useState(false);
  const [parseError, setParseError]   = useState("");
  const [form, setForm]               = useState({ name: "", role: "", experience: "", skills: "", achievements: "", tone: "professional", length: "standard" });
  const [summary, setSummary]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [copied, setCopied]           = useState(false);
  const [step, setStep]               = useState(1);
  const fileRef                       = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  /* file handling */
  const handleFile = useCallback(async (file) => {
    if (!file) return;
    const validType = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"].includes(file.type)
      || [".pdf", ".docx", ".txt"].some(ext => file.name.endsWith(ext));
    if (!validType) { setParseError("Only PDF, DOCX, or TXT files supported."); return; }
    if (file.size > 5 * 1024 * 1024) { setParseError("File must be under 5MB."); return; }

    setParseError("");
    setUploadedFile(file);
    setUploadState("parsing");

    try {
      const parsed = await extractFromFile(file);
      setForm(f => ({
        ...f,
        name:         parsed.name         || f.name,
        role:         parsed.role         || f.role,
        experience:   parsed.experience   || f.experience,
        skills:       parsed.skills       || f.skills,
        achievements: parsed.achievements || f.achievements,
      }));
      setUploadState("done");
      setMode("manual");
    } catch {
      setUploadState("error");
      setParseError("Couldn't parse this file. Please fill in details manually.");
      setMode("manual");
    }
  }, []);

  const onDrop = useCallback(e => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  /* generate summary */
  const generate = async () => {
    if (!form.role.trim()) return;
    setLoading(true); setSummary(""); setStep(2);
    const lenMap = { concise: "2-3 sentences", standard: "4-5 sentences", detailed: "6-8 sentences" };
    const prompt = `Write a ${form.tone} resume professional summary for a ${form.role}.
${form.name        ? `Name: ${form.name}`                 : ""}
${form.experience  ? `Experience: ${form.experience}`     : ""}
${form.skills      ? `Skills: ${form.skills}`             : ""}
${form.achievements? `Achievements: ${form.achievements}` : ""}
Length: ${lenMap[form.length]}. First-person voice. ATS-optimized. Return ONLY the summary paragraph.`;
    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      setSummary(data.content?.map(c => c.text || "").join("").trim() || "");
    } catch { setSummary("Something went wrong. Please try again."); }
    finally  { setLoading(false); }
  };

  const copy  = () => { navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const reset = () => {
    setStep(1); setSummary(""); setMode("upload"); setUploadState("idle");
    setUploadedFile(null); setParseError("");
    setForm({ name: "", role: "", experience: "", skills: "", achievements: "", tone: "professional", length: "standard" });
  };

  const canGenerate = form.role.trim().length > 0;
  const fileIcon = uploadedFile?.name.endsWith(".pdf") ? "📄" : uploadedFile?.name.endsWith(".docx") ? "📝" : "📃";

  return (
    <>
      <style>{`
        @keyframes fadeUp   { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulseBar { from { opacity:.35 } to { opacity:.9 } }
        @keyframes spin     { to   { transform:rotate(360deg) } }
        .fade-up  { animation: fadeUp .28s ease both }
        .skeleton { animation: pulseBar 1.4s ease-in-out infinite alternate }
        .spinner  { animation: spin .85s linear infinite }
      `}</style>

      {/* ╔══════════════════════════════ CARD ═══════════════════════╗ */}
      <div className="relative max-w-7xl mx-auto rounded-2xl overflow-hidden border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.55)] bg-gradient-to-br from-[#0f1117] via-[#111318] to-[#0d0f14]">

        {/* gold hairline */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />

        {/* noise layer */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.018]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "128px" }}
        />

        <div className="relative z-10 p-8">

          {/* ── HEADER ── */}
          <div className="flex items-start justify-between mb-7">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-300/20 to-amber-600/10 border border-amber-300/25 text-[13px]">✦</div>
                <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-amber-300">Resume Tool</span>
              </div>
              <h2 className="text-[21px] font-bold text-slate-50 tracking-tight leading-tight m-0">Summary Generator</h2>
              <p className="text-[12.5px] text-slate-600 mt-1">Upload your resume or fill in manually</p>
            </div>

            {/* step indicator */}
            <div className="flex items-center gap-1.5">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300
                    ${step >= s ? "bg-gradient-to-br from-amber-300 to-amber-500 text-[#0f1117]" : "bg-white/5 text-slate-600 border border-white/[0.08]"}`}>
                    {s}
                  </div>
                  {s < 2 && <div className={`w-5 h-px transition-all duration-300 ${step > 1 ? "bg-amber-400/50" : "bg-white/[0.08]"}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* ════════ STEP 1 ════════ */}
          {step === 1 && (
            <div className="flex flex-col gap-5 fade-up">

              {/* mode tabs */}
              <div className="flex p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] gap-1">
                {[{ k: "upload", label: "📎  Upload Resume" }, { k: "manual", label: "✏️  Fill Manually" }].map(t => (
                  <button key={t.k} onClick={() => setMode(t.k)}
                    className={`flex-1 py-2.5 px-3 rounded-[9px] text-xs font-semibold cursor-pointer transition-all duration-200
                      ${mode === t.k
                        ? "bg-gradient-to-br from-amber-300/15 to-amber-600/[0.08] text-amber-300 border border-amber-300/25 shadow-[inset_0_1px_0_rgba(251,191,36,0.15)]"
                        : "text-slate-500 border border-transparent hover:text-slate-400"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* ── UPLOAD TAB ── */}
              {mode === "upload" && (
                <div className="flex flex-col gap-3">
                  <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={e => handleFile(e.target.files[0])} />

                  {/* idle drop zone */}
                  {uploadState === "idle" && (
                    <div
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={onDrop}
                      onClick={() => fileRef.current?.click()}
                      className={`rounded-2xl px-6 py-11 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-250 border-2 border-dashed
                        ${dragOver
                          ? "border-amber-400/60 bg-amber-400/[0.05]"
                          : "border-white/[0.09] bg-white/[0.02] hover:border-amber-400/35 hover:bg-amber-400/[0.03]"}`}>
                      {/* icon circle */}
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br from-amber-300/13 to-amber-600/[0.06] border border-amber-300/20">
                        <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-[15px] font-bold text-slate-100 mb-1">Drop your resume here</p>
                      <p className="text-[12.5px] text-slate-600 mb-5">
                        or <span className="text-amber-300 underline decoration-dotted underline-offset-2">click to browse</span>
                      </p>
                      <div className="flex gap-2">
                        {["PDF", "DOCX", "TXT"].map(ext => (
                          <span key={ext} className="text-[10px] font-bold px-3 py-1 rounded-full tracking-wider bg-white/[0.04] border border-white/[0.08] text-slate-600">{ext}</span>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-700 mt-3">Max 5MB</p>
                    </div>
                  )}

                  {/* parsing state */}
                  {uploadState === "parsing" && (
                    <div className="rounded-2xl px-6 py-11 flex flex-col items-center text-center bg-amber-300/[0.03] border border-amber-300/[0.12]">
                      <div className="w-12 h-12 rounded-full border-[2.5px] border-amber-300/15 border-t-amber-300 spinner mb-4" />
                      <p className="text-sm font-bold text-slate-100 mb-1">Parsing your resume…</p>
                      <p className="text-[12px] text-slate-600 mb-4">AI is reading and extracting your details</p>
                      {uploadedFile && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                          <span className="text-base">{fileIcon}</span>
                          <span className="text-xs text-slate-400 max-w-[200px] truncate">{uploadedFile.name}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* error */}
                  {parseError && (
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-400/[0.08] border border-red-400/20">
                      <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      <span className="text-xs text-red-300">{parseError}</span>
                    </div>
                  )}

                  {/* skip link */}
                  {uploadState === "idle" && (
                    <button onClick={() => setMode("manual")}
                      className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-600 border border-white/[0.06] bg-transparent hover:bg-white/[0.06] hover:text-slate-400 transition-all duration-200 cursor-pointer">
                      Skip — fill in manually instead →
                    </button>
                  )}
                </div>
              )}

              {/* ── MANUAL TAB ── */}
              {mode === "manual" && (
                <div className="flex flex-col gap-4 fade-up">

                  {/* auto-fill banner */}
                  {uploadedFile && uploadState === "done" && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-400/[0.05] border border-emerald-400/[0.18]">
                      <div className="w-[30px] h-[30px] shrink-0 rounded-lg flex items-center justify-center bg-emerald-400/10">
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11.5px] font-bold text-emerald-400 mb-0.5">Auto-filled from resume</p>
                        <p className="text-[11px] text-slate-600 truncate">{uploadedFile.name} — edit fields if needed</p>
                      </div>
                      <button
                        onClick={() => { setUploadState("idle"); setUploadedFile(null); setMode("upload"); }}
                        className="shrink-0 px-2.5 py-1 text-[11px] font-semibold text-slate-600 rounded-lg border border-white/[0.07] bg-transparent hover:bg-white/[0.07] hover:text-slate-400 transition-all duration-200 cursor-pointer">
                        Re-upload
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3.5">
                    <Field label="Full Name"  placeholder="Alex Rivera"          value={form.name}       onChange={v => set("name", v)} />
                    <Field label="Job Title"  placeholder="Senior UX Designer"   value={form.role}       onChange={v => set("role", v)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <Field label="Experience" placeholder="6 years"              value={form.experience} onChange={v => set("experience", v)} />
                    <Field label="Top Skills" placeholder="Figma, React, AWS"    value={form.skills}     onChange={v => set("skills", v)} />
                  </div>
                  <Textarea label="Key Achievements" placeholder="Grew retention 40%, led 8-person team, launched 4 products…" value={form.achievements} onChange={v => set("achievements", v)} />
                </div>
              )}

              {/* ── TONE + LENGTH + CTA ── */}
              {(mode === "manual" || uploadState === "done") && (
                <>
                  {/* Tone */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-slate-500 mb-2.5">Tone</label>
                    <div className="grid grid-cols-4 gap-2">
                      {TONES.map(t => (
                        <button key={t.id} onClick={() => set("tone", t.id)}
                          className={`py-2.5 px-2 rounded-xl text-center text-xs font-semibold cursor-pointer transition-all duration-200
                            ${form.tone === t.id
                              ? "bg-amber-300/[0.12] border border-amber-400/50 text-amber-300 shadow-[inset_0_1px_0_rgba(251,191,36,0.1)]"
                              : "bg-white/[0.03] border border-white/[0.06] text-slate-600 hover:border-amber-400/20 hover:text-slate-400"}`}>
                          <div className="text-[15px] mb-1">{t.icon}</div>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Length */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-slate-500 mb-2.5">Length</label>
                    <div className="grid grid-cols-3 gap-2">
                      {LENGTHS.map(l => (
                        <button key={l.id} onClick={() => set("length", l.id)}
                          className={`py-2.5 px-3 rounded-xl text-center cursor-pointer transition-all duration-200
                            ${form.length === l.id
                              ? "bg-amber-300/[0.12] border border-amber-400/50 text-amber-300"
                              : "bg-white/[0.03] border border-white/[0.06] text-slate-600 hover:border-amber-400/20 hover:text-slate-400"}`}>
                          <div className="text-xs font-bold">{l.label}</div>
                          <div className={`text-[10px] mt-0.5 ${form.length === l.id ? "text-amber-400/60" : "text-slate-700"}`}>{l.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate CTA */}
                  <button
                    onClick={generate}
                    disabled={!canGenerate}
                    className={`w-full py-4 rounded-xl text-[13.5px] font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-200
                      ${canGenerate
                        ? "bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-[#0f1117] cursor-pointer shadow-[0_4px_20px_rgba(251,191,36,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_28px_rgba(251,191,36,0.35)] hover:scale-[1.01]"
                        : "bg-white/[0.04] text-slate-600 cursor-not-allowed"}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate My Summary
                  </button>
                </>
              )}
            </div>
          )}

          {/* ════════ STEP 2 ════════ */}
          {step === 2 && (
            <div className="fade-up">

              {/* divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-600">
                  {loading ? "Generating…" : "Your Summary"}
                </span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* result card */}
              <div className="relative rounded-2xl p-6 bg-amber-300/[0.03] border border-amber-300/[0.13] min-h-[90px]">
                {/* corner glow */}
                <div className="absolute top-0 left-0 w-10 h-10 rounded-tl-2xl bg-gradient-to-br from-amber-300/10 to-transparent pointer-events-none" />

                {loading ? (
                  <div className="flex flex-col gap-2.5">
                    {[92, 100, 78, 88, 55].map((w, i) => (
                      <div key={i} className="h-3 rounded-full bg-amber-300/[0.07] skeleton" style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                ) : (
                  <p className="m-0 text-sm leading-[1.85] text-slate-300 tracking-[0.01em]">{summary}</p>
                )}
              </div>

              {/* actions */}
              {summary && !loading && (
                <div className="flex items-center justify-between mt-3.5 flex-wrap gap-2.5">
                  {/* tags */}
                  <div className="flex gap-1.5 flex-wrap">
                    {[form.tone, form.length, `${summary.split(" ").length} words`, uploadedFile ? "from file" : "manual"].map(tag => (
                      <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize bg-white/[0.04] border border-white/[0.07] text-slate-600 tracking-[0.05em]">{tag}</span>
                    ))}
                  </div>

                  {/* buttons */}
                  <div className="flex gap-2">
                    <button onClick={copy}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200
                        ${copied
                          ? "bg-emerald-400/[0.12] border border-emerald-400/35 text-emerald-400"
                          : "bg-amber-300/[0.08] border border-amber-400/20 text-amber-300 hover:bg-amber-300/[0.14]"}`}>
                      {copied ? (
                        <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>Copied!</>
                      ) : (
                        <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>Copy</>
                      )}
                    </button>
                    <button onClick={reset}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.07] hover:text-slate-400 cursor-pointer transition-all duration-200">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Start Over
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* gold bottom hairline */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-300/[0.08] to-transparent" />
      </div>
    </>
  );
}