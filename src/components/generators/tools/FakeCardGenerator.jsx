import { useState, useCallback, useRef } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const NETWORKS = {
  Visa:       { prefix:["4"],                                          len:16, cvv:3,  light:false, mcCircles:false },
  Mastercard: { prefix:["51","52","53","54","55"],                     len:16, cvv:3,  light:false, mcCircles:true  },
  Amex:       { prefix:["34","37"],                                    len:15, cvv:4,  light:false, mcCircles:false },
  Discover:   { prefix:["6011","644","645","646","647","648","649","65"],len:16,cvv:3, light:true,  mcCircles:false },
};

const THEMES = {
  Minimal: {
    front: (net) => {
      const g = { Visa:"linear-gradient(135deg,#1a1a2e,#0f3460)", Mastercard:"linear-gradient(135deg,#1c1c1c,#2d2d2d)", Amex:"linear-gradient(135deg,#006994,#003a54)", Discover:"linear-gradient(135deg,#f5f0e8,#e0d4b8)" };
      return g[net] || g.Visa;
    },
    chip: { Visa:"#d4af6a", Mastercard:"#c0c0c0", Amex:"#a8d8ea", Discover:"#d4a843" },
    glow: "none",
  },
  Neon: {
    front: () => "linear-gradient(135deg,#0d0d0d 0%,#111 100%)",
    chip: { Visa:"#00ff88", Mastercard:"#ff3366", Amex:"#00cfff", Discover:"#ffcc00" },
    glow: true,
    accent: { Visa:"#00ff88", Mastercard:"#ff3366", Amex:"#00cfff", Discover:"#ffcc00" },
  },
  Glass: {
    front: (net) => {
      const g = { Visa:"linear-gradient(135deg,rgba(30,60,120,0.55),rgba(15,52,96,0.7))", Mastercard:"linear-gradient(135deg,rgba(40,40,40,0.55),rgba(20,20,20,0.7))", Amex:"linear-gradient(135deg,rgba(0,100,148,0.55),rgba(0,58,84,0.7))", Discover:"linear-gradient(135deg,rgba(220,200,160,0.6),rgba(200,175,120,0.75))" };
      return g[net] || g.Visa;
    },
    chip: { Visa:"rgba(212,175,106,0.8)", Mastercard:"rgba(192,192,192,0.8)", Amex:"rgba(168,216,234,0.8)", Discover:"rgba(212,168,67,0.8)" },
    glow: "none",
    glass: true,
  },
};

const FIRST = ["James","Emma","Oliver","Sophia","Liam","Ava","Noah","Isabella","Lucas","Mia","Ethan","Charlotte","Mason","Amelia","Logan","Zoe","Ryan","Harper","Caleb","Aria"];
const LAST  = ["Johnson","Williams","Brown","Garcia","Miller","Davis","Wilson","Moore","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Lee","Walker","Hall","Allen","Young"];

const TABS = ["Generator","Bulk","Validator","Export"];
const TAB_ICONS = { Generator:"✦", Bulk:"⊞", Validator:"⊛", Export:"⬡" };

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const rand = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const pick = arr => arr[rand(0,arr.length-1)];

function luhn(partial) {
  const d = partial.split("").map(Number); let s=0;
  for(let i=d.length-1;i>=0;i--){let v=d[i]; if((d.length-i)%2===0){v*=2;if(v>9)v-=9;} s+=v;}
  return ((10-(s%10))%10).toString();
}

function genCard(net) {
  const cfg = NETWORKS[net];
  const pre = pick(cfg.prefix);
  let num = pre;
  while(num.length < cfg.len-1) num += rand(0,9);
  num += luhn(num);
  return {
    network: net,
    number: num,
    expMonth: String(rand(1,12)).padStart(2,"0"),
    expYear: String(rand(new Date().getFullYear()+1, new Date().getFullYear()+5)).slice(-2),
    cvv: Array.from({length:cfg.cvv},()=>rand(0,9)).join(""),
    name: `${pick(FIRST)} ${pick(LAST)}`.toUpperCase(),
    id: Math.random().toString(36).slice(2,8),
  };
}

function fmtNum(n, net) {
  if(net==="Amex") return `${n.slice(0,4)} ${n.slice(4,10)} ${n.slice(10)}`;
  return n.match(/.{1,4}/g).join(" ");
}

function luhnCheck(num) {
  const d = num.replace(/\D/g,"").split("").reverse().map(Number);
  if(d.length<13) return false;
  let s=0;
  for(let i=0;i<d.length;i++){let v=d[i]; if(i%2===1){v*=2;if(v>9)v-=9;} s+=v;}
  return s%10===0;
}

function detectNetwork(num) {
  const n = num.replace(/\D/g,"");
  if(/^4/.test(n)) return "Visa";
  if(/^5[1-5]/.test(n)) return "Mastercard";
  if(/^3[47]/.test(n)) return "Amex";
  if(/^(6011|64[4-9]|65)/.test(n)) return "Discover";
  return null;
}

// ─── CARD CANVAS DOWNLOAD ────────────────────────────────────────────────────
function downloadCard(card, theme) {
  const W=800,H=504, cfg=NETWORKS[card.network];
  const canvas = document.createElement("canvas");
  canvas.width=W; canvas.height=H;
  const ctx = canvas.getContext("2d");
  const thm = THEMES[theme];

  // bg
  const gr = ctx.createLinearGradient(0,0,W,H);
  const bg = thm.front(card.network);
  const stops = bg.match(/rgba?\([^)]+\)|#[0-9a-f]{3,8}|[a-z]+/gi).filter(c=>/^(#|rgb)/.test(c));
  if(stops[0]) { gr.addColorStop(0,stops[0]); gr.addColorStop(1,stops[1]||stops[0]); }
  ctx.fillStyle = gr;
  ctx.beginPath(); ctx.roundRect(0,0,W,H,32); ctx.fill();

  // glass overlay
  if(thm.glass) {
    ctx.fillStyle="rgba(255,255,255,0.06)";
    ctx.beginPath(); ctx.roundRect(0,0,W,H,32); ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.15)"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.roundRect(1,1,W-2,H-2,31); ctx.stroke();
  }

  // neon glow
  if(thm.glow) {
    const acc = thm.accent[card.network]||"#00ff88";
    ctx.shadowColor=acc; ctx.shadowBlur=60;
    ctx.strokeStyle=acc; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(2,2,W-4,H-4,30); ctx.stroke();
    ctx.shadowBlur=0;
  }

  const isLight = cfg.light && theme==="Minimal";
  const tc = isLight?"#1a1a1a":"#fff";
  const sc = isLight?"rgba(0,0,0,0.45)":"rgba(255,255,255,0.55)";
  const neonAcc = thm.glow ? (thm.accent[card.network]||"#00ff88") : null;

  // network
  ctx.font="600 20px sans-serif"; ctx.fillStyle=sc; ctx.fillText(card.network.toUpperCase(),56,76);
  ctx.font="300 16px sans-serif"; ctx.fillStyle=isLight?"rgba(0,0,0,0.3)":"rgba(255,255,255,0.35)"; ctx.fillText("Test Card",56,100);

  // chip
  const chipCol = thm.chip[card.network]||"#d4af6a";
  const cg = ctx.createLinearGradient(56,140,148,212);
  cg.addColorStop(0,chipCol); cg.addColorStop(1,chipCol+"aa");
  ctx.fillStyle=cg; ctx.beginPath(); ctx.roundRect(56,140,92,72,10); ctx.fill();
  ctx.strokeStyle="rgba(0,0,0,0.2)"; ctx.lineWidth=1; ctx.stroke();
  ["rgba(0,0,0,0.15)"].forEach(c=>{ ctx.strokeStyle=c; ctx.lineWidth=1.5;
    [[86,140,86,212],[118,140,118,212],[56,164,148,164],[56,188,148,188]].forEach(([x1,y1,x2,y2])=>{
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }); });
  ctx.fillStyle="rgba(0,0,0,0.1)"; ctx.beginPath(); ctx.roundRect(90,162,24,20,4); ctx.fill();

  // number
  ctx.font=`600 36px 'Courier New',monospace`;
  ctx.fillStyle = neonAcc||tc;
  if(neonAcc){ctx.shadowColor=neonAcc; ctx.shadowBlur=18;}
  ctx.fillText(fmtNum(card.number,card.network),56,306);
  ctx.shadowBlur=0;

  // name
  ctx.font="500 16px sans-serif"; ctx.fillStyle=sc; ctx.fillText("CARD HOLDER",56,354);
  ctx.font="600 20px 'Courier New',monospace"; ctx.fillStyle=neonAcc||tc;
  if(neonAcc){ctx.shadowColor=neonAcc; ctx.shadowBlur=10;}
  ctx.fillText(card.name,56,382); ctx.shadowBlur=0;

  // expiry
  ctx.font="500 16px sans-serif"; ctx.fillStyle=sc; ctx.fillText("EXPIRES",56,426);
  ctx.font="600 20px 'Courier New',monospace"; ctx.fillStyle=neonAcc||tc;
  ctx.fillText(`${card.expMonth}/${card.expYear}`,56,454);

  // mc circles
  if(card.network==="Mastercard") {
    ctx.beginPath(); ctx.arc(W-120,H-60,44,0,Math.PI*2); ctx.fillStyle="rgba(235,0,27,0.9)"; ctx.fill();
    ctx.beginPath(); ctx.arc(W-84,H-60,44,0,Math.PI*2); ctx.fillStyle="rgba(247,158,27,0.9)"; ctx.fill();
  }

  // logo
  if(card.network==="Visa"){ctx.font="italic bold 52px 'Times New Roman',serif"; ctx.fillStyle="#fff"; ctx.fillText("VISA",W-130,H-38);}
  else if(card.network==="Amex"){ctx.font="800 22px sans-serif"; ctx.fillStyle="#fff"; ctx.fillText("AMEX",W-110,H-42);}
  else if(card.network==="Discover"){ctx.font="800 18px sans-serif"; ctx.fillStyle="#333"; ctx.fillText("DISCOVER",W-160,H-42);}

  // watermark
  ctx.font="300 13px sans-serif"; ctx.fillStyle="rgba(255,255,255,0.08)";
  ctx.fillText("FOR TESTING ONLY — NOT A REAL CARD",W/2-150,H-14);

  const a=document.createElement("a");
  a.download=`card-${card.network.toLowerCase()}-${card.id}.png`;
  a.href=canvas.toDataURL("image/png"); a.click();
}

// ─── CHIP SVG ─────────────────────────────────────────────────────────────────
function Chip({color="#d4af6a"}) {
  return (
    <svg width="44" height="34" viewBox="0 0 46 36" fill="none">
      <rect x="1" y="1" width="44" height="34" rx="5" fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="0.5"/>
      <line x1="15" y1="1" x2="15" y2="35" stroke="rgba(0,0,0,0.14)" strokeWidth="2"/>
      <line x1="31" y1="1" x2="31" y2="35" stroke="rgba(0,0,0,0.14)" strokeWidth="2"/>
      <line x1="1" y1="12" x2="45" y2="12" stroke="rgba(0,0,0,0.14)" strokeWidth="2"/>
      <line x1="1" y1="24" x2="45" y2="24" stroke="rgba(0,0,0,0.14)" strokeWidth="2"/>
      <rect x="17" y="13" width="12" height="10" rx="2" fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"/>
    </svg>
  );
}

// ─── CARD FACE ────────────────────────────────────────────────────────────────
function CardFace({ card, theme, flipped }) {
  const cfg = NETWORKS[card.network];
  const thm = THEMES[theme];
  const bg = thm.front(card.network);
  const chipCol = thm.chip[card.network] || "#d4af6a";
  const isLight = cfg.light && theme === "Minimal";
  const tc = isLight ? "#1a1a1a" : "#fff";
  const sc = isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)";
  const neonAcc = thm.glow ? (thm.accent[card.network] || "#00ff88") : null;

  const glassStyle = thm.glass ? {
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.18)",
  } : {};

  const neonBorder = neonAcc ? { boxShadow: `0 0 0 1.5px ${neonAcc}44, 0 0 32px ${neonAcc}22, 0 20px 60px rgba(0,0,0,0.5)` } : {};

  return (
    <div style={{ perspective:"1200px", width:"100%", maxWidth:"420px", margin:"0 auto" }}>
      <div style={{ position:"relative", width:"100%", paddingBottom:"60%", transformStyle:"preserve-3d", transform: flipped?"rotateY(180deg)":"rotateY(0deg)", transition:"transform 0.55s cubic-bezier(0.23,1,0.32,1)" }}>
        {/* Front */}
        <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden", background:bg, borderRadius:"20px", padding:"22px 26px", display:"flex", flexDirection:"column", justifyContent:"space-between", overflow:"hidden", boxShadow:"0 28px 64px rgba(0,0,0,0.24), 0 8px 20px rgba(0,0,0,0.12)", ...glassStyle, ...neonBorder }}>
          <div style={{position:"absolute",top:"-50px",right:"-50px",width:"200px",height:"200px",borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
          <div style={{position:"absolute",bottom:"-70px",left:"-30px",width:"240px",height:"240px",borderRadius:"50%",background:"rgba(255,255,255,0.02)"}}/>
          {cfg.mcCircles && <div style={{position:"absolute",bottom:"16px",right:"22px",display:"flex"}}><div style={{width:"40px",height:"40px",borderRadius:"50%",background:"#eb001b",opacity:0.9}}/><div style={{width:"40px",height:"40px",borderRadius:"50%",background:"#f79e1b",opacity:0.9,marginLeft:"-14px"}}/></div>}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:1}}>
            <div>
              <div style={{fontSize:"10px",fontWeight:"700",color:sc,letterSpacing:"0.12em",textTransform:"uppercase"}}>{card.network}</div>
              {neonAcc && <div style={{fontSize:"9px",color:neonAcc,marginTop:"1px",letterSpacing:"0.08em"}}>NEON EDITION</div>}
            </div>
            <svg width="18" height="20" viewBox="0 0 20 22" fill="none">
              {[6,10,14].map((r,i)=><path key={i} d={`M${10-r*0.6} ${11+r*0.5} A${r} ${r} 0 0 1 ${10+r*0.6} ${11+r*0.5}`} stroke={neonAcc||sc} strokeWidth="1.5" strokeLinecap="round" opacity={1-i*0.25}/>)}
              <circle cx="10" cy="14" r="1.5" fill={neonAcc||sc}/>
            </svg>
          </div>
          <Chip color={chipCol}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"18px",fontWeight:"600",color:neonAcc||tc,letterSpacing:"0.14em",lineHeight:1,textShadow:neonAcc?`0 0 12px ${neonAcc}88`:"none"}}>
              {fmtNum(card.number,card.network)}
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",position:"relative",zIndex:1}}>
            <div>
              <div style={{fontSize:"8px",color:sc,letterSpacing:"0.1em",marginBottom:"2px"}}>CARD HOLDER</div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"12px",color:neonAcc||tc,fontWeight:"600",letterSpacing:"0.04em"}}>{card.name}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"8px",color:sc,letterSpacing:"0.1em",marginBottom:"2px"}}>EXPIRES</div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"12px",color:neonAcc||tc,fontWeight:"600"}}>{card.expMonth}/{card.expYear}</div>
            </div>
            {!cfg.mcCircles && (
              card.network==="Visa" ? <span style={{fontFamily:"'Times New Roman',serif",fontStyle:"italic",fontSize:"22px",fontWeight:"700",color:neonAcc||"#fff",letterSpacing:"-0.5px",textShadow:neonAcc?`0 0 10px ${neonAcc}`:"none"}}>VISA</span>
              : card.network==="Amex" ? <span style={{fontSize:"11px",fontWeight:"800",letterSpacing:"0.15em",color:neonAcc||"#fff"}}>AMEX</span>
              : <span style={{fontSize:"10px",fontWeight:"800",letterSpacing:"0.12em",color:neonAcc||"#333"}}>DISCOVER</span>
            )}
          </div>
        </div>
        {/* Back */}
        <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden", background:bg, borderRadius:"20px", overflow:"hidden", transform:"rotateY(180deg)", boxShadow:"0 28px 64px rgba(0,0,0,0.24)", display:"flex", flexDirection:"column", justifyContent:"center", ...glassStyle }}>
          <div style={{height:"42px",background:"rgba(0,0,0,0.8)",marginBottom:"18px"}}/>
          <div style={{margin:"0 26px",display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{flex:1,height:"38px",background:"repeating-linear-gradient(90deg,#f5f5f5 0,#fff 2px,#eee 4px)",borderRadius:"4px",display:"flex",alignItems:"center",paddingLeft:"10px"}}>
              <span style={{fontFamily:"'Brush Script MT',cursive",fontSize:"16px",color:"#333",opacity:0.7}}>{card.name.split(" ")[0]}</span>
            </div>
            <div style={{background:neonAcc?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.1)",borderRadius:"8px",padding:"6px 12px",textAlign:"center",border:neonAcc?`1px solid ${neonAcc}66`:"none"}}>
              <div style={{fontSize:"8px",color:neonAcc||"rgba(255,255,255,0.5)",marginBottom:"2px",letterSpacing:"0.1em"}}>CVV</div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"15px",fontWeight:"700",color:neonAcc||"#fff",letterSpacing:"0.12em",textShadow:neonAcc?`0 0 8px ${neonAcc}`:"none"}}>{card.cvv}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("Generator");
  const [net, setNet] = useState("Visa");
  const [theme, setTheme] = useState("Minimal");
  const [card, setCard] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(null);
  const [dlLoading, setDlLoading] = useState(false);

  // Bulk
  const [bulkNet, setBulkNet] = useState("Visa");
  const [bulkCount, setBulkCount] = useState(5);
  const [bulkCards, setBulkCards] = useState([]);
  const [bulkCopied, setBulkCopied] = useState(null);

  // Validator
  const [valInput, setValInput] = useState("");
  const [valResult, setValResult] = useState(null);

  // Export (uses bulk cards or single card)
  const [exportSrc, setExportSrc] = useState("single");

  const generate = useCallback(() => {
    setFlipped(false);
    setTimeout(() => { setCard(genCard(net)); setCopied(null); }, 80);
  }, [net]);

  const copyField = (val, field) => {
    navigator.clipboard.writeText(val);
    setCopied(field);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleDownload = () => {
    if (!card) return;
    setDlLoading(true);
    setTimeout(() => { downloadCard(card, theme); setDlLoading(false); }, 120);
  };

  const handleValidate = () => {
    const clean = valInput.replace(/\D/g,"");
    if (!clean) return;
    const valid = luhnCheck(clean);
    const detNet = detectNetwork(clean);
    setValResult({ valid, network: detNet, length: clean.length, input: clean });
  };

  const exportData = (format) => {
    const src = exportSrc === "bulk" ? bulkCards : (card ? [card] : []);
    if (!src.length) return;
    if (format === "json") {
      const data = src.map(c => ({ network:c.network, number:c.number, expiry:`${c.expMonth}/${c.expYear}`, cvv:c.cvv, name:c.name }));
      const blob = new Blob([JSON.stringify(data, null, 2)], { type:"application/json" });
      const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="cards.json"; a.click();
    } else {
      const header = "Network,Number,Expiry,CVV,Name\n";
      const rows = src.map(c => `${c.network},${c.number},${c.expMonth}/${c.expYear},${c.cvv},"${c.name}"`).join("\n");
      const blob = new Blob([header+rows], { type:"text/csv" });
      const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="cards.csv"; a.click();
    }
  };

  const fields = card ? [
    { label:"Card Number", val:fmtNum(card.number,card.network), raw:card.number, field:"number", mono:true },
    { label:"Cardholder",  val:card.name,                         raw:card.name,   field:"name",   mono:false },
    { label:"Expiry",      val:`${card.expMonth}/${card.expYear}`, raw:`${card.expMonth}/${card.expYear}`, field:"expiry", mono:true },
    { label:"CVV",         val:card.cvv,                           raw:card.cvv,   field:"cvv",    mono:true },
  ] : [];

  const sideItems = TABS;

  return (
    <div style={{ fontFamily:"'Outfit',sans-serif", minHeight:"100vh", background:"#f2f0ed", display:"flex" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .appear{animation:fadeUp 0.35s cubic-bezier(0.23,1,0.32,1) both}
        .tab-item{transition:all 0.18s ease;cursor:pointer}
        .tab-item:hover{background:rgba(255,255,255,0.08)!important}
        .net-pill{transition:all 0.15s ease;cursor:pointer}
        .net-pill:hover{transform:translateY(-1px)}
        .action-btn{transition:all 0.16s ease;cursor:pointer}
        .action-btn:hover{opacity:0.88;transform:translateY(-1px)}
        .action-btn:active{transform:translateY(0)}
        .field-row{transition:background 0.12s ease;cursor:pointer}
        .field-row:hover{background:#f8f7f4!important}
        .theme-card{transition:all 0.18s ease;cursor:pointer}
        .theme-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.1)!important}
        input:focus{outline:none}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px}
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{ width:"220px", minHeight:"100vh", background:"#13121a", display:"flex", flexDirection:"column", padding:"28px 0", flexShrink:0 }}>
        <div style={{ padding:"0 20px 28px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
            <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"linear-gradient(135deg,#6366f1,#818cf8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>💳</div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:"800", fontSize:"15px", color:"#fff", letterSpacing:"-0.3px" }}>CardForge</span>
          </div>
          <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.25)", letterSpacing:"0.06em", paddingLeft:"36px" }}>TEST CARD SUITE</div>
        </div>

        <div style={{ padding:"0 10px", flex:1 }}>
          {sideItems.map(t => {
            const active = tab === t;
            return (
              <div key={t} className="tab-item" onClick={() => setTab(t)}
                style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"10px", marginBottom:"2px", background: active?"rgba(99,102,241,0.18)":"transparent", border: active?"1px solid rgba(99,102,241,0.3)":"1px solid transparent" }}>
                <span style={{ fontSize:"14px", opacity: active?1:0.4 }}>{TAB_ICONS[t]}</span>
                <span style={{ fontSize:"13px", fontWeight: active?"600":"400", color: active?"#a5b4fc":"rgba(255,255,255,0.45)", letterSpacing:"0.01em" }}>{t}</span>
                {active && <div style={{ marginLeft:"auto", width:"5px", height:"5px", borderRadius:"50%", background:"#818cf8" }}/>}
              </div>
            );
          })}
        </div>

        <div style={{ padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,0.06)", marginTop:"auto" }}>
          <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.2)", lineHeight:1.6 }}>
            ⚠ Testing purposes only<br/>No real financial data
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex:1, overflow:"auto", padding:"32px" }}>

        {/* ══ GENERATOR TAB ══ */}
        {tab === "Generator" && (
          <div className="appear" style={{ maxWidth:"860px" }}>
            <div style={{ marginBottom:"28px" }}>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"28px", fontWeight:"800", color:"#111", letterSpacing:"-0.8px", marginBottom:"4px" }}>Card Generator</h1>
              <p style={{ fontSize:"13px", color:"#999", fontWeight:"300" }}>Generate a single Luhn-valid test card with custom theme</p>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", alignItems:"start" }}>
              {/* Left */}
              <div>
                {/* Network */}
                <div style={{ background:"#fff", borderRadius:"16px", padding:"18px", marginBottom:"14px", border:"1px solid rgba(0,0,0,0.06)", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:"11px", fontWeight:"600", color:"#aaa", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"12px" }}>Network</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                    {Object.keys(NETWORKS).map(n => (
                      <button key={n} className="net-pill" onClick={() => setNet(n)}
                        style={{ padding:"8px 12px", borderRadius:"10px", border: net===n?"1.5px solid #6366f1":"1.5px solid #eee", background: net===n?"#eef2ff":"#fafafa", color: net===n?"#4f46e5":"#555", fontSize:"12px", fontWeight: net===n?"600":"400", display:"flex", alignItems:"center", gap:"6px" }}>
                        <span>{n==="Visa"?"💙":n==="Mastercard"?"🔴":n==="Amex"?"🟦":"🟠"}</span>{n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme */}
                <div style={{ background:"#fff", borderRadius:"16px", padding:"18px", marginBottom:"14px", border:"1px solid rgba(0,0,0,0.06)", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:"11px", fontWeight:"600", color:"#aaa", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"12px" }}>Card Theme</div>
                  <div style={{ display:"flex", gap:"8px" }}>
                    {Object.keys(THEMES).map(t => {
                      const previews = { Minimal:"🌑", Neon:"⚡", Glass:"🔮" };
                      const active = theme === t;
                      return (
                        <button key={t} className="theme-card" onClick={() => setTheme(t)}
                          style={{ flex:1, padding:"12px 8px", borderRadius:"12px", border: active?"1.5px solid #6366f1":"1.5px solid #eee", background: active?"#eef2ff":"#fafafa", textAlign:"center", boxShadow: active?"0 4px 14px rgba(99,102,241,0.12)":"0 2px 6px rgba(0,0,0,0.04)" }}>
                          <div style={{ fontSize:"20px", marginBottom:"4px" }}>{previews[t]}</div>
                          <div style={{ fontSize:"11px", fontWeight: active?"600":"400", color: active?"#4f46e5":"#666" }}>{t}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Generate btn */}
                <button className="action-btn" onClick={generate}
                  style={{ width:"100%", padding:"14px", borderRadius:"14px", background:"linear-gradient(135deg,#4f46e5,#6366f1)", color:"#fff", border:"none", fontSize:"13px", fontWeight:"700", letterSpacing:"0.04em", boxShadow:"0 6px 20px rgba(79,70,229,0.3)" }}>
                  {card ? "↺  Regenerate Card" : "⚡  Generate Card"}
                </button>
              </div>

              {/* Right */}
              <div>
                {card ? (
                  <>
                    <div style={{ marginBottom:"14px" }}><CardFace card={card} theme={theme} flipped={flipped}/></div>
                    <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginBottom:"14px" }}>
                      <button className="action-btn" onClick={() => setFlipped(f=>!f)}
                        style={{ padding:"7px 16px", borderRadius:"100px", border:"1px solid #e0e0e0", background:"#f5f3ef", fontSize:"11px", fontWeight:"500", color:"#666" }}>
                        {flipped ? "↩ Front" : "↩ Back & CVV"}
                      </button>
                      <button className="action-btn" onClick={handleDownload}
                        style={{ padding:"7px 16px", borderRadius:"100px", border:"none", background:"#13121a", fontSize:"11px", fontWeight:"600", color:"#fff", display:"flex", alignItems:"center", gap:"6px" }}>
                        {dlLoading ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{animation:"spin 1s linear infinite"}}><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="3" strokeDasharray="40" strokeDashoffset="15" strokeLinecap="round"/></svg> : "⬇"}
                        Download PNG
                      </button>
                    </div>

                    {/* Fields */}
                    <div style={{ background:"#fff", borderRadius:"16px", border:"1px solid rgba(0,0,0,0.06)", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                      <div style={{ padding:"12px 18px", borderBottom:"1px solid #f5f5f5" }}>
                        <span style={{ fontSize:"10px", fontWeight:"600", color:"#aaa", letterSpacing:"0.1em", textTransform:"uppercase" }}>Card Details</span>
                      </div>
                      {fields.map(({label,val,raw,field,mono},i) => (
                        <div key={field} className="field-row" onClick={() => copyField(raw,field)}
                          style={{ padding:"10px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom: i<fields.length-1?"1px solid #f9f9f9":"none" }}>
                          <div>
                            <div style={{ fontSize:"10px", color:"#bbb", marginBottom:"2px" }}>{label}</div>
                            <div style={{ fontSize:"12px", fontWeight:"600", color:"#111", fontFamily: mono?"'IBM Plex Mono',monospace":"inherit", letterSpacing: field==="number"?"0.08em":field==="cvv"?"0.12em":"0" }}>{val}</div>
                          </div>
                          <div style={{ fontSize:"10px", fontWeight:"500", padding:"4px 10px", borderRadius:"6px", background: copied===field?"#f0fdf4":"#f5f3ef", color: copied===field?"#16a34a":"#999", border: copied===field?"1px solid #bbf7d0":"1px solid transparent" }}>
                            {copied===field ? "✓" : "Copy"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ height:"280px", borderRadius:"20px", background:"rgba(255,255,255,0.6)", border:"2px dashed #e0ddd8", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                    <div style={{ fontSize:"40px", opacity:0.15 }}>💳</div>
                    <p style={{ fontSize:"12px", color:"#bbb" }}>Generate a card to preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ BULK TAB ══ */}
        {tab === "Bulk" && (
          <div className="appear" style={{ maxWidth:"860px" }}>
            <div style={{ marginBottom:"28px" }}>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"28px", fontWeight:"800", color:"#111", letterSpacing:"-0.8px", marginBottom:"4px" }}>Bulk Generator</h1>
              <p style={{ fontSize:"13px", color:"#999", fontWeight:"300" }}>Generate multiple test cards at once</p>
            </div>

            <div style={{ background:"#fff", borderRadius:"16px", padding:"20px", marginBottom:"16px", border:"1px solid rgba(0,0,0,0.06)", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", display:"flex", flexWrap:"wrap", gap:"16px", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:"11px", fontWeight:"600", color:"#aaa", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"8px" }}>Network</div>
                <div style={{ display:"flex", gap:"6px" }}>
                  {[...Object.keys(NETWORKS),"Random"].map(n => (
                    <button key={n} className="net-pill" onClick={() => setBulkNet(n)}
                      style={{ padding:"5px 12px", borderRadius:"8px", border: bulkNet===n?"1.5px solid #6366f1":"1.5px solid #e5e5e5", background: bulkNet===n?"#eef2ff":"#fafafa", color: bulkNet===n?"#4f46e5":"#666", fontSize:"11px", fontWeight: bulkNet===n?"600":"400" }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize:"11px", fontWeight:"600", color:"#aaa", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"8px" }}>Count</div>
                <div style={{ display:"flex", gap:"6px" }}>
                  {[5,10,25,50].map(n => (
                    <button key={n} className="net-pill" onClick={() => setBulkCount(n)}
                      style={{ padding:"5px 12px", borderRadius:"8px", border: bulkCount===n?"1.5px solid #6366f1":"1.5px solid #e5e5e5", background: bulkCount===n?"#eef2ff":"#fafafa", color: bulkCount===n?"#4f46e5":"#666", fontSize:"11px", fontWeight: bulkCount===n?"600":"400" }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <button className="action-btn" onClick={() => { const nets = bulkNet==="Random"?Object.keys(NETWORKS):null; setBulkCards(Array.from({length:bulkCount},()=>genCard(nets?pick(nets):bulkNet))); }}
                style={{ marginLeft:"auto", padding:"10px 22px", borderRadius:"10px", background:"linear-gradient(135deg,#4f46e5,#6366f1)", color:"#fff", border:"none", fontSize:"12px", fontWeight:"700", boxShadow:"0 4px 14px rgba(79,70,229,0.25)" }}>
                ⚡ Generate {bulkCount}
              </button>
            </div>

            {bulkCards.length > 0 && (
              <div style={{ background:"#fff", borderRadius:"16px", border:"1px solid rgba(0,0,0,0.06)", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ padding:"12px 18px", borderBottom:"1px solid #f5f5f5", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:"11px", fontWeight:"600", color:"#aaa", letterSpacing:"0.1em", textTransform:"uppercase" }}>{bulkCards.length} Cards Generated</span>
                  <button className="action-btn" onClick={() => setBulkCards([])} style={{ fontSize:"10px", color:"#bbb", background:"none", border:"none", padding:"0" }}>Clear all</button>
                </div>
                <div style={{ maxHeight:"440px", overflow:"auto" }}>
                  {bulkCards.map((c, i) => (
                    <div key={c.id} style={{ padding:"10px 18px", display:"flex", alignItems:"center", gap:"12px", borderBottom: i<bulkCards.length-1?"1px solid #f9f9f9":"none", background: i%2===0?"#fff":"#fdfcfb" }}>
                      <span style={{ fontSize:"10px", color:"#ccc", fontFamily:"'IBM Plex Mono',monospace", width:"20px" }}>{i+1}</span>
                      <span style={{ fontSize:"10px", padding:"2px 8px", borderRadius:"5px", background:"#f0f0f0", color:"#666", fontWeight:"600", minWidth:"72px", textAlign:"center" }}>{c.network}</span>
                      <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"12px", color:"#333", flex:1, letterSpacing:"0.06em" }}>{fmtNum(c.number,c.network)}</span>
                      <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"11px", color:"#888" }}>{c.expMonth}/{c.expYear}</span>
                      <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"11px", color:"#aaa", minWidth:"40px" }}>{c.cvv}</span>
                      <button className="action-btn" onClick={() => { navigator.clipboard.writeText(c.number); setBulkCopied(i); setTimeout(()=>setBulkCopied(null),1500); }}
                        style={{ fontSize:"10px", padding:"3px 8px", borderRadius:"5px", background: bulkCopied===i?"#f0fdf4":"#f5f3ef", color: bulkCopied===i?"#16a34a":"#999", border: bulkCopied===i?"1px solid #bbf7d0":"none" }}>
                        {bulkCopied===i?"✓":"Copy"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ VALIDATOR TAB ══ */}
        {tab === "Validator" && (
          <div className="appear" style={{ maxWidth:"560px" }}>
            <div style={{ marginBottom:"28px" }}>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"28px", fontWeight:"800", color:"#111", letterSpacing:"-0.8px", marginBottom:"4px" }}>Card Validator</h1>
              <p style={{ fontSize:"13px", color:"#999", fontWeight:"300" }}>Check any card number using the Luhn algorithm</p>
            </div>

            <div style={{ background:"#fff", borderRadius:"16px", padding:"24px", border:"1px solid rgba(0,0,0,0.06)", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", marginBottom:"16px" }}>
              <div style={{ fontSize:"11px", fontWeight:"600", color:"#aaa", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"10px" }}>Card Number</div>
              <div style={{ display:"flex", gap:"10px" }}>
                <input value={valInput} onChange={e => { setValInput(e.target.value); setValResult(null); }}
                  placeholder="4532 0151 1283 0366"
                  style={{ flex:1, padding:"12px 16px", borderRadius:"10px", border:"1.5px solid #e5e5e5", fontSize:"14px", fontFamily:"'IBM Plex Mono',monospace", letterSpacing:"0.06em", color:"#111", background:"#fafafa", transition:"border 0.15s" }}
                  onFocus={e=>e.target.style.borderColor="#6366f1"}
                  onBlur={e=>e.target.style.borderColor="#e5e5e5"}
                  onKeyDown={e=>e.key==="Enter"&&handleValidate()}
                />
                <button className="action-btn" onClick={handleValidate}
                  style={{ padding:"12px 20px", borderRadius:"10px", background:"linear-gradient(135deg,#4f46e5,#6366f1)", color:"#fff", border:"none", fontSize:"13px", fontWeight:"700", boxShadow:"0 4px 14px rgba(79,70,229,0.25)", whiteSpace:"nowrap" }}>
                  Validate
                </button>
              </div>
            </div>

            {valResult && (
              <div className="appear" style={{ background:"#fff", borderRadius:"16px", border:`2px solid ${valResult.valid?"#86efac":"#fca5a5"}`, overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,0.06)" }}>
                <div style={{ padding:"16px 20px", background: valResult.valid?"#f0fdf4":"#fef2f2", borderBottom:`1px solid ${valResult.valid?"#bbf7d0":"#fecaca"}`, display:"flex", alignItems:"center", gap:"10px" }}>
                  <span style={{ fontSize:"22px" }}>{valResult.valid?"✅":"❌"}</span>
                  <div>
                    <div style={{ fontSize:"15px", fontWeight:"700", color: valResult.valid?"#15803d":"#dc2626" }}>{valResult.valid?"Valid Card Number":"Invalid Card Number"}</div>
                    <div style={{ fontSize:"11px", color: valResult.valid?"#16a34a":"#ef4444", marginTop:"1px" }}>Luhn checksum {valResult.valid?"passed":"failed"}</div>
                  </div>
                </div>
                <div style={{ padding:"16px 20px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px" }}>
                  {[
                    { label:"Network", val: valResult.network||"Unknown", icon:"🌐" },
                    { label:"Length",  val:`${valResult.length} digits`,   icon:"📏" },
                    { label:"Format",  val:`****${valResult.input.slice(-4)}`, icon:"🔢" },
                  ].map(({label,val,icon}) => (
                    <div key={label} style={{ background:"#f9f9f9", borderRadius:"10px", padding:"12px", textAlign:"center" }}>
                      <div style={{ fontSize:"18px", marginBottom:"4px" }}>{icon}</div>
                      <div style={{ fontSize:"10px", color:"#aaa", marginBottom:"2px", letterSpacing:"0.06em" }}>{label.toUpperCase()}</div>
                      <div style={{ fontSize:"13px", fontWeight:"600", color:"#222", fontFamily:"'IBM Plex Mono',monospace" }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop:"20px", background:"#fff", borderRadius:"14px", padding:"16px 20px", border:"1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize:"11px", fontWeight:"600", color:"#aaa", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"10px" }}>How Luhn Works</div>
              <div style={{ fontSize:"12px", color:"#777", lineHeight:1.7, fontWeight:"300" }}>
                The Luhn algorithm validates card numbers by doubling every second digit from the right, subtracting 9 if greater than 9, summing all digits, and checking if the total is divisible by 10.
              </div>
            </div>
          </div>
        )}

        {/* ══ EXPORT TAB ══ */}
        {tab === "Export" && (
          <div className="appear" style={{ maxWidth:"620px" }}>
            <div style={{ marginBottom:"28px" }}>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"28px", fontWeight:"800", color:"#111", letterSpacing:"-0.8px", marginBottom:"4px" }}>Export Data</h1>
              <p style={{ fontSize:"13px", color:"#999", fontWeight:"300" }}>Download your generated cards as JSON or CSV</p>
            </div>

            {/* Source select */}
            <div style={{ background:"#fff", borderRadius:"16px", padding:"20px", border:"1px solid rgba(0,0,0,0.06)", marginBottom:"14px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize:"11px", fontWeight:"600", color:"#aaa", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"12px" }}>Data Source</div>
              <div style={{ display:"flex", gap:"10px" }}>
                {[{v:"single",label:"Single Card",desc:card?`${card.network} ···${card.number.slice(-4)}`:"No card yet",icon:"💳"},
                  {v:"bulk",label:"Bulk Cards",desc:`${bulkCards.length} cards`,icon:"⊞"}].map(({v,label,desc,icon}) => (
                  <button key={v} className="theme-card" onClick={() => setExportSrc(v)}
                    style={{ flex:1, padding:"14px", borderRadius:"12px", border: exportSrc===v?"1.5px solid #6366f1":"1.5px solid #eee", background: exportSrc===v?"#eef2ff":"#fafafa", textAlign:"left", boxShadow: exportSrc===v?"0 4px 14px rgba(99,102,241,0.12)":"none" }}>
                    <span style={{ fontSize:"20px" }}>{icon}</span>
                    <div style={{ marginTop:"6px", fontSize:"13px", fontWeight:"600", color: exportSrc===v?"#4f46e5":"#333" }}>{label}</div>
                    <div style={{ fontSize:"11px", color:"#aaa", marginTop:"2px", fontFamily:"'IBM Plex Mono',monospace" }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Export formats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"14px" }}>
              {[
                { fmt:"json", label:"JSON", icon:"{ }", desc:"Structured JSON array", color:"#f59e0b", bg:"#fffbeb" },
                { fmt:"csv",  label:"CSV",  icon:"≡",   desc:"Spreadsheet compatible", color:"#10b981", bg:"#ecfdf5" },
              ].map(({fmt,label,icon,desc,color,bg}) => {
                const hasData = exportSrc==="bulk" ? bulkCards.length>0 : !!card;
                return (
                  <button key={fmt} className="action-btn" onClick={() => exportData(fmt)} disabled={!hasData}
                    style={{ padding:"22px 20px", borderRadius:"16px", border:`1.5px solid ${hasData?color+"44":"#eee"}`, background: hasData?bg:"#fafafa", textAlign:"left", opacity: hasData?1:0.5, boxShadow: hasData?`0 4px 16px ${color}18`:"none" }}>
                    <div style={{ fontSize:"28px", fontFamily:"'IBM Plex Mono',monospace", color:color, fontWeight:"700", marginBottom:"6px" }}>{icon}</div>
                    <div style={{ fontSize:"14px", fontWeight:"700", color:"#111", marginBottom:"2px" }}>Export as {label}</div>
                    <div style={{ fontSize:"11px", color:"#888" }}>{desc}</div>
                    <div style={{ marginTop:"10px", fontSize:"11px", fontWeight:"600", color:color, display:"flex", alignItems:"center", gap:"4px" }}>⬇ Download .{fmt}</div>
                  </button>
                );
              })}
            </div>

            {/* Preview */}
            {(exportSrc==="single"?card:bulkCards[0]) && (
              <div style={{ background:"#13121a", borderRadius:"14px", padding:"18px 20px", border:"1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"10px" }}>Preview (first record)</div>
                <pre style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:"11px", color:"#a5b4fc", lineHeight:1.7, overflow:"auto" }}>
{JSON.stringify((() => { const c = exportSrc==="single"?card:bulkCards[0]; return { network:c.network, number:c.number, expiry:`${c.expMonth}/${c.expYear}`, cvv:c.cvv, name:c.name }; })(), null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}