import { useState, useRef, useCallback } from "react";

/* ─── presets ─── */
const PRESETS = [
  { name: "Aurora",    stops: [{ color:"#00c9ff", pos:0 },{ color:"#92fe9d", pos:100 }] },
  { name: "Sunset",    stops: [{ color:"#ff6b6b", pos:0 },{ color:"#ffd93d", pos:50 },{ color:"#ff6b6b", pos:100 }] },
  { name: "Ocean",     stops: [{ color:"#0575e6", pos:0 },{ color:"#021b79", pos:100 }] },
  { name: "Peach",     stops: [{ color:"#ed4264", pos:0 },{ color:"#ffedbc", pos:100 }] },
  { name: "Forest",    stops: [{ color:"#134e5e", pos:0 },{ color:"#71b280", pos:100 }] },
  { name: "Candy",     stops: [{ color:"#f953c6", pos:0 },{ color:"#b91d73", pos:100 }] },
  { name: "Neon",      stops: [{ color:"#f7971e", pos:0 },{ color:"#ffd200", pos:50 },{ color:"#f7971e", pos:100 }] },
  { name: "Cosmic",    stops: [{ color:"#200122", pos:0 },{ color:"#6f0000", pos:50 },{ color:"#200122", pos:100 }] },
  { name: "Mint",      stops: [{ color:"#00b09b", pos:0 },{ color:"#96c93d", pos:100 }] },
  { name: "Lavender",  stops: [{ color:"#c471ed", pos:0 },{ color:"#f64f59", pos:100 }] },
  { name: "Gold",      stops: [{ color:"#f7971e", pos:0 },{ color:"#ffd200", pos:100 }] },
  { name: "Deep Sea",  stops: [{ color:"#2980b9", pos:0 },{ color:"#6dd5fa", pos:50 },{ color:"#ffffff", pos:100 }] },
];

const TYPES = ["linear","radial","conic"];
const BLEND_MODES = ["normal","overlay","multiply","screen","hard-light","soft-light","difference","luminosity"];
const EASING = ["linear","ease-in","ease-out","ease-in-out"];

const uid = () => Math.random().toString(36).slice(2,8);

const buildCSS = (type, angle, stops, repeat, prefix="") => {
  const sorted = [...stops].sort((a,b)=>a.pos-b.pos);
  const stopsStr = sorted.map(s=>`${s.color} ${s.pos}%`).join(", ");
  const fn = repeat
    ? (type==="linear"?`repeating-linear-gradient`:`repeating-${type}-gradient`)
    : `${type}-gradient`;
  const dir = type==="linear"
    ? `${angle}deg, `
    : type==="conic"
    ? `from ${angle}deg, `
    : "";
  return `${prefix}${fn}(${dir}${stopsStr})`;
};

export default function GradientGenerator() {
  const [type, setType]       = useState("linear");
  const [angle, setAngle]     = useState(135);
  const [stops, setStops]     = useState([
    { id: uid(), color:"#6366f1", pos:0 },
    { id: uid(), color:"#ec4899", pos:100 },
  ]);
  const [repeat, setRepeat]   = useState(false);
  const [copied, setCopied]   = useState(false);
  const [activeStop, setActiveStop] = useState(null);
  const [showPresets, setShowPresets] = useState(true);
  const trackRef = useRef(null);
  const dragRef  = useRef(null);

  /* ── CSS string ── */
  const cssValue   = buildCSS(type, angle, stops, repeat);
  const fullCSS    = `background: ${cssValue};`;
  const vendorCSS  = `background: ${buildCSS(type,angle,stops,repeat,"-webkit-")};\nbackground: ${cssValue};`;
  const tailwindCSS= `style={{ background: "${cssValue}" }}`;

  const copyCSS = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  };

  /* ── stop manipulation ── */
  const updateStop = (id, key, val) =>
    setStops(s => s.map(st => st.id===id ? {...st,[key]:val} : st));

  const addStop = (e) => {
    if(!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pos  = Math.round(((e.clientX-rect.left)/rect.width)*100);
    const sorted = [...stops].sort((a,b)=>a.pos-b.pos);
    // interpolate color at click position
    let color = "#888888";
    for(let i=0;i<sorted.length-1;i++){
      if(pos>=sorted[i].pos && pos<=sorted[i+1].pos){
        color = sorted[i].color;
        break;
      }
    }
    const ns = [...stops, {id:uid(), color, pos: Math.min(100,Math.max(0,pos))}];
    setStops(ns);
  };

  const removeStop = (id) => {
    if(stops.length<=2) return;
    setStops(s=>s.filter(st=>st.id!==id));
    if(activeStop===id) setActiveStop(null);
  };

  const applyPreset = (p) => {
    setStops(p.stops.map(s=>({...s,id:uid()})));
    setType("linear");
    setAngle(135);
  };

  /* ── drag stops on track ── */
  const startDrag = (e, id) => {
    e.preventDefault();
    dragRef.current = id;
    setActiveStop(id);
    const move = (ev) => {
      if(!trackRef.current||!dragRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pos  = Math.round(Math.min(100,Math.max(0,((ev.clientX-rect.left)/rect.width)*100)));
      updateStop(dragRef.current,"pos",pos);
    };
    const up = () => { dragRef.current=null; window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); };
    window.addEventListener("mousemove",move);
    window.addEventListener("mouseup",up);
  };

  const activeStopData = stops.find(s=>s.id===activeStop) || stops[0];

  /* ── angle presets ── */
  const ANGLE_PRESETS = [0,45,90,135,180,225,270,315];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        input[type=color]{ -webkit-appearance:none; border:none; background:none; padding:0; width:100%; height:100%; cursor:pointer; border-radius:inherit; }
        input[type=color]::-webkit-color-swatch-wrapper{ padding:0; }
        input[type=color]::-webkit-color-swatch{ border:none; border-radius:inherit; }
        input[type=range]{ -webkit-appearance:none; background:transparent; cursor:pointer; }
        input[type=range]::-webkit-slider-runnable-track{ height:3px; border-radius:3px; background:#e5e7eb; }
        input[type=range]::-webkit-slider-thumb{ -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#111827; border:2px solid #fff; box-shadow:0 0 0 1px #d1d5db; margin-top:-6.5px; }
        .stop-handle{ position:absolute; top:50%; transform:translate(-50%,-50%); width:20px; height:20px; border-radius:50%; border:2.5px solid #fff; box-shadow:0 0 0 1.5px rgba(0,0,0,.25), 0 2px 6px rgba(0,0,0,.2); cursor:grab; transition:transform .1s; z-index:2; }
        .stop-handle:hover{ transform:translate(-50%,-50%) scale(1.2); }
        .stop-handle.active{ transform:translate(-50%,-50%) scale(1.25); box-shadow:0 0 0 2px #6366f1, 0 2px 8px rgba(0,0,0,.3); }
        .track-click{ cursor:crosshair; }
        @keyframes fadeIn{ from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        .fade-in{ animation:fadeIn .18s ease; }
        .angle-wheel { position:relative; width:48px; height:48px; border-radius:50%; border:1.5px solid #e5e7eb; cursor:pointer; }
        .angle-needle{ position:absolute; top:50%; left:50%; width:2px; height:40%; background:#4f46e5; border-radius:2px; transform-origin:bottom center; }
        .preview-checker {
          background-image: linear-gradient(45deg,#e5e7eb 25%,transparent 25%),
                            linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),
                            linear-gradient(45deg,transparent 75%,#e5e7eb 75%),
                            linear-gradient(-45deg,transparent 75%,#e5e7eb 75%);
          background-size:16px 16px;
          background-position:0 0,0 8px,8px -8px,-8px 0;
        }
        .code-block { font-family:'Courier New',monospace; font-size:12px; line-height:1.7; }
      `}</style>

      <div className="gg min-h-screen bg-gray-50 flex flex-col">

        {/* ── NAV ── */}
        <nav className="bg-white border-b border-gray-100 h-14 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* logo: gradient circle */}
            <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{background:"linear-gradient(135deg,#6366f1,#ec4899)"}} />
            <span className="font-bold text-[15px] tracking-tight text-gray-900">GradientLab</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full">Free</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="hidden sm:block">Live CSS generator · No signup</span>
            <button className="bg-gray-900 text-white text-[13px] font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors border-0 cursor-pointer">
              Get Pro
            </button>
          </div>
        </nav>

        {/* ── BODY ── */}
        <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">

          {/* ════ LEFT PANEL ════ */}
          <div className="w-full lg:w-[360px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-y-auto">

            {/* gradient type tabs */}
            <div className="px-5 pt-5 pb-3">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block mb-2">Type</label>
              <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
                {TYPES.map(t=>(
                  <button key={t} onClick={()=>setType(t)}
                    className={`flex-1 py-1.5 rounded-lg text-[12px] font-semibold capitalize cursor-pointer transition-all border-0
                      ${type===t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700 bg-transparent"}`}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-50 mx-5" />

            {/* ── STOP TRACK ── */}
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Color Stops</label>
                <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                  Click track to add · {stops.length} stops
                </span>
              </div>

              {/* track */}
              <div className="relative h-10 mb-4">
                {/* checker + gradient */}
                <div
                  ref={trackRef}
                  className="track-click absolute inset-0 rounded-xl overflow-hidden"
                  onClick={addStop}
                >
                  <div className="preview-checker absolute inset-0 rounded-xl" />
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `linear-gradient(90deg, ${[...stops].sort((a,b)=>a.pos-b.pos).map(s=>`${s.color} ${s.pos}%`).join(", ")})` }}
                  />
                </div>
                {/* stop handles */}
                {stops.map(stop=>(
                  <div
                    key={stop.id}
                    className={`stop-handle ${activeStop===stop.id?"active":""}`}
                    style={{ left:`${stop.pos}%`, background:stop.color }}
                    onMouseDown={e=>startDrag(e,stop.id)}
                    onDoubleClick={()=>removeStop(stop.id)}
                    onClick={e=>{e.stopPropagation(); setActiveStop(stop.id);}}
                    title="Drag to move · Double-click to remove"
                  />
                ))}
              </div>

              {/* active stop editor */}
              {activeStopData && (
                <div className="fade-in bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                      <input type="color" value={activeStopData.color}
                        onChange={e=>updateStop(activeStopData.id,"color",e.target.value)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-gray-600">Position</span>
                        <span className="text-[11px] font-bold text-gray-900">{activeStopData.pos}%</span>
                      </div>
                      <input type="range" min="0" max="100"
                        className="w-full"
                        value={activeStopData.pos}
                        onChange={e=>updateStop(activeStopData.id,"pos",+e.target.value)} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={activeStopData.color.toUpperCase()}
                      onChange={e=>{ if(/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) updateStop(activeStopData.id,"color",e.target.value); }}
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] font-mono text-gray-700 outline-none focus:border-indigo-400"
                    />
                    <button onClick={()=>removeStop(activeStopData.id)} disabled={stops.length<=2}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors cursor-pointer
                        ${stops.length<=2 ? "opacity-30 cursor-not-allowed bg-gray-50 border-gray-100 text-gray-400" : "bg-red-50 border-red-100 text-red-400 hover:bg-red-100"}`}
                    >Remove</button>
                  </div>
                </div>
              )}

              {/* all stops list */}
              <div className="mt-3 flex flex-col gap-1.5">
                {[...stops].sort((a,b)=>a.pos-b.pos).map(stop=>(
                  <button key={stop.id} onClick={()=>setActiveStop(stop.id)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left cursor-pointer transition-all border
                      ${activeStop===stop.id ? "bg-indigo-50 border-indigo-200" : "bg-gray-50 border-transparent hover:border-gray-200"}`}
                  >
                    <div className="w-4 h-4 rounded border border-gray-200 flex-shrink-0" style={{background:stop.color}} />
                    <span className="text-[11px] font-mono text-gray-600">{stop.color.toUpperCase()}</span>
                    <span className="ml-auto text-[11px] font-semibold text-gray-400">{stop.pos}%</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-50 mx-5" />

            {/* ── DIRECTION (linear/conic) ── */}
            {(type==="linear"||type==="conic") && (
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                    {type==="conic"?"Start Angle":"Direction"}
                  </label>
                  <span className="text-[11px] font-bold text-gray-700">{angle}°</span>
                </div>
                {/* angle wheel + slider */}
                <div className="flex items-center gap-4 mb-3">
                  {/* visual wheel */}
                  <div
                    className="angle-wheel flex-shrink-0"
                    onClick={(e)=>{
                      const r=e.currentTarget.getBoundingClientRect();
                      const cx=r.left+r.width/2, cy=r.top+r.height/2;
                      const deg = Math.round(Math.atan2(e.clientX-cx,-(e.clientY-cy))*(180/Math.PI)+180)%360;
                      setAngle(deg);
                    }}
                  >
                    <div className="angle-needle" style={{transform:`translateX(-50%) rotate(${angle-180}deg)`, left:"50%", bottom:"50%"}} />
                    <div className="absolute inset-0 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    </div>
                  </div>
                  <input type="range" min="0" max="359" value={angle} onChange={e=>setAngle(+e.target.value)} className="flex-1" />
                </div>
                {/* angle quick picks */}
                <div className="grid grid-cols-8 gap-1">
                  {ANGLE_PRESETS.map(a=>(
                    <button key={a} onClick={()=>setAngle(a)}
                      className={`py-1 rounded-lg text-[10px] font-semibold cursor-pointer border transition-all
                        ${angle===a ? "bg-gray-900 text-white border-gray-900" : "bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-300"}`}
                    >{a}°</button>
                  ))}
                </div>
              </div>
            )}

            {/* ── OPTIONS ── */}
            <div className="px-5 py-4">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block mb-3">Options</label>
              <div
                onClick={()=>setRepeat(!repeat)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl border cursor-pointer transition-all select-none
                  ${repeat ? "bg-indigo-50 border-indigo-200" : "bg-gray-50 border-gray-100 hover:border-gray-200"}`}
              >
                <span className="text-[13px] font-medium text-gray-700">Repeating gradient</span>
                <div className={`relative w-9 h-5 rounded-full transition-colors ${repeat?"bg-indigo-500":"bg-gray-200"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${repeat?"left-4":"left-0.5"}`} />
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-50 mx-5" />

            {/* ── PRESETS ── */}
            <div className="px-5 py-4">
              <button onClick={()=>setShowPresets(!showPresets)}
                className="flex items-center justify-between w-full cursor-pointer bg-transparent border-0 mb-3"
              >
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 cursor-pointer">Presets</label>
                <span className="text-gray-400 text-sm">{showPresets?"▲":"▼"}</span>
              </button>
              {showPresets && (
                <div className="grid grid-cols-3 gap-2 fade-in">
                  {PRESETS.map(p=>(
                    <button key={p.name} onClick={()=>applyPreset(p)}
                      className="group relative rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-indigo-400 transition-all"
                      style={{height:52}}
                    >
                      <div className="absolute inset-0" style={{background:`linear-gradient(135deg, ${p.stops.map(s=>`${s.color} ${s.pos}%`).join(", ")})`}} />
                      <div className="absolute inset-0 flex items-end p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{background:"linear-gradient(to top, rgba(0,0,0,.5), transparent)"}}>
                        <span className="text-white text-[9px] font-semibold leading-tight">{p.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ════ RIGHT PANEL ════ */}
          <div className="flex-1 flex flex-col min-h-[500px] lg:min-h-0">

            {/* ── BIG PREVIEW ── */}
            <div className="flex-1 relative min-h-[280px]">
              <div className="preview-checker absolute inset-0" />
              <div
                className="absolute inset-0 transition-all duration-300"
                style={{ background: cssValue }}
              />
              {/* overlay: CSS string */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 flex-wrap">
                <div className="bg-black/30 backdrop-blur-md rounded-xl px-4 py-2.5 max-w-full overflow-x-auto">
                  <p className="code-block text-white whitespace-nowrap">{cssValue}</p>
                </div>
                <button
                  onClick={()=>copyCSS(fullCSS)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer border-0
                    ${copied ? "bg-emerald-500 text-white" : "bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white"}`}
                >
                  {copied ? (
                    <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>Copied!</>
                  ) : (
                    <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy CSS</>
                  )}
                </button>
              </div>
            </div>

            {/* ── CSS OUTPUT PANEL ── */}
            <div className="bg-white border-t border-gray-100 p-5 flex-shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label:"CSS",       value: fullCSS,    lang:"css" },
                  { label:"With Prefix", value: vendorCSS, lang:"css" },
                  { label:"React / JSX", value: tailwindCSS,lang:"jsx" },
                ].map(({label,value,lang})=>(
                  <div key={label} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
                      <button onClick={()=>copyCSS(value)}
                        className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-700 cursor-pointer bg-transparent border-0 transition-colors"
                      >Copy</button>
                    </div>
                    <pre className="code-block text-gray-600 px-3 py-2.5 overflow-x-auto whitespace-pre-wrap break-all text-[11px] leading-relaxed">
                      {value}
                    </pre>
                  </div>
                ))}
              </div>

              {/* ── UI mock preview row ── */}
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Preview in context</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* button */}
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-center border border-gray-100">
                    <button className="px-4 py-2 rounded-lg text-white text-sm font-semibold cursor-default border-0"
                      style={{background:cssValue}}>Button</button>
                  </div>
                  {/* badge */}
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-center border border-gray-100">
                    <span className="px-3 py-1 rounded-full text-white text-xs font-bold"
                      style={{background:cssValue}}>Badge</span>
                  </div>
                  {/* card header */}
                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <div className="h-8" style={{background:cssValue}} />
                    <div className="p-2">
                      <div className="h-1.5 bg-gray-200 rounded w-3/4 mb-1" />
                      <div className="h-1.5 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                  {/* text gradient */}
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-center border border-gray-100">
                    <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent"
                      style={{backgroundImage:cssValue}}>Text</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}