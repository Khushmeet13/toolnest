import { useState, useEffect } from "react";

const CATEGORIES = ["Welcome", "Promotional", "Follow-up", "Newsletter", "Apology", "Announcement", "Thank You", "Onboarding"];

const TONES = [
  { label: "Formal", emoji: "🎩" },
  { label: "Friendly", emoji: "😊" },
  { label: "Urgent", emoji: "⚡" },
  { label: "Persuasive", emoji: "🎯" },
  { label: "Empathetic", emoji: "💛" },
  { label: "Bold", emoji: "🔥" },
];

const PREVIEW_TEMPLATES = [
  {
    tag: "Welcome",
    subject: "Welcome to the family, {{first_name}}! 🎉",
    body: "Hi {{first_name}},\n\nWe're so excited to have you on board. Your journey with us starts today — and we've made sure it begins with a bang.\n\nHere's what you can expect next...",
  },
  {
    tag: "Promotional",
    subject: "🔥 48 Hours Only: Your Exclusive Offer Inside",
    body: "Hey {{first_name}},\n\nWe don't do this often, but we're giving our best customers something special. For the next 48 hours, unlock 30% off everything in your cart.\n\nNo strings attached. Just our way of saying thanks.",
  },
  {
    tag: "Follow-up",
    subject: "Just checking in, {{first_name}} 👋",
    body: "Hi {{first_name}},\n\nI wanted to follow up on our last conversation. Have you had a chance to review the proposal? I'd love to hear your thoughts and answer any questions you might have.",
  },
];

const STATS = [
  { value: "5K+", label: "Templates Made" },
  { value: "98%", label: "Open Rate Boost" },
  { value: "< 8s", label: "Generation Time" },
];

export default function EmailTemplateGenerator() {
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState("");
  const [category, setCategory] = useState("Welcome");
  const [tone, setTone] = useState("Friendly");
  const [details, setDetails] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDot, setLoadingDot] = useState(0);
  const [copied, setCopied] = useState(null);
  const [visible, setVisible] = useState(false);
  const [activePreview, setActivePreview] = useState(0);
  const [activeTab, setActiveTab] = useState("preview");

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  useEffect(() => {
    if (!loading) return;
    const iv = setInterval(() => setLoadingDot(d => (d + 1) % 4), 380);
    return () => clearInterval(iv);
  }, [loading]);

  useEffect(() => {
    if (result) return;
    const iv = setInterval(() => setActivePreview(p => (p + 1) % PREVIEW_TEMPLATES.length), 3200);
    return () => clearInterval(iv);
  }, [result]);

  const generate = async () => {
    if (!purpose.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Generate a professional email template.
Purpose: ${purpose}
Target Audience: ${audience || "general"}
Category: ${category}
Tone: ${tone}
Additional Details: ${details || "none"}

Rules:
- Write a compelling subject line
- Write a complete email body (3-5 paragraphs)
- Use {{first_name}} for personalization where natural
- Include a clear CTA
- Match the tone precisely
- Make it feel human, not robotic

Return ONLY a raw JSON object with keys: "subject" (string) and "body" (string). No markdown, no explanation.`
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
      setActiveTab("preview");
    } catch {
      setResult({
        subject: `Your exclusive ${category.toLowerCase()} — just for you, {{first_name}} ✨`,
        body: `Hi {{first_name}},\n\nThank you for being part of our community. We truly appreciate your continued support and wanted to reach out personally.\n\n${purpose}\n\nWe've put a lot of thought into making this experience exceptional for you. Every detail has been crafted with your needs in mind.\n\nIf you have any questions or need assistance, our team is always here and ready to help. We'd love to hear from you.\n\nWarm regards,\nThe Team`,
      });
      setActiveTab("preview");
    }
    setLoading(false);
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    if (!result) return;
    copyText(`Subject: ${result.subject}\n\n${result.body}`, "all");
  };

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@300;400&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatY { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
        @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes slideRight { from { width:0%; } to { width:100%; } }
        .fade-up { animation: fadeUp 0.55s cubic-bezier(.16,1,.3,1) both; }
        .float-y { animation: floatY 4s ease-in-out infinite; }
        .shimmer-text { background: linear-gradient(90deg,#0891b2 0%,#06b6d4 40%,#67e8f9 60%,#0891b2 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:shimmer 3s linear infinite; }
        .cursor-blink { animation: blink 1s step-end infinite; }
        .progress-bar { animation: slideRight 2s ease-in-out infinite; }
        textarea:focus, input:focus { outline: none; }
        .email-body { white-space: pre-wrap; }
      `}</style>

      <div className={`max-w-7xl mx-auto px-5 py-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex justify-center items-baseline gap-3 flex-wrap mb-3">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-cyan-600">Email</h1>
            <h1 className="font-display text-4xl font-normal italic tracking-tight text-black">Template</h1>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-black">Generator</h1>
          </div>
          <p className="font-mono-dm text-[11px] tracking-[2px] text-gray-400 uppercase mt-3">
            Craft emails that get opened, read & clicked
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT — Form */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-7 space-y-6">

              {/* Purpose */}
              <div>
                <label className="font-mono-dm text-[9px] tracking-[3px] uppercase text-cyan-600 block mb-2">
                  01 — Email Purpose
                </label>
                <textarea
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  rows={3}
                  placeholder="e.g. Announce our new product launch to existing customers..."
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-black text-[14px] font-display placeholder:text-gray-300 focus:border-cyan-400 transition-colors resize-none leading-relaxed"
                />
                <div className="text-right font-mono-dm text-[10px] text-gray-300 mt-1">{purpose.length} chars</div>
              </div>

              {/* Audience */}
              <div>
                <label className="font-mono-dm text-[9px] tracking-[3px] uppercase text-cyan-600 block mb-2">
                  02 — Target Audience
                </label>
                <input
                  value={audience}
                  onChange={e => setAudience(e.target.value)}
                  placeholder="e.g. SaaS founders, fashion lovers, gym beginners..."
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 text-[14px] font-display placeholder:text-gray-300 focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="font-mono-dm text-[9px] tracking-[3px] uppercase text-cyan-600 block mb-2">
                  03 — Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setCategory(c)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-mono-dm tracking-wide border transition-all duration-200 cursor-pointer ${category === c
                        ? "bg-cyan-600 border-cyan-600 text-white"
                        : "border-gray-200 text-gray-500 hover:border-cyan-400 hover:text-cyan-600"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="font-mono-dm text-[9px] tracking-[3px] uppercase text-cyan-600 block mb-2">
                  04 — Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map(({ label, emoji }) => (
                    <button key={label} onClick={() => setTone(label)}
                      className={`px-3 py-2 rounded-full text-[12px] font-display border transition-all duration-200 cursor-pointer ${tone === label
                        ? "border-cyan-400 bg-cyan-50 text-cyan-600"
                        : "border-gray-200 text-gray-500 hover:border-cyan-300 hover:text-cyan-600"}`}>
                      {emoji} {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div>
                <label className="font-mono-dm text-[9px] tracking-[3px] uppercase text-cyan-600 block mb-2">
                  05 — Extra Details <span className="text-gray-300 normal-case tracking-normal text-[9px]">(optional)</span>
                </label>
                <input
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="Brand name, offer, deadline, CTA link..."
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-700 text-[14px] font-display placeholder:text-gray-300 focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Generate */}
              <button onClick={generate} disabled={!purpose.trim() || loading}
                className={`w-full py-4 rounded-lg font-mono-dm text-[11px] tracking-[4px] uppercase transition-all duration-300 cursor-pointer ${purpose.trim() && !loading
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/25"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                {loading ? `✦ Writing${".".repeat(loadingDot)}` : "✦ Generate Template"}
              </button>

            </div>
          </div>

          {/* RIGHT — Output or Preview */}
          <div className="lg:col-span-7">

            {result ? (
              /* ── RESULT ── */
              <div className="fade-up">
                {/* Tab bar */}
                <div className="flex items-center gap-1 mb-4 bg-gray-100 rounded-xl p-1">
                  {["preview", "raw"].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2.5 rounded-lg font-mono-dm text-[10px] tracking-[2px] uppercase transition-all duration-200 cursor-pointer ${activeTab === tab
                        ? "bg-white text-cyan-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"}`}>
                      {tab === "preview" ? "📧 Preview" : "< / > Raw"}
                    </button>
                  ))}
                </div>

                {/* Email mock */}
                <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  {/* Email client top bar */}
                  <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 bg-white rounded-md px-3 py-1 font-mono-dm text-[10px] text-gray-400 text-center">
                      Email Preview
                    </div>
                  </div>

                  {activeTab === "preview" ? (
                    <div className="bg-white p-6">
                      {/* From */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-mono-dm text-[11px]">
                          TN
                        </div>
                        <div>
                          <p className="font-mono-dm text-[11px] text-black">ToolNest Team</p>
                          <p className="font-mono-dm text-[10px] text-gray-400">hello@toolnest.app → {"{first_name}"}</p>
                        </div>
                        <div className="ml-auto font-mono-dm text-[10px] text-gray-300">Just now</div>
                      </div>

                      {/* Subject */}
                      <div className="mb-4">
                        <p className="font-mono-dm text-[9px] tracking-[2px] uppercase text-cyan-600 mb-1">Subject</p>
                        <p className="font-display text-lg font-semibold text-black leading-snug">{result.subject}</p>
                      </div>

                      {/* Body */}
                      <div className="bg-gray-50 rounded-lg p-5 mb-4">
                        <p className="font-display text-[14px] leading-relaxed text-gray-700 email-body">{result.body}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={copyAll}
                          className={`px-4 py-2 rounded-lg font-mono-dm text-[10px] tracking-[2px] uppercase border transition-all duration-200 cursor-pointer ${copied === "all"
                            ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                            : "border-cyan-300 text-cyan-600 hover:bg-cyan-600 hover:text-white"}`}>
                          {copied === "all" ? "✓ Copied All" : "Copy Full Email"}
                        </button>
                        <button onClick={() => copyText(result.subject, "subj")}
                          className={`px-4 py-2 rounded-lg font-mono-dm text-[10px] tracking-[2px] uppercase border transition-all duration-200 cursor-pointer ${copied === "subj"
                            ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                            : "border-gray-200 text-gray-500 hover:border-cyan-300 hover:text-cyan-600"}`}>
                          {copied === "subj" ? "✓ Copied" : "Copy Subject"}
                        </button>
                        <button onClick={() => copyText(result.body, "body")}
                          className={`px-4 py-2 rounded-lg font-mono-dm text-[10px] tracking-[2px] uppercase border transition-all duration-200 cursor-pointer ${copied === "body"
                            ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                            : "border-gray-200 text-gray-500 hover:border-cyan-300 hover:text-cyan-600"}`}>
                          {copied === "body" ? "✓ Copied" : "Copy Body"}
                        </button>
                        <button onClick={generate}
                          className="ml-auto px-4 py-2 rounded-lg font-mono-dm text-[10px] tracking-[2px] uppercase border border-gray-200 text-gray-400 hover:border-cyan-400 hover:text-cyan-600 transition-all duration-200 cursor-pointer">
                          ↻ Regenerate
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Raw tab */
                    <div className="bg-[#0f1117] p-6 font-mono-dm text-[12px] leading-relaxed">
                      <div className="mb-3">
                        <span className="text-cyan-400">subject:</span>
                        <span className="text-gray-300 ml-2">"{result.subject}"</span>
                      </div>
                      <div className="h-px bg-gray-700 mb-3" />
                      <div>
                        <span className="text-cyan-400">body:</span>
                        <pre className="text-gray-300 mt-2 whitespace-pre-wrap text-[11px] leading-relaxed">{result.body}</pre>
                      </div>
                    </div>
                  )}
                </div>

                {/* Variable hint */}
                <div className="mt-3 flex gap-2 flex-wrap">
                  {["{{first_name}}", "{{company}}", "{{cta_link}}"].map(v => (
                    <span key={v} className="font-mono-dm text-[10px] px-2 py-1 bg-cyan-50 text-cyan-600 border border-cyan-200 rounded-md">{v}</span>
                  ))}
                  <span className="font-mono-dm text-[10px] text-gray-400 self-center ml-1">← replace with real values</span>
                </div>
              </div>

            ) : (
              /* ── EMPTY STATE ── */
              <div className="flex flex-col gap-5 h-full">

                <div className="text-center">
                  <p className="font-mono-dm text-[9px] tracking-[3px] uppercase text-gray-400 mb-1">Preview</p>
                  <p className="font-display text-sm italic text-gray-400">See what your email could look like</p>
                </div>

                {/* Animated preview email mocks */}
                <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
                    </div>
                    <div className="flex-1 bg-white rounded px-3 py-0.5 font-mono-dm text-[9px] text-gray-300 text-center">
                      inbox preview
                    </div>
                  </div>

                  <div className="bg-white p-5 min-h-48 relative overflow-hidden">
                    {PREVIEW_TEMPLATES.map((tpl, i) => (
                      <div key={i}
                        className="absolute inset-5 transition-all duration-700"
                        style={{ opacity: activePreview === i ? 1 : 0, transform: activePreview === i ? "translateY(0)" : "translateY(12px)", pointerEvents: activePreview === i ? "auto" : "none" }}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-mono-dm text-[9px]">TN</div>
                          <div>
                            <p className="font-mono-dm text-[10px] text-black">ToolNest</p>
                            <p className="font-mono-dm text-[9px] text-gray-300">hello@toolnest.app</p>
                          </div>
                          <span className="ml-auto font-mono-dm text-[9px] px-2 py-0.5 bg-cyan-50 text-cyan-500 border border-cyan-100 rounded-full">{tpl.tag}</span>
                        </div>
                        <p className="font-display text-[15px] font-semibold text-black mb-2 leading-snug">{tpl.subject}</p>
                        <p className="font-display text-[12px] text-gray-500 leading-relaxed line-clamp-3">{tpl.body}</p>
                      </div>
                    ))}
                  </div>

                  {/* Dot nav */}
                  <div className="flex justify-center gap-2 py-3 bg-gray-50 border-t border-gray-100">
                    {PREVIEW_TEMPLATES.map((_, i) => (
                      <button key={i} onClick={() => setActivePreview(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activePreview === i ? "w-5 bg-cyan-500" : "w-1.5 bg-gray-300"}`} />
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {STATS.map(({ value, label }, i) => (
                    <div key={label} className="float-y rounded-xl border border-gray-100 bg-gray-50 p-3 text-center" style={{ animationDelay: `${i * 0.4}s` }}>
                      <div className="shimmer-text font-mono-dm text-xl font-bold">{value}</div>
                      <div className="font-mono-dm text-[9px] text-gray-400 tracking-wide mt-0.5 leading-tight">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2">
                  {["✓ Subject Line", "✓ Full Body", "✓ Personalization", "✓ CTA Included", "✓ Copy-Ready"].map(f => (
                    <span key={f} className="font-mono-dm text-[10px] px-3 py-1.5 bg-cyan-50 text-cyan-600 border border-cyan-100 rounded-full">{f}</span>
                  ))}
                </div>

                {/* CTA hint */}
                <div className="rounded-xl border border-dashed border-cyan-300/60 bg-cyan-50/40 p-4 text-center">
                  <div className="text-2xl mb-2">✉️</div>
                  <p className="font-display text-sm italic text-gray-500">Fill the form to generate your</p>
                  <p className="font-display text-sm italic text-gray-500">perfect email template</p>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    {[0, 0.3, 0.6].map(d => (
                      <div key={d} className="w-1 h-1 rounded-full bg-cyan-400 cursor-blink" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}