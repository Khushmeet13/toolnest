import { useState, useEffect, useRef } from "react";

const TRUTHS = {
  mild: [
    "Aapka sabse embarrassing moment kya tha?",
    "Aapne kabhi kisi se jhooth bola hai? Kab aur kyun?",
    "Aapki sabse badi fear kya hai?",
    "Aap kis celebrity se milna chahte hain?",
    "Aapka crush kaun tha school mein?",
    "Aapne kabhi kisi ki diary padhi hai?",
    "Aapki sabse badi regret kya hai?",
    "Aap secretly kya talent rakhte hain?",
    "Aapne kabhi koi cheez churaayi hai?",
    "Aapka sabse weird khwaab kya tha?",
    "Aap kaunsa app sabse zyada use karte ho jo log nahi jaante?",
    "Aapne kabhi kisi ko ignore kiya to unhe bura laga?",
  ],
  spicy: [
    "Aapka first kiss kab aur kaise hua?",
    "Aapne kabhi kisi ke baare mein kuch bura socha jo aapka dost hai?",
    "Aapki life ka sabse bada secret kya hai jo aapne abhi tak kisi ko nahi bataya?",
    "Aapne kabhi kisi ko stalk kiya hai social media pe?",
    "Aap is group mein kis par sabse zyada trust karte ho aur kyun?",
    "Aapne kabhi kisi ko propose kiya ya kisi ne aapko?",
    "Aapki sabse badi insecurity kya hai?",
    "Aapne kabhi kuch aisa kiya jo aapke parents ko pata chalta to grounded ho jaate?",
    "Is room mein kaunsa insaan sabse attractive lagta hai aapko?",
    "Aapne kabhi kisi ke against gossip ki hai? Kiska?",
  ],
  extreme: [
    "Aapke phone ki gallery dekhi jaaye — kya koi embarrassing photo hai?",
    "Aapke texts padhe jaayein last 3 messages ke — kya ready ho?",
    "Aapne kabhi kisi se paise udhaaye aur wapas nahi kiye?",
    "Aapki worst date experience kya rahi?",
    "Aapne kabhi kisi se jhooth bolke relationship mein rehe ho?",
    "Aap apni zindagi mein sabse bada kya regret karte ho?",
    "Aapne kabhi kisi dost ki pith peeche bura kaha hai?",
  ],
};

const DARES = {
  mild: [
    "Apni best funny face banao aur 10 second hold karo.",
    "Koi bhi Bollywood song ke 30 second gaao.",
    "Group mein sabse funny joke sunao.",
    "Apni awkward walk mimicry karo.",
    "Kisi ek ko ek genuine compliment do.",
    "Apna worst accent try karo 1 minute.",
    "Pani ki bottle apne sar pe balance karo 30 seconds.",
    "Apni favorite movie ka famous scene act out karo.",
    "Apne phone se last sent photo sabko dikhao.",
    "Kisi bhi ek ko ek secret batao jo group ko nahi pata.",
    "Apni eyes band kar ke ek drawing banao.",
    "Ulta gino 100 se 1 tak bina rukke.",
  ],
  spicy: [
    "Group ke sabse funny member ki mimicry karo — woh guess karein kaun hai.",
    "Kisi ek ko blind fold kar ke apna haath thama do — woh guess karein kaun hai.",
    "Apna most cringey dance move perform karo.",
    "Kisi ek ko WhatsApp pe 'I miss you' message karo abhi.",
    "Apna phone kisi ko do 2 minute ke liye — woh kuch bhi dekh sakte hain.",
    "Kisi ek ki tarif mein 1 minute ka speech do.",
    "Apne crush ko 'Hey' text karo abhi.",
    "Koi embarrassing memory drama ke saath sunao.",
    "Apne 3 worst habits group ko batao.",
  ],
  extreme: [
    "Apna phone screen unlock kar ke kisi ko de do 5 minute ke liye.",
    "Group ke saath apna most embarrassing photo share karo.",
    "Abhi kisi bhi ex ko call karo aur 'I was thinking about you' bolo.",
    "Apne parents ko call karo aur kaho 'Mujhe tumse kuch important baat karni hai'.",
    "Apne social media pe ek weird selfie post karo.",
    "Kisi bhi online order karo — chahe kuch bhi ho.",
    "Apne boss ya teacher ko 'Aap mujhe inspire karte ho' message karo.",
  ],
};

const LEVELS = [
  { id: "mild", label: "Mild", emoji: "😊", color: "from-emerald-500 to-teal-500", bg: "bg-emerald-950", border: "border-emerald-500", text: "text-emerald-400" },
  { id: "spicy", label: "Spicy", emoji: "🌶️", color: "from-orange-500 to-red-500", bg: "bg-orange-950", border: "border-orange-500", text: "text-orange-400" },
  { id: "extreme", label: "Extreme", emoji: "💀", color: "from-red-600 to-pink-600", bg: "bg-red-950", border: "border-red-500", text: "text-red-400" },
];

const PLAYERS_COLORS = [
  "bg-violet-500", "bg-cyan-500", "bg-pink-500", "bg-amber-500",
  "bg-emerald-500", "bg-blue-500", "bg-rose-500", "bg-lime-500",
];

export default function TruthOrDare() {
  const [screen, setScreen] = useState("setup"); // setup | game | card | result
  const [players, setPlayers] = useState(["", ""]);
  const [level, setLevel] = useState("mild");
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [choice, setChoice] = useState(null); // truth | dare
  const [card, setCard] = useState(null);
  const [usedTruths, setUsedTruths] = useState([]);
  const [usedDares, setUsedDares] = useState([]);
  const [scores, setScores] = useState({});
  const [round, setRound] = useState(1);
  const [flipped, setFlipped] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const cardRef = useRef(null);

  const addPlayer = () => { if (players.length < 8) setPlayers([...players, ""]); };
  const removePlayer = (i) => { if (players.length > 2) setPlayers(players.filter((_, idx) => idx !== i)); };
  const updatePlayer = (i, val) => { const u = [...players]; u[i] = val; setPlayers(u); };

  const startGame = () => {
    const valid = players.map((p) => p.trim()).filter(Boolean);
    if (valid.length < 2) return;
    setPlayers(valid);
    const initScores = {};
    valid.forEach((p) => (initScores[p] = 0));
    setScores(initScores);
    setCurrentPlayer(0);
    setRound(1);
    setUsedTruths([]);
    setUsedDares([]);
    setScreen("game");
  };

  const pickCard = (type) => {
    setChoice(type);
    setFlipped(false);
    setSkipped(false);
    const pool = type === "truth" ? TRUTHS[level] : DARES[level];
    const used = type === "truth" ? usedTruths : usedDares;
    const fresh = pool.filter((_, i) => !used.includes(i));
    const source = fresh.length > 0 ? fresh : pool;
    const sourceIndexes = fresh.length > 0
      ? pool.map((_, i) => i).filter((i) => !used.includes(i))
      : pool.map((_, i) => i);
    const randIdx = Math.floor(Math.random() * sourceIndexes.length);
    const picked = sourceIndexes[randIdx];
    setCard({ text: pool[picked], index: picked });
    if (type === "truth") setUsedTruths((u) => [...u, picked]);
    else setUsedDares((u) => [...u, picked]);
    setAnimKey((k) => k + 1);
    setScreen("card");
    setTimeout(() => setFlipped(true), 300);
  };

  const completeChallenge = (completed) => {
    const name = players[currentPlayer];
    if (completed) {
      setScores((s) => ({ ...s, [name]: (s[name] || 0) + 1 }));
    }
    setSkipped(!completed);
    setScreen("result");
  };

  const nextPlayer = () => {
    setCurrentPlayer((c) => (c + 1) % players.length);
    setRound((r) => r + 1);
    setChoice(null);
    setCard(null);
    setFlipped(false);
    setSkipped(false);
    setScreen("game");
  };

  const levelObj = LEVELS.find((l) => l.id === level);
  const currentName = players[currentPlayer] || "Player";
  const playerColor = PLAYERS_COLORS[currentPlayer % PLAYERS_COLORS.length];

  const topPlayer = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-white" style={{ fontFamily: "'Trebuchet MS', sans-serif" }}>

      {/* Animated bg dots */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-5"
            style={{
              width: `${120 + i * 60}px`,
              height: `${120 + i * 60}px`,
              background: i % 2 === 0 ? "#a855f7" : "#ec4899",
              top: `${10 + i * 15}%`,
              left: `${5 + i * 16}%`,
              animation: `pulse ${3 + i}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.15); } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes flipIn { from { transform: rotateY(90deg) scale(0.8); opacity: 0; } to { transform: rotateY(0deg) scale(1); opacity: 1; } }
        @keyframes shake { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-3deg)} 75%{transform:rotate(3deg)} }
        .slide-up { animation: slideUp 0.4s cubic-bezier(.34,1.56,.64,1); }
        .flip-in { animation: flipIn 0.5s cubic-bezier(.34,1.56,.64,1); }
        .shake { animation: shake 0.3s ease-in-out 3; }
      `}</style>

      <div className="relative max-w-sm mx-auto px-4 py-8 min-h-screen flex flex-col">

        {/* ── SETUP SCREEN ── */}
        {screen === "setup" && (
          <div className="flex-1 flex flex-col slide-up">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🎭</div>
              <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                Truth or Dare
              </h1>
              <p className="text-zinc-500 text-sm mt-1">Party ka asli maza shuru karo</p>
            </div>

            {/* Players */}
            <div className="mb-6">
              <label className="text-xs tracking-[2px] text-zinc-500 mb-3 block">PLAYERS ({players.length}/8)</label>
              <div className="space-y-2">
                {players.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${PLAYERS_COLORS[i % PLAYERS_COLORS.length]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                      {p ? p[0].toUpperCase() : (i + 1)}
                    </div>
                    <input
                      value={p}
                      onChange={(e) => updatePlayer(i, e.target.value)}
                      placeholder={`Player ${i + 1} ka naam`}
                      maxLength={20}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500 placeholder-zinc-600 transition-colors"
                    />
                    {players.length > 2 && (
                      <button onClick={() => removePlayer(i)} className="text-zinc-600 hover:text-red-400 text-xl leading-none transition-colors">×</button>
                    )}
                  </div>
                ))}
              </div>
              {players.length < 8 && (
                <button onClick={addPlayer} className="mt-3 w-full py-2.5 border border-dashed border-zinc-800 rounded-xl text-xs tracking-[2px] text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-all">
                  + ADD PLAYER
                </button>
              )}
            </div>

            {/* Level */}
            <div className="mb-8">
              <label className="text-xs tracking-[2px] text-zinc-500 mb-3 block">LEVEL CHOOSE KARO</label>
              <div className="grid grid-cols-3 gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    className={`py-3 rounded-xl border text-center transition-all ${
                      level === l.id
                        ? `${l.border} bg-zinc-900 ${l.text}`
                        : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                    }`}
                  >
                    <div className="text-lg mb-1">{l.emoji}</div>
                    <div className="text-xs tracking-wide font-medium">{l.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              disabled={players.filter((p) => p.trim()).length < 2}
              className="w-full py-4 rounded-2xl font-black text-base tracking-wide bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              GAME SHURU KARO 🎮
            </button>
          </div>
        )}

        {/* ── GAME SCREEN ── */}
        {screen === "game" && (
          <div className="flex-1 flex flex-col slide-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setScreen("setup")} className="text-zinc-500 hover:text-white text-sm transition-colors">← Back</button>
              <div className="text-xs tracking-[2px] text-zinc-500">ROUND {round}</div>
              <div className={`text-xs font-bold px-2 py-1 rounded-full ${levelObj.text} border ${levelObj.border} bg-zinc-900`}>
                {levelObj.emoji} {levelObj.label}
              </div>
            </div>

            {/* Scoreboard */}
            <div className="bg-zinc-900 rounded-2xl p-3 mb-6 border border-zinc-800">
              <div className="text-xs tracking-[2px] text-zinc-500 mb-2">SCOREBOARD</div>
              <div className="flex gap-2 flex-wrap">
                {players.map((p, i) => (
                  <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${i === currentPlayer ? "border-violet-500 bg-violet-950" : "border-zinc-800"}`}>
                    <div className={`w-5 h-5 rounded-full ${PLAYERS_COLORS[i % PLAYERS_COLORS.length]} flex items-center justify-center text-xs font-bold text-white`}>
                      {p[0]?.toUpperCase()}
                    </div>
                    <span className="text-xs text-zinc-300">{scores[p] || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current player */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className={`w-24 h-24 rounded-full ${playerColor} flex items-center justify-center text-4xl font-black text-white mb-4 shadow-lg`}
                style={{ boxShadow: `0 0 40px ${playerColor.includes("violet") ? "#7c3aed" : "#ec4899"}40` }}>
                {currentName[0]?.toUpperCase()}
              </div>
              <h2 className="text-3xl font-black mb-1">{currentName}</h2>
              <p className="text-zinc-500 text-sm mb-10">ki baari hai! Choose karo:</p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => pickCard("truth")}
                  className="flex-1 py-6 rounded-2xl border-2 border-sky-500 bg-sky-950 hover:bg-sky-900 active:scale-95 transition-all text-center"
                >
                  <div className="text-3xl mb-2">🤔</div>
                  <div className="text-lg font-black text-sky-400">TRUTH</div>
                  <div className="text-xs text-sky-600 mt-1">Sach bolo</div>
                </button>
                <button
                  onClick={() => pickCard("dare")}
                  className="flex-1 py-6 rounded-2xl border-2 border-orange-500 bg-orange-950 hover:bg-orange-900 active:scale-95 transition-all text-center"
                >
                  <div className="text-3xl mb-2">😈</div>
                  <div className="text-lg font-black text-orange-400">DARE</div>
                  <div className="text-xs text-orange-600 mt-1">Karo agar himmat hai</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CARD SCREEN ── */}
        {screen === "card" && card && (
          <div key={animKey} className="flex-1 flex flex-col flip-in">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setScreen("game")} className="text-zinc-500 hover:text-white text-sm transition-colors">← Back</button>
              <div className={`text-sm font-bold px-3 py-1 rounded-full ${choice === "truth" ? "bg-sky-950 text-sky-400 border border-sky-500" : "bg-orange-950 text-orange-400 border border-orange-500"}`}>
                {choice === "truth" ? "🤔 TRUTH" : "😈 DARE"}
              </div>
              <div className="text-xs text-zinc-500">{currentName}</div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className={`rounded-3xl p-8 border-2 text-center mb-6 ${
                choice === "truth"
                  ? "bg-sky-950 border-sky-500"
                  : "bg-orange-950 border-orange-500"
              }`}>
                <div className="text-5xl mb-6">{choice === "truth" ? "🤔" : "😈"}</div>
                <p className="text-xl font-bold leading-relaxed text-white">{card.text}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => completeChallenge(true)}
                  className="py-4 rounded-2xl bg-emerald-900 border border-emerald-500 text-emerald-400 font-bold text-sm hover:bg-emerald-800 active:scale-95 transition-all"
                >
                  ✓ Completed!<br/>
                  <span className="text-xs font-normal opacity-70">+1 point</span>
                </button>
                <button
                  onClick={() => completeChallenge(false)}
                  className="py-4 rounded-2xl bg-red-950 border border-red-700 text-red-400 font-bold text-sm hover:bg-red-900 active:scale-95 transition-all"
                >
                  ✗ Skip<br/>
                  <span className="text-xs font-normal opacity-70">0 points</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULT SCREEN ── */}
        {screen === "result" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center slide-up">
            <div className="text-6xl mb-4">{skipped ? "😬" : "🎉"}</div>
            <h2 className="text-2xl font-black mb-2">
              {skipped ? "Chhod diya!" : "Shandaar!"}
            </h2>
            <p className="text-zinc-400 text-sm mb-2">
              {skipped
                ? `${currentName} ne dare skip kar liya`
                : `${currentName} ne complete kar liya!`}
            </p>
            {!skipped && (
              <div className="bg-emerald-950 border border-emerald-600 text-emerald-400 text-sm px-4 py-2 rounded-full mb-6">
                +1 point mila! 🏆
              </div>
            )}
            {skipped && <div className="mb-6" />}

            {/* Updated scores */}
            <div className="w-full bg-zinc-900 rounded-2xl p-4 border border-zinc-800 mb-8">
              <div className="text-xs tracking-[2px] text-zinc-500 mb-3">SCORES</div>
              {Object.entries(scores)
                .sort((a, b) => b[1] - a[1])
                .map(([name, score], i) => (
                  <div key={name} className={`flex items-center gap-3 py-2 ${i < Object.entries(scores).length - 1 ? "border-b border-zinc-800" : ""}`}>
                    <span className="text-zinc-500 text-sm w-5">{i + 1}.</span>
                    <div className={`w-7 h-7 rounded-full ${PLAYERS_COLORS[players.indexOf(name) % PLAYERS_COLORS.length]} flex items-center justify-center text-xs font-bold text-white`}>
                      {name[0]?.toUpperCase()}
                    </div>
                    <span className="flex-1 text-sm text-left text-zinc-200">{name}</span>
                    <span className={`font-black ${i === 0 && score > 0 ? "text-yellow-400" : "text-zinc-400"}`}>{score}</span>
                    {i === 0 && score > 0 && <span className="text-yellow-400">👑</span>}
                  </div>
                ))}
            </div>

            <button
              onClick={nextPlayer}
              className="w-full py-4 rounded-2xl font-black text-base tracking-wide bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 active:scale-95 transition-all"
            >
              NEXT PLAYER →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}