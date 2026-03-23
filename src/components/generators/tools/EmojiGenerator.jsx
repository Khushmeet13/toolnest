import { useState } from "react";

const STYLES = ["Cute", "Bold", "Minimal", "Retro", "3D", "Neon", "Pixel", "Watercolor"];
const MOODS = ["Happy 😄", "Sad 😢", "Angry 😤", "Cool 😎", "Love 💕", "Silly 🤪"];
const CATEGORIES = ["All", "Animals", "Food", "Nature", "Tech", "People", "Objects"];

const SAMPLE_EMOJIS = [
  { id: 1, emoji: "🐼", label: "Dancing Panda", style: "Cute", tag: "Animals" },
  { id: 2, emoji: "🌊", label: "Ocean Wave", style: "3D", tag: "Nature" },
  { id: 3, emoji: "🍕", label: "Pizza Slice", style: "Bold", tag: "Food" },
  { id: 4, emoji: "🚀", label: "Rocket Launch", style: "Neon", tag: "Tech" },
  { id: 5, emoji: "🦊", label: "Sly Fox", style: "Retro", tag: "Animals" },
  { id: 6, emoji: "🌸", label: "Cherry Blossom", style: "Watercolor", tag: "Nature" },
  { id: 7, emoji: "🎮", label: "Game Controller", style: "Pixel", tag: "Tech" },
  { id: 8, emoji: "🧁", label: "Birthday Cupcake", style: "Cute", tag: "Food" },
  { id: 9, emoji: "🦋", label: "Butterfly", style: "Minimal", tag: "Animals" },
  { id: 10, emoji: "⚡", label: "Lightning Bolt", style: "Bold", tag: "Objects" },
  { id: 11, emoji: "🌙", label: "Crescent Moon", style: "Neon", tag: "Nature" },
  { id: 12, emoji: "🎸", label: "Electric Guitar", style: "Retro", tag: "Objects" },
];

const NAV_ITEMS = [
  { icon: "✦", label: "Generate", active: true },
  { icon: "◈", label: "Collections" },
  { icon: "◇", label: "History" },
  { icon: "♡", label: "Favorites" },
];

const NAV_BOTTOM = [
  { icon: "⬡", label: "Analytics" },
  { icon: "⬗", label: "API Keys" },
  { icon: "⚙", label: "Settings" },
];

export default function EmojiGenerator() {
  const [prompt, setPrompt] = useState("");
  const [activeStyle, setActiveStyle] = useState("Cute");
  const [activeMood, setActiveMood] = useState("Happy 😄");
  const [activeCategory, setActiveCategory] = useState("All");
  const [generating, setGenerating] = useState(false);

  const [favorites, setFavorites] = useState(new Set());
  const [count, setCount] = useState(4);
  const [generatedEmojis, setGeneratedEmojis] = useState([]);
  const [error, setError] = useState("");

  const filteredEmojis =
    activeCategory === "All"
      ? SAMPLE_EMOJIS
      : SAMPLE_EMOJIS.filter((e) => e.tag === activeCategory);

  // Add after the imports
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;
  const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setGenerating(true);
    setError("");
    setGeneratedEmojis([]);

    try {
      const enhancedPrompt = `Generate ${count} unique emoji(s) based on this description: "${prompt}"

Style: ${activeStyle}
Mood: ${activeMood}

IMPORTANT RULES:
- Return ONLY a JSON array of emoji objects
- Each object should have: { "emoji": "actual_emoji", "label": "short_description" }
- Make the emojis creative, expressive, and match the style and mood
- Use real Unicode emojis (not text descriptions)
- Keep labels short (2-4 words max)
- For ${count} emoji(s), return exactly ${count} items

Example format: 
[{"emoji":"🐼","label":"Happy dancing panda"},{"emoji":"🎉","label":"Celebration party"}]

Return ONLY the JSON array, no other text.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: enhancedPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
      const cleanText = rawText.replace(/```json|```/g, "").trim();

      let aiEmojis;
      try {
        aiEmojis = JSON.parse(cleanText);
        if (!Array.isArray(aiEmojis)) {
          aiEmojis = [];
        }
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", cleanText);
        // Fallback to sample emojis
        const fallbackPool = ["✨", "🎉", "🌟", "💫", "🔥", "🎊", "🌈", "💎", "🦄", "🎯"];
        aiEmojis = Array(count).fill().map((_, i) => ({
          emoji: fallbackPool[i % fallbackPool.length],
          label: `Generated emoji ${i + 1}`
        }));
      }

      // Add IDs and metadata to generated emojis
      const emojisWithMeta = aiEmojis.map((emoji, index) => ({
        id: Date.now() + index,
        emoji: emoji.emoji || "✨",
        label: emoji.label || "Custom emoji",
        style: activeStyle,
        tag: "Generated",
        isGenerated: true
      }));

      setGeneratedEmojis(emojisWithMeta);
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to generate emojis. Please try again!");
      setTimeout(() => setError(""), 3000);
    } finally {
      setGenerating(false);
    }
  };

  const toggleFav = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const canvasToImage = (emoji) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 250;
    canvas.height = 200;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '80px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png');
  };

  return (
    <div className=" bg-white py-16">


      {/* ── Main ── */}
      <main className="max-w-6xl mx-auto">
        {/* Top bar */}
        <header className="text-center sticky top-0 z-10 bg-white/80 backdrop-blur  px-8    ">
          <div>
            <h1 className="text-4xl font-medium text-sky-900 tracking-tight">
              Emoji Generator
            </h1>
            <p className="text-base text-slate-400 mt-2">
              Craft expressive, unique emojis with AI
            </p>
          </div>

        </header>

        <div className="p-8 grid grid-cols-[1fr_1.6fr] gap-6 items-start">
          {/* ── LEFT: Input Panel ── */}
          <div className="flex flex-col gap-4">
            {/* Prompt card */}
            <div className="bg-white border border-cyan-100 rounded-xl p-5 shadow-sm">
              <label className="text-xs font-bold text-cyan-700 tracking-widest uppercase block mb-3">
                Describe your emoji
              </label>
              <textarea
                value={prompt}
                onChange={(e) =>
                  setPrompt(e.target.value.slice(0, 120))
                }
                placeholder="A happy dancing panda with confetti and sparkles..."
                className="w-full h-24 border border-cyan-100 rounded-xl px-3 py-2.5 text-sm text-sky-900 resize-none bg-cyan-50/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all placeholder:text-slate-300 leading-relaxed"
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-slate-300">
                  {prompt.length} / 120
                </span>
              </div>

              {/* Style chips */}
              <div className="mt-4">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  Style
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveStyle(s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${activeStyle === s
                        ? "bg-gradient-to-r from-cyan-500 to-sky-600 text-white border-transparent shadow-sm shadow-cyan-200"
                        : "bg-white text-cyan-700 border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className="mt-4">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  Mood
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {MOODS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setActiveMood(m)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${activeMood === m
                        ? "bg-sky-100 text-sky-700 border-sky-300"
                        : "bg-white text-slate-500 border-slate-200 hover:border-cyan-300 hover:text-cyan-600"
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count slider */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Generate Count
                  </p>
                  <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100">
                    {count}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-xs text-slate-300 mt-1">
                  <span>1</span>
                  <span>12</span>
                </div>
              </div>

              <div className="flex justify-between mt-1">
                <span className="text-xs text-slate-300">
                  {prompt.length} / 120
                </span>
                {error && (
                  <span className="text-xs text-red-500 animate-pulse">
                    ⚠️ {error}
                  </span>
                )}
              </div>
            </div>

            {/* Advanced settings */}
            <div className="bg-white border border-cyan-100 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-bold text-cyan-700 tracking-widest uppercase mb-3">
                Advanced Settings
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Background", options: ["Transparent", "White", "Gradient", "Custom"] },
                  { label: "Size", options: ["32px", "64px", "128px", "256px"] },
                  { label: "Format", options: ["PNG", "SVG", "WebP", "GIF"] },
                ].map(({ label, options }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">{label}</span>
                    <select className="text-xs border border-cyan-100 rounded-lg px-2 py-1 text-sky-800 bg-cyan-50/50 focus:outline-none focus:border-cyan-400 cursor-pointer">
                      {options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating…
                </span>
              ) : (
                "✦ Generate Emojis"
              )}
            </button>

            {/* Generated result */}
            {generatedEmojis.length > 0 && (
              <div className="bg-white border-2 border-cyan-300 rounded-xl p-5 shadow-md shadow-cyan-100">
                <p className="text-xs font-bold text-cyan-600 mb-3 flex items-center gap-2">
                  <span>✨ AI Generated {generatedEmojis.length} Emoji(s)</span>

                </p>
                <div className="grid grid-cols-2 gap-3">
                  {generatedEmojis.map((item) => (
                    <div key={item.id} className="flex flex-col items-center gap-2 p-3 bg-cyan-50 rounded-lg">
                      <div className="text-5xl">{item.emoji}</div>
                      <p className="text-xs font-semibold text-sky-900 text-center">{item.label}</p>
                      <div className="flex gap-2 w-full mt-2">
                        <button
                          onClick={() => toggleFav(item.id)}
                          className="flex-1 py-1.5 rounded-lg border border-cyan-200 text-xs text-cyan-600 hover:bg-cyan-100 transition-all cursor-pointer"
                        >
                          {favorites.has(item.id) ? "❤️ Saved" : "🤍 Save"}
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement("a");
                            link.download = `emoji-${item.id}.png`;
                            link.href = canvasToImage(item.emoji);
                            link.click();
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-white text-xs font-medium hover:opacity-90 transition-all cursor-pointer"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Results Grid ── */}
          <div>


            {/* Category filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${activeCategory === cat
                    ? "bg-gradient-to-r from-cyan-500 to-sky-600 text-white border-transparent shadow-sm"
                    : "bg-white text-slate-500 border-cyan-100 hover:border-cyan-300 hover:text-cyan-600"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Emoji grid */}
            <div className="grid grid-cols-4 gap-3">
              {filteredEmojis.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-cyan-100 rounded-xl p-3 flex flex-col items-center gap-2 group hover:border-cyan-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-100 transition-all cursor-pointer"
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
                    {item.emoji}
                  </div>
                  <p className="text-xs font-semibold text-sky-900 text-center leading-tight">
                    {item.label}
                  </p>
                  <span className="text-xs text-cyan-500 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded-full">
                    {item.style}
                  </span>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity w-full">
                    <button
                      onClick={() => toggleFav(item.id)}
                      className={`flex-1 py-1 rounded-lg text-xs font-medium border transition-all ${favorites.has(item.id)
                        ? "bg-pink-50 border-pink-200 text-pink-500"
                        : "border-cyan-100 text-slate-400 hover:border-pink-200 hover:text-pink-400"
                        }`}
                    >
                      {favorites.has(item.id) ? "♥" : "♡"}
                    </button>
                    <button className="flex-1 py-1 rounded-lg text-xs font-medium border border-cyan-100 text-slate-400 hover:border-cyan-400 hover:text-cyan-600 transition-all">
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent prompts */}
            <div className="mt-6 bg-white border border-cyan-100 rounded-xl p-5 shadow-sm">
              <p className="text-xs font-bold text-cyan-700 tracking-widest uppercase mb-3">
                Recent Prompts
              </p>
              <div className="flex flex-col gap-2">
                {[
                  "A sleepy cat holding a coffee mug",
                  "Retro robot doing a thumbs up",
                  "Neon jellyfish floating in space",
                  "Tiny mushroom with sparkles",
                ].map((txt, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(txt)}
                    className="text-left text-xs text-slate-500 px-3 py-1 rounded-xl hover:bg-cyan-50 hover:text-cyan-700 border border-transparent hover:border-cyan-100 transition-all flex items-center gap-2"
                  >
                    <span className="text-cyan-300 shrink-0">◈</span>
                    {txt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}