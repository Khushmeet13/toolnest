import { useState, useEffect } from "react";

// Simulated shared storage using localStorage with poll codes
// In production, replace with a real backend (Firebase, Supabase, etc.)
const storage = {
  get: (key) => {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  set: (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
  }
};

const generateId = () => Math.random().toString(36).substr(2, 6).toUpperCase();

export default function PollGenerator() {
  const [tab, setTab] = useState("create"); // create | find
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [createdPoll, setCreatedPoll] = useState(null);
  const [copied, setCopied] = useState(false);
  const [findCode, setFindCode] = useState("");
  const [foundPoll, setFoundPoll] = useState(null);
  const [findError, setFindError] = useState("");
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Options helpers ──
  const addOption = () => { if (options.length < 6) setOptions([...options, ""]); };
  const removeOption = (i) => { if (options.length > 2) setOptions(options.filter((_, idx) => idx !== i)); };
  const updateOption = (i, val) => { const u = [...options]; u[i] = val; setOptions(u); };

  // ── Create Poll ──
  const createPoll = () => {
    const q = question.trim();
    const validOpts = options.map((o) => o.trim()).filter(Boolean);
    if (!q) return showToast("First write your question", "error");
    if (validOpts.length < 2) return showToast("Give at least two options", "error");

    const pollId = generateId();
    const poll = {
      id: pollId,
      question: q,
      options: validOpts,
      votes: new Array(validOpts.length).fill(0),
      created: Date.now(),
    };
    storage.set("poll:" + pollId, poll);
    setCreatedPoll(poll);
    showToast("Poll ready! Code share karo 🎉");
  };

  // ── Find Poll ──
  const findPoll = () => {
    setFindError("");
    setFoundPoll(null);
    setSelectedOpt(null);
    setHasVoted(false);
    const code = findCode.trim().toUpperCase();
    if (!code) return setFindError("Code likhein pehle!");
    const poll = storage.get("poll:" + code);
    if (!poll) return setFindError("Poll nahi mila. Code check karein.");
    const voted = storage.get("voted:" + code);
    setHasVoted(!!voted);
    setFoundPoll(poll);
  };

  // ── Cast Vote ──
  const castVote = () => {
    if (selectedOpt === null || !foundPoll) return;
    const latest = storage.get("poll:" + foundPoll.id) || foundPoll;
    latest.votes[selectedOpt] += 1;
    storage.set("poll:" + foundPoll.id, latest);
    storage.set("voted:" + foundPoll.id, true);
    setFoundPoll({ ...latest });
    setHasVoted(true);
    showToast("Vote darz ho gaya! ✓");
  };

  const refreshResults = () => {
    if (!foundPoll) return;
    const latest = storage.get("poll:" + foundPoll.id);
    if (latest) { setFoundPoll({ ...latest }); showToast("Results updated!"); }
  };

  const copyCode = () => {
    if (!createdPoll) return;
    navigator.clipboard.writeText(createdPoll.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalVotes = (poll) => poll?.votes?.reduce((a, b) => a + b, 0) || 0;
  const maxVotes = (poll) => Math.max(...(poll?.votes || [0]));

  return (
    <div className=" bg-white py-16" style={{ fontFamily: "'Courier New', monospace" }}>
      <div className="max-w-md mx-auto">

        {/* Toast */}
        {toast && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm tracking-wide border ${
            toast.type === "error"
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-green-50 text-green-800 border-green-200"
          }`}>
            {toast.msg}
          </div>
        )}

        {/* Brand */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
          <span className="text-xs tracking-[3px] text-stone-400">POLLSTUDIO</span>
        </div>

        {/* Tabs */}
        <div className="flex border border-stone-200 rounded-lg overflow-hidden mb-6">
          {["create", "find"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs tracking-[2px] transition-all cursor-pointer ${
                tab === t
                  ? "bg-stone-100 text-stone-800 font-medium"
                  : "bg-white text-stone-400 hover:text-stone-600"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ── CREATE TAB ── */}
        {tab === "create" && (
          <div>
            <h1 className="text-3xl italic mb-1" style={{ fontFamily: "Georgia, serif" }}>
              New poll
            </h1>
            <p className="text-xs tracking-widest text-stone-400 mb-6">
              CREATE — SHARE CODE — ANYONE CAN VOTE
            </p>

            {/* Question */}
            <div className="mb-5">
              <label className="block text-xs tracking-[2px] text-stone-400 mb-2">QUESTION</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Write your question..."
                rows={2}
                className="w-full bg-stone-100 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-800 outline-none focus:border-stone-400 resize-none placeholder-stone-400 transition-colors"
              />
            </div>

            {/* Options */}
            <div className="mb-5">
              <label className="block text-xs tracking-[2px] text-stone-400 mb-3">OPTIONS (2–6)</label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2 group">
                    <div className="w-6 h-6 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-xs text-stone-400 flex-shrink-0">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <input
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      maxLength={80}
                      className="flex-1 bg-stone-100 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 outline-none focus:border-stone-400 placeholder-stone-400 transition-colors"
                    />
                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(i)}
                        className="opacity-0 group-hover:opacity-50 hover:!opacity-100 text-stone-400 hover:text-red-400 text-lg leading-none transition-all"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < 6 && (
                <button
                  onClick={addOption}
                  className="mt-3 w-full py-2.5 border border-dashed border-stone-300 rounded-lg text-xs tracking-[2px] text-stone-400 hover:text-stone-600 hover:border-stone-400 transition-all"
                >
                  + ADD OPTION
                </button>
              )}
            </div>

            <button
              onClick={createPoll}
              className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white text-xs tracking-[2px] rounded-lg transition-all cursor-pointer"
            >
              CREATE & GET SHARE CODE →
            </button>

            {/* Share Section */}
            {createdPoll && (
              <div className="mt-6 pt-6 border-t border-stone-200">
                <div className="bg-stone-100 rounded-xl p-4 mb-3">
                  <div className="text-xs tracking-[2px] text-stone-400 mb-1">SHARE CODE</div>
                  <div className="text-3xl italic text-pink-500 tracking-[4px] mb-1" style={{ fontFamily: "Georgia, serif" }}>
                    {createdPoll.id}
                  </div>
                  <div className="text-xs text-stone-400">Share this code - to vote together</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyCode}
                    className={`flex-1 py-2.5 border rounded-lg text-xs tracking-[2px] transition-all ${
                      copied
                        ? "border-green-300 text-green-700 bg-green-50"
                        : "border-stone-200 text-stone-600 hover:border-stone-400 bg-white"
                    }`}
                  >
                    {copied ? "COPIED ✓" : "COPY CODE"}
                  </button>
                  <button
                    onClick={() => { setFindCode(createdPoll.id); setTab("find"); setTimeout(findPoll, 50); }}
                    className="flex-1 py-2.5 border border-stone-200 bg-white rounded-lg text-xs tracking-[2px] text-stone-600 hover:border-stone-400 transition-all"
                  >
                    SEE RESULTS →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── FIND TAB ── */}
        {tab === "find" && (
          <div>
            <h1 className="text-3xl italic mb-1" style={{ fontFamily: "Georgia, serif" }}>
              Find poll
            </h1>
            <p className="text-xs tracking-widest text-stone-400 mb-6">ENTER CODE TO VOTE OR VIEW</p>

            <div className="flex gap-2 mb-4">
              <input
                value={findCode}
                onChange={(e) => setFindCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && findPoll()}
                placeholder="POLL CODE..."
                maxLength={8}
                className="flex-1 bg-stone-100 border border-stone-200 rounded-lg px-4 py-2.5 text-base tracking-[4px] text-stone-800 outline-none focus:border-stone-400 placeholder-stone-400 uppercase transition-colors"
              />
              <button
                onClick={findPoll}
                className="px-5 py-2.5 border border-stone-200 bg-white rounded-lg text-xs tracking-[2px] text-stone-600 hover:border-stone-400 hover:text-stone-800 transition-all"
              >
                FIND →
              </button>
            </div>

            {findError && (
              <div className="text-xs text-red-500 tracking-wide mb-4 px-1">{findError}</div>
            )}

            {/* Poll Vote View */}
            {foundPoll && !hasVoted && (
              <div>
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-4">
                  <div className="px-5 py-4 border-b border-stone-100">
                    <p className="text-lg italic leading-snug text-stone-800 mb-1" style={{ fontFamily: "Georgia, serif" }}>
                      {foundPoll.question}
                    </p>
                    <span className="text-xs text-stone-400 tracking-wide">
                      {totalVotes(foundPoll)} votes · LIVE
                    </span>
                  </div>
                  {foundPoll.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedOpt(i)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 border-b border-stone-100 last:border-0 text-left transition-all ${
                        selectedOpt === i ? "bg-cyan-50" : "hover:bg-stone-50"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                        selectedOpt === i ? "border-cyan-500 bg-cyan-500" : "border-stone-300"
                      }`}>
                        {selectedOpt === i && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm text-stone-700">{opt}</span>
                      {selectedOpt === i && (
                        <span className="ml-auto text-xs text-cyan-600 tracking-wide">SELECTED</span>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={castVote}
                  disabled={selectedOpt === null}
                  className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs tracking-[2px] rounded-lg transition-all"
                >
                  SUBMIT VOTE →
                </button>
              </div>
            )}

            {/* Results View */}
            {foundPoll && hasVoted && (
              <div>
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-4">
                  <div className="px-5 py-4 border-b border-stone-100">
                    <p className="text-lg italic leading-snug text-stone-800 mb-1" style={{ fontFamily: "Georgia, serif" }}>
                      {foundPoll.question}
                    </p>
                    <span className="text-xs text-stone-400 tracking-wide">
                      {totalVotes(foundPoll)} votes · RESULTS
                    </span>
                  </div>
                  {foundPoll.options.map((opt, i) => {
                    const total = totalVotes(foundPoll);
                    const pct = total > 0 ? Math.round((foundPoll.votes[i] / total) * 100) : 0;
                    const isWinner = foundPoll.votes[i] === maxVotes(foundPoll) && maxVotes(foundPoll) > 0;
                    return (
                      <div key={i} className="relative px-5 py-3.5 border-b border-stone-100 last:border-0 overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 transition-all duration-700 ${isWinner ? "bg-cyan-50" : "bg-stone-100"}`}
                          style={{ width: `${pct}%` }}
                        />
                        <div className="relative flex items-center gap-2">
                          {isWinner && <span className="text-cyan-400 text-sm">★</span>}
                          <span className="flex-1 text-sm text-stone-700">{opt}</span>
                          <span className="text-xs text-stone-400">{foundPoll.votes[i]}</span>
                          <span className={`text-sm font-medium min-w-[36px] text-right ${isWinner ? "text-cyan-600" : "text-stone-500"}`}>
                            {pct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { num: totalVotes(foundPoll), label: "TOTAL VOTES" },
                    { num: foundPoll.options.length, label: "OPTIONS" },
                  ].map(({ num, label }) => (
                    <div key={label} className="bg-stone-100 rounded-lg p-3 text-center">
                      <div className="text-2xl italic text-cyan-600 mb-0.5" style={{ fontFamily: "Georgia, serif" }}>{num}</div>
                      <div className="text-xs tracking-[1px] text-stone-400">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={refreshResults}
                    className="flex-1 py-2.5 border border-stone-200 bg-white rounded-lg text-xs tracking-[2px] text-stone-600 hover:border-stone-400 transition-all"
                  >
                    REFRESH ↻
                  </button>
                  <button
                    onClick={() => { navigator.clipboard.writeText(foundPoll.id); showToast("Code copied: " + foundPoll.id); }}
                    className="flex-1 py-2.5 border border-stone-200 bg-white rounded-lg text-xs tracking-[2px] text-stone-600 hover:border-stone-400 transition-all"
                  >
                    SHARE CODE
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
