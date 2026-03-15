import { useState } from "react";

const niches = [
  "E-commerce", "SaaS", "Fitness & Wellness", "Education", "Food & Restaurant",
  "Real Estate", "Fashion & Beauty", "Finance & Investing", "Travel", "Healthcare",
  "Tech Startup", "Consulting", "Non-profit", "Entertainment", "Other"
];

const goals = [
  "Increase Brand Awareness", "Generate More Leads", "Boost Sales & Revenue",
  "Grow Social Media Following", "Launch a New Product", "Retain Existing Customers",
  "Enter a New Market", "Build Community"
];

const audienceOptions = ["B2B", "B2C", "Both"];

const toneOptions = ["Professional", "Casual", "Bold & Energetic", "Inspirational", "Educational"];

const mockGenerate = (niche, goal, audience, tone, budget) => {
  return {
    seo: {
      title: "SEO Strategy",
      icon: "🔍",
      color: "from-cyan-400 to-cyan-600",
      items: [
        `Target long-tail keywords like "${niche.toLowerCase()} tips for ${audience}" and "${goal.toLowerCase()} strategies"`,
        `Create a pillar content page around "${niche} Complete Guide 2025" with 10+ cluster posts`,
        `Optimize Google Business Profile with ${niche}-specific categories and weekly posts`,
        `Build backlinks through guest posting on ${niche} industry blogs and forums`,
        `Launch a FAQ section targeting "People Also Ask" snippets for ${goal.toLowerCase()} queries`,
      ]
    },
    social: {
      title: "Social Media Content Ideas",
      icon: "📱",
      color: "from-sky-400 to-blue-500",
      items: [
        `${tone} Reels series: "Day in the life of a ${niche} professional" — post 3x/week on Instagram & TikTok`,
        `Weekly LinkedIn carousel: "${5} ways to ${goal.toLowerCase()} in ${niche}" targeting ${audience} decision makers`,
        `Twitter/X threads: Break down industry stats with a ${tone.toLowerCase()} voice every Tuesday`,
        `User-generated content campaign: Ask customers to share results using a branded hashtag`,
        `Behind-the-scenes Stories: Show your ${niche} process authentically to build trust`,
      ]
    },
    email: {
      title: "Email Campaign Ideas",
      icon: "✉️",
      color: "from-teal-400 to-cyan-600",
      items: [
        `Welcome sequence (5 emails): Onboard new subscribers with ${tone.toLowerCase()} storytelling and a ${budget === "Low" ? "free resource" : "discount offer"}`,
        `Monthly newsletter: Curate top ${niche} news + your unique take — builds authority`,
        `Drip campaign for leads: 7-email nurture flow focused on "${goal}" pain points and your solution`,
        `Re-engagement campaign: Win back cold subscribers with a "We miss you" offer + survey`,
        `Case study emails: Feature ${audience} customer success stories with measurable results`,
      ]
    },
    paid: {
      title: `Paid Ads Plan (${budget} Budget)`,
      icon: "💰",
      color: "from-cyan-500 to-teal-500",
      items: [
        budget === "Low"
          ? `Start with Meta Ads: $5–$10/day targeting ${audience} interested in ${niche}, use retargeting pixel immediately`
          : `Google Search Ads: Bid on high-intent "${niche} ${goal.toLowerCase()}" keywords with $50–$100/day budget`,
        `Create a lead magnet landing page (free checklist/template) to capture emails at low CPC`,
        `Retarget website visitors with dynamic ads showing your top ${niche} content or offer`,
        budget === "High"
          ? `YouTube pre-roll ads: 15-sec ${tone.toLowerCase()} hook targeting ${niche} content viewers`
          : `Leverage Instagram Boost on your top organic posts — minimum spend, maximum reach`,
        `A/B test 3 ad creatives: one testimonial, one stat-based, one problem/solution format`,
      ]
    },
    content: {
      title: "Content Marketing Plan",
      icon: "📝",
      color: "from-sky-300 to-cyan-500",
      items: [
        `Launch a ${niche} podcast or YouTube channel — long-form content with ${tone.toLowerCase()} tone converts ${audience} audiences`,
        `Publish one in-depth blog post (2000+ words) weekly targeting competitive ${niche} keywords`,
        `Create a free downloadable resource: "${niche} Roadmap to ${goal}" — gated behind email signup`,
        `Start a weekly newsletter digest: curate 5 ${niche} insights every Friday`,
        `Repurpose each blog post into: 1 LinkedIn carousel, 3 tweets, 1 Instagram infographic`,
      ]
    }
  };
};

export default function MarketingStrategyGenerator() {
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("seo");

  const finalNiche = niche === "Other" ? customNiche : niche;

  const handleGenerate = () => {
    if (!finalNiche || !goal || !audience || !tone || !budget) return;
    setLoading(true);
    setTimeout(() => {
      setResult(mockGenerate(finalNiche, goal, audience, tone, budget));
      setLoading(false);
      setStep(3);
    }, 2000);
  };

  const handleReset = () => {
    setStep(1);
    setNiche(""); setCustomNiche(""); setGoal("");
    setAudience(""); setTone(""); setBudget("");
    setResult(null); setActiveTab("seo");
  };

  const tabs = result ? Object.keys(result) : [];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-teal-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sky-100 rounded-full opacity-30 blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-cyan-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">StrategyAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-cyan-600 transition-colors">Features</a>
            <a href="#" className="hover:text-cyan-600 transition-colors">Pricing</a>
            <a href="#" className="hover:text-cyan-600 transition-colors">Blog</a>
          </div>
          <button className="text-sm bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-5 py-2 rounded-full font-medium hover:shadow-md hover:shadow-cyan-200 transition-all">
            Get Started Free
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Hero */}
        {step === 1 && (
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-full px-4 py-1.5 text-xs font-medium text-cyan-700 mb-6">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
              AI-Powered Marketing Intelligence
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
              Generate Your
              <span className="block bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">
                Marketing Strategy
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              Enter your niche and growth goal. Get a complete, actionable marketing plan in seconds — no agency required.
            </p>
          </div>
        )}

        {/* Step Indicator */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-4 mb-10">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s
                    ? "bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-200"
                    : "bg-gray-100 text-gray-400"
                }`}>{s}</div>
                <span className={`text-sm font-medium ${step >= s ? "text-cyan-700" : "text-gray-400"}`}>
                  {s === 1 ? "Your Details" : "Preferences"}
                </span>
                {s < 2 && <div className={`w-12 h-px ${step > s ? "bg-cyan-400" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100 p-8 md:p-10">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Tell us about your business</h2>

            {/* Niche */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Your Business Niche</label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {niches.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNiche(n)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                      niche === n
                        ? "bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-100"
                        : "bg-white text-gray-600 border-gray-200 hover:border-cyan-300 hover:text-cyan-600"
                    }`}
                  >{n}</button>
                ))}
              </div>
              {niche === "Other" && (
                <input
                  type="text"
                  value={customNiche}
                  onChange={(e) => setCustomNiche(e.target.value)}
                  placeholder="Describe your niche..."
                  className="mt-3 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
                />
              )}
            </div>

            {/* Goal */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Primary Marketing Goal</label>
              <div className="grid grid-cols-2 gap-3">
                {goals.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium border text-left transition-all ${
                      goal === g
                        ? "bg-cyan-50 text-cyan-700 border-cyan-400 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-cyan-200"
                    }`}
                  >
                    {goal === g && <span className="mr-2">✓</span>}{g}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!finalNiche || !goal}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold text-base hover:shadow-lg hover:shadow-cyan-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100 p-8 md:p-10">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Refine your strategy</h2>

            {/* Audience */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Target Audience Type</label>
              <div className="flex gap-3">
                {audienceOptions.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAudience(a)}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                      audience === a
                        ? "bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-100"
                        : "bg-white text-gray-600 border-gray-200 hover:border-cyan-300"
                    }`}
                  >{a}</button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Brand Tone</label>
              <div className="grid grid-cols-3 gap-3">
                {toneOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                      tone === t
                        ? "bg-cyan-50 text-cyan-700 border-cyan-400 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-cyan-200"
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="mb-10">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Marketing Budget</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Low", sub: "< $500/mo" },
                  { label: "Medium", sub: "$500–$2k/mo" },
                  { label: "High", sub: "$2k+/mo" }
                ].map(({ label, sub }) => (
                  <button
                    key={label}
                    onClick={() => setBudget(label)}
                    className={`py-4 rounded-xl border transition-all text-center ${
                      budget === label
                        ? "bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-100"
                        : "bg-white text-gray-600 border-gray-200 hover:border-cyan-300"
                    }`}
                  >
                    <div className="font-semibold text-sm">{label}</div>
                    <div className={`text-xs mt-0.5 ${budget === label ? "text-cyan-100" : "text-gray-400"}`}>{sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-2xl border border-gray-200 text-gray-600 font-semibold hover:border-gray-300 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={!audience || !tone || !budget}
                className="flex-[3] py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold text-base hover:shadow-lg hover:shadow-cyan-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating your strategy...
                  </span>
                ) : "Generate My Marketing Strategy ✨"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Results */}
        {step === 3 && result && (
          <div>
            {/* Result header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 text-xs font-medium text-green-700 mb-5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Strategy Generated Successfully
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Your Marketing Strategy</h2>
              <p className="text-gray-500 text-sm">
                Tailored for <span className="font-semibold text-cyan-600">{finalNiche}</span> · Goal:{" "}
                <span className="font-semibold text-cyan-600">{goal}</span>
              </p>
            </div>

            {/* Summary pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                { label: "Niche", value: finalNiche },
                { label: "Goal", value: goal },
                { label: "Audience", value: audience },
                { label: "Tone", value: tone },
                { label: "Budget", value: budget },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2 bg-cyan-50 border border-cyan-100 rounded-full px-4 py-1.5 text-xs">
                  <span className="text-gray-500">{label}:</span>
                  <span className="font-semibold text-cyan-700">{value}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    activeTab === tab
                      ? "bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-100"
                      : "bg-white text-gray-500 border-gray-200 hover:border-cyan-200 hover:text-cyan-600"
                  }`}
                >
                  {result[tab].icon} {result[tab].title.split(" ").slice(0, 2).join(" ")}
                </button>
              ))}
            </div>

            {/* Active tab content */}
            {result[activeTab] && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100 overflow-hidden">
                <div className={`h-2 w-full bg-gradient-to-r ${result[activeTab].color}`} />
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${result[activeTab].color} flex items-center justify-center text-2xl shadow-md`}>
                      {result[activeTab].icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{result[activeTab].title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">5 actionable recommendations</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {result[activeTab].items.map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/50 transition-all group">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                          {i + 1}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* All strategies grid */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {tabs.filter(t => t !== activeTab).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all text-left group"
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${result[tab].color} flex items-center justify-center text-lg mb-3 shadow-sm`}>
                    {result[tab].icon}
                  </div>
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-cyan-700 transition-colors">{result[tab].title}</div>
                  <div className="text-xs text-gray-400 mt-1">5 ideas →</div>
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-4 rounded-2xl border-2 border-cyan-200 text-cyan-700 font-semibold hover:bg-cyan-50 transition-all"
              >
                ← Generate New Strategy
              </button>
              <button
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-200 transition-all"
              >
                Export as PDF ↓
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-100 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            © 2025 StrategyAI · All rights reserved
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-cyan-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cyan-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-cyan-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}