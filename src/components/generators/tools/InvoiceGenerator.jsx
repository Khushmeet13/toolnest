import { useState, useRef } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 3.5h9M5 3.5V2.5A.5.5 0 015.5 2h2a.5.5 0 01.5.5v1M10 3.5l-.5 7a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5L3 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2v7M4.5 6.5L7 9l2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const PrintIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="3" y="1.5" width="8" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M3 5.5H1.5A.5.5 0 001 6v4a.5.5 0 00.5.5H3M11 5.5h1.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <rect x="3" y="7.5" width="8" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5 9.5h4M5 11h2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (n, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n || 0);

const today = () => new Date().toISOString().split("T")[0];
const dueDate = (days = 30) => {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const newItem = () => ({ id: Date.now(), desc: "", qty: 1, rate: 0, tax: 0 });

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY"];
const THEMES = [
  { key: "slate", accent: "#0f172a", light: "#f8fafc", label: "Slate" },
  { key: "blue", accent: "#1d4ed8", light: "#eff6ff", label: "Blue" },
  { key: "emerald", accent: "#065f46", light: "#ecfdf5", label: "Emerald" },
  { key: "rose", accent: "#9f1239", light: "#fff1f2", label: "Rose" },
  { key: "amber", accent: "#92400e", light: "#fffbeb", label: "Amber" },
];

// ── Invoice Preview Component ──────────────────────────────────────────────────
function InvoicePreview({ data, theme }) {
  const { accent, light } = theme;
  const subtotal = data.items.reduce((s, i) => s + i.qty * i.rate, 0);
  const taxTotal = data.items.reduce((s, i) => s + (i.qty * i.rate * i.tax) / 100, 0);
  const discount = (subtotal * (data.discount || 0)) / 100;
  const total = subtotal + taxTotal - discount;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-sm text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header band */}
      <div className="px-10 py-8 flex justify-between items-start" style={{ background: accent, color: "#fff" }}>
        <div>
          {data.logo ? (
            <img src={data.logo} alt="logo" className="h-10 mb-3 object-contain" />
          ) : (
            <div className="text-[22px] font-black tracking-tight mb-1">{data.fromName || "Your Company"}</div>
          )}
          <div className="text-[12px] opacity-70 leading-relaxed whitespace-pre-line">{data.fromAddress}</div>
          {data.fromEmail && <div className="text-[12px] opacity-70 mt-1">{data.fromEmail}</div>}
        </div>
        <div className="text-right">
          <div className="text-[28px] font-black tracking-tight opacity-90">INVOICE</div>
          <div className="text-[12px] opacity-60 mt-1">#{data.invoiceNo || "001"}</div>
        </div>
      </div>

      {/* Meta row */}
      <div className="px-10 py-5 grid grid-cols-3 gap-6" style={{ background: light }}>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Bill To</div>
          <div className="font-bold text-neutral-900">{data.toName || "—"}</div>
          <div className="text-neutral-500 whitespace-pre-line text-[12px] leading-relaxed">{data.toAddress}</div>
          {data.toEmail && <div className="text-neutral-500 text-[12px]">{data.toEmail}</div>}
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Issue Date</div>
          <div className="font-semibold text-neutral-800">{data.issueDate || "—"}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-3 mb-1">Due Date</div>
          <div className="font-semibold text-neutral-800">{data.dueDate || "—"}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Amount Due</div>
          <div className="text-[26px] font-black tracking-tight" style={{ color: accent }}>{fmt(total, data.currency)}</div>
          {data.poNumber && <>
            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-3 mb-1">PO Number</div>
            <div className="font-semibold text-neutral-800">{data.poNumber}</div>
          </>}
        </div>
      </div>

      {/* Items table */}
      <div className="px-10 py-6">
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ borderBottom: `2px solid ${accent}` }}>
              {["Description", "Qty", "Rate", "Tax %", "Amount"].map((h, i) => (
                <th key={h} className={`pb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => {
              const amt = item.qty * item.rate;
              const taxAmt = (amt * item.tax) / 100;
              return (
                <tr key={item.id} className={i % 2 === 0 ? "" : ""} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td className="py-3 text-neutral-800 font-medium pr-4">{item.desc || <span className="text-neutral-300 italic">Item description</span>}</td>
                  <td className="py-3 text-right text-neutral-600">{item.qty}</td>
                  <td className="py-3 text-right text-neutral-600">{fmt(item.rate, data.currency)}</td>
                  <td className="py-3 text-right text-neutral-600">{item.tax}%</td>
                  <td className="py-3 text-right font-bold text-neutral-800">{fmt(amt + taxAmt, data.currency)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mt-5">
          <div className="w-56 space-y-1.5 text-[12px]">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span><span className="font-semibold text-neutral-700">{fmt(subtotal, data.currency)}</span>
            </div>
            {taxTotal > 0 && (
              <div className="flex justify-between text-neutral-500">
                <span>Tax</span><span className="font-semibold text-neutral-700">{fmt(taxTotal, data.currency)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-neutral-500">
                <span>Discount ({data.discount}%)</span><span className="font-semibold text-rose-500">−{fmt(discount, data.currency)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t-2 text-[14px]" style={{ borderColor: accent }}>
              <span className="font-black text-neutral-900">Total</span>
              <span className="font-black" style={{ color: accent }}>{fmt(total, data.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes & footer */}
      {(data.notes || data.terms) && (
        <div className="px-10 pb-8 grid grid-cols-2 gap-6">
          {data.notes && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">Notes</div>
              <div className="text-neutral-500 text-[12px] leading-relaxed">{data.notes}</div>
            </div>
          )}
          {data.terms && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">Payment Terms</div>
              <div className="text-neutral-500 text-[12px] leading-relaxed">{data.terms}</div>
            </div>
          )}
        </div>
      )}

      {/* Accent footer strip */}
      <div className="h-1.5 w-full" style={{ background: accent }} />
    </div>
  );
}

// ── Input helpers ──────────────────────────────────────────────────────────────
const Input = ({ label, value, onChange, type = "text", placeholder = "", rows }) => (
  <div className="mb-4">
    {label && <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">{label}</label>}
    {rows ? (
      <textarea
        value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full text-[13px] font-medium px-3 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 outline-none focus:border-neutral-400 focus:bg-white transition-colors resize-none"
      />
    ) : (
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full text-[13px] font-medium px-3 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 outline-none focus:border-neutral-400 focus:bg-white transition-colors"
      />
    )}
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export default function InvoiceGenerator() {
  const [view, setView] = useState("edit"); // "edit" | "preview"
  const [themeKey, setThemeKey] = useState("slate");
  const theme = THEMES.find(t => t.key === themeKey);

  const [data, setData] = useState({
    fromName: "", fromAddress: "", fromEmail: "", logo: "",
    toName: "", toAddress: "", toEmail: "",
    invoiceNo: "INV-001", poNumber: "",
    issueDate: today(), dueDate: dueDate(30),
    currency: "USD",
    items: [newItem()],
    discount: 0, notes: "", terms: "Payment due within 30 days.",
  });

  const set = (key) => (val) => setData(d => ({ ...d, [key]: val }));

  const setItem = (id, key, val) =>
    setData(d => ({ ...d, items: d.items.map(i => i.id === id ? { ...i, [key]: val } : i) }));

  const addItem = () => setData(d => ({ ...d, items: [...d.items, newItem()] }));
  const removeItem = (id) => setData(d => ({ ...d, items: d.items.filter(i => i.id !== id) }));

  const subtotal = data.items.reduce((s, i) => s + i.qty * i.rate, 0);
  const taxTotal = data.items.reduce((s, i) => s + (i.qty * i.rate * i.tax) / 100, 0);
  const discount = (subtotal * (data.discount || 0)) / 100;
  const total = subtotal + taxTotal - discount;

  const handlePrint = () => {
    setView("preview");
    setTimeout(() => window.print(), 400);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setData(d => ({ ...d, logo: reader.result }));
    reader.readAsDataURL(file);
  };

  const sectionHead = (title) => (
    <div className="flex items-center gap-2 mb-4 mt-2">
      <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400">{title}</span>
      <div className="flex-1 h-px bg-neutral-100" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-16 text-neutral-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        .fade-up { animation: fadeUp 0.25s ease forwards; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-area { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <div className="no-print max-w-2xl mx-auto text-center px-6">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-cyan-600 bg-blue-50 px-3 py-1.5 rounded-full mb-4 tracking-wide">
          🧾 Invoice Generator
        </span>
        <h1 className="text-4xl font-medium  text-neutral-950 mb-2.5">
          Create professiona <span className="text-cyan-600">invoices</span> <br />in seconds
        </h1>
        <p className="text-[14px] text-neutral-400">Fill in the form, see a live preview, then print or download as PDF.</p>
      </div>

      <div className="flex items-center gap-2 justify-end max-w-6xl mx-auto py-5">

        <button onClick={() => setView(v => v === "edit" ? "preview" : "edit")}
          className="flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
          {view === "edit" ? <><EyeIcon /> Preview</> : <><EditIcon /> Edit</>}
        </button>
        <button onClick={handlePrint}
          className="flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
          <PrintIcon /> Print / PDF
        </button>
        <button className="flex items-center gap-1.5 text-[13px] font-bold px-3.5 py-1.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors">
          <DownloadIcon /> Download
        </button>
      </div>

      {/* ── Layout ── */}
      <div className="max-w-[1200px] mx-auto px-5">

        {view === "edit" ? (
          <div className="grid gap-6 items-start" style={{ gridTemplateColumns: "380px 1fr" }}>

            {/* ── Left: Form ── */}
            <div className="no-print space-y-4">

              {/* Theme picker */}
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                <div className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3">Invoice Theme</div>
                <div className="flex gap-2">
                  {THEMES.map(t => (
                    <button key={t.key} onClick={() => setThemeKey(t.key)}
                      title={t.label}
                      className={["w-8 h-8 rounded-full border-2 transition-all", themeKey === t.key ? "border-neutral-900 scale-110" : "border-transparent"].join(" ")}
                      style={{ background: t.accent }}
                    />
                  ))}
                </div>
              </div>

              {/* From */}
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm fade-up">
                {sectionHead("From (Your Business)")}

                {/* Logo upload */}
                <div className="mb-4">
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">Logo (optional)</label>
                  <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 rounded-lg border border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 transition-colors">
                    {data.logo ? (
                      <img src={data.logo} className="h-8 object-contain" alt="logo preview" />
                    ) : (
                      <span className="text-[12px] text-neutral-400">Click to upload logo</span>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                </div>

                <Input label="Business Name" value={data.fromName} onChange={set("fromName")} placeholder="Acme Corp" />
                <Input label="Address" value={data.fromAddress} onChange={set("fromAddress")} placeholder={"123 Main St\nCity, State 10001"} rows={2} />
                <Input label="Email" value={data.fromEmail} onChange={set("fromEmail")} placeholder="billing@acme.com" />
              </div>

              {/* To */}
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm fade-up">
                {sectionHead("Bill To (Client)")}
                <Input label="Client Name" value={data.toName} onChange={set("toName")} placeholder="Client Ltd." />
                <Input label="Address" value={data.toAddress} onChange={set("toAddress")} placeholder={"456 Client Ave\nCity, State 20002"} rows={2} />
                <Input label="Email" value={data.toEmail} onChange={set("toEmail")} placeholder="accounts@client.com" />
              </div>



              {/* Notes */}
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm fade-up">
                {sectionHead("Notes & Terms")}
                <Input label="Notes" value={data.notes} onChange={set("notes")} placeholder="Thank you for your business!" rows={2} />
                <Input label="Payment Terms" value={data.terms} onChange={set("terms")} placeholder="Payment due within 30 days." rows={2} />
              </div>
            </div>

            {/* ── Right: Items + Preview ── */}
            <div className="space-y-5">

              {/* Line Items */}
              <div className="no-print bg-white border border-neutral-200 rounded-xl p-6 shadow-sm fade-up">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400">Line Items</span>
                  <button onClick={addItem}
                    className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors">
                    <PlusIcon /> Add Item
                  </button>
                </div>

                {/* Header */}
                <div className="grid text-[10px] font-bold uppercase tracking-widest text-neutral-400 pb-2 border-b border-neutral-100"
                  style={{ gridTemplateColumns: "1fr 60px 90px 60px 28px" }}>
                  <span>Description</span>
                  <span className="text-center">Qty</span>
                  <span className="text-center">Rate</span>
                  <span className="text-center">Tax %</span>
                  <span></span>
                </div>

                {/* Items */}
                <div className="space-y-2 mt-2">
                  {data.items.map((item, idx) => (
                    <div key={item.id} className="grid items-center gap-2 fade-up"
                      style={{ gridTemplateColumns: "1fr 60px 90px 60px 28px", animationDelay: `${idx * 0.05}s` }}>
                      <input value={item.desc} onChange={e => setItem(item.id, "desc", e.target.value)}
                        placeholder={`Item ${idx + 1}`}
                        className="text-[13px] font-medium px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 outline-none focus:border-neutral-400 focus:bg-white transition-colors w-full" />
                      <input type="number" value={item.qty} onChange={e => setItem(item.id, "qty", parseFloat(e.target.value) || 0)} min="0"
                        className="text-[13px] font-semibold px-2 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 outline-none focus:border-neutral-400 focus:bg-white transition-colors text-center w-full" />
                      <input type="number" value={item.rate} onChange={e => setItem(item.id, "rate", parseFloat(e.target.value) || 0)} min="0" step="0.01"
                        className="text-[13px] font-semibold px-2 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 outline-none focus:border-neutral-400 focus:bg-white transition-colors text-center w-full" />
                      <input type="number" value={item.tax} onChange={e => setItem(item.id, "tax", parseFloat(e.target.value) || 0)} min="0" max="100"
                        className="text-[13px] font-semibold px-2 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 outline-none focus:border-neutral-400 focus:bg-white transition-colors text-center w-full" />
                      <button onClick={() => removeItem(item.id)} disabled={data.items.length === 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-300 hover:text-rose-400 hover:bg-rose-50 transition-colors disabled:opacity-20">
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Totals summary */}
                <div className="flex justify-end mt-6 pt-4 border-t border-neutral-100">
                  <div className="space-y-1.5 text-[13px] w-52">
                    <div className="flex justify-between text-neutral-500">
                      <span>Subtotal</span>
                      <span className="font-semibold text-neutral-700">{fmt(subtotal, data.currency)}</span>
                    </div>
                    {taxTotal > 0 && (
                      <div className="flex justify-between text-neutral-500">
                        <span>Tax</span>
                        <span className="font-semibold text-neutral-700">{fmt(taxTotal, data.currency)}</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-neutral-500">
                        <span>Discount ({data.discount}%)</span>
                        <span className="font-semibold text-rose-500">−{fmt(discount, data.currency)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-neutral-200 text-[15px] font-black">
                      <span className="text-neutral-900">Total</span>
                      <span style={{ color: theme.accent }}>{fmt(total, data.currency)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="print-area fade-up">
                <div className="no-print flex items-center gap-2 mb-3">
                  <EyeIcon />
                  <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400">Live Preview</span>
                </div>
                <InvoicePreview data={data} theme={theme} />

                {/* Invoice Details */}
                <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm fade-up mt-5">
                  {sectionHead("Invoice Details")}
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Invoice No." value={data.invoiceNo} onChange={set("invoiceNo")} placeholder="INV-001" />
                    <Input label="PO Number" value={data.poNumber} onChange={set("poNumber")} placeholder="Optional" />
                    <Input label="Issue Date" type="date" value={data.issueDate} onChange={set("issueDate")} />
                    <Input label="Due Date" type="date" value={data.dueDate} onChange={set("dueDate")} />
                  </div>

                  <div className="mb-4">
                    <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">Currency</label>
                    <div className="relative">
                      <select value={data.currency} onChange={e => set("currency")(e.target.value)}
                        className="w-full text-[13px] font-semibold px-3 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 appearance-none outline-none focus:border-neutral-400 focus:bg-white transition-colors pr-8">
                        {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronIcon /></span>
                    </div>
                  </div>

                  <Input label="Discount %" type="number" value={data.discount} onChange={val => set("discount")(parseFloat(val) || 0)} placeholder="0" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── Full Preview Mode ── */
          <div className="max-w-[720px] mx-auto fade-up print-area">
            <InvoicePreview data={data} theme={theme} />

          </div>

        )}


      </div>


    </div>
  );
}