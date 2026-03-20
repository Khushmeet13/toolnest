// SkeletonBuilder.jsx
// Full custom skeleton builder — add, reorder, configure each element, export code
// Requires Tailwind CSS + skeleton CSS in your global stylesheet (see bottom)

import { useState, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const ELEMENT_TYPES = [
  { key: "line", icon: "—", label: "Line" },
  { key: "title", icon: "T", label: "Title" },
  { key: "rect", icon: "▭", label: "Rect" },
  { key: "circle", icon: "●", label: "Circle" },
  { key: "avatar", icon: "👤", label: "Avatar" },
  { key: "image", icon: "🖼", label: "Image" },
  { key: "button", icon: "⬜", label: "Button" },
  { key: "row", icon: "≡", label: "Row" },
];

const ANIMATIONS = ["shimmer", "pulse", "wave", "none"];
const COLOR_THEMES = [
  { key: "default", bg: "#e2e8f0" },
  { key: "dark", bg: "#334155" },
  { key: "blue", bg: "#dbeafe" },
  { key: "green", bg: "#d1fae5" },
  { key: "rose", bg: "#ffe4e6" },
];

const DEFAULTS = {
  line: { type: "line", width: 80, height: 12, radius: 4, label: "Text line" },
  title: { type: "title", width: 60, height: 20, radius: 4, label: "Title" },
  rect: { type: "rect", width: 100, height: 80, radius: 8, label: "Rectangle" },
  circle: { type: "circle", width: 48, height: 48, radius: 50, label: "Circle" },
  avatar: { type: "avatar", width: 44, height: 44, radius: 50, label: "Avatar" },
  image: { type: "image", width: 100, height: 160, radius: 8, label: "Image" },
  button: { type: "button", width: 40, height: 36, radius: 8, label: "Button" },
  row: { type: "row", width: 100, height: 12, radius: 4, label: "Row", cols: 3, colGap: 8 },
};

let _idCounter = 0;
const uid = () => ++_idCounter;

// ─── Skeleton Block ───────────────────────────────────────────────────────────
function SkBlock({ anim, color, width, height, radius, style = {} }) {
  const colorCls = color === "default" ? "" : `sk-${color}`;
  const animCls = anim === "none" ? "sk-static" : `sk-${anim}`;
  return (
    <div
      className={`sk-b ${animCls} ${colorCls}`}
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

// ─── Rendered Element ─────────────────────────────────────────────────────────
function RenderedElem({ el, anim, color }) {
  const isCircle = el.type === "circle" || el.type === "avatar";
  const w = isCircle ? el.width : `${el.width}%`;

  if (el.type === "row") {
    return (
      <div className="flex" style={{ gap: el.colGap || 8 }}>
        {Array.from({ length: el.cols || 3 }).map((_, i) => (
          <SkBlock key={i} anim={anim} color={color} width="100%" height={el.height} radius={el.radius} style={{ flex: 1 }} />
        ))}
      </div>
    );
  }
  return <SkBlock anim={anim} color={color} width={w} height={el.height} radius={el.radius} />;
}

// ─── Element Row on Canvas ────────────────────────────────────────────────────
function ElemRow({ el, index, total, anim, color, gap, selected, onSelect, onDelete, onMove, onUpdate }) {
  return (
    <div
      className={`relative cursor-pointer rounded group ${selected ? "ring-2 ring-blue-400" : "hover:ring-2 hover:ring-blue-200"}`}
      style={{ marginBottom: index < total - 1 ? gap : 0 }}
      onClick={() => onSelect(el.id)}
    >
      {/* Action Buttons */}
      <div className={`absolute -top-6 right-0 flex gap-1 z-10 ${selected ? "flex" : "hidden group-hover:flex"}`}>
        {index > 0 && (
          <button
            className="w-5 h-5 bg-gray-500 text-white rounded text-[10px] flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); onMove(el.id, -1); }}
          >↑</button>
        )}
        {index < total - 1 && (
          <button
            className="w-5 h-5 bg-gray-500 text-white rounded text-[10px] flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); onMove(el.id, 1); }}
          >↓</button>
        )}
        <button
          className="w-5 h-5 bg-red-400 text-white rounded text-[10px] flex items-center justify-center"
          onClick={(e) => { e.stopPropagation(); onDelete(el.id); }}
        >×</button>
      </div>
      <RenderedElem el={el} anim={anim} color={color} />
    </div>
  );
}

// ─── Properties Panel ─────────────────────────────────────────────────────────
function PropsPanel({ el, onUpdate, onDelete }) {
  if (!el) return (
    <div className="text-center py-10 text-xs text-gray-400">
      Select an element<br />to edit its properties
    </div>
  );

  const isCircle = el.type === "circle" || el.type === "avatar";
  const isRow = el.type === "row";

  const ctrl = (label, key, min, max, valSuffix = "px", step = 1, syncKey = null) => (
    <div className="flex flex-col gap-1 mb-3">
      <div className="flex justify-between">
        <label className="text-[11px] text-gray-500">{label}</label>
        <span className="text-[11px] font-medium text-gray-800">{el[key]}{valSuffix}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={el[key]}
        className="w-full accent-blue-500"
        onChange={(e) => {
          onUpdate(el.id, key, Number(e.target.value));
          if (syncKey) onUpdate(el.id, syncKey, Number(e.target.value));
        }}
      />
    </div>
  );

  return (
    <div>
      <div className="text-xs font-medium text-gray-800 mb-3 pb-2 border-b border-gray-100">
        {el.label} <span className="text-gray-400 font-normal">#{el.id}</span>
      </div>
      <div className="flex flex-col gap-1 mb-3">
        <label className="text-[11px] text-gray-500">Label</label>
        <input
          type="text" value={el.label}
          onChange={(e) => onUpdate(el.id, "label", e.target.value)}
          className="h-7 px-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>
      {isCircle
        ? ctrl("Size (px)", "width", 24, 120, "px", 1, "height")
        : ctrl("Width (%)", "width", 10, 100, "%")}
      {ctrl("Height (px)", "height", isCircle ? 24 : 4, 240)}
      {!isCircle && ctrl("Radius (px)", "radius", 0, 40)}
      {isRow && ctrl("Columns", "cols", 2, 6, "", 1)}
      {isRow && ctrl("Column gap", "colGap", 4, 24)}
      <button
        onClick={() => onDelete(el.id)}
        className="w-full mt-2 py-1.5 text-xs border border-red-200 rounded-lg text-red-400 hover:bg-red-50 transition"
      >
        Delete element
      </button>
    </div>
  );
}

// ─── Code Builders ────────────────────────────────────────────────────────────
function buildJSX(elements, anim, color, gap, pad) {
  if (!elements.length) return "// Add elements to generate code";
  const colorCls = color === "default" ? "" : ` sk-${color}`;
  const animCls = anim === "none" ? "sk-static" : `sk-${anim}`;
  const skCls = `sk-b ${animCls}${colorCls}`;
  const lines = [
    `function SkeletonBlock({ width, height, radius, style = {} }) {`,
    `  return (`,
    `    <div className="${skCls}" style={{ width, height, borderRadius: radius, ...style }} />`,
    `  );`,
    `}`,
    ``,
    `export default function SkeletonLoader() {`,
    `  return (`,
    `    <div style={{ display: 'flex', flexDirection: 'column', gap: ${gap}, padding: ${pad} }}>`,
  ];
  elements.forEach((el) => {
    lines.push(`      {/* ${el.label} */}`);
    if (el.type === "row") {
      lines.push(`      <div style={{ display: 'flex', gap: ${el.colGap || 8} }}>`);
      Array.from({ length: el.cols || 3 }).forEach(() =>
        lines.push(`        <SkeletonBlock width="100%" height={${el.height}} radius={${el.radius}} style={{ flex: 1 }} />`)
      );
      lines.push(`      </div>`);
    } else {
      const isCircle = el.type === "circle" || el.type === "avatar";
      const w = isCircle ? el.width : `"${el.width}%"`;
      lines.push(`      <SkeletonBlock width={${w}} height={${el.height}} radius={${el.radius}} />`);
    }
  });
  lines.push(`    </div>`);
  lines.push(`  );`);
  lines.push(`}`);
  return lines.join("\n");
}

function buildHTML(elements, anim, color, gap, pad) {
  if (!elements.length) return "<!-- Add elements to generate code -->";
  const colorCls = color === "default" ? "" : ` sk-${color}`;
  const animCls = anim === "none" ? "sk-static" : `sk-${anim}`;
  const skCls = `sk-b ${animCls}${colorCls}`;
  const css = `/* ── Add to global CSS ── */
@keyframes shimmer { 0% { background-position: -500px 0 } 100% { background-position: 500px 0 } }
@keyframes pulse   { 0%, 100% { opacity: 1 } 50% { opacity: .35 } }
@keyframes wave    { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } }
.sk-b { position: relative; overflow: hidden; }
.sk-shimmer { background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%); background-size: 800px 100%; animation: shimmer 1.6s infinite linear; }
.sk-pulse   { background: #e2e8f0; animation: pulse 1.8s ease-in-out infinite; }
.sk-wave    { background: #e2e8f0; }
.sk-wave::after { content:''; display:block; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent); animation:wave 1.6s infinite; }
.sk-static  { background: #e2e8f0; }

`;
  let html = `<div style="display:flex;flex-direction:column;gap:${gap}px;padding:${pad}px;">\n`;
  elements.forEach((el) => {
    html += `  <!-- ${el.label} -->\n`;
    if (el.type === "row") {
      html += `  <div style="display:flex;gap:${el.colGap || 8}px;">\n`;
      Array.from({ length: el.cols || 3 }).forEach(() => {
        html += `    <div class="${skCls}" style="flex:1;height:${el.height}px;border-radius:${el.radius}px;"></div>\n`;
      });
      html += `  </div>\n`;
    } else {
      const isCircle = el.type === "circle" || el.type === "avatar";
      const w = isCircle ? `${el.width}px` : `${el.width}%`;
      html += `  <div class="${skCls}" style="width:${w};height:${el.height}px;border-radius:${el.radius}px;"></div>\n`;
    }
  });
  html += `</div>`;
  return css + html;
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`w-8 h-[18px] rounded-full transition-colors ${checked ? "bg-blue-500" : "bg-gray-300"}`}>
        <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-[14px]" : "translate-x-0"}`} />
      </div>
    </label>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SkeletonBuilder() {
  const [elements, setElements] = useState([]);
  const [selected, setSelected] = useState(null);
  const [anim, setAnim] = useState("shimmer");
  const [color, setColor] = useState("default");
  const [gap, setGap] = useState(10);
  const [pad, setPad] = useState(20);
  const [repeat, setRepeat] = useState(false);
  const [tab, setTab] = useState("canvas");
  const [copied, setCopied] = useState(false);

  const addElem = useCallback((type) => {
    const el = { ...DEFAULTS[type], id: uid() };
    setElements((prev) => [...prev, el]);
    setSelected(el.id);
  }, []);

  const deleteElem = useCallback((id) => {
    setElements((prev) => prev.filter((e) => e.id !== id));
    setSelected((s) => s === id ? null : s);
  }, []);

  const moveElem = useCallback((id, dir) => {
    setElements((prev) => {
      const arr = [...prev];
      const i = arr.findIndex((e) => e.id === id);
      const ni = i + dir;
      if (ni < 0 || ni >= arr.length) return arr;
      [arr[i], arr[ni]] = [arr[ni], arr[i]];
      return arr;
    });
  }, []);

  const updateProp = useCallback((id, key, val) => {
    setElements((prev) => prev.map((e) => e.id === id ? { ...e, [key]: val } : e));
  }, []);

  const selectedEl = elements.find((e) => e.id === selected) || null;

  const canvasBg = color === "dark" ? "#1e293b" : "white";

  const copy = () => {
    const code = tab === "jsx" ? buildJSX(elements, anim, color, gap, pad) : buildHTML(elements, anim, color, gap, pad);
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  };

  return (
    <div className=" py-16 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-3 mb-1">
            <h1 className="text-4xl font-medium text-gray-900">
              Skeleton Loader Builder
            </h1>
            <span className="text-xs bg-blue-100 text-cyan-600 px-2 py-0.5 rounded font-medium">
              Custom
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-6 max-w-xl mx-auto">
            Add elements, configure each one individually, then export React or HTML+CSS code.
          </p>
        </div>

        <div className="grid grid-cols-[220px_1fr_230px] gap-3 items-start">
          {/* ── LEFT PANEL ── */}
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-3">Add Element</p>
              <div className="grid grid-cols-2 gap-1.5">
                {ELEMENT_TYPES.map(({ key, icon, label }) => (
                  <button
                    key={key}
                    onClick={() => addElem(key)}
                    className="py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-600 hover:bg-white hover:border-gray-300 hover:text-gray-900 transition-all"
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setElements([]); setSelected(null); }}
                className="w-full mt-2 py-2 text-xs border border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-400 transition"
              >
                🗑 Clear all
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-3">Global Settings</p>

              {/* Animation */}
              <p className="text-[11px] text-gray-500 mb-2">Animation</p>
              <div className="grid grid-cols-2 gap-1.5 mb-4">
                {ANIMATIONS.map((a) => (
                  <button key={a} onClick={() => setAnim(a)}
                    className={`py-1.5 text-xs rounded-lg border capitalize transition-all ${anim === a ? "border-cyan-600 text-cyan-600 bg-blue-50 font-medium" : "border-gray-200 text-gray-500 bg-gray-50 hover:bg-white"}`}
                  >{a}</button>
                ))}
              </div>

              {/* Color */}
              <p className="text-[11px] text-gray-500 mb-2">Color Theme</p>
              <div className="flex gap-2 mb-4 flex-wrap">
                {COLOR_THEMES.map((c) => (
                  <button key={c.key} title={c.key} onClick={() => setColor(c.key)}
                    className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${color === c.key ? "border-gray-600 scale-110" : "border-transparent"}`}
                    style={{ background: c.bg }}
                  />
                ))}
              </div>

              {/* Gap */}
              <div className="flex flex-col gap-1 mb-3">
                <div className="flex justify-between">
                  <label className="text-[11px] text-gray-500">Gap</label>
                  <span className="text-[11px] font-medium text-gray-800">{gap}px</span>
                </div>
                <input type="range" min={0} max={32} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>

              {/* Padding */}
              <div className="flex flex-col gap-1 mb-3">
                <div className="flex justify-between">
                  <label className="text-[11px] text-gray-500">Padding</label>
                  <span className="text-[11px] font-medium text-gray-800">{pad}px</span>
                </div>
                <input type="range" min={8} max={48} value={pad} onChange={(e) => setPad(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>

              {/* Repeat */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500">Repeat ×2 preview</span>
                <Toggle checked={repeat} onChange={(e) => setRepeat(e.target.checked)} />
              </div>
            </div>
          </div>

          {/* ── CENTRE ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1.5">
                {["canvas", "jsx", "html"].map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-3 py-1.5 text-xs rounded-lg border capitalize transition-all ${tab === t ? "bg-white border-gray-300 text-gray-900 font-medium shadow-sm" : "bg-transparent border-transparent text-gray-500 hover:text-gray-700"}`}
                  >
                    {t === "jsx" ? "React JSX" : t === "html" ? "HTML+CSS" : "Canvas"}
                  </button>
                ))}
              </div>
              {tab !== "canvas" && (
                <button onClick={copy}
                  className="text-xs text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition"
                >
                  {copied ? "Copied!" : "Copy code"}
                </button>
              )}
            </div>

            {/* Canvas */}
            {tab === "canvas" && (
              <>
                <div className="rounded-xl min-h-60 transition-colors duration-300" style={{ background: canvasBg, padding: pad }}>
                  {elements.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-10">Add elements from the left panel</p>
                  ) : (
                    <div>
                      {elements.map((el, i) => (
                        <ElemRow
                          key={el.id} el={el} index={i} total={elements.length}
                          anim={anim} color={color} gap={gap}
                          selected={selected === el.id}
                          onSelect={setSelected} onDelete={deleteElem}
                          onMove={moveElem} onUpdate={updateProp}
                        />
                      ))}
                      {repeat && (
                        <div style={{ marginTop: gap * 2, opacity: 0.5 }}>
                          {elements.map((el, i) => (
                            <ElemRow
                              key={`r-${el.id}`} el={el} index={i} total={elements.length}
                              anim={anim} color={color} gap={gap}
                              selected={false} onSelect={() => { }} onDelete={() => { }}
                              onMove={() => { }} onUpdate={() => { }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => addElem("line")}
                  className="w-full mt-3 py-2 text-xs border border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-blue-400 hover:text-blue-500 transition"
                >
                  + Click to add an element
                </button>
              </>
            )}

            {/* JSX Code */}
            {tab === "jsx" && (
              <div className="bg-gray-50 rounded-xl p-4 overflow-auto max-h-[480px]">
                <pre className="font-mono text-[11px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {buildJSX(elements, anim, color, gap, pad)}
                </pre>
              </div>
            )}

            {/* HTML Code */}
            {tab === "html" && (
              <div className="bg-gray-50 rounded-xl p-4 overflow-auto max-h-[480px]">
                <pre className="font-mono text-[11px] text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {buildHTML(elements, anim, color, gap, pad)}
                </pre>
              </div>
            )}
          </div>

          {/* ── RIGHT: Properties ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-3">Properties</p>
            <PropsPanel el={selectedEl} onUpdate={updateProp} onDelete={deleteElem} />
          </div>
        </div>
      </div>
    </div>
  );
}