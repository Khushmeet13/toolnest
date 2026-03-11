import { useState, useEffect, useRef } from "react";

const CATEGORIES = ["Welcome", "Promotional", "Follow-up", "Newsletter", "Apology", "Announcement", "Thank You", "Onboarding"];
const TONES = [
  { label: "Formal", emoji: "🎩", desc: "Professional & polished" },
  { label: "Friendly", emoji: "😊", desc: "Warm & approachable" },
  { label: "Urgent", emoji: "⚡", desc: "Time-sensitive & direct" },
  { label: "Persuasive", emoji: "🎯", desc: "Compelling & action-driven" },
  { label: "Empathetic", emoji: "💛", desc: "Caring & understanding" },
  { label: "Bold", emoji: "🔥", desc: "Daring & high-impact" },
];

const STEPS = [
  { id: 1, key: "purpose", label: "Purpose", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { id: 2, key: "audience", label: "Audience", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: 3, key: "category", label: "Category", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
  { id: 4, key: "tone", label: "Tone", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
  { id: 5, key: "details", label: "Details", icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" },
];


const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY; // Your API key
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;

export default function EmailTemplateGenerator() {
  const [activeStep, setActiveStep] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState("");
  const [category, setCategory] = useState("Welcome");
  const [tone, setTone] = useState("Friendly");
  const [details, setDetails] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [activeTab, setActiveTab] = useState("preview");
  const [visible, setVisible] = useState(false);
  const [typedSubj, setTypedSubj] = useState("");
  const [typedBody, setTypedBody] = useState("");
  const [typing, setTyping] = useState(false);
  const [apiError, setApiError] = useState(null);

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
    if (s.key === "purpose") return purpose.trim().length > 0;
    if (s.key === "audience") return audience.trim().length > 0;
    return true;
  };

  const completedCount = STEPS.filter(stepDone).length;
  const canGenerate = purpose.trim().length > 0;
  const toneObj = TONES.find(t => t.label === tone) || TONES[1];

  // 🎯 Generate email using Gemini API
  const generateWithGemini = async () => {
    const prompt = `Generate a professional email template with the following details:

Purpose: ${purpose}
Target Audience: ${audience || "general audience"}
Category: ${category}
Tone: ${tone}
Additional Details: ${details || "none"}

IMPORTANT RULES:
1. Create a compelling subject line that grabs attention
2. Write 3-5 paragraphs for the email body
3. Use {{first_name}} naturally in the body (at least once)
4. Include a clear Call-to-Action (CTA)
5. Match the ${tone} tone perfectly
6. Make it feel human and personal, not robotic
7. Keep paragraphs concise and scannable
8. Use emojis sparingly but effectively if tone allows

Return ONLY a valid JSON object with this exact format:
{"subject": "Your compelling subject line here", "body": "Your email body here with proper line breaks"}

NO markdown, NO explanations, NO additional text. Just the JSON object.`;

    try {
      console.log("🔄 Calling Gemini API for email template...");

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_ONLY_HIGH"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_ONLY_HIGH"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_ONLY_HIGH"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_ONLY_HIGH"
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Gemini API error response:", errorData);
        throw new Error(`Gemini API failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Gemini API response received");

      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new Error("No text generated from Gemini");
      }

      // Clean up the response
      let cleanText = generatedText
        .replace(/```json\s*/g, '')
        .replace(/```\s*$/g, '')
        .replace(/^```/g, '')
        .trim();

      // Find JSON object in the text
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }

      const parsed = JSON.parse(cleanText);

      // Validate the response has required fields
      if (!parsed.subject || !parsed.body) {
        throw new Error("Invalid response format");
      }

      return parsed;

    } catch (error) {
      console.error("❌ Gemini API error:", error);
      throw error;
    }
  };

  // 📝 Smart fallback that creates personalized email
  const getPersonalizedFallback = () => {
    const toneGreetings = {
      "Formal": "Dear",
      "Friendly": "Hi",
      "Urgent": "ATTENTION",
      "Persuasive": "Imagine this",
      "Empathetic": "Hello",
      "Bold": "Hey"
    };

    const toneClosings = {
      "Formal": "Sincerely",
      "Friendly": "Best regards",
      "Urgent": "Act now",
      "Persuasive": "Don't wait",
      "Empathetic": "Warmly",
      "Bold": "Onward"
    };

    const greeting = toneGreetings[tone] || "Hi";
    const closing = toneClosings[tone] || "Best regards";

    const subject = `${category} Update: ${purpose.substring(0, 50)}${purpose.length > 50 ? '...' : ''}`;

    const body = `${greeting} {{first_name}},

I hope this message finds you well. I'm reaching out because ${purpose.toLowerCase()}.

${audience ? `As a valued member of our ${audience} community, ` : ''}We've crafted this message especially with you in mind. ${details ? `Here are the key details: ${details}` : ''}

We'd love to hear your thoughts on this. Please don't hesitate to reach out if you have any questions or would like to learn more.

${closing},
The ${category} Team

P.S. ${tone === "Urgent" ? "This opportunity won't last long!" : "We're here to help anytime!"}`;

    return { subject, body };
  };

  // 🚀 Main generate function
  const generate = async () => {
    if (!canGenerate || loading) return;

    setLoading(true);
    setResult(null);
    setApiError(null);
    setActiveTab("preview");

    try {
      // Try Gemini API first
      const generatedEmail = await generateWithGemini();

      if (generatedEmail) {
        setResult(generatedEmail);
      } else {
        // Use personalized fallback
        setApiError("✨ Using smart generation mode. Your email is personalized based on your input!");
        setResult(getPersonalizedFallback());
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setApiError("✨ Using smart fallback. Your email is still personalized!");
      setResult(getPersonalizedFallback());
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2200);
  };

  return (
    <div className=" overflow-hidden py-16">

      <h1 className="text-4xl font-medium text-gray-900 text-center mb-8">
        Email template <span className="text-cyan-700">generator</span>
      </h1>

      <div className={`relative max-w-5xl border border-gray-200 shadow-md rounded-lg shadow-cyan-100/50 mx-auto flex h-screen transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>

        {/* ═══════════ SIDEBAR ═══════════ */}
        <aside className="sidebar-bg w-60 flex-shrink-0 flex flex-col h-screen sticky top-0 z-20 border-r border-gray-200">

          {/* Progress */}
          <div className="px-5 py-4" style={{ borderBottom: "1.5px solid #e0f7fa" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="f-code text-[8px] tracking-widest uppercase" style={{ color: "#9dd6e5" }}>Progress</span>
              <span className="f-code text-[9px] font-medium" style={{ color: "#06b6d4" }}>{completedCount}/{STEPS.length}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#e0f7fa" }}>
              <div className="progress-fill h-full rounded-full" style={{ width: `${(completedCount / STEPS.length) * 100}%` }} />
            </div>
          </div>

          {/* Steps */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="flex flex-col">
              {STEPS.map((step, idx) => {
                const done = stepDone(step);
                const active = activeStep === step.id;
                return (
                  <div key={step.id} className="flex flex-col items-stretch">
                    <button
                      onClick={() => setActiveStep(step.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left group border ${active ? "step-active" : "hover:bg-cyan-50 border-transparent"}`}
                      style={{ borderColor: active ? "#7de8f8" : "transparent" }}>
                      {/* Dot */}
                      <div className={`relative w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all`}
                        style={{
                          background: done ? "linear-gradient(135deg,#cff3fd,#a5f3fc)" : active ? "#e0f9ff" : "#f0fbff",
                          border: done ? "1.5px solid #06b6d4" : active ? "1.5px solid #22d3ee" : "1.5px solid #cff3fd"
                        }}>
                        {done ? (
                          <svg className="w-3 h-3" style={{ color: "#0891b2" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="f-code text-[8px] font-bold" style={{ color: active ? "#0891b2" : "#9dd6e5" }}>{step.id}</span>
                        )}
                        {active && !done && (
                          <div className="absolute inset-0 rounded-full ping-ring" style={{ border: "1.5px solid #22d3ee" }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="f-ui text-[12px] font-semibold transition-colors"
                          style={{ color: active ? "#0891b2" : done ? "#3d8fa0" : "#9dd6e5" }}>
                          {step.label}
                        </p>
                      </div>
                      {active && <div className="w-1 h-4 rounded-full shrink-0" style={{ background: "linear-gradient(180deg,#06b6d4,#22d3ee)" }} />}
                    </button>
                    {idx < STEPS.length - 1 && (
                      <div className={`mx-[1.35rem] my-0.5 step-line ${done ? "done" : ""}`} style={{ height: "12px" }} />
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4" style={{ borderTop: "1.5px solid #cff3fd" }}>
            <div className="flex gap-1.5 flex-wrap mb-3">
              <span className="f-code text-[8px] px-2 py-1 rounded-lg border truncate max-w-full" style={{ background: "#f0fbff", border: "1.5px solid #cff3fd", color: "#5bb8cb" }}>{category}</span>
              <span className="f-code text-[8px] px-2 py-1 rounded-lg border" style={{ background: "#f0fbff", border: "1.5px solid #cff3fd", color: "#5bb8cb" }}>{toneObj.emoji} {tone}</span>
            </div>
            <button
              onClick={generate}
              disabled={!canGenerate || loading}
              className={`w-full py-2.5 rounded-xl f-ui text-[12px] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${canGenerate && !loading ? "gen-btn" : ""}`}
              style={!canGenerate || loading ? { background: "#e0f7fa", color: "#9dd6e5", border: "1.5px solid #cff3fd", cursor: "not-allowed" } : {}}>
              {loading ? (
                <><div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white spin-it" />Gemini is writing…</>
              ) : (
                <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Generate with Gemini</>
              )}
            </button>
            {!canGenerate && <p className="f-code text-[8px] text-center mt-1.5" style={{ color: "#9dd6e5" }}>Add purpose first</p>}
            {apiError && (
              <p className="f-code text-[8px] text-center mt-1.5 text-amber-600">{apiError}</p>
            )}
          </div>
        </aside>

        {/* ═══════════ MAIN AREA ═══════════ */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto">

          {/* Step content */}
          <div className="flex-1 px-7 py-7 max-w-2xl mx-auto w-full">
            <div key={activeStep} className="fade-up">

              {/* Step heading */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #e0f9ff, #cff3fd)", border: "1.5px solid #7de8f8" }}>
                  <svg className="w-4 h-4" style={{ color: "#0891b2" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={STEPS[activeStep - 1]?.icon} />
                  </svg>
                </div>
                <div>
                  <h2 className="f-ui text-lg font-bold" style={{ color: "#0e4f5c" }}>{STEPS[activeStep - 1]?.label}</h2>
                  <p className="f-code text-[9px] tracking-widest uppercase" style={{ color: "#9dd6e5" }}>Step {activeStep} / {STEPS.length}</p>
                </div>
              </div>

              {/* ── Step 1 ── */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <p className="f-ui text-sm leading-relaxed" style={{ color: "#3d8fa0" }}>What is this email trying to achieve? Be specific — better context = better output.</p>
                  <div className="field-box rounded-2xl overflow-hidden">
                    <div className="px-4 pt-4 pb-1">
                      <label className="f-code text-[8px] tracking-[3px] uppercase block mb-2.5" style={{ color: "#22d3ee" }}>Email Purpose *</label>
                      <textarea value={purpose} onChange={e => setPurpose(e.target.value)} rows={4}
                        placeholder="e.g. Announce our new product launch to existing customers and drive sign-ups for the beta program..."
                        className="w-full f-ui text-sm leading-relaxed resize-none" style={{ color: "#0e4f5c" }} />
                    </div>
                    <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderTop: "1.5px solid #e0f7fa" }}>
                      <span className="f-code text-[8px]" style={{ color: "#9dd6e5" }}>{purpose.length} chars</span>
                      {purpose.length > 0 && <span className="f-code text-[8px]" style={{ color: "#10b981" }}>✓ Looks good</span>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Product launch", "Sale announcement", "Re-engagement", "Event invite", "Feature update"].map(ex => (
                      <button key={ex} onClick={() => setPurpose(p => p ? p : ex + " — ")}
                        className="suggest-pill px-3 py-1.5 text-[9px] rounded-lg">
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 2 ── */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <p className="f-ui text-sm leading-relaxed" style={{ color: "#3d8fa0" }}>Who will receive this email? Defining your audience tailors the language and messaging.</p>
                  <div className="field-box rounded-2xl overflow-hidden">
                    <div className="px-4 pt-4 pb-1">
                      <label className="f-code text-[8px] tracking-[3px] uppercase block mb-2.5" style={{ color: "#22d3ee" }}>Target Audience</label>
                      <input value={audience} onChange={e => setAudience(e.target.value)}
                        placeholder="e.g. SaaS founders, fashion lovers, gym beginners..."
                        className="w-full f-ui text-sm py-1.5" style={{ color: "#0e4f5c" }} />
                    </div>
                    <div className="px-4 py-2.5" style={{ borderTop: "1.5px solid #e0f7fa" }}>
                      <span className="f-code text-[8px]" style={{ color: "#9dd6e5" }}>Leave blank for general audience</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[["B2B Professionals", "Executives, founders, managers"], ["E-commerce Shoppers", "Online buyers, deal-hunters"], ["Tech Enthusiasts", "Developers, early adopters"], ["Health & Wellness", "Wellness-focused individuals"]].map(([lbl, desc]) => (
                      <button key={lbl} onClick={() => setAudience(lbl)}
                        className={`aud-card p-3.5 rounded-xl text-left ${audience === lbl ? "sel" : ""}`}>
                        <p className="f-ui text-[12px] font-semibold mb-0.5" style={{ color: "#0e4f5c" }}>{lbl}</p>
                        <p className="f-code text-[9px]" style={{ color: "#9dd6e5" }}>{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 3 ── */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <p className="f-ui text-sm leading-relaxed" style={{ color: "#3d8fa0" }}>Select the category that best describes this template's intent.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(c => (
                      <button key={c} onClick={() => setCategory(c)} className={`cat-btn p-4 rounded-xl text-left ${category === c ? "sel" : ""}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="f-ui text-[13px] font-semibold" style={{ color: "#0e4f5c" }}>{c}</span>
                          {category === c && <div className="w-2 h-2 rounded-full" style={{ background: "#06b6d4" }} />}
                        </div>
                        <p className="f-code text-[9px]" style={{ color: "#9dd6e5" }}>
                          {{ "Welcome": "First impression", "Promotional": "Offers & deals", "Follow-up": "Check-in message", "Newsletter": "Regular updates", "Apology": "Address issues", "Announcement": "Share big news", "Thank You": "Express gratitude", "Onboarding": "Guide new users" }[c]}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 4 ── */}
              {activeStep === 4 && (
                <div className="space-y-4">
                  <p className="f-ui text-sm leading-relaxed" style={{ color: "#3d8fa0" }}>Choose the voice and energy your email should carry.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {TONES.map(({ label, emoji, desc }) => (
                      <button key={label} onClick={() => setTone(label)} className={`tone-card p-4 rounded-xl text-left ${tone === label ? "sel" : ""}`}>
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="text-xl">{emoji}</span>
                          <span className="f-ui text-[13px] font-semibold" style={{ color: "#0e4f5c" }}>{label}</span>
                          {tone === label && <div className="ml-auto w-2 h-2 rounded-full" style={{ background: "#06b6d4" }} />}
                        </div>
                        <p className="f-code text-[9px]" style={{ color: "#9dd6e5" }}>{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 5 ── */}
              {activeStep === 5 && (
                <div className="space-y-4">
                  <p className="f-ui text-sm leading-relaxed" style={{ color: "#3d8fa0" }}>Any finishing touches? Brand name, specific offer, deadline, or CTA link.</p>
                  <div className="field-box rounded-2xl overflow-hidden">
                    <div className="px-4 pt-4 pb-1">
                      <label className="f-code text-[8px] tracking-[3px] uppercase block mb-2.5" style={{ color: "#22d3ee" }}>
                        Extra Details <span className="normal-case tracking-normal text-[8px]" style={{ color: "#9dd6e5" }}>(optional)</span>
                      </label>
                      <input value={details} onChange={e => setDetails(e.target.value)}
                        placeholder="Brand name, offer %, deadline, CTA URL..."
                        className="w-full f-ui text-sm py-1.5" style={{ color: "#0e4f5c" }} />
                    </div>
                    <div className="px-4 py-2.5" style={{ borderTop: "1.5px solid #e0f7fa" }}>
                      <span className="f-code text-[8px]" style={{ color: "#9dd6e5" }}>Woven naturally into the copy</span>
                    </div>
                  </div>
                  {/* Summary */}
                  <div className="summary-card rounded-xl p-5">
                    <p className="f-code text-[8px] tracking-widest uppercase mb-3" style={{ color: "#9dd6e5" }}>Configuration Summary</p>
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                      {[{ l: "Category", v: category }, { l: "Tone", v: `${toneObj.emoji} ${tone}` }, { l: "Audience", v: audience || "General" }, { l: "Purpose", v: purpose.slice(0, 36) + (purpose.length > 36 ? "…" : "") }].map(row => (
                        <div key={row.l} className="flex items-start gap-2">
                          <span className="f-code text-[8px] w-14 shrink-0 pt-px" style={{ color: "#9dd6e5" }}>{row.l}</span>
                          <span className="f-code text-[9px] leading-tight" style={{ color: "#0891b2" }}>{row.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step nav */}
              <div className="flex items-center gap-3 mt-7">
                {activeStep > 1 && (
                  <button onClick={() => setActiveStep(s => s - 1)}
                    className="nav-next px-4 py-2.5 rounded-xl f-ui text-[13px] font-medium flex items-center gap-1.5 cursor-pointer">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back
                  </button>
                )}
                {activeStep < STEPS.length ? (
                  <button onClick={() => setActiveStep(s => s + 1)}
                    className="ml-auto nav-next px-5 py-2.5 rounded-xl f-ui text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer">
                    Next
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                ) : (
                  <button onClick={generate} disabled={!canGenerate || loading}
                    className={`ml-auto px-6 py-2.5 rounded-xl f-ui text-[13px] font-semibold flex items-center gap-2 cursor-pointer ${canGenerate && !loading ? "gen-btn" : ""}`}
                    style={!canGenerate || loading ? { background: "#e0f7fa", color: "#9dd6e5", border: "1.5px solid #cff3fd", cursor: "not-allowed" } : {}}>
                    {loading ? (
                      <><div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white spin-it" />Generating…</>
                    ) : (
                      <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Generate with Gemini</>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* ── OUTPUT ── */}
            {(result || loading) && (
              <div className="fade-up mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #cff3fd, transparent)" }} />
                  <span className="f-code text-[8px] tracking-widest uppercase px-2" style={{ color: "#9dd6e5" }}>Generated Output</span>
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #cff3fd, transparent)" }} />
                </div>

                <div className="output-card rounded-2xl overflow-hidden">
                  {/* Chrome bar */}
                  <div className="px-5 py-3 flex items-center gap-3" style={{ background: "#f8feff", borderBottom: "1.5px solid #cff3fd" }}>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: "#fca5a5" }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: "#fcd34d" }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: "#6ee7b7" }} />
                    </div>
                    <div className="flex-1 rounded-md px-3 py-1 f-code text-[9px] text-center border" style={{ background: "#f0fbff", borderColor: "#cff3fd", color: "#9dd6e5" }}>
                      compose · {category.toLowerCase()} · {tone.toLowerCase()} · Gemini AI
                    </div>
                    <div className="flex gap-1">
                      {["preview", "raw"].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                          className={`tab-pill px-3 py-1 rounded-lg f-code text-[9px] tracking-wide uppercase ${activeTab === tab ? "on" : ""}`}>
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {loading ? (
                    <div className="scanline-wrap p-10 flex flex-col items-center justify-center min-h-[220px]" style={{ background: "#f8feff" }}>
                      <div className="scanline" />
                      <div className="w-10 h-10 rounded-full border-2 border-t-cyan-500 spin-it mb-4" style={{ borderColor: "#cff3fd", borderTopColor: "#06b6d4" }} />
                      <p className="f-ui text-sm mb-1" style={{ color: "#3d8fa0" }}>Gemini is crafting your email…</p>
                      <p className="f-code text-[10px]" style={{ color: "#9dd6e5" }}>{category} · {tone} · {audience || "General"}</p>
                    </div>

                  ) : result && activeTab === "preview" ? (
                    <div className="p-6" style={{ background: "#ffffff" }}>
                      {/* Sender */}
                      <div className="flex items-center gap-3 pb-4 mb-5" style={{ borderBottom: "1.5px solid #e0f7fa" }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center f-code text-[10px] text-white font-bold shrink-0"
                          style={{ background: "linear-gradient(135deg, #0891b2, #22d3ee)" }}>MC</div>
                        <div className="flex-1 min-w-0">
                          <p className="f-ui text-[12px] font-semibold" style={{ color: "#0e4f5c" }}>MailCraft Team</p>
                          <p className="f-code text-[10px]" style={{ color: "#9dd6e5" }}>
                            hello@mailcraft.app → <span style={{ color: "#06b6d4" }}>{"{{first_name}}"}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="f-code text-[9px] px-2 py-0.5 rounded-md border" style={{ background: "#f0fbff", borderColor: "#cff3fd", color: "#5bb8cb" }}>{category}</span>
                          <span className="f-code text-[9px]" style={{ color: "#9dd6e5" }}>Just now</span>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="mb-5">
                        <p className="f-code text-[8px] tracking-[2px] uppercase mb-2" style={{ color: "#9dd6e5" }}>Subject Line</p>
                        <p className="f-ui text-xl font-bold leading-snug" style={{ color: "#0e4f5c" }}>
                          {typedSubj}{typing && typedBody.length === 0 && <span className="blink ml-0.5" style={{ color: "#06b6d4" }}>|</span>}
                        </p>
                      </div>

                      {/* Body */}
                      <div className="scanline-wrap rounded-xl p-5 mb-5" style={{ background: "#f8feff", border: "1.5px solid #e0f7fa" }}>
                        {typing && <div className="scanline" />}
                        <p className="f-ui text-sm leading-[1.85] whitespace-pre-wrap" style={{ color: "#3d8fa0" }}>
                          {typedBody}{typing && typedBody.length > 0 && <span className="blink" style={{ color: "#06b6d4" }}>|</span>}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => copyText(`Subject: ${result.subject}\n\n${result.body}`, "all")}
                          className={`copy-btn px-4 py-2 rounded-lg f-code text-[9px] tracking-wide uppercase flex items-center gap-1.5 ${copied === "all" ? "on" : ""}`}>
                          {copied === "all" ? <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Copied!</> : "Copy Full Email"}
                        </button>
                        <button onClick={() => copyText(result.subject, "subj")} className={`copy-btn px-4 py-2 rounded-lg f-code text-[9px] tracking-wide uppercase ${copied === "subj" ? "on" : ""}`}>
                          {copied === "subj" ? "✓ Subject" : "Copy Subject"}
                        </button>
                        <button onClick={() => copyText(result.body, "body")} className={`copy-btn px-4 py-2 rounded-lg f-code text-[9px] tracking-wide uppercase ${copied === "body" ? "on" : ""}`}>
                          {copied === "body" ? "✓ Body" : "Copy Body"}
                        </button>
                        <button onClick={generate}
                          className="ml-auto copy-btn px-4 py-2 rounded-lg f-code text-[9px] tracking-wide uppercase flex items-center gap-1.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          Regen
                        </button>
                      </div>
                    </div>

                  ) : result && activeTab === "raw" ? (
                    <div className="p-6 f-code text-[11px] leading-loose" style={{ background: "#f8feff" }}>
                      <div className="text-[8px] tracking-widest mb-4" style={{ color: "#9dd6e5" }}>// raw output — gemini-2.5-flash-lite</div>
                      <div>
                        <span style={{ color: "#0891b2" }}>subject</span>
                        <span style={{ color: "#9dd6e5" }}>: </span>
                        <span style={{ color: "#0e7490" }}>"{result.subject}"</span>
                      </div>
                      <div className="h-px my-4" style={{ background: "#e0f7fa" }} />
                      <div>
                        <span style={{ color: "#0891b2" }}>body</span>
                        <span style={{ color: "#9dd6e5" }}>:</span>
                        <pre className="mt-3 whitespace-pre-wrap text-[10px] leading-relaxed pl-4" style={{ color: "#3d8fa0", borderLeft: "2px solid #cff3fd" }}>{result.body}</pre>
                      </div>
                    </div>
                  ) : null}
                </div>

                {result && (
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="f-code text-[8px] tracking-widest uppercase" style={{ color: "#9dd6e5" }}>Variables</span>
                    {["{{first_name}}", "{{company}}", "{{cta_link}}", "{{offer_code}}"].map(v => (
                      <span key={v} className="f-code text-[9px] px-2 py-1 rounded-md border" style={{ background: "#f0fbff", borderColor: "#cff3fd", color: "#06b6d4" }}>{v}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status bar */}
          <div className="statusbar sticky bottom-0 px-7 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3 f-code text-[8px]" style={{ color: "#9dd6e5" }}>
              <span>MailCraft v2</span>
              <span>·</span>
              <span>Powered by Gemini AI</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="f-code text-[8px]" style={{ color: "#9dd6e5" }}>{completedCount}/{STEPS.length} steps</span>
              <div className="w-14 h-1 rounded-full overflow-hidden" style={{ background: "#e0f7fa" }}>
                <div className="progress-fill h-full rounded-full" style={{ width: `${(completedCount / STEPS.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}