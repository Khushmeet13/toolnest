import { useState, useEffect } from "react";

/* ── Platform config ── */
const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: "📸", color: "#E1306C", bg: "from-pink-500 via-rose-500 to-orange-400", light: "bg-pink-50", border: "border-pink-200", text: "text-pink-600", tag: "bg-pink-100 text-pink-700" },
  { id: "twitter",   label: "X / Twitter", icon: "𝕏",  color: "#000000", bg: "from-gray-900 via-gray-800 to-gray-700", light: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", tag: "bg-gray-100 text-gray-700" },
  { id: "linkedin",  label: "LinkedIn",   icon: "💼", color: "#0A66C2", bg: "from-blue-700 via-blue-600 to-sky-500", light: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", tag: "bg-blue-100 text-blue-700" },
  { id: "tiktok",    label: "TikTok",     icon: "🎵", color: "#FF0050", bg: "from-fuchsia-600 via-pink-500 to-rose-400", light: "bg-fuchsia-50", border: "border-fuchsia-200", text: "text-fuchsia-700", tag: "bg-fuchsia-100 text-fuchsia-700" },
  { id: "youtube",   label: "YouTube",    icon: "▶",  color: "#FF0000", bg: "from-red-600 via-red-500 to-orange-500", light: "bg-red-50", border: "border-red-200", text: "text-red-600", tag: "bg-red-100 text-red-700" },
  { id: "facebook",  label: "Facebook",   icon: "f",  color: "#1877F2", bg: "from-blue-600 via-blue-500 to-indigo-500", light: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", tag: "bg-indigo-100 text-indigo-700" },
];

const TONES = [
  { id: "educational", label: "Educational", emoji: "🎓" },
  { id: "funny",       label: "Funny & Witty", emoji: "😄" },
  { id: "inspiring",   label: "Inspiring", emoji: "✨" },
  { id: "promotional", label: "Promotional", emoji: "📣" },
  { id: "storytelling",label: "Storytelling", emoji: "📖" },
  { id: "controversial",label: "Bold Take", emoji: "🔥" },
];

const NICHES = [
  "Tech & AI", "Fitness & Health", "Finance & Investing", "Food & Recipes",
  "Travel", "Fashion & Style", "Business & Entrepreneurship", "Personal Development",
  "Parenting", "Beauty & Skincare", "Gaming", "Art & Design", "Education", "Other",
];

/* ── Post idea generator ── */
const IDEAS = {
  instagram: {
    educational: [
      { type: "Carousel", hook: "5 things nobody tells you about {niche}", caption: "Save this for later 💾 These {niche} secrets changed my game. Swipe through →", hashtags: ["#{niche}tips", "#learnon{niche}", "#savethispost", "#growthhacks", "#creatorlife"], cta: "Drop a 🙋 if this helped!" },
      { type: "Reel", hook: "POV: You just learned the {niche} trick everyone is hiding", caption: "The {niche} hack that took me from 0 to 10k followers 🚀 Watch till the end!", hashtags: ["#reels", "#{niche}hack", "#viralreel", "#trending", "#fyp"], cta: "Follow for daily {niche} tips!" },
      { type: "Single Image", hook: "This one rule changed everything in {niche}", caption: "Print this. Frame it. Live it. 🖼️ The golden rule of {niche} that top creators swear by.", hashtags: ["#motivationmonday", "#{niche}life", "#quotes", "#mindset"], cta: "Tag someone who needs to see this 👇" },
    ],
    funny: [
      { type: "Reel", hook: "Me explaining {niche} to my parents 😂", caption: "They still don't get it and honestly that's okay 😭 Tag your family!", hashtags: ["#relatable", "#{niche}humor", "#funny", "#reels", "#mood"], cta: "Who else? 🙋‍♀️ Comment below!" },
      { type: "Carousel", hook: "Types of people in the {niche} space (which one are you?)", caption: "No wrong answers here 😂 Swipe to find your {niche} personality type!", hashtags: ["#funny", "#{niche}community", "#whichone", "#relatable"], cta: "Tag your {niche} twin 👇" },
    ],
    inspiring: [
      { type: "Quote Card", hook: "Your {niche} journey starts with one decision.", caption: "Nobody starts perfect. Everyone starts somewhere. Your {niche} story begins today. 🌅", hashtags: ["#motivation", "#{niche}journey", "#inspiration", "#growth", "#mindset"], cta: "Save this for when you need a reminder 💛" },
      { type: "Before/After Reel", hook: "6 months of {niche}. Here's what changed.", caption: "From zero to something real. The {niche} transformation nobody shows you — the messy middle. 💪", hashtags: ["#transformation", "#{niche}progress", "#journey", "#glow"], cta: "You got this. Drop a 💪 below!" },
    ],
    promotional: [
      { type: "Product Showcase", hook: "The {niche} tool I can't live without anymore", caption: "I tried everything in {niche}. This is the only thing that actually worked. No fluff, just results. 🎯", hashtags: ["#ad", "#{niche}tools", "#recommendation", "#review"], cta: "Link in bio to try it free 🔗" },
    ],
    storytelling: [
      { type: "Carousel Story", hook: "I almost quit {niche}. Here's what stopped me.", caption: "Buckle up. This is the story I never planned to share about my {niche} journey 🧵 Swipe →", hashtags: ["#mystory", "#{niche}journey", "#authentic", "#creator"], cta: "Have you been here? Tell me below 👇" },
    ],
    controversial: [
      { type: "Opinion Reel", hook: "Hot take: Most {niche} advice is completely wrong.", caption: "I said what I said. 🔥 Here's why the mainstream {niche} advice is holding you back.", hashtags: ["#hottake", "#{niche}truth", "#controversial", "#unpopularopinion"], cta: "Agree or disagree? Fight me in comments 😂" },
    ],
  },
  twitter: {
    educational: [
      { type: "Thread", hook: "The {niche} masterclass nobody is charging for:", caption: "I spent 3 years learning {niche}. Here's everything condensed into one thread. Bookmark this.\n\n1/ The foundation most people skip...", hashtags: [], cta: "RT if this was useful. More threads every week 🔁" },
      { type: "Single Tweet", hook: "{niche} tip that took me way too long to figure out:", caption: "Stop overcomplicating {niche}.\n\nThe 3 things that actually matter:\n→ Consistency\n→ Clarity\n→ Value\n\nEverything else is noise.", hashtags: [], cta: "Agree? Drop a ✅" },
    ],
    funny: [
      { type: "Single Tweet", hook: "Me after one week in {niche}:", caption: "Week 1: 'I have no idea what I'm doing'\nWeek 4: 'I have no idea what I'm doing but with more confidence'\nWeek 12: 'I have no idea what I'm doing but I'm charging for it'", hashtags: [], cta: "😂 RT if you lived this" },
    ],
    inspiring: [
      { type: "Single Tweet", hook: "A reminder for everyone in {niche}:", caption: "You're not behind.\n\nYou're not too late.\n\nYou're not not talented enough.\n\nYou just started earlier or later than someone else.\n\nKeep going.", hashtags: [], cta: "Save & read when you need it most 🔖" },
    ],
    promotional: [
      { type: "Thread", hook: "Why I built a {niche} tool and what happened next:", caption: "I saw a problem in {niche} that nobody was solving well.\n\nSo I built something.\n\nHere's the story + what I learned (long thread) 🧵", hashtags: [], cta: "Try it free — link in bio" },
    ],
    storytelling: [
      { type: "Thread", hook: "Story time: How {niche} changed my life in 12 months.", caption: "January last year I knew nothing about {niche}.\n\nDecember: it was my main income.\n\nHere's exactly what happened 🧵", hashtags: [], cta: "Follow for more real {niche} stories" },
    ],
    controversial: [
      { type: "Single Tweet", hook: "Unpopular opinion about {niche}:", caption: "Most people teaching {niche} have never actually done it at scale.\n\nThey learned it, packaged it, and sold the course before getting results.\n\nBe very careful who you learn {niche} from.", hashtags: [], cta: "Thoughts? 👇" },
    ],
  },
  linkedin: {
    educational: [
      { type: "Long-form Post", hook: "I analyzed 100 {niche} case studies. Here's the pattern:", caption: "After 3 years in {niche}, I noticed something.\n\nThe people who win aren't the smartest.\n\nThey're the ones who do these 5 things consistently:\n\n1. They document everything...", hashtags: ["#{niche}", "#professionaldev", "#leadership", "#growthmindset"], cta: "Save this. Share with your team. What would you add?" },
      { type: "Carousel", hook: "The {niche} skill matrix: where do you land?", caption: "Most professionals in {niche} overestimate their strengths and underestimate their gaps. I built this framework to show you where to focus.", hashtags: ["#{niche}skills", "#careerdevelopment", "#framework"], cta: "Comment your level 👇 I read every response." },
    ],
    funny: [
      { type: "Post", hook: "Job description vs reality in {niche} 😅", caption: "Job post: 'Looking for a {niche} expert with 5+ years experience'\nWhat they really mean: 'Will do everything {niche}-related for $40k/year'\n\nAnyone else? 😂", hashtags: ["#{niche}", "#careertruths", "#relatable"], cta: "Tag a {niche} colleague who gets it 👇" },
    ],
    inspiring: [
      { type: "Personal Story", hook: "I failed at {niche} for 2 years. Then everything changed.", caption: "I'm sharing this because I wish someone had told me earlier.\n\nMy {niche} journey wasn't linear. It was messy, humbling, and worth every moment.\n\nHere's what I learned:", hashtags: ["#{niche}", "#growthmindset", "#leadership", "#authentic"], cta: "Has {niche} ever challenged you like this? Share below." },
    ],
    promotional: [
      { type: "Value Post", hook: "We just launched something for the {niche} community.", caption: "We built this because the {niche} space was missing something obvious.\n\nAfter 18 months of development and 200 beta users, it's finally here.\n\nHere's what makes it different:", hashtags: ["#{niche}", "#productlaunch", "#innovation"], cta: "Comment 'DEMO' to get early access 👇" },
    ],
    storytelling: [
      { type: "Milestone Post", hook: "From knowing nothing about {niche} to leading a team of 12.", caption: "5 years ago I Googled '{niche} basics' at midnight.\n\nToday I run a department of 12 people focused entirely on {niche}.\n\nThe turning points nobody talks about 👇", hashtags: ["#{niche}", "#careerstory", "#milestone"], cta: "What was your {niche} turning point? Tell me below." },
    ],
    controversial: [
      { type: "Opinion Post", hook: "The {niche} industry has a credibility problem. I'll say it.", caption: "Too many {niche} 'experts' are selling theory they've never tested.\n\nHere's how to tell the difference between a real {niche} practitioner and someone just selling courses:", hashtags: ["#{niche}", "#hottake", "#industrytruth"], cta: "Agree? Disagree? Let's discuss 👇" },
    ],
  },
  tiktok: {
    educational: [
      { type: "Talking Head", hook: "3 {niche} facts that will blow your mind (Part 1)", caption: "These {niche} facts stopped me in my tracks 🤯 Comment 'PART 2' for more! #fyp", hashtags: ["#fyp", "#{niche}facts", "#learnontiktok", "#didyouknow", "#viral"], cta: "Comment 'PART 2' to get the next one! 🔁" },
      { type: "Tutorial", hook: "POV you're learning {niche} in 60 seconds", caption: "I taught my whole {niche} framework in under a minute. Save this video! ⭐ #learnontiktok", hashtags: ["#learnontiktok", "#{niche}tutorial", "#60seconds", "#fyp"], cta: "Follow for daily {niche} tips in 60 sec!" },
    ],
    funny: [
      { type: "Skit", hook: "The {niche} girlies when someone says it's easy 💀", caption: "If you know, you know 😭 {niche} community where you at?! #fyp", hashtags: ["#fyp", "#{niche}community", "#relatable", "#humor", "#trending"], cta: "Tag your {niche} bestie 🫶" },
    ],
    inspiring: [
      { type: "Montage", hook: "This time last year I was scared to start {niche}.", caption: "Now look 🥹 Your {niche} era is waiting for you. Take the leap. #motivational #fyp", hashtags: ["#motivation", "#{niche}journey", "#fyp", "#glow", "#transformation"], cta: "Save this for when you doubt yourself 💛" },
    ],
    promotional: [
      { type: "Review", hook: "I tried every {niche} tool so you don't have to 😤", caption: "Okay real talk — this {niche} tool is built different 🔥 Link in bio for free trial!", hashtags: ["#review", "#{niche}tools", "#fyp", "#honest", "#recommendation"], cta: "Link in bio! ⬆️ Free trial no credit card" },
    ],
    storytelling: [
      { type: "Story Time", hook: "Story time: how {niche} saved my life (not clickbait)", caption: "Grab a snack. This {niche} story is a whole journey 🧃 Part 1 of 3 — follow so you don't miss it!", hashtags: ["#storytime", "#{niche}story", "#fyp", "#authentic", "#series"], cta: "Follow for Part 2 dropping tomorrow! 🔔" },
    ],
    controversial: [
      { type: "Hot Take", hook: "I'm saying what everyone in {niche} is thinking 🫡", caption: "I'll probably lose followers for this but here's the truth about {niche} that nobody says out loud 🔥", hashtags: ["#hottake", "#{niche}truth", "#fyp", "#controversial", "#drama"], cta: "Agree or disagree? Comments are open 👇" },
    ],
  },
  youtube: {
    educational: [
      { type: "Tutorial Video", hook: "The Complete {niche} Guide for Beginners (2025)", caption: "Everything you need to know about {niche} in one video. I spent 6 months condensing this so you don't have to. Timestamps below 👇\n\n0:00 Intro\n2:15 The Basics\n8:30 Common Mistakes\n15:00 Advanced Tips\n22:00 Action Plan", hashtags: ["#{niche}tutorial", "#{niche}forbeginners", "#learnontiktok"], cta: "Subscribe + ring the bell 🔔 New {niche} video every week!" },
      { type: "List Video", hook: "Top 10 {niche} Mistakes (And How to Fix Them)", caption: "I made all 10 of these {niche} mistakes so you don't have to 😅 Watch till the end — #10 is the most overlooked.", hashtags: ["#{niche}mistakes", "#top10", "#{niche}tips"], cta: "Comment which mistake hit closest to home 👇" },
    ],
    funny: [
      { type: "Comedy Sketch", hook: "A Day in the Life of a {niche} Obsessed Person 😂", caption: "We asked a real {niche} fanatic to document their day. What we got was... a lot. 😂 #relatable", hashtags: ["#funny", "#{niche}life", "#comedy", "#relatable"], cta: "Like if you're guilty of this! 😂" },
    ],
    inspiring: [
      { type: "Documentary Style", hook: "How I Built My {niche} Business From $0 (Full Story)", caption: "This is the full, unfiltered story of how I went from knowing nothing about {niche} to building something real. No hype, just the truth.", hashtags: ["#{niche}journey", "#entrepreneur", "#success", "#fullstory"], cta: "Subscribe for the next chapter of this journey 🙏" },
    ],
    promotional: [
      { type: "Sponsored Review", hook: "I Tested 5 {niche} Tools So You Don't Have To (Honest Review)", caption: "After 30 days testing every major {niche} tool on the market, here's the verdict. Some surprised me, some disappointed me. Full breakdown in this video.", hashtags: ["#{niche}tools", "#review", "#honest", "#comparison"], cta: "Best one is linked in description! 🔗" },
    ],
    storytelling: [
      { type: "Vlog", hook: "The Day Everything in My {niche} Business Changed", caption: "I didn't plan to film this. But something happened in my {niche} business that I think everyone needs to hear about.", hashtags: ["#{niche}business", "#vlog", "#entrepreneur", "#reallife"], cta: "Subscribe — more behind the scenes coming soon 📽️" },
    ],
    controversial: [
      { type: "Opinion Video", hook: "The {niche} Industry Is Lying to You (Controversial)", caption: "I'm probably going to get hate for this. But after years in {niche}, I can't stay quiet anymore. Here's what the industry doesn't want you to know.", hashtags: ["#{niche}truth", "#controversial", "#opinion", "#expose"], cta: "Do you agree? Comment below — I reply to everyone." },
    ],
  },
  facebook: {
    educational: [
      { type: "Long Post", hook: "Everything I know about {niche}, condensed into one post:", caption: "I've been in {niche} for years and I want to share what actually works. This is long but every sentence matters. Save it.\n\n✅ Tip 1: Start before you're ready\n✅ Tip 2: Document, don't create\n✅ Tip 3: Consistency beats perfection", hashtags: ["#{niche}", "#tips", "#community"], cta: "Share with someone who needs this today 🔁" },
    ],
    funny: [
      { type: "Meme Post", hook: "Nobody in {niche} talks about this enough 😂", caption: "Tag a friend who will 100% relate to this {niche} reality 😂 The struggle is SO real.", hashtags: ["#{niche}humor", "#relatable", "#community"], cta: "Tag someone! 👇 Comments always open 🤣" },
    ],
    inspiring: [
      { type: "Community Post", hook: "To everyone starting their {niche} journey today:", caption: "You don't need to be perfect. You don't need all the answers. You just need to start.\n\nI started my {niche} journey with zero experience. Today it's changed my life.\n\nYou can do this. 🙌", hashtags: ["#{niche}community", "#support", "#growth"], cta: "Like + share if this resonated with you 💛" },
    ],
    promotional: [
      { type: "Offer Post", hook: "Special offer for our {niche} community 🎁", caption: "Because this community has given me so much, I'm giving something back.\n\nFor the next 48 hours, I'm offering [your offer] to anyone serious about {niche}.\n\nDetails below 👇", hashtags: ["#{niche}", "#offer", "#community", "#limitedtime"], cta: "Comment 'YES' to get details! 👇" },
    ],
    storytelling: [
      { type: "Personal Story", hook: "Something happened in my {niche} journey I've never shared.", caption: "I've been putting off sharing this story for months.\n\nBut I think it might help someone in this community who's going through the same thing with their {niche} journey.\n\nHere's what happened 👇", hashtags: ["#{niche}", "#mystory", "#community"], cta: "Have you experienced something similar? Share below 💬" },
    ],
    controversial: [
      { type: "Discussion Post", hook: "Controversial {niche} opinion — do you agree?", caption: "I'm going to share an unpopular take about {niche} and I want this community's honest opinion.\n\nHere it is: [Your bold take about {niche}]\n\nFight me in the comments 😤", hashtags: ["#{niche}", "#discussion", "#opinion"], cta: "Agree or disagree? All views welcome 👇" },
    ],
  },
};

function getIdeas(platformId, toneId, niche) {
  const raw = IDEAS[platformId]?.[toneId] || [];
  return raw.map(idea => ({
    ...idea,
    hook: idea.hook.replace(/\{niche\}/g, niche),
    caption: idea.caption.replace(/\{niche\}/g, niche),
    hashtags: idea.hashtags.map(h => h.replace(/\{niche\}/g, niche.toLowerCase().replace(/\s+/g, ""))),
    cta: idea.cta.replace(/\{niche\}/g, niche),
  }));
}

/* ── Copyable post card ── */
function PostCard({ idea, platform, index }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${idea.hook}\n\n${idea.caption}\n\n${idea.hashtags.join(" ")}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const delayClass = ["", "animation-delay-100", "animation-delay-200"][index] || "";

  return (
    <div className={`relative bg-white rounded-3xl border-2 ${platform.border} overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group ${delayClass}`}>
      {/* Platform color top strip */}
      <div className={`h-2 w-full bg-gradient-to-r ${platform.bg}`} />

      {/* Card header */}
      <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Fake avatar */}
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${platform.bg} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
            {platform.icon}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">Your Brand</div>
            <div className="text-xs text-gray-400">{platform.label}</div>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${platform.tag} flex-shrink-0`}>
          {idea.type}
        </span>
      </div>

      {/* Hook */}
      <div className="px-6 pb-2">
        <p className="text-base font-extrabold text-gray-900 leading-snug">{idea.hook}</p>
      </div>

      {/* Caption */}
      <div className="px-6 pb-4">
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{idea.caption}</p>
      </div>

      {/* Hashtags */}
      {idea.hashtags.length > 0 && (
        <div className="px-6 pb-4 flex flex-wrap gap-1.5">
          {idea.hashtags.map((h, i) => (
            <span key={i} className={`text-xs font-semibold ${platform.text}`}>{h}</span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className={`mx-6 mb-5 px-4 py-3 rounded-2xl ${platform.light} border ${platform.border}`}>
        <span className={`text-xs font-bold ${platform.text}`}>📣 CTA: </span>
        <span className="text-xs text-gray-600">{idea.cta}</span>
      </div>

      {/* Copy button */}
      <div className="px-6 pb-5">
        <button
          onClick={handleCopy}
          className={`w-full py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
            copied
              ? `bg-gradient-to-r ${platform.bg} text-white border-transparent`
              : `border-current ${platform.text} hover:bg-gradient-to-r hover:${platform.bg} hover:text-white hover:border-transparent`
          }`}
          style={copied ? {} : {}}
        >
          {copied ? "✓ Copied to clipboard!" : "Copy Post Caption"}
        </button>
      </div>
    </div>
  );
}

/* ── Main App ── */
export default function App() {
  const [niche, setNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedTone, setSelectedTone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePlatform, setActivePlatform] = useState("");
  const [loadDot, setLoadDot] = useState(0);

  const finalNiche = niche === "Other" ? customNiche : niche;
  const canGenerate = finalNiche && selectedPlatforms.length > 0 && selectedTone;

  const loadTexts = ["Brainstorming hooks…", "Crafting captions…", "Writing hashtags…", "Finalizing ideas…"];

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setLoadDot(p => (p + 1) % loadTexts.length), 550);
    return () => clearInterval(t);
  }, [loading]);

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (!canGenerate) return;
    setLoading(true);
    setTimeout(() => {
      const out = {};
      selectedPlatforms.forEach(pid => {
        out[pid] = getIdeas(pid, selectedTone, finalNiche);
      });
      setResult(out);
      setActivePlatform(selectedPlatforms[0]);
      setLoading(false);
    }, 2200);
  };

  const handleReset = () => {
    setResult(null); setNiche(""); setCustomNiche("");
    setSelectedPlatforms([]); setSelectedTone(""); setActivePlatform("");
  };

  const currentPlatformData = PLATFORMS.find(p => p.id === activePlatform);
  const currentIdeas = result?.[activePlatform] || [];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #fdf4ff 0%, #fef9ee 40%, #f0fffe 100%)", fontFamily: "'Nunito','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pop { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
        .float { animation: float 3s ease-in-out infinite; }
        .pop-in { animation: pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .emoji-bg { font-size: 120px; opacity: 0.06; user-select: none; }
      `}</style>

      {/* Decorative background shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-20" style={{ background: "radial-gradient(circle,#f472b6,transparent 70%)" }} />
        <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle,#818cf8,transparent 70%)" }} />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle,#34d399,transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#fb923c,transparent 70%)" }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 bg-white/80 backdrop-blur-md border-b border-white shadow-sm sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 flex items-center justify-center shadow-lg shadow-pink-200">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <span className="font-black text-gray-900 text-lg tracking-tight">PostSpark</span>
              <span className="ml-2 text-xs font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">AI</span>
            </div>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-bold text-gray-400">
            {["Features", "Templates", "Pricing"].map(l => (
              <a key={l} href="#" className="hover:text-gray-700 transition-colors">{l}</a>
            ))}
          </div>
          <button className="text-sm font-extrabold bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white px-5 py-2.5 rounded-full shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:scale-105 transition-all">
            Start Free 🚀
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-14">

        {/* Hero */}
        {!result && (
          <div className="text-center mb-14">
            <div className="float inline-block text-6xl mb-6">💡</div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight mb-5">
              Never run out of
              <span className="block bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
                post ideas. Ever.
              </span>
            </h1>
            <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed font-medium">
              Pick your niche, platforms, and tone. Get scroll-stopping post ideas tailored for each channel — ready to copy and post.
            </p>
          </div>
        )}

        {!result && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white shadow-2xl shadow-gray-100/80 p-8 md:p-10">

            {/* Niche */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🎯</span>
                <h2 className="text-lg font-extrabold text-gray-900">Your Content Niche</h2>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-3">
                {NICHES.filter(n => n !== "Other").map((n) => (
                  <button
                    key={n}
                    onClick={() => setNiche(n)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all ${
                      niche === n
                        ? "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700 shadow-sm shadow-fuchsia-100"
                        : "border-gray-100 text-gray-500 hover:border-fuchsia-200 hover:bg-fuchsia-50/40"
                    }`}
                  >{n}</button>
                ))}
                <button
                  onClick={() => setNiche("Other")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all ${
                    niche === "Other"
                      ? "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700"
                      : "border-gray-100 text-gray-500 hover:border-fuchsia-200"
                  }`}
                >Other ✏️</button>
              </div>
              {niche === "Other" && (
                <input
                  type="text"
                  value={customNiche}
                  onChange={(e) => setCustomNiche(e.target.value)}
                  placeholder="Describe your niche..."
                  className="w-full border-2 border-fuchsia-200 focus:border-fuchsia-500 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none placeholder-gray-300 transition-colors"
                />
              )}
            </div>

            {/* Platforms */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📱</span>
                <h2 className="text-lg font-extrabold text-gray-900">Platforms</h2>
                <span className="text-xs font-bold text-gray-400 ml-1">(pick one or more)</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PLATFORMS.map((p) => {
                  const selected = selectedPlatforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all group ${
                        selected
                          ? `border-transparent bg-gradient-to-r ${p.bg} text-white shadow-lg`
                          : `border-gray-100 hover:border-gray-200 hover:bg-gray-50`
                      }`}
                    >
                      <span className={`text-2xl ${!selected ? "grayscale group-hover:grayscale-0" : ""} transition-all`}>
                        {typeof p.icon === "string" && p.icon.length <= 2 ? (
                          <span className={`font-black text-lg ${selected ? "text-white" : p.text}`}>{p.icon}</span>
                        ) : p.icon}
                      </span>
                      <div className="text-left">
                        <div className={`text-sm font-extrabold ${selected ? "text-white" : "text-gray-700"}`}>{p.label}</div>
                      </div>
                      {selected && <span className="ml-auto text-white text-sm">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🎨</span>
                <h2 className="text-lg font-extrabold text-gray-900">Content Tone</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTone(t.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                      selectedTone === t.id
                        ? "border-violet-400 bg-violet-50 shadow-md shadow-violet-100"
                        : "border-gray-100 hover:border-violet-200 hover:bg-violet-50/40"
                    }`}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <span className={`text-sm font-extrabold ${selectedTone === t.id ? "text-violet-700" : "text-gray-600"}`}>{t.label}</span>
                    {selectedTone === t.id && <span className="ml-auto text-violet-500 text-sm font-bold">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary chips */}
            {(finalNiche || selectedPlatforms.length > 0 || selectedTone) && (
              <div className="flex flex-wrap gap-2 mb-8 p-4 bg-gray-50 rounded-2xl">
                {finalNiche && <span className="bg-fuchsia-100 text-fuchsia-700 text-xs font-bold px-3 py-1.5 rounded-full">🎯 {finalNiche}</span>}
                {selectedPlatforms.map(pid => {
                  const p = PLATFORMS.find(x => x.id === pid);
                  return <span key={pid} className={`${p.tag} text-xs font-bold px-3 py-1.5 rounded-full`}>{p.icon} {p.label}</span>;
                })}
                {selectedTone && <span className="bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full">{TONES.find(t => t.id === selectedTone)?.emoji} {TONES.find(t => t.id === selectedTone)?.label}</span>}
              </div>
            )}

            {/* Generate */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || loading}
              className="w-full py-5 rounded-2xl font-black text-base bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-xl shadow-pink-200 hover:shadow-2xl hover:shadow-pink-300 hover:scale-[1.01] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {loadTexts[loadDot]}
                </span>
              ) : "✨ Generate Post Ideas"}
            </button>
          </div>
        )}

        {/* ── RESULTS ── */}
        {result && (
          <div>
            {/* Result hero */}
            <div className="text-center mb-10">
              <div className="float inline-block text-5xl mb-4">🎉</div>
              <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Your Post Ideas Are Ready!</h2>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-fuchsia-100 text-fuchsia-700 text-xs font-bold px-3 py-1.5 rounded-full">🎯 {finalNiche}</span>
                <span className="bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full">{TONES.find(t => t.id === selectedTone)?.emoji} {TONES.find(t => t.id === selectedTone)?.label}</span>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">📝 {Object.values(result).flat().length} post ideas</span>
              </div>
            </div>

            {/* Platform tabs */}
            <div className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              {selectedPlatforms.map(pid => {
                const p = PLATFORMS.find(x => x.id === pid);
                const isActive = activePlatform === pid;
                return (
                  <button
                    key={pid}
                    onClick={() => setActivePlatform(pid)}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-extrabold text-sm whitespace-nowrap transition-all flex-shrink-0 border-2 ${
                      isActive
                        ? `bg-gradient-to-r ${p.bg} text-white border-transparent shadow-xl`
                        : `border-gray-100 text-gray-500 bg-white hover:border-gray-200`
                    }`}
                  >
                    <span>{p.icon}</span>
                    {p.label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>
                      {result[pid]?.length || 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Post cards grid */}
            {currentPlatformData && (
              <div className="grid md:grid-cols-2 gap-5">
                {currentIdeas.map((idea, i) => (
                  <div key={i} className="pop-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <PostCard idea={idea} platform={currentPlatformData} index={i} />
                  </div>
                ))}
                {currentIdeas.length === 0 && (
                  <div className="col-span-2 text-center py-16 text-gray-400 font-bold">
                    No ideas for this combination yet — try a different tone!
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-10 flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-extrabold text-sm hover:border-fuchsia-300 hover:text-fuchsia-600 transition-all"
              >
                ← Generate New Ideas
              </button>
              <button
                className="flex-[2] py-4 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-xl shadow-pink-200 hover:shadow-2xl hover:shadow-pink-300 transition-all"
              >
                Save All Ideas 💾
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/80 bg-white/50 mt-16 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
            <span>✨</span>
            © 2025 PostSpark AI · Made with love for creators
          </div>
          <div className="flex gap-5 text-sm font-bold text-gray-400">
            {["Privacy", "Terms", "Contact"].map(l => (
              <a key={l} href="#" className="hover:text-fuchsia-600 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}