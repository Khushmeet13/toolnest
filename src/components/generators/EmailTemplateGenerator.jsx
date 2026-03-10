import { useState, useEffect, useRef } from "react";

const CATEGORIES = ["Welcome","Promotional","Follow-up","Newsletter","Apology","Announcement","Thank You","Onboarding"];
const TONES = [
  { label:"Formal",     emoji:"🎩", desc:"Professional & polished" },
  { label:"Friendly",   emoji:"😊", desc:"Warm & approachable" },
  { label:"Urgent",     emoji:"⚡", desc:"Time-sensitive & direct" },
  { label:"Persuasive", emoji:"🎯", desc:"Compelling & action-driven" },
  { label:"Empathetic", emoji:"💛", desc:"Caring & understanding" },
  { label:"Bold",       emoji:"🔥", desc:"Daring & high-impact" },
];

const STEPS = [
  { id:1, key:"purpose",  label:"Purpose",  icon:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { id:2, key:"audience", label:"Audience", icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id:3, key:"category", label:"Category", icon:"M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
  { id:4, key:"tone",     label:"Tone",     icon:"M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
  { id:5, key:"details",  label:"Details",  icon:"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" },
];

export default function EmailTemplateGenerator() {
  const [activeStep, setActiveStep] = useState(1);
  const [purpose,    setPurpose]    = useState("");
  const [audience,   setAudience]   = useState("");
  const [category,   setCategory]   = useState("Welcome");
  const [tone,       setTone]       = useState("Friendly");
  const [details,    setDetails]    = useState("");
  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [copied,     setCopied]     = useState(null);
  const [activeTab,  setActiveTab]  = useState("preview");
  const [visible,    setVisible]    = useState(false);
  const [typedSubj,  setTypedSubj]  = useState("");
  const [typedBody,  setTypedBody]  = useState("");
  const [typing,     setTyping]     = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  useEffect(() => {
    if (!result) return;
    setTypedSubj(""); setTypedBody(""); setTyping(true);
    let si = 0;
    const subjInterval = setInterval(() => {
      si++;
      setTypedSubj(result.subject.slice(0, si));
      if (si >= result.subject.length) {
        clearInterval(subjInterval);
        let bi = 0;
        const bodyInterval = setInterval(() => {
          bi++;
          setTypedBody(result.body.slice(0, bi));
          if (bi >= result.body.length) { clearInterval(bodyInterval); setTyping(false); }
        }, 8);
      }
    }, 22);
    return () => clearInterval(subjInterval);
  }, [result]);

  const stepDone = (s) => {
    if (s.key === "purpose")  return purpose.trim().length > 0;
    if (s.key === "audience") return audience.trim().length > 0;
    return true;
  };

  const completedCount = STEPS.filter(stepDone).length;
  const canGenerate = purpose.trim().length > 0;
  const toneObj = TONES.find(t => t.label === tone) || TONES[1];

  const generate = async () => {
    if (!canGenerate || loading) return;
    setLoading(true); setResult(null); setActiveTab("preview");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{ role:"user", content:`Generate a professional email template.
Purpose: ${purpose}
Target Audience: ${audience||"general"}
Category: ${category}
Tone: ${tone}
Additional Details: ${details||"none"}
Rules: compelling subject, 3-5 paragraph body, use {{first_name}} naturally, clear CTA, match tone, feel human.
Return ONLY raw JSON: {"subject":"...","body":"..."}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text||"").join("")||"";
      setResult(JSON.parse(text.replace(/```json|```/g,"").trim()));
    } catch {
      setResult({
        subject:`Your exclusive ${category.toLowerCase()} — just for you, {{first_name}} ✨`,
        body:`Hi {{first_name}},\n\nThank you for being part of our community. We truly appreciate your continued support.\n\n${purpose}\n\nWe've crafted every detail with your needs in mind. Our team is always here to help.\n\nWarm regards,\nThe Team`,
      });
    }
    setLoading(false);
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key); setTimeout(()=>setCopied(null), 2200);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fira+Code:wght@300;400;500&display=swap');
        .f-ui   { font-family:'Outfit',sans-serif; }
        .f-code { font-family:'Fira Code',monospace; }

        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes pulseRing { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
        @keyframes scanline  { from{transform:translateY(-100%)} to{transform:translateY(400px)} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes ping      { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2);opacity:0} }

        .fade-up   { animation:fadeUp .5s cubic-bezier(.16,1,.3,1) both }
        .spin-it   { animation:spin .7s linear infinite }
        .blink     { animation:blink 1s step-end infinite }
        .ping-ring { animation:ping 1.4s ease-out infinite }

        .sidebar-bg {
          background:linear-gradient(180deg,#18181b 0%,#111113 100%);
          border-right:1px solid rgba(39,39,42,.9);
        }

        .step-line { width:1px; flex:1; background:rgba(63,63,70,.5); }
        .step-line.done { background:linear-gradient(180deg,rgba(6,182,212,.6),rgba(6,182,212,.2)); }

        .field-box {
          background:rgba(24,24,27,.9);
          border:1px solid rgba(63,63,70,.6);
          transition:border-color .2s, box-shadow .2s;
        }
        .field-box:focus-within {
          border-color:rgba(6,182,212,.55);
          box-shadow:0 0 0 3px rgba(6,182,212,.07), 0 0 24px rgba(6,182,212,.05);
        }
        .field-box textarea, .field-box input {
          background:transparent; color:#e4e4e7; font-family:'Outfit',sans-serif;
        }
        .field-box textarea:focus, .field-box input:focus { outline:none; }
        .field-box textarea::placeholder, .field-box input::placeholder { color:rgba(113,113,122,.45); }

        .cat-btn {
          background:rgba(24,24,27,.8); border:1px solid rgba(63,63,70,.5);
          transition:all .18s; cursor:pointer;
        }
        .cat-btn:hover { border-color:rgba(6,182,212,.4); color:#a1f0fc; }
        .cat-btn.sel {
          background:rgba(6,182,212,.1); border-color:rgba(6,182,212,.5);
          color:#67e8f9; box-shadow:0 0 14px rgba(6,182,212,.1);
        }

        .tone-card {
          background:rgba(24,24,27,.7); border:1px solid rgba(63,63,70,.4);
          transition:all .18s; cursor:pointer;
        }
        .tone-card:hover { border-color:rgba(6,182,212,.35); transform:translateY(-1px); }
        .tone-card.sel { background:rgba(6,182,212,.08); border-color:rgba(6,182,212,.5); box-shadow:0 4px 20px rgba(6,182,212,.1); }

        .gen-btn {
          background:linear-gradient(135deg,#0891b2 0%,#06b6d4 50%,#22d3ee 100%);
          box-shadow:0 4px 24px rgba(6,182,212,.35), 0 1px 0 rgba(255,255,255,.08) inset;
          transition:all .22s;
        }
        .gen-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 36px rgba(6,182,212,.5); }
        .gen-btn:active:not(:disabled) { transform:translateY(0); }

        .output-card {
          background:rgba(9,9,11,.9); border:1px solid rgba(39,39,42,.9);
          box-shadow:0 0 0 1px rgba(6,182,212,.04), 0 24px 60px rgba(0,0,0,.7);
        }

        .scanline-wrap { overflow:hidden; position:relative; }
        .scanline {
          position:absolute; left:0; right:0; height:60px; pointer-events:none;
          background:linear-gradient(180deg,transparent,rgba(6,182,212,.04),transparent);
          animation:scanline 4s linear infinite;
        }

        .copy-btn {
          background:rgba(24,24,27,.8); border:1px solid rgba(63,63,70,.5);
          transition:all .18s; cursor:pointer;
        }
        .copy-btn:hover { border-color:rgba(6,182,212,.4); color:#a1f0fc; }
        .copy-btn.on { background:rgba(6,182,212,.1); border-color:rgba(6,182,212,.5); color:#67e8f9; }

        .tab-pill { transition:all .18s; cursor:pointer; border:1px solid transparent; }
        .tab-pill.on { background:rgba(6,182,212,.1); color:#67e8f9; border-color:rgba(6,182,212,.35); }
        .tab-pill:not(.on) { color:#52525b; }
        .tab-pill:not(.on):hover { color:#a1a1aa; }

        .progress-fill { background:linear-gradient(90deg,#0891b2,#22d3ee); transition:width .4s ease; }

        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(6,182,212,.18); border-radius:4px; }

        .mesh-bg {
          background:
            radial-gradient(ellipse 55% 35% at 12% 18%, rgba(6,182,212,.055) 0%, transparent 65%),
            radial-gradient(ellipse 45% 30% at 88% 82%, rgba(8,145,178,.04) 0%, transparent 65%),
            #09090b;
        }
        .grid-bg {
          background-image:linear-gradient(rgba(6,182,212,.03) 1px,transparent 1px),
            linear-gradient(90deg,rgba(6,182,212,.03) 1px,transparent 1px);
          background-size:44px 44px;
        }
      `}</style> */}

      {/* Ambient layers */}
      <div className="fixed inset-0 mesh-bg pointer-events-none" />
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-100" />

      <div className={`relative flex h-screen transition-all duration-700 ${visible?"opacity-100":"opacity-0"}`}>

        {/* ═══════════ SIDEBAR ═══════════ */}
        <aside className="sidebar-bg w-60 flex-shrink-0 flex flex-col h-screen sticky top-0 z-20">

          {/* Brand */}
          <div className="px-5 pt-6 pb-5 border-b border-zinc-800/70">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p className="f-ui font-bold text-[13px] text-zinc-100 leading-none">MailCraft</p>
                <p className="f-code text-[8px] text-zinc-600 tracking-widest uppercase mt-0.5">AI Studio</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="px-5 py-4 border-b border-zinc-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="f-code text-[8px] text-zinc-600 tracking-widest uppercase">Progress</span>
              <span className="f-code text-[9px] text-cyan-400 font-medium">{completedCount}/{STEPS.length}</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="progress-fill h-full rounded-full" style={{ width:`${(completedCount/STEPS.length)*100}%` }} />
            </div>
          </div>

          {/* Steps */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="flex flex-col">
              {STEPS.map((step, idx) => {
                const done   = stepDone(step);
                const active = activeStep === step.id;
                return (
                  <div key={step.id} className="flex flex-col items-stretch">
                    <button
                      onClick={()=>setActiveStep(step.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left group border
                        ${active
                          ? "bg-cyan-500/10 border-cyan-500/20"
                          : "hover:bg-zinc-800/50 border-transparent"}`}>
                      {/* dot */}
                      <div className={`relative w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all
                        ${done?"bg-cyan-500/20 border border-cyan-500/50":active?"bg-zinc-700 border border-zinc-600":"bg-zinc-800 border border-zinc-700/60"}`}>
                        {done ? (
                          <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                          </svg>
                        ) : (
                          <span className={`f-code text-[8px] font-bold ${active?"text-cyan-400":"text-zinc-600"}`}>{step.id}</span>
                        )}
                        {active && !done && (
                          <div className="absolute inset-0 rounded-full border border-cyan-400/50 ping-ring" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`f-ui text-[12px] font-semibold transition-colors ${active?"text-cyan-300":done?"text-zinc-300":"text-zinc-500 group-hover:text-zinc-400"}`}>{step.label}</p>
                      </div>
                      {active && <div className="w-1 h-3.5 rounded-full bg-cyan-400 shrink-0" />}
                    </button>
                    {idx < STEPS.length - 1 && (
                      <div className={`mx-[1.35rem] my-0.5 step-line ${done?"done":""}`} style={{ height:"12px" }} />
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Sidebar footer — generate */}
          <div className="p-4 border-t border-zinc-800/70 space-y-3">
            <div className="flex gap-1.5 flex-wrap">
              <span className="f-code text-[8px] px-2 py-1 bg-zinc-800/80 text-zinc-500 rounded-md border border-zinc-700/50 truncate max-w-full">{category}</span>
              <span className="f-code text-[8px] px-2 py-1 bg-zinc-800/80 text-zinc-500 rounded-md border border-zinc-700/50">{toneObj.emoji} {tone}</span>
            </div>
            <button
              onClick={generate}
              disabled={!canGenerate||loading}
              className={`w-full py-2.5 rounded-xl f-ui text-[12px] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all
                ${canGenerate&&!loading?"gen-btn text-white":"bg-zinc-800/60 text-zinc-600 border border-zinc-700/40 cursor-not-allowed"}`}>
              {loading ? (
                <><div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white spin-it" />Generating…</>
              ) : (
                <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>Generate Email</>
              )}
            </button>
            {!canGenerate && <p className="f-code text-[8px] text-zinc-700 text-center">Add purpose first</p>}
          </div>
        </aside>

        {/* ═══════════ MAIN AREA ═══════════ */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto">

          {/* Top bar */}
          <div className="sticky top-0 z-10 px-7 py-3.5 border-b border-zinc-800/60 bg-zinc-950/95 backdrop-blur-sm flex items-center justify-between">
            <div className="f-code text-[10px] flex items-center gap-2 text-zinc-600">
              <span>mailcraft</span>
              <span className="text-zinc-800">/</span>
              <span>new-template</span>
              <span className="text-zinc-800">/</span>
              <span className="text-cyan-400">{STEPS.find(s=>s.id===activeStep)?.label.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${loading?"bg-amber-400 blink":result?"bg-emerald-400":"bg-zinc-700"}`} />
                <span className="f-code text-[9px] text-zinc-600">{loading?"generating…":result?"ready":"idle"}</span>
              </div>
              <div className="h-3.5 w-px bg-zinc-800" />
              <span className="f-code text-[9px] text-zinc-700">{category} · {tone}</span>
            </div>
          </div>

          {/* Step content */}
          <div className="flex-1 px-7 py-7 max-w-2xl mx-auto w-full">
            <div key={activeStep} className="fade-up">

              {/* Step heading */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={STEPS[activeStep-1]?.icon}/>
                  </svg>
                </div>
                <div>
                  <h2 className="f-ui text-lg font-bold text-zinc-100">{STEPS[activeStep-1]?.label}</h2>
                  <p className="f-code text-[9px] text-zinc-600 tracking-widest uppercase">Step {activeStep} / {STEPS.length}</p>
                </div>
              </div>

              {/* ── Step 1 ── */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <p className="f-ui text-sm text-zinc-400 leading-relaxed">What is this email trying to achieve? Be specific — better context = better output.</p>
                  <div className="field-box rounded-2xl overflow-hidden">
                    <div className="px-4 pt-4 pb-1">
                      <label className="f-code text-[8px] tracking-[3px] uppercase text-cyan-500/50 block mb-2.5">Email Purpose *</label>
                      <textarea value={purpose} onChange={e=>setPurpose(e.target.value)} rows={4}
                        placeholder="e.g. Announce our new product launch to existing customers and drive sign-ups for the beta program..."
                        className="w-full f-ui text-sm leading-relaxed resize-none placeholder:text-zinc-600" />
                    </div>
                    <div className="px-4 py-2.5 border-t border-zinc-800/50 flex items-center justify-between">
                      <span className="f-code text-[8px] text-zinc-600">{purpose.length} chars</span>
                      {purpose.length > 0 && <span className="f-code text-[8px] text-emerald-400">✓ Looks good</span>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Product launch","Sale announcement","Re-engagement","Event invite","Feature update"].map(ex=>(
                      <button key={ex} onClick={()=>setPurpose(p=>p?p:ex+" — ")}
                        className="px-3 py-1.5 f-code text-[9px] text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:text-zinc-300 transition-all cursor-pointer">
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 2 ── */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <p className="f-ui text-sm text-zinc-400 leading-relaxed">Who will receive this email? Defining your audience tailors the language and messaging.</p>
                  <div className="field-box rounded-2xl overflow-hidden">
                    <div className="px-4 pt-4 pb-1">
                      <label className="f-code text-[8px] tracking-[3px] uppercase text-cyan-500/50 block mb-2.5">Target Audience</label>
                      <input value={audience} onChange={e=>setAudience(e.target.value)}
                        placeholder="e.g. SaaS founders, fashion lovers, gym beginners..."
                        className="w-full f-ui text-sm py-1.5" />
                    </div>
                    <div className="px-4 py-2.5 border-t border-zinc-800/50">
                      <span className="f-code text-[8px] text-zinc-600">Leave blank for general audience</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[["B2B Professionals","Executives, founders, managers"],["E-commerce Shoppers","Online buyers, deal-hunters"],["Tech Enthusiasts","Developers, early adopters"],["Health & Wellness","Wellness-focused individuals"]].map(([lbl,desc])=>(
                      <button key={lbl} onClick={()=>setAudience(lbl)}
                        className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${audience===lbl?"bg-cyan-500/8 border-cyan-500/40":"bg-zinc-900/60 border-zinc-800 hover:border-zinc-600"}`}>
                        <p className="f-ui text-[12px] font-semibold text-zinc-200 mb-0.5">{lbl}</p>
                        <p className="f-code text-[9px] text-zinc-500">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 3 ── */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <p className="f-ui text-sm text-zinc-400 leading-relaxed">Select the category that best describes this template's intent.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(c=>(
                      <button key={c} onClick={()=>setCategory(c)}
                        className={`cat-btn p-4 rounded-xl text-left ${category===c?"sel":""}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="f-ui text-[13px] font-semibold text-zinc-200">{c}</span>
                          {category===c && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                        </div>
                        <p className="f-code text-[9px] text-zinc-600">
                          {{"Welcome":"First impression","Promotional":"Offers & deals","Follow-up":"Check-in message","Newsletter":"Regular updates","Apology":"Address issues","Announcement":"Share big news","Thank You":"Express gratitude","Onboarding":"Guide new users"}[c]}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 4 ── */}
              {activeStep === 4 && (
                <div className="space-y-4">
                  <p className="f-ui text-sm text-zinc-400 leading-relaxed">Choose the voice and energy your email should carry.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {TONES.map(({label,emoji,desc})=>(
                      <button key={label} onClick={()=>setTone(label)}
                        className={`tone-card p-4 rounded-xl text-left ${tone===label?"sel":""}`}>
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="text-xl">{emoji}</span>
                          <span className="f-ui text-[13px] font-semibold text-zinc-200">{label}</span>
                          {tone===label && <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400" />}
                        </div>
                        <p className="f-code text-[9px] text-zinc-500">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 5 ── */}
              {activeStep === 5 && (
                <div className="space-y-4">
                  <p className="f-ui text-sm text-zinc-400 leading-relaxed">Any finishing touches? Brand name, specific offer, deadline, or CTA link.</p>
                  <div className="field-box rounded-2xl overflow-hidden">
                    <div className="px-4 pt-4 pb-1">
                      <label className="f-code text-[8px] tracking-[3px] uppercase text-cyan-500/50 block mb-2.5">Extra Details <span className="text-zinc-600 normal-case tracking-normal text-[8px]">(optional)</span></label>
                      <input value={details} onChange={e=>setDetails(e.target.value)}
                        placeholder="Brand name, offer %, deadline, CTA URL..."
                        className="w-full f-ui text-sm py-1.5" />
                    </div>
                    <div className="px-4 py-2.5 border-t border-zinc-800/50">
                      <span className="f-code text-[8px] text-zinc-600">Woven naturally into the copy</span>
                    </div>
                  </div>
                  {/* Summary */}
                  <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
                    <p className="f-code text-[8px] text-zinc-600 tracking-widest uppercase mb-3">Configuration Summary</p>
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                      {[{l:"Category",v:category},{l:"Tone",v:`${toneObj.emoji} ${tone}`},{l:"Audience",v:audience||"General"},{l:"Purpose",v:purpose.slice(0,36)+(purpose.length>36?"…":"")}].map(row=>(
                        <div key={row.l} className="flex items-start gap-2">
                          <span className="f-code text-[8px] text-zinc-600 w-14 shrink-0 pt-px">{row.l}</span>
                          <span className="f-code text-[9px] text-cyan-400/80 leading-tight">{row.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step nav */}
              <div className="flex items-center gap-3 mt-7">
                {activeStep > 1 && (
                  <button onClick={()=>setActiveStep(s=>s-1)}
                    className="px-4 py-2.5 rounded-xl f-ui text-[13px] font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-200 transition-all cursor-pointer flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                    Back
                  </button>
                )}
                {activeStep < STEPS.length ? (
                  <button onClick={()=>setActiveStep(s=>s+1)}
                    className="ml-auto px-5 py-2.5 rounded-xl f-ui text-[13px] font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 transition-all cursor-pointer flex items-center gap-1.5">
                    Next
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </button>
                ) : (
                  <button onClick={generate} disabled={!canGenerate||loading}
                    className={`ml-auto px-6 py-2.5 rounded-xl f-ui text-[13px] font-semibold flex items-center gap-2 cursor-pointer
                      ${canGenerate&&!loading?"gen-btn text-white":"bg-zinc-800 text-zinc-600 border border-zinc-700 cursor-not-allowed"}`}>
                    {loading?(<><div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white spin-it" />Generating…</>):(<><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>Generate</>)}
                  </button>
                )}
              </div>
            </div>

            {/* ── OUTPUT ── */}
            {(result || loading) && (
              <div className="fade-up mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                  <span className="f-code text-[8px] text-zinc-600 tracking-widest uppercase px-2">Generated Output</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                </div>

                <div className="output-card rounded-2xl overflow-hidden">
                  {/* Chrome bar */}
                  <div className="bg-zinc-900/90 border-b border-zinc-800 px-5 py-3 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                      <div className="w-3 h-3 rounded-full bg-green-400/60" />
                    </div>
                    <div className="flex-1 bg-zinc-800/60 rounded-md px-3 py-1 f-code text-[9px] text-zinc-500 text-center border border-zinc-700/40">
                      compose · {category.toLowerCase()} · {tone.toLowerCase()}
                    </div>
                    <div className="flex gap-1">
                      {["preview","raw"].map(tab=>(
                        <button key={tab} onClick={()=>setActiveTab(tab)}
                          className={`tab-pill px-3 py-1 rounded-lg f-code text-[9px] tracking-wide uppercase ${activeTab===tab?"on":""}`}>
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {loading ? (
                    <div className="scanline-wrap p-10 flex flex-col items-center justify-center min-h-[220px] bg-zinc-950/50">
                      <div className="scanline" />
                      <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-cyan-500 spin-it mb-4" />
                      <p className="f-ui text-sm text-zinc-400 mb-1">Crafting your email…</p>
                      <p className="f-code text-[10px] text-zinc-600">{category} · {tone} · {audience||"General"}</p>
                    </div>

                  ) : result && activeTab === "preview" ? (
                    <div className="p-6 bg-zinc-950/20">
                      {/* Sender */}
                      <div className="flex items-center gap-3 pb-4 mb-5 border-b border-zinc-800/60">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center f-code text-[10px] text-white font-bold shrink-0">MC</div>
                        <div className="flex-1 min-w-0">
                          <p className="f-ui text-[12px] font-semibold text-zinc-200">MailCraft Team</p>
                          <p className="f-code text-[10px] text-zinc-500">hello@mailcraft.app → <span className="text-cyan-500/60">&#123;&#123;first_name&#125;&#125;</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="f-code text-[9px] px-2 py-0.5 bg-zinc-800 text-zinc-500 rounded-md border border-zinc-700/50">{category}</span>
                          <span className="f-code text-[9px] text-zinc-600">Just now</span>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="mb-5">
                        <p className="f-code text-[8px] tracking-[2px] uppercase text-cyan-500/40 mb-2">Subject Line</p>
                        <p className="f-ui text-xl font-bold text-zinc-100 leading-snug">
                          {typedSubj}{typing && typedBody.length===0 && <span className="blink text-cyan-400 ml-0.5">|</span>}
                        </p>
                      </div>

                      {/* Body */}
                      <div className="scanline-wrap rounded-xl bg-zinc-900/60 border border-zinc-800/60 p-5 mb-5">
                        {typing && <div className="scanline" />}
                        <p className="f-ui text-sm leading-[1.85] text-zinc-300 whitespace-pre-wrap">
                          {typedBody}{typing && typedBody.length>0 && <span className="blink text-cyan-400">|</span>}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={()=>copyText(`Subject: ${result.subject}\n\n${result.body}`,"all")}
                          className={`copy-btn px-4 py-2 rounded-lg f-code text-[9px] tracking-wide uppercase flex items-center gap-1.5 ${copied==="all"?"on":""}`}>
                          {copied==="all"?<><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>Copied!</>:"Copy Full Email"}
                        </button>
                        <button onClick={()=>copyText(result.subject,"subj")} className={`copy-btn px-4 py-2 rounded-lg f-code text-[9px] tracking-wide uppercase ${copied==="subj"?"on":""}`}>
                          {copied==="subj"?"✓ Subject":"Copy Subject"}
                        </button>
                        <button onClick={()=>copyText(result.body,"body")} className={`copy-btn px-4 py-2 rounded-lg f-code text-[9px] tracking-wide uppercase ${copied==="body"?"on":""}`}>
                          {copied==="body"?"✓ Body":"Copy Body"}
                        </button>
                        <button onClick={generate}
                          className="ml-auto copy-btn px-4 py-2 rounded-lg f-code text-[9px] tracking-wide uppercase flex items-center gap-1.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                          Regen
                        </button>
                      </div>
                    </div>

                  ) : result && activeTab === "raw" ? (
                    <div className="bg-zinc-950 p-6 f-code text-[11px] leading-loose">
                      <div className="text-zinc-700 text-[8px] tracking-widest mb-4">// raw output — claude-sonnet-4</div>
                      <div><span className="text-cyan-400">subject</span><span className="text-zinc-600">: </span><span className="text-amber-300/80">"{result.subject}"</span></div>
                      <div className="h-px bg-zinc-800 my-4" />
                      <div>
                        <span className="text-cyan-400">body</span><span className="text-zinc-600">:</span>
                        <pre className="text-zinc-400 mt-3 whitespace-pre-wrap text-[10px] leading-relaxed pl-4 border-l border-zinc-800">{result.body}</pre>
                      </div>
                    </div>
                  ) : null}
                </div>

                {result && (
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="f-code text-[8px] text-zinc-600 tracking-widest uppercase">Variables</span>
                    {["{{first_name}}","{{company}}","{{cta_link}}","{{offer_code}}"].map(v=>(
                      <span key={v} className="f-code text-[9px] px-2 py-1 bg-zinc-900 text-cyan-500/50 border border-zinc-800 rounded-md">{v}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status bar */}
          <div className="sticky bottom-0 px-7 py-2.5 border-t border-zinc-800/60 bg-zinc-950/95 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-3 f-code text-[8px] text-zinc-700">
              <span>MailCraft v2</span>
              <span>·</span>
              <span>Powered by Claude</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="f-code text-[8px] text-zinc-700">{completedCount}/{STEPS.length} steps</span>
              <div className="w-14 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="progress-fill h-full rounded-full" style={{ width:`${(completedCount/STEPS.length)*100}%` }} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}