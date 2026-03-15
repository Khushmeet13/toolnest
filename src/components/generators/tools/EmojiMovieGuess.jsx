import { useState, useEffect, useRef } from "react";

const MOVIES = [
  // Bollywood
  { emojis: "🦁👑🌅", answer: "The Lion King", hint: "Jungle ka raja", category: "Hollywood" },
  { emojis: "❄️👸⛄", answer: "Frozen", hint: "Barf aur behne", category: "Hollywood" },
  { emojis: "🕷️🦸‍♂️🏙️", answer: "Spider-Man", hint: "Jaal fenekne wala hero", category: "Hollywood" },
  { emojis: "🧙‍♂️⚡📚", answer: "Harry Potter", hint: "Jaadu ki duniya", category: "Hollywood" },
  { emojis: "🚢💑🌊", answer: "Titanic", hint: "Pani mein duba pyaar", category: "Hollywood" },
  { emojis: "🦇🌃🦸", answer: "Batman", hint: "Raat ka rakhwala", category: "Hollywood" },
  { emojis: "🧸🚀⭐", answer: "Toy Story", hint: "Khilone ki duniya", category: "Hollywood" },
  { emojis: "🐠🌊🔍", answer: "Finding Nemo", hint: "Samundar mein dhundh", category: "Hollywood" },
  { emojis: "👸🍎💤", answer: "Snow White", hint: "Seb khaaya aur so gayi", category: "Hollywood" },
  { emojis: "🦸‍♀️🌩️⚡", answer: "Wonder Woman", hint: "Taaqatwar aurat", category: "Hollywood" },
  { emojis: "🤖❤️🌱", answer: "WALL-E", hint: "Pyaar karne wala robot", category: "Hollywood" },
  { emojis: "👹🌹📚", answer: "Beauty and the Beast", hint: "Jaanwar se pyaar", category: "Hollywood" },
  { emojis: "🏎️💨🏁", answer: "Cars", hint: "Racing ki duniya", category: "Hollywood" },
  { emojis: "🌀⏰🔄", answer: "Inception", hint: "Sapne ke andar sapna", category: "Hollywood" },
  { emojis: "🦊🐰🏙️", answer: "Zootopia", hint: "Janwaron ka sheher", category: "Hollywood" },
  { emojis: "🍕🐢🥊", answer: "Teenage Mutant Ninja Turtles", hint: "Pizza khane wale ninja", category: "Hollywood" },
  { emojis: "👽🌙🚲", answer: "E.T.", hint: "Alien dost", category: "Hollywood" },
  { emojis: "🦖🌿⚠️", answer: "Jurassic Park", hint: "Dinosaur park", category: "Hollywood" },
  { emojis: "🧊❄️💙", answer: "Ice Age", hint: "Barf ka zamana", category: "Hollywood" },
  { emojis: "🌋🦍👸", answer: "King Kong", hint: "Bada bandar", category: "Hollywood" },

  // Bollywood
  { emojis: "🐯🌿📖", answer: "The Jungle Book", hint: "Jungle mein bacha", category: "Bollywood" },
  { emojis: "💃🎶❤️", answer: "Dilwale Dulhania Le Jayenge", hint: "Simran aur Raj", category: "Bollywood" },
  { emojis: "🔫💣🕵️", answer: "Sholay", hint: "Jai aur Veeru", category: "Bollywood" },
  { emojis: "🎪🤹🎠", answer: "Mera Naam Joker", hint: "Joker ki zindagi", category: "Bollywood" },
  { emojis: "🏏🏆🇮🇳", answer: "Lagaan", hint: "Cricket se azaadi", category: "Bollywood" },
  { emojis: "🎓✏️🏫", answer: "3 Idiots", hint: "3 dost aur engineering", category: "Bollywood" },
  { emojis: "🦋🌸💭", answer: "Kuch Kuch Hota Hai", hint: "Pyaar ki feeling", category: "Bollywood" },
  { emojis: "👊💪🥊", answer: "Dangal", hint: "Wrestling wali betiyan", category: "Bollywood" },
  { emojis: "🚂🌄🇮🇳", answer: "Dil Dhadakne Do", hint: "Cruise pe family", category: "Bollywood" },
  { emojis: "🧠💊🔬", answer: "Ghajini", hint: "Yaaddasht kho gayi", category: "Bollywood" },
  { emojis: "🚀🌌🛸", answer: "Koi Mil Gaya", hint: "Alien se dosti", category: "Bollywood" },
  { emojis: "👶🧠📈", answer: "Taare Zameen Par", hint: "Bachche ki kahaani", category: "Bollywood" },
  { emojis: "🏃‍♂️🌏🍫", answer: "Forrest Gump", hint: "Bhagna hi zindagi", category: "Hollywood" },
  { emojis: "🧟💀🌍", answer: "World War Z", hint: "Zombie apocalypse", category: "Hollywood" },
  { emojis: "🦸🌈💥", answer: "Avengers", hint: "Superheroes ka team", category: "Hollywood" },
  { emojis: "🎭🃏😂", answer: "Joker", hint: "Villain ki origin story", category: "Hollywood" },
  { emojis: "🐉🔥🏰", answer: "How to Train Your Dragon", hint: "Azhdag se dosti", category: "Hollywood" },
  { emojis: "🌊🤿🐋", answer: "Aquaman", hint: "Samundar ka raja", category: "Hollywood" },
  { emojis: "🏔️⛏️💎", answer: "Snow White and the Huntsman", hint: "Jungle mein shehzadi", category: "Hollywood" },
  { emojis: "🎻💔🌹", answer: "Devdas", hint: "Pyaar mein toota dil", category: "Bollywood" },
  { emojis: "🦅🌄🏹", answer: "Bahubali", hint: "Mahishmati ka raja", category: "Bollywood" },
  { emojis: "🕵️🔍🎩", answer: "Detective Byomkesh Bakshy", hint: "Bangali detective", category: "Bollywood" },
  { emojis: "🤸‍♂️🎬💫", answer: "PK", hint: "Alien India mein", category: "Bollywood" },
  { emojis: "🏄‍♂️🌊🐬", answer: "Blue", hint: "Samundar ki gehrayi", category: "Bollywood" },
  { emojis: "🤵💍👰", answer: "Band Baaja Baaraat", hint: "Wedding planners ka pyaar", category: "Bollywood" },
];

const CATEGORIES = ["All", "Hollywood", "Bollywood"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const getDifficultyColor = (d) => {
  if (d === "Easy") return { bg: "bg-emerald-950", border: "border-emerald-500", text: "text-emerald-400", glow: "#10b981" };
  if (d === "Medium") return { bg: "bg-amber-950", border: "border-amber-500", text: "text-amber-400", glow: "#f59e0b" };
  return { bg: "bg-red-950", border: "border-red-500", text: "text-red-400", glow: "#ef4444" };
};

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getMovieOptions(correct, allMovies) {
  const others = allMovies.filter((m) => m.answer !== correct.answer);
  const wrong = shuffle(others).slice(0, 3).map((m) => m.answer);
  return shuffle([correct.answer, ...wrong]);
}

export default function EmojiMovieGuess() {
  const [screen, setScreen] = useState("home"); // home | game | result
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("Medium");
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timesUp, setTimesUp] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [history, setHistory] = useState([]); // {correct, chosen, points}
  const [shakeKey, setShakeKey] = useState(0);
  const timerRef = useRef(null);

  const timeLimit = difficulty === "Easy" ? 45 : difficulty === "Medium" ? 30 : 15;

  const filteredMovies = MOVIES.filter(
    (m) => category === "All" || m.category === category
  );

  const startGame = () => {
    const shuffled = shuffle(filteredMovies).slice(0, 10);
    setQueue(shuffled);
    setCurrent(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setHistory([]);
    setSelected(null);
    setRevealed(false);
    setHintUsed(false);
    setTimesUp(false);
    setOptions(getMovieOptions(shuffled[0], filteredMovies));
    setTimeLeft(timeLimit);
    setAnimKey((k) => k + 1);
    setScreen("game");
  };

  // Timer
  useEffect(() => {
    if (screen !== "game" || revealed || timesUp) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setTimesUp(true);
          setRevealed(true);
          setStreak(0);
          setHistory((h) => [...h, { correct: queue[current].answer, chosen: null, points: 0 }]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen, current, revealed, timesUp]);

  const handleAnswer = (opt) => {
    if (revealed) return;
    clearInterval(timerRef.current);
    setSelected(opt);
    setRevealed(true);
    const correct = queue[current].answer;
    const isCorrect = opt === correct;
    let pts = 0;
    if (isCorrect) {
      pts = hintUsed ? 5 : difficulty === "Easy" ? 10 : difficulty === "Medium" ? 15 : 25;
      const timeBonus = Math.floor(timeLeft / 3);
      pts += timeBonus;
      setScore((s) => s + pts);
      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
      setShakeKey((k) => k + 1);
    }
    setHistory((h) => [...h, { correct, chosen: opt, points: pts }]);
  };

  const nextQuestion = () => {
    const next = current + 1;
    if (next >= queue.length) {
      setScreen("result");
      return;
    }
    setCurrent(next);
    setOptions(getMovieOptions(queue[next], filteredMovies));
    setSelected(null);
    setRevealed(false);
    setHintUsed(false);
    setTimesUp(false);
    setTimeLeft(timeLimit);
    setAnimKey((k) => k + 1);
  };

  const useHint = () => {
    if (hintUsed || revealed) return;
    setHintUsed(true);
  };

  const movie = queue[current];
  const progress = queue.length > 0 ? ((current) / queue.length) * 100 : 0;
  const diffColors = getDifficultyColor(difficulty);
  const totalPossible = queue.length * (difficulty === "Easy" ? 25 : difficulty === "Medium" ? 35 : 50);
  const accuracy = history.length > 0
    ? Math.round((history.filter((h) => h.chosen === h.correct).length / history.length) * 100)
    : 0;

  return (
    <div
      className="min-h-screen bg-gray-950 text-white"
      style={{ fontFamily: "'Trebuchet MS', sans-serif" }}
    >
      <style>{`
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 60%{transform:translateX(6px)} }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        @keyframes timerPulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .slide-up { animation: slideUp 0.4s cubic-bezier(.34,1.56,.64,1) both; }
        .pop-in { animation: popIn 0.35s cubic-bezier(.34,1.56,.64,1) both; }
        .shake-it { animation: shake 0.4s ease; }
        .bounce-it { animation: bounce 0.3s ease; }
        .timer-pulse { animation: timerPulse 0.8s ease-in-out infinite; }
      `}</style>

      <div className="max-w-sm mx-auto px-4 py-8 min-h-screen flex flex-col">

        {/* ── HOME SCREEN ── */}
        {screen === "home" && (
          <div className="flex-1 flex flex-col slide-up">
            <div className="text-center mb-10">
              <div className="text-6xl mb-4 pop-in">🎬</div>
              <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                Emoji Movie
              </h1>
              <h2 className="text-2xl font-black text-white mb-2">Guess Game</h2>
              <p className="text-gray-500 text-sm">Emojis dekho, movie pehchano!</p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 mb-4">
              <div className="text-xs tracking-[2px] text-gray-500 mb-3">CATEGORY</div>
              <div className="flex gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      category === c
                        ? "bg-yellow-500 border-yellow-500 text-gray-900"
                        : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
                    }`}
                  >
                    {c === "All" ? "🌍 All" : c === "Hollywood" ? "🎥 Hollywood" : "🎭 Bollywood"}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 mb-6">
              <div className="text-xs tracking-[2px] text-gray-500 mb-3">DIFFICULTY</div>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => {
                  const dc = getDifficultyColor(d);
                  return (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        difficulty === d
                          ? `${dc.bg} ${dc.border} ${dc.text}`
                          : "border-gray-700 text-gray-500 hover:border-gray-500"
                      }`}
                    >
                      {d === "Easy" ? "😊" : d === "Medium" ? "🌶️" : "💀"} {d}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-gray-600 text-center">
                {difficulty === "Easy" ? "45 sec • 10 pts" : difficulty === "Medium" ? "30 sec • 15 pts" : "15 sec • 25 pts"} per question + time bonus
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Movies", val: filteredMovies.length },
                { label: "Questions", val: Math.min(10, filteredMovies.length) },
                { label: "Time", val: `${timeLimit}s` },
              ].map(({ label, val }) => (
                <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
                  <div className="text-xl font-black text-yellow-400">{val}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={startGame}
              className="w-full py-4 rounded-2xl font-black text-base tracking-wide bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-400 hover:to-pink-400 active:scale-95 transition-all text-gray-900"
            >
              GAME SHURU KARO 🎬
            </button>
          </div>
        )}

        {/* ── GAME SCREEN ── */}
        {screen === "game" && movie && (
          <div className="flex-1 flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => { clearInterval(timerRef.current); setScreen("home"); }} className="text-gray-500 hover:text-white text-sm transition-colors">
                ← Quit
              </button>
              <div className="flex items-center gap-3">
                {streak >= 2 && (
                  <div className="flex items-center gap-1 bg-orange-950 border border-orange-500 px-2.5 py-1 rounded-full">
                    <span className="text-xs text-orange-400">🔥 {streak}</span>
                  </div>
                )}
                <div className="bg-yellow-950 border border-yellow-600 px-3 py-1 rounded-full">
                  <span className="text-sm font-black text-yellow-400">⭐ {score}</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 tabular-nums">{current + 1}/{queue.length}</span>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-between mb-4">
              <div className={`text-xs tracking-[2px] ${diffColors.text} ${diffColors.bg} border ${diffColors.border} px-3 py-1 rounded-full`}>
                {difficulty.toUpperCase()}
              </div>
              <div className={`flex items-center gap-2 ${timeLeft <= 5 ? "timer-pulse" : ""}`}>
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#1f2937" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15" fill="none"
                      stroke={timeLeft <= 5 ? "#ef4444" : timeLeft <= 10 ? "#f59e0b" : "#10b981"}
                      strokeWidth="3"
                      strokeDasharray={`${(timeLeft / timeLimit) * 94} 94`}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dasharray 1s linear, stroke 0.3s" }}
                    />
                  </svg>
                  <span className={`absolute inset-0 flex items-center justify-center text-xs font-black ${
                    timeLeft <= 5 ? "text-red-400" : timeLeft <= 10 ? "text-amber-400" : "text-white"
                  }`}>
                    {timeLeft}
                  </span>
                </div>
              </div>
            </div>

            {/* Emoji Card */}
            <div key={animKey} className="pop-in">
              <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 text-center mb-4">
                <div className="text-xs tracking-[2px] text-gray-500 mb-4">YE MOVIE KAUN SI HAI?</div>
                <div className="text-6xl leading-tight tracking-widest mb-4 select-none">
                  {movie.emojis}
                </div>
                {hintUsed && (
                  <div className="bg-blue-950 border border-blue-700 text-blue-300 text-sm px-4 py-2 rounded-xl">
                    💡 Hint: {movie.hint}
                  </div>
                )}
                {timesUp && !hintUsed && (
                  <div className="bg-red-950 border border-red-700 text-red-300 text-sm px-4 py-2 rounded-xl">
                    ⏰ Time's up! Answer: <strong>{movie.answer}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Options */}
            <div key={shakeKey} className={`grid grid-cols-2 gap-2 mb-4 ${shakeKey > 0 ? "shake-it" : ""}`}>
              {options.map((opt, i) => {
                const isCorrect = opt === movie.answer;
                const isSelected = opt === selected;
                let style = "border-gray-700 bg-gray-900 text-gray-200 hover:border-gray-500 hover:bg-gray-800";
                if (revealed) {
                  if (isCorrect) style = "border-emerald-500 bg-emerald-950 text-emerald-300";
                  else if (isSelected && !isCorrect) style = "border-red-500 bg-red-950 text-red-300";
                  else style = "border-gray-800 bg-gray-900 text-gray-600 opacity-50";
                }
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={revealed}
                    className={`py-3.5 px-3 rounded-xl border text-sm font-medium text-center transition-all active:scale-95 disabled:cursor-not-allowed ${style}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {revealed && isCorrect && "✓ "}
                    {revealed && isSelected && !isCorrect && "✗ "}
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Bottom actions */}
            <div className="flex gap-2">
              {!hintUsed && !revealed && (
                <button
                  onClick={useHint}
                  className="flex-1 py-3 rounded-xl border border-blue-700 bg-blue-950 text-blue-400 text-sm font-medium hover:bg-blue-900 active:scale-95 transition-all"
                >
                  💡 Hint (-5 pts)
                </button>
              )}
              {revealed && (
                <button
                  onClick={nextQuestion}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-black text-sm hover:from-yellow-400 hover:to-orange-400 active:scale-95 transition-all"
                >
                  {current + 1 >= queue.length ? "RESULTS DEKHO →" : "NEXT →"}
                </button>
              )}
            </div>

            {/* Score feedback */}
            {revealed && selected === movie.answer && (
              <div className="mt-3 text-center bounce-it">
                <span className="text-emerald-400 font-black text-lg">
                  {streak >= 3 ? `🔥 ${streak}x Streak!` : "✓ Sahi!"} +{history[history.length - 1]?.points} pts
                </span>
              </div>
            )}
            {revealed && selected !== movie.answer && !timesUp && (
              <div className="mt-3 text-center">
                <span className="text-red-400 text-sm">✗ Galat! Sahi jawab: <strong>{movie.answer}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* ── RESULT SCREEN ── */}
        {screen === "result" && (
          <div className="flex-1 flex flex-col slide-up">
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">
                {accuracy >= 80 ? "🏆" : accuracy >= 50 ? "🎯" : "💪"}
              </div>
              <h2 className="text-3xl font-black mb-1">
                {accuracy >= 80 ? "Zabardast!" : accuracy >= 50 ? "Acha kiya!" : "Practice karo!"}
              </h2>
              <p className="text-gray-500 text-sm">Game khatam!</p>
            </div>

            {/* Score cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "SCORE", val: score, color: "text-yellow-400" },
                { label: "ACCURACY", val: `${accuracy}%`, color: "text-emerald-400" },
                { label: "BEST STREAK", val: `🔥 ${bestStreak}`, color: "text-orange-400" },
                { label: "CORRECT", val: `${history.filter((h) => h.chosen === h.correct).length}/${queue.length}`, color: "text-blue-400" },
              ].map(({ label, val, color }) => (
                <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                  <div className={`text-2xl font-black ${color}`}>{val}</div>
                  <div className="text-xs text-gray-500 mt-1 tracking-wide">{label}</div>
                </div>
              ))}
            </div>

            {/* Answer review */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6 max-h-52 overflow-y-auto">
              <div className="text-xs tracking-[2px] text-gray-500 mb-3">ANSWERS REVIEW</div>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div key={i} className={`flex items-center gap-2 text-sm py-1.5 border-b border-gray-800 last:border-0`}>
                    <span className={h.chosen === h.correct ? "text-emerald-400" : "text-red-400"}>
                      {h.chosen === h.correct ? "✓" : "✗"}
                    </span>
                    <span className="flex-1 text-gray-300 truncate">{queue[i]?.emojis}</span>
                    <span className={`text-xs truncate max-w-[100px] ${h.chosen === h.correct ? "text-emerald-400" : "text-red-400"}`}>
                      {h.correct}
                    </span>
                    {h.points > 0 && <span className="text-yellow-500 text-xs">+{h.points}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setScreen("home")}
                className="flex-1 py-3.5 rounded-2xl border border-gray-700 text-gray-400 font-medium text-sm hover:border-gray-500 hover:text-white active:scale-95 transition-all"
              >
                ← Home
              </button>
              <button
                onClick={startGame}
                className="flex-1 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 hover:from-yellow-400 hover:to-orange-400 active:scale-95 transition-all"
              >
                PHIR KHELO 🎬
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}