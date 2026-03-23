import { useState, useEffect, useRef } from "react";

const DATA = {
  Bollywood: [
    "Dilwale Dulhania Le Jayenge", "Sholay", "3 Idiots", "Dangal", "Lagaan",
    "Kuch Kuch Hota Hai", "Dil Chahta Hai", "Zindagi Na Milegi Dobara",
    "Queen", "Gangs of Wasseypur", "Andhadhun", "Article 15",
    "Taare Zameen Par", "Dil Dhadakne Do", "Bajrangi Bhaijaan",
    "PK", "Raazi", "Gully Boy", "Super 30", "Tumbbad",
    "Stree", "Bard of Blood", "Uri The Surgical Strike",
    "Kabir Singh", "Padmaavat", "Bahubali", "RRR", "KGF",
    "Pushpa", "Vikram Vedha", "Sarkar", "Mughal E Azam",
  ],
  Hollywood: [
    "The Dark Knight", "Inception", "Interstellar", "The Avengers",
    "Jurassic Park", "Forrest Gump", "The Lion King", "Titanic",
    "Harry Potter", "The Lord of the Rings", "Spider Man",
    "Iron Man", "Black Panther", "Doctor Strange",
    "The Matrix", "Fight Club", "Shutter Island",
    "Pulp Fiction", "Goodfellas", "The Godfather",
    "La La Land", "Whiplash", "Get Out",
    "Parasite", "Joker", "Oppenheimer", "Barbie",
    "Top Gun Maverick", "Everything Everywhere All At Once",
    "No Country for Old Men", "The Wolf of Wall Street",
  ],
  "Web Series": [
    "Breaking Bad", "Game of Thrones", "Stranger Things",
    "Money Heist", "Dark", "Squid Game", "The Crown",
    "Black Mirror", "Ozark", "The Witcher",
    "Narcos", "Peaky Blinders", "The Boys",
    "Mirzapur", "Sacred Games", "Panchayat",
    "Scam 1992", "Delhi Crime", "Jamtara",
    "Kota Factory", "TVF Pitchers", "Breathe",
    "Paatal Lok", "Asur", "The Family Man",
    "Aarya", "Bandish Bandits", "Four More Shots Please",
    "Inside Edge", "Maharani", "Special Ops",
  ],
  "Random Words": [
    "Jugaad", "Chai", "Rickshaw", "Monsoon", "Cricket",
    "Bollywood Dance", "Street Food", "Holi Festival",
    "Yoga", "Meditation", "Elephant Ride", "Spice Market",
    "Railway Station", "Autorickshaw", "Paan Shop",
    "Dabbawala", "Dhol", "Rangoli", "Kite Flying",
    "Buffalo", "Mango Tree", "Coconut Water", "Lassi",
    "Dhaba", "Jugalbandi", "Antakshari", "Tambola",
    "Kabaddi", "Gilli Danda", "Pitthu",
    "Wedding Baraat", "Mehendi", "Diwali Crackers",
  ],
};

const CATEGORY_META = {
  Bollywood: { icon: "🎭", color: "#06b6d4", desc: "Hindi films" },
  Hollywood: { icon: "🎬", color: "#0891b2", desc: "English films" },
  "Web Series": { icon: "📺", color: "#0e7490", desc: "OTT shows" },
  "Random Words": { icon: "🎲", color: "#155e75", desc: "Fun words" },
};

const TIPS = [
  "Bolna bilkul nahi!",
  "Sirf haath hilao",
  "Aankhon se baat karo",
  "Act karo, bol nahi sakte",
  "Time shuru hoga abhi",
];

export default function DumbCharades() {
  const [screen, setScreen] = useState("home");
  const [selectedCats, setSelectedCats] = useState(["Bollywood"]);
  const [current, setCurrent] = useState(null);
  const [category, setCategory] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [history, setHistory] = useState([]);
  const [tipIdx, setTipIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [cardFlip, setCardFlip] = useState(false);
  const [customTime, setCustomTime] = useState(60);
  const [score, setScore] = useState({ correct: 0, pass: 0 });
  const [confetti, setConfetti] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const iv = setInterval(() => setTipIdx((t) => (t + 1) % TIPS.length), 2500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current); setTimerActive(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const getRandomPhrase = () => {
    const cats = selectedCats.length > 0 ? selectedCats : ["Bollywood"];
    const cat = cats[Math.floor(Math.random() * cats.length)];
    const pool = DATA[cat].filter((p) => !history.includes(p));
    const source = pool.length > 0 ? pool : DATA[cat];
    const phrase = source[Math.floor(Math.random() * source.length)];
    return { phrase, cat };
  };

  const startRound = () => {
    const { phrase, cat } = getRandomPhrase();
    setCurrent(phrase);
    setCategory(cat);
    setRevealed(false);
    setTimer(customTime);
    setTimerActive(false);
    setCardFlip(false);
    setAnimKey((k) => k + 1);
    setHistory((h) => [...h, phrase]);
    setScreen("play");
  };

  const revealAndStart = () => {
    setCardFlip(true);
    setRevealed(true);
    setTimeout(() => { setTimerActive(true); }, 400);
  };

  const markCorrect = () => {
    clearInterval(timerRef.current);
    setTimerActive(false);
    setScore((s) => ({ ...s, correct: s.correct + 1 }));
    triggerConfetti();
    setScreen("done");
  };

  const markPass = () => {
    clearInterval(timerRef.current);
    setTimerActive(false);
    setScore((s) => ({ ...s, pass: s.pass + 1 }));
    setScreen("done");
  };

  const triggerConfetti = () => {
    const pieces = Array.from({ length: 18 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      color: ["#06b6d4","#0891b2","#67e8f9","#cffafe","#0e7490"][i % 5],
      delay: Math.random() * 0.5, size: 6 + Math.random() * 8,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 2000);
  };

  const toggleCat = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat)
        ? prev.length > 1 ? prev.filter((c) => c !== cat) : prev
        : [...prev, cat]
    );
  };

  const timerPct = (timer / customTime) * 100;
  const timerColor = timer > customTime * 0.5 ? "#06b6d4" : timer > customTime * 0.25 ? "#f59e0b" : "#ef4444";
  const wordCount = current ? current.split(" ").length : 0;

  return (
    <div className=" bg-white py-16" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;900&family=Syne:wght@700;800&display=swap');
        @keyframes slideUp { from{transform:translateY(24px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes flipCard { 0%{transform:rotateY(0)} 50%{transform:rotateY(90deg)} 100%{transform:rotateY(0)} }
        @keyframes confettiFall { to{transform:translateY(400px) rotate(720deg);opacity:0} }
        @keyframes pulse2 { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes spin1 { to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        .slide-up{animation:slideUp .4s cubic-bezier(.34,1.56,.64,1) both}
        .flip-card{animation:flipCard .5s ease both}
        .pulse2{animation:pulse2 1s ease-in-out infinite}
        .fade-in{animation:fadeIn .3s ease both}
        .confetti-piece{position:fixed;top:20%;pointer-events:none;z-index:999;border-radius:2px;animation:confettiFall 1.8s ease-in forwards}
      `}</style>

      {confetti.map((c) => (
        <div key={c.id} className="confetti-piece"
          style={{ left:`${c.x}%`, width:c.size, height:c.size*1.4, background:c.color, animationDelay:`${c.delay}s` }} />
      ))}

      <div className="max-w-sm mx-auto px-5  flex flex-col">

        {/* ── HOME ── */}
        {screen === "home" && (
          <div className="flex-1 flex flex-col slide-up">
            {/* Header */}
            <div className="mb-8">
              
              <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:36,fontWeight:800,lineHeight:1.1,color:"#0c1a2e"}}>
                Pick. Act.<br/>Win! 🏆
              </h1>
              <p className="text-slate-400 text-sm mt-2">Bolna bilkul mana hai — sirf act karo!</p>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">Categories choose karo</p>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.entries(CATEGORY_META).map(([cat, meta]) => {
                  const active = selectedCats.includes(cat);
                  return (
                    <button key={cat} onClick={() => toggleCat(cat)}
                      className="relative overflow-hidden text-left p-4 rounded-xl border-2 transition-all active:scale-95 cursor-pointer"
                      style={{
                        borderColor: active ? meta.color : "#e2e8f0",
                        background: active ? `${meta.color}10` : "#f8fafc",
                      }}>
                      {active && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{background:meta.color}}>
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                      <div style={{fontSize:24}} className="mb-2">{meta.icon}</div>
                      <div className="font-bold text-sm text-slate-700">{cat}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{meta.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timer setting */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Timer</span>
                <span className="text-sm font-bold text-cyan-600">{customTime}s</span>
              </div>
              <input type="range" min={30} max={120} step={15} value={customTime}
                onChange={(e) => setCustomTime(Number(e.target.value))}
                className="w-full accent-cyan-500" />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>30s</span><span>60s</span><span>90s</span><span>120s</span>
              </div>
            </div>

            {/* Score if played */}
            {(score.correct > 0 || score.pass > 0) && (
              <div className="flex gap-2 mb-4">
                <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                  <div className="text-xl font-black text-emerald-500">{score.correct}</div>
                  <div className="text-xs text-emerald-400">Correct</div>
                </div>
                <div className="flex-1 bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                  <div className="text-xl font-black text-red-400">{score.pass}</div>
                  <div className="text-xs text-red-400">Pass</div>
                </div>
              </div>
            )}

            <button onClick={startRound}
              className="w-full py-4 rounded-xl font-bold text-base text-white transition-all active:scale-95 mt-auto cursor-pointer"
              style={{background:"linear-gradient(135deg,#06b6d4,#0891b2)"}}>
              Start Round 🎬
            </button>
          </div>
        )}

        {/* ── PLAY ── */}
        {screen === "play" && (
          <div className="flex-1 flex flex-col">
            {/* Top */}
            <div className="flex items-center justify-between mb-5">
              <button onClick={() => { clearInterval(timerRef.current); setScreen("home"); }}
                className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{background:`${CATEGORY_META[category]?.color}15`,color:CATEGORY_META[category]?.color}}>
                  {CATEGORY_META[category]?.icon} {category}
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-500">{history.length}</span>
              </div>
            </div>

            {/* Timer ring */}
            <div className="flex justify-center mb-5">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#f1f5f9" strokeWidth="6"/>
                  <circle cx="40" cy="40" r="34" fill="none"
                    stroke={timerColor} strokeWidth="6"
                    strokeDasharray={`${timerPct * 2.136} 213.6`}
                    strokeLinecap="round"
                    style={{transition:"stroke-dasharray .9s linear,stroke .3s"}}/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black" style={{color: timerActive ? timerColor : "#94a3b8", lineHeight:1}}>{timer}</span>
                  <span className="text-xs text-slate-400">sec</span>
                </div>
              </div>
            </div>

            {/* Card */}
            <div key={animKey} className={`flex-1 flex flex-col justify-center ${cardFlip ? "flip-card" : "slide-up"}`}>
              {!revealed ? (
                <div className="rounded-xl border-2 border-dashed border-cyan-200 bg-cyan-50 p-8 text-center mb-5 cursor-pointer active:scale-95 transition-all"
                  onClick={revealAndStart}>
                  <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                      <line x1="2" y1="2" x2="22" y2="22"/>
                    </svg>
                  </div>
                  <p className="text-cyan-600 font-bold text-base mb-1">Actor ko dikhao</p>
                  <p className="text-cyan-400 text-sm">Tap to reveal the phrase</p>
                  <div className="mt-4 flex items-center justify-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 pulse2" style={{animationDelay:"0s"}}/>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 pulse2" style={{animationDelay:".2s"}}/>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 pulse2" style={{animationDelay:".4s"}}/>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-white border-2 p-6 text-center mb-5 shadow-sm"
                  style={{borderColor:"#06b6d4"}}>
                  {/* Word count indicators */}
                  <div className="flex items-center justify-center gap-1.5 mb-4">
                    {current.split(" ").map((_, i) => (
                      <div key={i} className="h-1 rounded-full flex-1 max-w-8"
                        style={{background:i===0?"#06b6d4":i===1?"#0891b2":"#0e7490",opacity:.7+i*.1}}/>
                    ))}
                  </div>
                  <div className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">
                    {wordCount} word{wordCount !== 1 ? "s" : ""}
                  </div>
                  <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:"#0c1a2e",lineHeight:1.2}}>
                    {current}
                  </h2>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {timerActive ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 pulse2"/>
                        <span className="text-xs font-semibold text-emerald-600">Timer chal raha hai</span>
                      </div>
                    ) : timer === 0 ? (
                      <div className="px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
                        <span className="text-xs font-semibold text-red-500">⏰ Time's up!</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Tip ticker
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 mb-5">
                <span className="text-slate-300 text-sm">💡</span>
                <span key={tipIdx} className="text-xs text-slate-400 fade-in">{TIPS[tipIdx]}</span>
              </div> */}

              {/* Action buttons */}
              {revealed && (
                <div className="grid grid-cols-2 gap-3 fade-in">
                  <button onClick={markPass}
                    className="py-4 rounded-xl border-2 border-red-100 bg-red-50 text-red-400 font-bold text-sm active:scale-95 transition-all cursor-pointer">
                    ✗ Pass
                  </button>
                  <button onClick={markCorrect}
                    className="py-4 rounded-xl text-white font-bold text-sm active:scale-95 transition-all cursor-pointer"
                    style={{background:"linear-gradient(135deg,#06b6d4,#0891b2)"}}>
                    ✓ Correct!
                  </button>
                </div>
              )}

              {!revealed && (
                <button onClick={revealAndStart}
                  className="w-full py-4 rounded-xl text-white font-bold text-sm active:scale-95 transition-all cursor-pointer"
                  style={{background:"linear-gradient(135deg,#06b6d4,#0891b2)"}}>
                  Reveal & Start Timer ▶
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── DONE ── */}
        {screen === "done" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center slide-up">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5"
              style={{background: score.correct > score.pass ? "linear-gradient(135deg,#06b6d4,#0891b2)" : "#fef2f2",
                      border: score.correct > score.pass ? "none" : "2px solid #fecaca"}}>
              <span style={{fontSize:36}}>{score.correct > (score.correct + score.pass - 1) ? "🎉" : "😬"}</span>
            </div>

            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:"#0c1a2e"}} className="mb-1">
              Round Over!
            </h2>
            <p className="text-slate-400 text-sm mb-8">{current}</p>

            {/* Stats */}
            <div className="w-full grid grid-cols-2 gap-3 mb-6">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <div className="text-3xl font-black text-emerald-500">{score.correct}</div>
                <div className="text-xs font-semibold text-emerald-400 mt-1">Correct ✓</div>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <div className="text-3xl font-black text-red-400">{score.pass}</div>
                <div className="text-xs font-semibold text-red-400 mt-1">Passed ✗</div>
              </div>
            </div>

            {/* Seen phrases */}
            <div className="w-full bg-slate-50 rounded-xl p-4 mb-6 text-left border border-slate-100">
              <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">Phrases seen</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {history.slice().reverse().map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:"#06b6d4"}}/>
                    <span className="text-sm text-slate-600 truncate">{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button onClick={() => { setScore({correct:0,pass:0}); setHistory([]); setScreen("home"); }}
                className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-500 font-semibold text-sm active:scale-95 transition-all cursor-pointer">
                ← Home
              </button>
              <button onClick={startRound}
                className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm active:scale-95 transition-all cursor-pointer"
                style={{background:"linear-gradient(135deg,#06b6d4,#0891b2)"}}>
                Next Round →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}