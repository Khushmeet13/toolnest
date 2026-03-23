import { useState } from "react";

const ALL_CHALLENGES = [
  { cat: "Fitness", emoji: "💪", title: "30 Pushups", desc: "Abhi 30 pushups karo. Ruko nahi, seedha neeche jao!", time: "5 min", diff: "Medium" },
  { cat: "Fitness", emoji: "🏃", title: "100 Jumping Jacks", desc: "Ek saath 100 jumping jacks. Go go go!", time: "3 min", diff: "Easy" },
  { cat: "Fitness", emoji: "🧘", title: "2 Min Plank", desc: "Plank position mein raho full 2 minutes. Shake nahi karna!", time: "2 min", diff: "Hard" },
  { cat: "Fitness", emoji: "🦵", title: "50 Squats", desc: "Deep squats. Knees toes ke peeche nahi jaane chahiye.", time: "5 min", diff: "Medium" },
  { cat: "Creativity", emoji: "🎨", title: "Blind Drawing", desc: "Bina dekhe ek celebrity ka face draw karo. Share karo result!", time: "10 min", diff: "Easy" },
  { cat: "Creativity", emoji: "✍️", title: "6-Word Story", desc: "Sirf 6 words mein ek poori story likhdo. Serious wali.", time: "5 min", diff: "Easy" },
  { cat: "Creativity", emoji: "🎵", title: "Beatbox 30 Sec", desc: "30 seconds ka beatbox banao aur record karo.", time: "5 min", diff: "Medium" },
  { cat: "Creativity", emoji: "🖊️", title: "Left Hand Poem", desc: "Apne opposite hand se 4-line ki poem likhdo.", time: "10 min", diff: "Easy" },
  { cat: "Social", emoji: "😂", title: "Dad Joke Marathon", desc: "3 family members ko dad jokes sunao. Laugh nikalna compulsory.", time: "10 min", diff: "Easy" },
  { cat: "Social", emoji: "📞", title: "Old Friend Call", desc: "Ek purane dost ko call karo jisse 6 mahine se baat nahi ki.", time: "20 min", diff: "Medium" },
  { cat: "Social", emoji: "🙏", title: "Compliment Spree", desc: "5 alag logon ko aaj genuine compliment do — real life mein.", time: "1 day", diff: "Easy" },
  { cat: "Mental", emoji: "🧠", title: "No Phone 1 Hour", desc: "Phone bilkul band. 1 ghanta. Kuch aur karo.", time: "1 hr", diff: "Hard" },
  { cat: "Mental", emoji: "🧩", title: "Sudoku Hard", desc: "Ek hard sudoku solve karo bina hint ke.", time: "20 min", diff: "Hard" },
  { cat: "Mental", emoji: "📚", title: "Read 10 Pages", desc: "Koi bhi book. Abhi 10 pages padho. Bina social media ke.", time: "15 min", diff: "Easy" },
  { cat: "Fun", emoji: "🌶️", title: "Spicy Food Dare", desc: "Sabse teekha khana khao jo ghar mein ho. Water ready rakhna!", time: "5 min", diff: "Hard" },
  { cat: "Fun", emoji: "🕺", title: "Random Dance", desc: "Koi bhi Bollywood song aur 1 min continuous dance.", time: "5 min", diff: "Easy" },
  { cat: "Fun", emoji: "🤸", title: "Cartwheel Try", desc: "Ek cartwheel attempt karo. Grass pe jaana safe rahega!", time: "5 min", diff: "Medium" },
  { cat: "Fun", emoji: "🍳", title: "Mystery Recipe", desc: "Fridge mein jo 5 cheezein hain sirf unse kuch bnao. Google band.", time: "30 min", diff: "Medium" },
];

const CATEGORIES = ["All", "Fitness", "Creativity", "Social", "Mental", "Fun"];

const DIFF_STYLES = {
  Easy: "bg-green-100 text-green-800 border border-green-200",
  Medium: "bg-amber-100 text-amber-800 border border-amber-200",
  Hard: "bg-red-100 text-red-800 border border-red-200",
};

const CAT_COLORS = {
  Fitness: "from-green-400 to-emerald-500",
  Creativity: "from-purple-400 to-violet-500",
  Social: "from-blue-400 to-sky-500",
  Mental: "from-amber-400 to-orange-500",
  Fun: "from-pink-400 to-rose-500",
};

export default function ChallengeGenerator() {
  const [activeCat, setActiveCat] = useState("All");
  const [current, setCurrent] = useState(null);
  const [used, setUsed] = useState(new Set());
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total: 0, done: 0, skipped: 0 });
  const [animKey, setAnimKey] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const getPool = () => {
    const pool = ALL_CHALLENGES.filter(
      (c) => activeCat === "All" || c.cat === activeCat
    );
    const fresh = pool.filter((c) => !used.has(c.title));
    return fresh.length ? fresh : pool;
  };

  const spin = () => {
    const pool = getPool();
    if (!pool.length) return;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setSpinning(true);
    setTimeout(() => setSpinning(false), 500);
    setCurrent(picked);
    setUsed((prev) => new Set([...prev, picked.title]));
    setAnimKey((k) => k + 1);
    setStats((s) => ({ ...s, total: s.total + 1 }));
  };

  const markDone = () => {
    if (!current) return;
    setHistory((h) => [{ ...current, status: "done" }, ...h].slice(0, 8));
    setStats((s) => ({ ...s, done: s.done + 1 }));
    setCurrent(null);
  };

  const skipChallenge = () => {
    if (!current) return;
    setHistory((h) => [{ ...current, status: "skip" }, ...h].slice(0, 8));
    setStats((s) => ({ ...s, skipped: s.skipped + 1 }));
    setCurrent(null);
  };

  const gradient = current ? CAT_COLORS[current.cat] : "from-gray-400 to-gray-500";

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-medium tracking-tight text-gray-900">
            🎲 Challenge Spinner
          </h1>
          <p className="text-sm text-gray-500 mt-1">Spin karo, complete karo, mazze karo!</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border cursor-pointer ${
                activeCat === cat
                  ? "bg-cyan-600 text-white border-cyan-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Challenge Card */}
        <div
          key={animKey}
          className="animate-bounce-in bg-white rounded-xl shadow-lg overflow-hidden mb-4 border border-gray-100"
          style={{ animation: animKey > 0 ? "popIn 0.4s cubic-bezier(.34,1.56,.64,1)" : "none" }}
        >
          {/* Gradient top bar */}
          <div className={`h-1 bg-gradient-to-r ${gradient}`} />

          <div className="p-6">
            {current ? (
              <>
                <div className="text-5xl mb-3">{current.emoji}</div>
                <div className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
                  {current.cat}
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
                  {current.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{current.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    ⏱ {current.time}
                  </span>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${DIFF_STYLES[current.diff]}`}>
                    {current.diff}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">🎯</div>
                <p className="text-gray-400 text-sm">Neeche ka button dabao aur pehla challenge lo!</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={spin}
            className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-bold py-2.5 rounded-xl transition-all text-base cursor-pointer"
          >
            <span className={spinning ? "animate-spin inline-block" : "inline-block"}>⟳</span>
            New Challenge
          </button>
          <button
            onClick={markDone}
            disabled={!current}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-green-50 hover:border-green-300 hover:text-green-700 font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            ✓ Done
          </button>
          <button
            onClick={skipChallenge}
            disabled={!current}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            Skip →
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Spin", value: stats.total, color: "text-gray-800" },
            { label: "Completed", value: stats.done, color: "text-green-600" },
            { label: "Skipped", value: stats.skipped, color: "text-gray-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-2 text-center border border-gray-100 shadow-sm">
              <div className={`text-2xl font-semibold ${color}`}>{value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
              Recent Activity
            </p>
            <div className="flex flex-col gap-2">
              {history.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-100 text-sm"
                >
                  <span>{item.emoji}</span>
                  <span className="flex-1 text-gray-600 truncate">{item.title}</span>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      item.status === "done"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.status === "done" ? "Done ✓" : "Skipped"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.85) rotate(-2deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}