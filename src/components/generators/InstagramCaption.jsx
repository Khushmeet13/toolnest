import { Check, Copy, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

const TONES = [
    { label: "Playful", emoji: "🎉" },
    { label: "Professional", emoji: "💼" },
    { label: "Witty", emoji: "😏" },
    { label: "Inspirational", emoji: "✨" },
    { label: "Mysterious", emoji: "🌙" },
    { label: "Romantic", emoji: "💕" },
];

const NICHES = ["Fashion", "Food", "Travel", "Fitness", "Tech", "Business", "Lifestyle", "Beauty"];

const PREVIEW_CAPTIONS = [
    { text: "Golden hour never hits different than when you're exactly where you're meant to be. 🌅✨", tags: "#GoldenHour #Wanderlust #LiveFully", niche: "Travel" },
    { text: "Plot twist: the glow-up was an inside job all along. 💫 Swipe right on the life you deserve.", tags: "#Mindset #GlowUp #SelfGrowth", niche: "Lifestyle" },
    { text: "She didn't wait for the storm to pass — she learned to dance in it. 🌧️💃", tags: "#BossVibes #Resilience #Unstoppable", niche: "Business" },
];

const STATS = [
    { value: "10K+", label: "Captions Generated" },
    { value: "3X", label: "More Engagement" },
    { value: "< 5s", label: "Generation Time" },
];


const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY; // Your API key
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;

export default function InstagramCaptionGenerator() {
    const [topic, setTopic] = useState("");
    const [tone, setTone] = useState("Playful");
    const [niche, setNiche] = useState("Lifestyle");
    const [keywords, setKeywords] = useState("");
    const [captions, setCaptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(null);
    const [loadingDot, setLoadingDot] = useState(0);
    const [visible, setVisible] = useState(false);
    const [activePreview, setActivePreview] = useState(0);
    const [apiError, setApiError] = useState(null);
    const [usingFallback, setUsingFallback] = useState(false);


    useEffect(() => {
        setTimeout(() => setVisible(true), 100);
    }, []);

    useEffect(() => {
        if (!loading) return;
        const iv = setInterval(() => setLoadingDot(d => (d + 1) % 4), 380);
        return () => clearInterval(iv);
    }, [loading]);

    // Auto-cycle preview cards
    useEffect(() => {
        if (captions.length > 0) return;
        const iv = setInterval(() => setActivePreview(p => (p + 1) % PREVIEW_CAPTIONS.length), 3000);
        return () => clearInterval(iv);
    }, [captions]);

    // 🎯 Generate captions using Google Gemini API
    const generateWithGemini = async () => {
        const prompt = `Generate 5 creative Instagram captions based on these details:

Topic: ${topic}
Tone: ${tone}
Niche: ${niche}
Keywords: ${keywords || "none"}

IMPORTANT RULES:
1. Each caption must be punchy and native to Instagram
2. Include 3-5 relevant hashtags at the end of each caption
3. Use emojis naturally throughout each caption
4. Keep each caption under 220 characters (including hashtags)
5. Make each caption distinctly different in style
6. Return ONLY a valid JSON array with 5 strings
7. NO markdown, NO explanations, NO additional text

Example format:
["Caption 1 with emojis 🎉 #hashtag1 #hashtag2", "Caption 2 with emojis ✨ #hashtag3 #hashtag4", "Caption 3 with emojis 💫 #hashtag5 #hashtag6"]`;

        try {
            console.log("🔄 Calling Gemini API...");

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
                        temperature: 0.9,
                        topK: 1,
                        topP: 1,
                        maxOutputTokens: 1024,
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
            console.log("✅ Gemini API response received:", data);

            // Extract the generated text from Gemini response
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!generatedText) {
                throw new Error("No text generated from Gemini");
            }

            console.log("Generated text:", generatedText);

            // Try to parse the response as JSON
            try {
                // Clean the text - remove markdown code blocks if present
                let cleanText = generatedText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();

                // Find JSON array in the text (in case there's extra text)
                const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    cleanText = jsonMatch[0];
                }

                const parsed = JSON.parse(cleanText);

                if (Array.isArray(parsed) && parsed.length >= 3) {
                    return parsed.slice(0, 5);
                } else {
                    throw new Error("Response is not an array with 3 items");
                }
            } catch (parseError) {
                console.log("JSON parsing failed, trying text extraction:", parseError);

                // If not valid JSON, try to extract captions from text
                const lines = generatedText.split('\n')
                    .filter(line => line.trim() &&
                        !line.includes('```') &&
                        !line.toLowerCase().includes('json') &&
                        line.length > 20)
                    .map(line => line.replace(/^[0-9"'.–—\s]+/, '').trim())
                    .filter(line => line.length > 0);

                if (lines.length >= 3) {
                    return lines.slice(0, 3);
                }
            }

            return null;
        } catch (error) {
            console.error("❌ Gemini API error:", error);
            throw error;
        }
    };

    // 📝 Smart fallback that creates personalized captions
    const getPersonalizedFallback = () => {
        const toneEmojis = {
            "Playful": "🎉🎈✨",
            "Professional": "💼📊📈",
            "Witty": "😏💅🔥",
            "Inspirational": "✨🌟💫",
            "Mysterious": "🌙🔮👀",
            "Romantic": "💕💖💘"
        };

        const nicheHashtags = {
            "Fashion": "OOTD,StyleGoals,FashionWeek",
            "Food": "Foodie,InstaFood,Yummy",
            "Travel": "Wanderlust,TravelGram,Adventure",
            "Fitness": "GymLife,FitnessMotivation,Workout",
            "Tech": "TechLife,Gadgets,Innovation",
            "Business": "Entrepreneur,Success,Mindset",
            "Lifestyle": "LifeStyle,GoodVibes,DailyLife",
            "Beauty": "BeautyTips,Skincare,Mua"
        };

        const selectedEmojis = toneEmojis[tone] || "✨";
        const hashtagList = (nicheHashtags[niche] || "Vibes,Life,Goals").split(',');

        const keywordsList = keywords ? keywords.split(',').map(k => k.trim()) : [];
        const keywordHashtag = keywordsList.length > 0 ? `#${keywordsList[0].replace(/\s+/g, '')}` : '';

        return [
            `${selectedEmojis[0]} ${topic} — where every moment feels like magic. ${selectedEmojis} #${topic.replace(/\s+/g, '')} #${niche}Vibes ${keywordHashtag}`,
            `Just dropped: your daily dose of ${niche.toLowerCase()} inspiration. ${selectedEmojis[1] || '💫'} #${niche}Life #DailyInspo #${hashtagList[1]}`,
            `Plot twist: this ${topic.toLowerCase()} moment hits different. ${selectedEmojis[2] || '🔥'} #Unforgettable #${niche}Magic #${hashtagList[2]}`,
        ];
    };

    // 🚀 Main generate function
    const generate = async () => {
        if (!topic.trim() || loading) return;

        setLoading(true);
        setApiError(null);
        setUsingFallback(false);
        setCaptions([]);

        try {
            // Try Gemini API first
            let generatedCaptions = await generateWithGemini();

            if (generatedCaptions && generatedCaptions.length >= 3) {
                setCaptions(generatedCaptions);
            } else {
                // Use personalized fallback
                setUsingFallback(true);
                setApiError("✨ Using smart generation mode. Your captions are personalized based on your input!");
                setCaptions(getPersonalizedFallback());
            }
        } catch (error) {
            console.error("Generation failed:", error);
            setUsingFallback(true);
            setApiError("✨ Using smart generation mode. Please try again for AI-generated captions!");
            setCaptions(getPersonalizedFallback());
        } finally {
            setLoading(false);
        }
    };

    // 📋 Copy to clipboard function
    const copy = (text, i) => {
        navigator.clipboard.writeText(text);
        setCopied(i);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen bg-white text-black overflow-x-hidden relative">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@300;400&display=swap');
                .font-display { font-family: 'Playfair Display', serif; }
                .font-mono-dm { font-family: 'DM Mono', monospace; }
                @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
                @keyframes floatY { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-8px); } }
                @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
                @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
                @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
                .fade-up { animation: fadeUp 0.6s cubic-bezier(.16,1,.3,1) both; }
                .float-y { animation: floatY 4s ease-in-out infinite; }
                .slide-in { animation: slideIn 0.5s cubic-bezier(.16,1,.3,1) both; }
                .shimmer-text {
                    background: linear-gradient(90deg, #0891b2 0%, #06b6d4 40%, #67e8f9 60%, #0891b2 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 3s linear infinite;
                }
                .cursor-blink { animation: blink 1s step-end infinite; }
                .preview-card { transition: all 0.5s cubic-bezier(.16,1,.3,1); }
                .api-error { 
                    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
                    border: 1px solid #3b82f6;
                    color: #1e40af;
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    margin-top: 1rem;
                    text-align: center;
                }
                .free-badge {
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    margin-left: 0.5rem;
                }
                .gemini-badge {
                    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    margin-left: 0.5rem;
                }
                .fallback-badge {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    margin-left: 0.5rem;
                }
            `}</style>

            <div className={`relative z-10 max-w-7xl mx-auto px-5 py-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

                {/* Title with Gemini Badge */}
                <div className="mb-10 text-center">
                    <div className="flex justify-center items-center gap-3 flex-wrap mb-3">
                        <h1 className="font-display text-4xl font-medium leading-none tracking-tight text-cyan-600">
                            Instagram
                        </h1>
                        <h1 className="font-display text-4xl font-normal italic leading-none tracking-tight text-black">
                            Captions
                        </h1>
                    </div>
                    <p className="font-mono-dm text-[11px] tracking-[2px] text-gray-500 mt-4 uppercase">
                        Stop the scroll — craft words that convert
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">

                    {/* LEFT: Form */}
                    <div className="lg:col-span-6">
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 mb-6 space-y-6">

                            {/* Topic */}
                            <div>
                                <label className="font-mono-dm text-[9px] tracking-[3px] uppercase text-cyan-600 block mb-3">
                                    01 — Describe your post
                                </label>
                                <textarea
                                    value={topic}
                                    onChange={e => setTopic(e.target.value)}
                                    rows={3}
                                    placeholder="e.g. A sunrise hike with misty mountains in the background..."
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 text-black text-[14px] font-display placeholder:text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none leading-relaxed"
                                />
                                <div className="text-right font-mono-dm text-[10px] text-gray-400 mt-1.5">{topic.length} chars</div>
                            </div>

                            {/* Tone */}
                            <div>
                                <label className="font-mono-dm text-[9px] tracking-[3px] uppercase text-cyan-600 block mb-3">
                                    02 — Tone
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {TONES.map(({ label, emoji }) => (
                                        <button key={label} onClick={() => setTone(label)}
                                            className={`px-4 py-2 rounded-full text-[13px] font-display border transition-all duration-200 cursor-pointer ${tone === label
                                                ? "border-cyan-600 text-cyan-700"
                                                : "border-gray-200 text-gray-500 hover:border-cyan-400/70 hover:text-cyan-600"}`}>
                                            {emoji} {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Niche */}
                            <div>
                                <label className="font-mono-dm text-[9px] tracking-[3px] uppercase text-cyan-600 block mb-3">
                                    03 — Niche
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {NICHES.map(n => (
                                        <button key={n} onClick={() => setNiche(n)}
                                            className={`px-3 py-1.5 rounded-lg text-[12px] font-mono-dm tracking-wide border transition-all duration-200 cursor-pointer ${niche === n
                                                ? "bg-cyan-600 border-cyan-600 text-white"
                                                : "border-gray-200 text-gray-500 hover:border-cyan-600/70 hover:text-cyan-600"}`}>
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Keywords */}
                            <div>
                                <label className="font-mono-dm text-[9px] tracking-[3px] uppercase text-cyan-600 block mb-3">
                                    04 — Keywords <span className="text-gray-400 normal-case tracking-normal text-[9px]">(optional)</span>
                                </label>
                                <input
                                    value={keywords}
                                    onChange={e => setKeywords(e.target.value)}
                                    placeholder="summer, golden, minimalist..."
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3.5 text-gray-700 text-[14px] font-display placeholder:text-gray-300 focus:outline-none focus:border-cyan-600/50 transition-colors"
                                />
                            </div>

                            {/* Generate button */}
                            <button onClick={generate} disabled={!topic.trim() || loading}
                                className={`w-full py-4 rounded-lg cursor-pointer text-sm tracking-[4px] transition-all duration-300 ${topic.trim() && !loading
                                    ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 active:translate-y-0"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                                {loading ? `✦ Generating${".".repeat(loadingDot)}` : "✦ Generate"}
                            </button>

                            {apiError && (
                                <div className="api-error">
                                    {apiError}
                                </div>
                            )}

                           
                        </div>
                    </div>

                    {/* RIGHT: Results or Preview */}
                    <div className="lg:col-span-6">

                        {captions.length > 0 ? (
                            /* RESULTS */
                            <div>
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="flex-1 h-px bg-gray-200" />
                                    <span className="font-mono-dm text-sm tracking-[3px] text-cyan-600 uppercase flex items-center">
                                        Your AI Captions
                                        {usingFallback && <span className="fallback-badge ml-2">Smart Mode</span>}
                                    </span>
                                    <div className="flex-1 h-px bg-gray-200" />
                                </div>
                                <div className="space-y-2">
                                    {captions.map((cap, i) => (
                                        <div key={i}
                                            className="fade-up rounded-lg border border-cyan-600/30 bg-white p-4 hover:border-cyan-700/60 hover:shadow-sm transition-all duration-300"
                                            style={{ animationDelay: `${i * 0.12}s` }}>
                                            <div className="flex items-center justify-between">

                                                <div className="font-mono-dm text-[9px] tracking-[3px] text-cyan-600 mb-2">0{i + 1}</div>

                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono-dm text-[10px] text-gray-400">{cap.length} chars</span>
                                                    <button onClick={() => copy(cap, i)}
                                                        className={`p-1.5 rounded-md text-[10px] font-mono-dm tracking-[2px] uppercase border transition-all duration-200 cursor-pointer ${copied === i
                                                            ? "border-emerald-400/50 bg-emerald-50 text-emerald-600"
                                                            : "border-gray-200 text-gray-500 hover:border-cyan-300 hover:text-cyan-600"}`}>
                                                        {copied === i ? <Check size={14} /> : <Copy size={14} />}
                                                    </button>


                                                </div>
                                            </div>
                                            <p className="font-display text-[14px] leading-relaxed text-black">{cap}</p>

                                        </div>
                                    ))}
                                    <button onClick={generate}
                                        className="w-full py-3.5 rounded-lg border border-cyan-600 text-cyan-600 text-sm tracking-[3px] hover:bg-cyan-600 hover:text-white transition-all duration-200 cursor-pointer flex items-center gap-2 justify-center">
                                        <RotateCcw size={16} className="pt-0.5" /> Generate More
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* PREVIEW STATE */
                            <div className="h-full flex flex-col gap-5">

                                {/* Header */}
                                <div className="text-center">

                                    <p className="font-display text-sm font-medium text-cyan-600">
                                        Your Captions
                                    </p>
                                </div>

                                {/* Animated preview cards */}
                                <div className="relative space-y-3">
                                    {PREVIEW_CAPTIONS.map((item, i) => (
                                        <div key={i}
                                            className={`preview-card rounded-lg border p-4 ${activePreview === i
                                                ? "border-cyan-600/60  shadow-md shadow-cyan-100"
                                                : "border-gray-100 bg-gray-50/50"}`}
                                            style={{ opacity: activePreview === i ? 1 : 0.5 }}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`font-mono-dm text-[9px] tracking-[2px] uppercase px-2 py-0.5 rounded-full ${activePreview === i ? "bg-cyan-100 text-cyan-600" : "bg-gray-100 text-gray-400"}`}>
                                                    {item.niche}
                                                </span>
                                                {activePreview === i && (
                                                    <span className="font-mono-dm text-[8px] text-cyan-600 tracking-widest uppercase flex items-center gap-1">
                                                        Free <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 inline-block cursor-blink" />
                                                    </span>
                                                )}
                                            </div>
                                            <p className="font-display text-[13px] leading-relaxed text-gray-700 mb-1">{item.text}</p>
                                            <p className="font-mono-dm text-[10px] text-cyan-700">{item.tags}</p>
                                        </div>
                                    ))}

                                    {/* Dot indicators */}
                                    <div className="flex justify-center gap-2 pt-1">
                                        {PREVIEW_CAPTIONS.map((_, i) => (
                                            <button key={i} onClick={() => setActivePreview(i)}
                                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activePreview === i ? "bg-cyan-500 w-4" : "bg-gray-300"}`} />
                                        ))}
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-3 mt-2">
                                    {STATS.map(({ value, label }, index) => (
                                        <div key={label} className="float-y rounded-lg border border-gray-100 bg-gray-50 p-3 text-center"
                                            style={{ animationDelay: `${index * 0.5}s` }}>
                                            <div className="shimmer-text font-mono-dm text-lg font-bold">{value}</div>
                                            <div className="font-mono-dm text-[9px] text-gray-400 tracking-wide mt-0.5">{label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA hint */}
                                <div className="rounded-lg border border-dashed border-cyan-600/60 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 text-center">
                                    <div className="text-2xl mb-2">⚡</div>
                                    <p className="font-display text-sm text-gray-600 font-medium">Fill in the form to generate</p>
                                    <p className="font-display text-sm text-gray-500 italic">AI-powered captions</p>
                                    {/* <div className="flex items-center justify-center gap-1 mt-3">
                                        <span className="text-xs font-mono-dm text-cyan-600">✨ 60 requests/minute free</span>
                                    </div> */}
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}