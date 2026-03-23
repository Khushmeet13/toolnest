import { useState, useEffect, useRef } from "react";

const productTypes = [
  { id: "saas", label: "SaaS / Software", icon: "⬡" },
  { id: "ecommerce", label: "E-commerce", icon: "◈" },
  { id: "digital", label: "Digital Download", icon: "◎" },
  { id: "service", label: "Service / Agency", icon: "◇" },
  { id: "mobile", label: "Mobile App", icon: "▣" },
  { id: "course", label: "Online Course", icon: "◉" },
  { id: "marketplace", label: "Marketplace", icon: "⬠" },
  { id: "hardware", label: "Hardware / Physical", icon: "◫" },
];

const competitionLevels = ["Low", "Medium", "High", "Saturated"];
const customerTypes = ["Consumers (B2C)", "Businesses (B2B)", "Both"];
const marginGoals = ["Maximum Volume", "Balanced Growth", "Maximum Margin"];

const generatePricing = (product, cost, competition, customer, margin) => {
  const costNum = parseFloat(cost) || 50;
  const markup = competition === "Low" ? 4 : competition === "Medium" ? 3 : competition === "High" ? 2.2 : 1.8;
  const base = Math.round(costNum * markup);
  const isB2B = customer.includes("B2B");
  const isSaaS = product === "saas" || product === "mobile";
  const isService = product === "service";

  return {
    subscription: {
      label: "Subscription",
      fullLabel: "Subscription Model",
      icon: "↻",
      tag: "RECURRING",
      fitScore: isSaaS ? 95 : isService ? 80 : 60,
      headline: `$${Math.round(base * 0.4)} – $${Math.round(base * 0.9)}/mo`,
      tiers: [
        { name: "Starter", price: `$${Math.round(base * 0.3)}/mo`, desc: "Solo users, core features", popular: false },
        { name: "Growth", price: `$${Math.round(base * 0.55)}/mo`, desc: "Teams, priority support", popular: true },
        { name: "Scale", price: `$${Math.round(base * 0.9)}/mo`, desc: "Unlimited + dedicated CSM", popular: false },
      ],
      pros: ["Predictable MRR", "Lower entry barrier", "Compounds over time"],
      cons: ["Slower initial revenue", "Requires ongoing value delivery"],
      bestFor: isSaaS ? "Software tools with daily usage" : isService ? "Retainer-based services" : "Repeat-use products",
      insight: competition === "High"
        ? "In saturated markets, monthly plans beat annual commitments — easier trials reduce objection and boost activation."
        : "Low competition gives room to anchor on annual plans and convert trial users at 40–60% rates.",
    },
    freemium: {
      label: "Freemium",
      fullLabel: "Freemium Model",
      icon: "⬡",
      tag: "GROWTH-LED",
      fitScore: isSaaS ? 88 : product === "mobile" ? 92 : product === "marketplace" ? 75 : 45,
      headline: `Free + $${Math.round(base * 0.35)}/mo`,
      tiers: [
        { name: "Free", price: "$0 forever", desc: "Core features, limited usage", popular: false },
        { name: "Pro", price: `$${Math.round(base * 0.35)}/mo`, desc: "Full access, no limits", popular: true },
        { name: "Teams", price: `$${Math.round(base * 0.6)}/user/mo`, desc: "Collaboration + admin", popular: false },
      ],
      pros: ["Viral distribution", "Low CAC via word-of-mouth", "Large top-of-funnel"],
      cons: ["Costly free tier", "Low conversion if value unclear"],
      bestFor: product === "mobile" ? "Mobile apps with network effects" : "Products that improve with more users",
      insight: `Free-to-paid benchmarks: 2–5% B2C, 8–15% B2B. With a $${costNum} unit cost, freemium is ${costNum < 30 ? "very viable" : "risky without clear upgrade triggers"}.`,
    },
    tiered: {
      label: "Tiered",
      fullLabel: "Tiered Pricing",
      icon: "▲",
      tag: "RECOMMENDED",
      fitScore: 90,
      headline: `$${Math.round(base * 0.5)} / $${Math.round(base)} / $${Math.round(base * 2.2)}`,
      tiers: [
        { name: "Basic", price: `$${Math.round(base * 0.5)}${isSaaS ? "/mo" : ""}`, desc: "Entry-level access", popular: false },
        { name: "Professional", price: `$${Math.round(base)}${isSaaS ? "/mo" : ""}`, desc: "Most popular tier", popular: true },
        { name: "Enterprise", price: `$${Math.round(base * 2.2)}+${isSaaS ? "/mo" : ""}`, desc: "Custom + white-glove", popular: false },
      ],
      pros: ["Captures all willingness-to-pay", "Anchoring lifts mid-tier", "Clear upgrade path"],
      cons: ["Complex to communicate", "Risk of tier cannibalization"],
      bestFor: "Almost every product — most versatile model",
      insight: isB2B
        ? "For B2B, make the middle tier the obvious choice with 80% of features — decoys push 60–70% of buyers there."
        : "Anchor with a premium tier first. Consumers reference it, making mid-tier feel like a bargain.",
    },
    bundle: {
      label: "Value Bundle",
      fullLabel: "Value Bundle",
      icon: "◈",
      tag: "HIGH MARGIN",
      fitScore: isService ? 85 : product === "course" ? 90 : product === "digital" ? 80 : 55,
      headline: `$${Math.round(base * 1.8)} – $${Math.round(base * 3.5)}`,
      tiers: [
        { name: "Core Bundle", price: `$${Math.round(base * 1.8)}`, desc: "Product + 2 bonuses", popular: false },
        { name: "Complete Kit", price: `$${Math.round(base * 2.8)}`, desc: "Everything + support", popular: true },
        { name: "VIP Access", price: `$${Math.round(base * 3.5)}`, desc: "All + 1:1 onboarding", popular: false },
      ],
      pros: ["Higher AOV per transaction", "Perceived value exceeds cost", "Reduces price sensitivity"],
      cons: ["Requires complementary assets", "Can confuse if poorly designed"],
      bestFor: product === "course" ? "Info products and coaching" : isService ? "Agency / consulting" : "Physical products with accessories",
      insight: `Bundle pricing works best when cost-to-build is $${costNum} but perceived value is 5–8×. ${margin === "Maximum Margin" ? "Given your margin goal, this aligns perfectly." : "Great as a secondary revenue stream."}`,
    },
  };
};

function FitBar({ score, active }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score), 400); return () => clearTimeout(t); }, [score]);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-cyan-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${w}%`, background: active ? "linear-gradient(to right,#06b6d4,#14b8a6)" : "#a5f3fc" }} />
      </div>
      <span className={`text-xs font-bold tabular-nums ${active ? "text-cyan-600" : "text-cyan-300"}`}>{score}%</span>
    </div>
  );
}

function AnimCounter({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let s = 0; const end = parseInt(value);
    if (isNaN(end)) return;
    const step = end / (700 / 16);
    const t = setInterval(() => { s += step; if (s >= end) { setN(end); clearInterval(t); } else setN(Math.floor(s)); }, 16);
    return () => clearInterval(t);
  }, [value]);
  return <span>{n}</span>;
}

const STEPS = [
  { id: 1, label: "Product Type" },
  { id: 2, label: "Cost & Goals" },
  { id: 3, label: "Market Info" },
];

export default function PricingsStrategyGenerator() {
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState("");
  const [cost, setCost] = useState("");
  const [competition, setCompetition] = useState("");
  const [customer, setCustomer] = useState("");
  const [margin, setMargin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeModel, setActiveModel] = useState("tiered");
  const [loadTick, setLoadTick] = useState(0);
  const resultRef = useRef(null);

  const loadMessages = [
    "Analyzing your inputs…",
    "Modeling market data…",
    "Computing margin curves…",
    "Building pricing models…",
  ];

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setLoadTick(p => p + 1), 600);
    return () => clearInterval(t);
  }, [loading]);

  const handleGenerate = () => {
    if (!product || !cost || !competition || !customer || !margin) return;
    setLoading(true);
    setTimeout(() => {
      setResult(generatePricing(product, cost, competition, customer, margin));
      setLoading(false);
      setActiveModel("tiered");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }, 2600);
  };

  const handleReset = () => {
    setResult(null); setStep(1);
    setProduct(""); setCost(""); setCompetition(""); setCustomer(""); setMargin("");
  };

  const models = result ? Object.keys(result) : [];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');`}</style>

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full opacity-[0.18]"
          style={{ background: "radial-gradient(circle,#06b6d4,transparent 70%)" }} />
        <div className="absolute top-1/2 -left-28 w-80 h-80 rounded-full opacity-[0.10]"
          style={{ background: "radial-gradient(circle,#22d3ee,transparent 70%)" }} />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle,#0e7490,transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(#06b6d4 1px,transparent 1px)", backgroundSize: "30px 30px" }} />
      </div>



      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16">

        {/* Hero */}
        {!result && (
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 border border-cyan-200 bg-cyan-50 rounded-full px-4 py-1.5 text-xs font-bold text-cyan-700 mb-6 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              AI Pricing Intelligence
            </div>
            <h1 className="text-4xl font-medium text-gray-900 leading-[1.1] tracking-tight mb-2">
              Find the pricing model<br />
              <span className="text-cyan-600">
                that maximizes revenue.
              </span>
            </h1>
            <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
              Enter your product type and cost structure. Get instant pricing recommendations with fit scores, tier tables, and strategic rationale.
            </p>
          </div>
        )}

        {/* Step Progress */}
        {!result && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <button
                  onClick={() => step > s.id && setStep(s.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    step === s.id
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md shadow-cyan-200"
                      : step > s.id
                        ? "bg-cyan-100 text-cyan-700 cursor-pointer hover:bg-cyan-200"
                        : "bg-gray-100 text-gray-400 cursor-default"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > s.id ? "bg-cyan-500 text-white" : step === s.id ? "bg-white text-cyan-600" : "bg-gray-300 text-gray-500"
                  }`}>
                    {step > s.id ? "✓" : s.id}
                  </span>
                  {s.label}
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 rounded-full ${step > s.id ? "bg-cyan-300" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 1 ── */}
        {!result && step === 1 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xl shadow-gray-100/60 p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900">What kind of product are you pricing?</h2>
              <p className="text-sm text-gray-400 mt-1.5">Select the category that best describes your offering</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {productTypes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProduct(p.id)}
                  className={`p-5 rounded-xl border-2 text-left transition-all group cursor-pointer ${
                    product === p.id
                      ? "border-cyan-500 bg-gradient-to-br from-cyan-50 to-teal-50 shadow-md shadow-cyan-100"
                      : "border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/40"
                  }`}
                >
                  <div className={`text-2xl mb-3 transition-colors ${product === p.id ? "text-cyan-500" : "text-gray-300 group-hover:text-cyan-300"}`}>
                    {p.icon}
                  </div>
                  <div className={`text-xs font-bold leading-snug ${product === p.id ? "text-cyan-700" : "text-gray-600"}`}>{p.label}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!product}
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md shadow-cyan-200 hover:shadow-lg hover:shadow-cyan-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {!result && step === 2 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xl shadow-gray-100/60 p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900">Cost structure & goals</h2>
              <p className="text-sm text-gray-400 mt-1.5">Include CAC, COGS, hosting, and overhead per unit or per month</p>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Unit / Monthly Cost (USD)</label>
              <div className="flex items-center border-2 border-gray-200 focus-within:border-cyan-400 rounded-xl overflow-hidden transition-colors">
                <span className="px-5 text-cyan-500 font-extrabold text-xl border-r border-gray-100 py-4 bg-cyan-50/50">$</span>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 px-5 py-4 text-gray-800 text-xl font-bold focus:outline-none placeholder-gray-200 bg-white"
                />
                <span className="px-5 text-gray-300 text-sm font-semibold">USD</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">This is the estimated cost per unit or per month to deliver your product/service</p>
            </div>

            <div className="mb-10">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Margin Objective</label>
              <div className="grid grid-cols-3 gap-3">
                {marginGoals.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMargin(m)}
                    className={`py-4 px-3 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${
                      margin === m
                        ? "border-cyan-500 bg-gradient-to-br from-cyan-50 to-teal-50 text-cyan-700 shadow-md shadow-cyan-100"
                        : "border-gray-100 text-gray-500 hover:border-cyan-200 hover:bg-cyan-50/30"
                    }`}
                  >{m}</button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm hover:border-cyan-200 hover:text-cyan-600 transition-all cursor-pointer">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!cost || !margin}
                className="flex-[3] py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-200 hover:shadow-lg hover:shadow-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {!result && step === 3 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xl shadow-gray-100/60 p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900">Market & customer details</h2>
              <p className="text-sm text-gray-400 mt-1.5">Helps calibrate competitive positioning and pricing power</p>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Market Competition</label>
              <div className="grid grid-cols-4 gap-3">
                {competitionLevels.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCompetition(c)}
                    className={`py-4 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${
                      competition === c
                        ? "border-cyan-500 bg-gradient-to-br from-cyan-50 to-teal-50 text-cyan-700 shadow-md shadow-cyan-100"
                        : "border-gray-100 text-gray-500 hover:border-cyan-200 hover:bg-cyan-50/30"
                    }`}
                  >{c}</button>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Target Customer Segment</label>
              <div className="grid grid-cols-3 gap-3">
                {customerTypes.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCustomer(c)}
                    className={`py-4 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${
                      customer === c
                        ? "border-cyan-500 bg-gradient-to-br from-cyan-50 to-teal-50 text-cyan-700 shadow-md shadow-cyan-100"
                        : "border-gray-100 text-gray-500 hover:border-cyan-200 hover:bg-cyan-50/30"
                    }`}
                  >{c}</button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="flex-1 py-4 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm hover:border-cyan-200 hover:text-cyan-600 transition-all cursor-pointer">
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={!competition || !customer || loading}
                className="flex-[3] py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md shadow-cyan-200 hover:shadow-lg hover:shadow-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {loadMessages[loadTick % loadMessages.length]}
                  </span>
                ) : "Generate Pricing Strategy ✦"}
              </button>
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {result && (
          <div ref={resultRef}>
            {/* Result header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 border border-teal-200 bg-teal-50 rounded-full px-4 py-1.5 text-xs font-bold text-teal-700 mb-5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                4 Models Generated
              </div>
              <h2 className="text-4xl font-medium text-gray-900 mb-4 tracking-tight">Your Pricing Strategy</h2>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {[
                  { k: "Product", v: productTypes.find(p => p.id === product)?.label },
                  { k: "Cost", v: `$${cost}` },
                  { k: "Competition", v: competition },
                  { k: "Segment", v: customer.split(" ")[0] },
                  { k: "Goal", v: margin },
                ].map(({ k, v }) => (
                  <span key={k} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full px-3.5 py-1.5 text-xs">
                    <span className="text-gray-400 font-medium">{k}:</span>
                    <span className="font-bold text-gray-700">{v}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Model selector tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {models.map((key) => {
                const m = result[key];
                const isActive = activeModel === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveModel(key)}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      isActive
                        ? "border-cyan-500 bg-gradient-to-br from-cyan-50 to-teal-50 shadow-lg shadow-cyan-100"
                        : "border-gray-100 bg-white hover:border-cyan-200 hover:bg-cyan-50/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xl ${isActive ? "text-cyan-500" : "text-gray-300"}`}>{m.icon}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-cyan-100 text-cyan-700" : "bg-gray-100 text-gray-400"}`}>
                        {m.tag}
                      </span>
                    </div>
                    <div className={`text-sm font-bold mb-3 ${isActive ? "text-cyan-700" : "text-gray-600"}`}>{m.label}</div>
                    <FitBar score={m.fitScore} active={isActive} />
                  </button>
                );
              })}
            </div>

            {/* Active model detail card */}
            {result[activeModel] && (() => {
              const m = result[activeModel];
              return (
                <div className="bg-white rounded-xl border border-gray-100 shadow-2xl shadow-gray-100/60 overflow-hidden">
                  <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-teal-400" />

                  {/* Header */}
                  <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white text-3xl shadow-xl shadow-cyan-200">
                        {m.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-extrabold text-gray-900">{m.fullLabel}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">Best for: {m.bestFor}</p>
                      </div>
                    </div>
                    <div className="md:text-right">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Suggested Range</div>
                      <div className="text-2xl font-extrabold text-cyan-600">{m.headline}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2">
                    {/* Tiers */}
                    <div className="p-8 border-r border-gray-50">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Pricing Tiers</div>
                      <div className="space-y-3">
                        {m.tiers.map((tier, i) => (
                          <div key={i} className={`p-5 rounded-xl border-2 transition-all ${
                            tier.popular
                              ? "border-cyan-400 bg-gradient-to-br from-cyan-50 to-teal-50 shadow-lg shadow-cyan-100"
                              : "border-gray-100"
                          }`}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-bold text-gray-700">{tier.name}</span>
                              {tier.popular && (
                                <span className="text-[10px] font-extrabold bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-2.5 py-0.5 rounded-full">
                                  MOST POPULAR
                                </span>
                              )}
                            </div>
                            <div className={`text-2xl font-extrabold mb-1 ${tier.popular ? "text-cyan-600" : "text-gray-800"}`}>
                              {tier.price}
                            </div>
                            <div className="text-xs text-gray-400">{tier.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Analysis */}
                    <div className="p-8">
                      {/* Fit score */}
                      <div className="mb-7">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Model Fit Score</div>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-6xl font-extrabold text-cyan-500 leading-none tabular-nums">
                            <AnimCounter value={m.fitScore} />
                          </span>
                          <span className="text-2xl text-gray-200 font-light mb-2">/ 100</span>
                        </div>
                        <FitBar score={m.fitScore} active={true} />
                      </div>

                      {/* Pros */}
                      <div className="mb-5">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Advantages</div>
                        <div className="space-y-2">
                          {m.pros.map((p, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-600 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">↑</span>
                              <span className="text-sm text-gray-600">{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cons */}
                      <div className="mb-6">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Risks</div>
                        <div className="space-y-2">
                          {m.cons.map((c, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-orange-50 text-orange-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">!</span>
                              <span className="text-sm text-gray-500">{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Insight */}
                      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100 rounded-xl p-5">
                        <div className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-2">Strategic Insight</div>
                        <p className="text-sm text-gray-600 leading-relaxed">{m.insight}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Comparison bar */}
            <div className="mt-4 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-50 p-8">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Model Fit Comparison</div>
              <div className="space-y-5">
                {models.map((key) => {
                  const m = result[key];
                  const isActive = activeModel === key;
                  return (
                    <button key={key} onClick={() => setActiveModel(key)} className="flex items-center gap-4 w-full group">
                      <span className={`w-28 text-sm font-bold text-left transition-colors cursor-pointer ${isActive ? "text-cyan-600" : "text-gray-400 group-hover:text-gray-600"}`}>
                        {m.icon} {m.label}
                      </span>
                      <div className="flex-1 h-2.5 bg-cyan-50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${m.fitScore}%`,
                            background: isActive
                              ? "linear-gradient(to right, #06b6d4, #14b8a6)"
                              : "#a5f3fc",
                          }}
                        />
                      </div>
                      <span className={`text-sm font-extrabold tabular-nums w-8 text-right ${isActive ? "text-cyan-600" : "text-cyan-200"}`}>
                        {m.fitScore}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-4 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm hover:border-cyan-600 hover:text-cyan-600 transition-all cursor-pointer"
              >
                ← New Analysis
              </button>
              <button className="flex-[2] py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md shadow-cyan-200 hover:shadow-lg hover:shadow-cyan-300 transition-all cursor-pointer">
                Export Report ↓
              </button>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}