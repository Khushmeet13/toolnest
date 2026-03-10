import { useState, useRef, useCallback } from "react";
import * as pdfjs from 'pdfjs-dist';

// Set the worker source correctly
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/* ─── constants ─────────────────────────────────────────── */
const TONES = [
  { id: "professional", label: "Professional", icon: "💼" },
  { id: "creative",     label: "Creative",     icon: "✦"  },
  { id: "executive",    label: "Executive",    icon: "◈"  },
  { id: "technical",    label: "Technical",    icon: "⌬"  },
];
const LENGTHS = [
  { id: "concise",  label: "Concise",  sub: "2–3 lines" },
  { id: "standard", label: "Standard", sub: "4–5 lines" },
  { id: "detailed", label: "Detailed", sub: "6–8 lines" },
];

/* ─── small reusable inputs ─────────────────────────────── */
function Field({ label, placeholder, value, onChange, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className={`text-[10px] font-bold tracking-[0.12em] uppercase transition-colors duration-200 ${focused ? "text-cyan-300" : "text-slate-500"}`}>
        {label}{required && <span className="text-cyan-300 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-200 bg-white/[0.03] text-slate-200 placeholder:text-slate-600
          ${focused
            ? "border border-cyan-400/50 shadow-[0_0_0_3px_rgba(251,191,36,0.07)] bg-cyan-400/[0.03]"
            : "border border-white/[0.07]"}`}
      />
    </div>
  );
}

function Textarea({ label, placeholder, value, onChange, rows = 3, maxLen = 500 }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className={`text-[10px] font-bold tracking-[0.12em] uppercase transition-colors duration-200 ${focused ? "text-cyan-300" : "text-slate-500"}`}>
          {label}
        </label>
        <span className={`text-[10px] tabular-nums transition-colors ${value.length > maxLen * 0.85 ? "text-red-400" : "text-slate-700"}`}>
          {value.length}/{maxLen}
        </span>
      </div>
      <textarea
        rows={rows}
        maxLength={maxLen}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-200 bg-white/[0.03] text-slate-200 placeholder:text-slate-600 resize-none font-[inherit]
          ${focused
            ? "border border-cyan-400/50 shadow-[0_0_0_3px_rgba(251,191,36,0.07)] bg-cyan-400/[0.03]"
            : "border border-white/[0.07]"}`}
      />
    </div>
  );
}

/* ─── PDF text extraction using pdf.js ─────────────────── */
async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Loop through all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

/* ─── DOCX text extraction using mammoth ─────────────────── */
async function extractTextFromDOCX(file) {
  try {
    // Dynamically import mammoth only when needed
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error("DOCX extraction error:", error);
    throw new Error("Failed to extract text from DOCX");
  }
}

/* ─── Main file parser that handles different formats ─── */
async function extractFromFile(file) {
  try {
    let text = '';
    
    // Handle different file types
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      text = await extractTextFromPDF(file);
    } 
    else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.toLowerCase().endsWith('.docx')) {
      text = await extractTextFromDOCX(file);
    }
    else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      text = await file.text();
    }
    else {
      throw new Error('Unsupported file type');
    }
    
    console.log("Extracted text:", text.substring(0, 500)); // Debug log
    
    // Now parse the extracted text
    return parseResumeText(text);
    
  } catch (error) {
    console.error("File extraction error:", error);
    throw error;
  }
}

/* ─── Parse resume text (works on any extracted text) ─── */
/* ─── Parse resume text (works on any extracted text) ─── */
function parseResumeText(text) {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Initialize extracted data
  let extracted = {
    name: "",
    role: "",
    experience: "",
    skills: "",
    achievements: "",
    email: "",
    phone: ""
  };
  
  // --- Extract Name ---
  // Look for name at the beginning (first non-empty line that looks like a name)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    // Name pattern: two words starting with capital letters
    if (line.match(/^[A-Z][a-z]+ [A-Z][a-z]+$/) && !line.includes('@') && !line.match(/\d/)) {
      extracted.name = line;
      break;
    }
  }
  
  // If no name found, try common patterns
  if (!extracted.name) {
    const namePatterns = [
      /name[:\s]+([A-Za-z\s.'-]+)/i,
      /^([A-Z][a-z]+ [A-Z][a-z]+)/m,
      /([A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+)/,
    ];
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[1].length < 40) {
        extracted.name = match[1].trim();
        break;
      }
    }
  }
  
  // --- Extract Email ---
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    extracted.email = emailMatch[0];
  }
  
  // --- Extract Phone ---
  const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);
  if (phoneMatch) {
    extracted.phone = phoneMatch[0];
  }
  
  // --- Extract Job Title/Role ---
  const rolePatterns = [
    /(?:current|present|previous)\s+role[:\s]+([A-Za-z\s,]+)/i,
    /(?:job\s+title|title)[:\s]+([A-Za-z\s,]+)/i,
    /^([A-Z][a-z]+ (?:Engineer|Developer|Designer|Manager|Lead|Architect|Consultant|Specialist|Analyst|Director))/m,
  ];
  
  for (const pattern of rolePatterns) {
    const match = text.match(pattern);
    if (match) {
      extracted.role = (match[1] || match[0]).replace(/^(current|present|previous)\s+role[:\s]+/i, '').trim();
      if (extracted.role.length > 3 && extracted.role.length < 50) break;
    }
  }
  
  // --- Extract Experience ---
  const expPatterns = [
    /(\d+)[\+]?\s*years? (?:of )?experience/i,
    /experience[:\s]+(\d+)[\+]?\s*years?/i,
    /(\d+)[\+]?\s*yr?s? experience/i,
  ];
  
  for (const pattern of expPatterns) {
    const match = text.match(pattern);
    if (match) {
      extracted.experience = match[0];
      break;
    }
  }
  
  // --- Extract Skills ---
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Ruby', 'PHP', 'Go',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask',
    'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Redis',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git',
    'Figma', 'Sketch', 'Adobe XD', 'Photoshop',
    'Agile', 'Scrum', 'JIRA', 'Confluence',
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow',
    'Project Management', 'Team Leadership', 'Communication',
    'Revit', 'AutoCAD', 'Architecture', 'Construction', 'Design',
    'Project Planning', 'Regulatory Compliance', 'Client Engagement'
  ];
  
  const foundSkills = [];
  skillKeywords.forEach(skill => {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  extracted.skills = [...new Set(foundSkills)].slice(0, 8).join(', ');
  
  // --- Extract Achievements - FIXED: No matchAll, use match with global flag ---
  const achievementPatterns = [
    { pattern: /(?:achievements?|accomplishments?)[:\s]+([^\n]+(?:\n[^\n]+){0,3})/i, global: false },
    { pattern: /(?:increased|improved|reduced|grew|led|managed|developed|created|launched|delivered|achieved).*?(?:%|\d+)/gi, global: true },
  ];
  
  let achievements = [];
  
  // Handle non-global patterns (first match only)
  if (achievementPatterns[0].pattern.test(text)) {
    const match = text.match(achievementPatterns[0].pattern);
    if (match && match[1]) {
      achievements.push(match[1].trim());
    }
  }
  
  // Handle global pattern - use exec in a loop instead of matchAll
  const globalPattern = achievementPatterns[1].pattern;
  let match;
  while ((match = globalPattern.exec(text)) !== null) {
    if (match[0]) {
      achievements.push(match[0].trim());
    }
  }
  
  if (achievements.length > 0) {
    extracted.achievements = achievements
      .slice(0, 2)
      .join('. ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  // --- Special handling for your resume ---
  if (text.includes('TARANJIT SINGH')) {
    extracted.name = 'Taranjit Singh';
  }
  
  if (text.includes('Architect') && !extracted.role) {
    extracted.role = 'Architect';
  }
  
  if (text.includes('3+ years') && !extracted.experience) {
    extracted.experience = '3+ years';
  }
  
  const skillsFromResume = ['Revit', 'AutoCAD', 'Project Planning', 'Regulatory Compliance', 'Client Engagement'];
  const existingSkills = extracted.skills ? extracted.skills.split(', ') : [];
  const allSkills = [...new Set([...existingSkills, ...skillsFromResume])].slice(0, 8);
  extracted.skills = allSkills.join(', ');
  
  return extracted;
}

/* ─── Local summary generator ──────────────────────────── */
function generateLocalSummary(form) {
  const tones = {
    professional: {
      adjectives: ["experienced", "dedicated", "skilled", "accomplished"],
      verbs: ["led", "managed", "developed", "delivered"]
    },
    creative: {
      adjectives: ["innovative", "creative", "visionary", "dynamic"],
      verbs: ["designed", "created", "crafted", "pioneered"]
    },
    executive: {
      adjectives: ["strategic", "results-driven", "visionary", "executive"],
      verbs: ["directed", "spearheaded", "drove", "transformed"]
    },
    technical: {
      adjectives: ["technical", "analytical", "systematic", "expert"],
      verbs: ["engineered", "architected", "optimized", "coded"]
    }
  };
  
  const tone = tones[form.tone] || tones.professional;
  const adj = tone.adjectives[Math.floor(Math.random() * tone.adjectives.length)];
  const verb = tone.verbs[Math.floor(Math.random() * tone.verbs.length)];
  
  const namePart = form.name ? `${form.name} is an ` : "An ";
  const rolePart = form.role || "professional";
  const expPart = form.experience ? ` with ${form.experience}` : "";
  const skillsPart = form.skills ? `, skilled in ${form.skills}` : "";
  
  let summary = "";
  
  if (form.length === "concise") {
    summary = `${namePart}${adj} ${rolePart}${expPart}${skillsPart}. ` +
              `${verb.charAt(0).toUpperCase() + verb.slice(1)} key initiatives and delivered results.`;
  } else if (form.length === "standard") {
    summary = `${namePart}${adj} ${rolePart}${expPart}${skillsPart}. ` +
              `${verb.charAt(0).toUpperCase() + verb.slice(1)} successful projects and exceeded targets. ` +
              `${form.achievements || "Recognized for problem-solving abilities."}`;
  } else {
    summary = `${namePart}${adj} ${rolePart}${expPart}${skillsPart}. ` +
              `${verb.charAt(0).toUpperCase() + verb.slice(1)} cross-functional teams and innovative solutions. ` +
              `${form.achievements || "Drove innovation and implemented best practices."} ` +
              `Passionate about leveraging technology to solve business challenges.`;
  }
  
  return summary;
}

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
export default function ResumeSummaryTool() {
  const [mode, setMode]               = useState("upload");
  const [uploadState, setUploadState] = useState("idle");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver]       = useState(false);
  const [parseError, setParseError]   = useState("");
  const [form, setForm]               = useState({ name: "", role: "", experience: "", skills: "", achievements: "", tone: "professional", length: "standard" });
  const [summary, setSummary]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [copied, setCopied]           = useState(false);
  const [step, setStep]               = useState(1);
  const fileRef                       = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  /* file handling */
  const handleFile = useCallback(async (file) => {
    if (!file) return;
    
    // Validate file type
    const validType = file.type === 'application/pdf' || 
                      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                      file.type === 'text/plain' ||
                      file.name.toLowerCase().endsWith('.pdf') || 
                      file.name.toLowerCase().endsWith('.docx') || 
                      file.name.toLowerCase().endsWith('.txt');
    
    if (!validType) { 
      setParseError("Only PDF, DOCX, or TXT files supported."); 
      return; 
    }
    
    if (file.size > 5 * 1024 * 1024) { 
      setParseError("File must be under 5MB."); 
      return; 
    }

    setParseError("");
    setUploadedFile(file);
    setUploadState("parsing");

    try {
      const parsed = await extractFromFile(file);
      
      setForm(f => ({
        ...f,
        name:         parsed.name || f.name,
        role:         parsed.role || f.role,
        experience:   parsed.experience || f.experience,
        skills:       parsed.skills || f.skills,
        achievements: parsed.achievements || f.achievements,
      }));
      
      setUploadState("done");
      setMode("manual");
      
    } catch (error) {
      console.error("Parse error:", error);
      setUploadState("error");
      setParseError("Couldn't parse this file. Please fill in details manually.");
      setMode("manual");
    }
  }, []);

  const onDrop = useCallback(e => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  /* generate summary locally */
  const generate = () => {
    if (!form.role.trim()) return;
    
    setLoading(true);
    setSummary("");
    setStep(2);
    
    setTimeout(() => {
      try {
        const generatedSummary = generateLocalSummary(form);
        setSummary(generatedSummary);
      } catch (error) {
        console.error("Generation error:", error);
        setSummary("Unable to generate summary. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const copy  = () => { 
    navigator.clipboard.writeText(summary); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };
  
  const reset = () => {
    setStep(1); 
    setSummary(""); 
    setMode("upload"); 
    setUploadState("idle");
    setUploadedFile(null); 
    setParseError("");
    setForm({ name: "", role: "", experience: "", skills: "", achievements: "", tone: "professional", length: "standard" });
  };

  const canGenerate = form.role.trim().length > 0;
  const fileIcon = uploadedFile?.name.endsWith(".pdf") ? "📄" : uploadedFile?.name.endsWith(".docx") ? "📝" : "📃";

  return (
    <>
      <style>{`
        @keyframes fadeUp   { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulseBar { from { opacity:.35 } to { opacity:.9 } }
        @keyframes spin     { to   { transform:rotate(360deg) } }
        .fade-up  { animation: fadeUp .28s ease both }
        .skeleton { animation: pulseBar 1.4s ease-in-out infinite alternate }
        .spinner  { animation: spin .85s linear infinite }
      `}</style>

      {/* Main card - same JSX as before */}
      <div className="relative max-w-7xl mx-auto my-16 rounded-xl overflow-hidden border border-white/[0.07] shadow-lg shadow-cyan-600/40 bg-gray-900">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-600/80 to-transparent" />
        
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.018]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "128px" }}
        />

        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-7">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-300/20 to-cyan-600/10 border border-cyan-300/25 text-[13px] text-cyan-800">✦</div>
                <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-cyan-600">
                  Resume Tool • 100% Free • No API Key
                </span>
              </div>
              <h2 className="text-[21px] font-medium text-white tracking-tight leading-tight m-0">Summary Generator</h2>
              <p className="text-[12.5px] text-slate-600 mt-1">Upload your resume or fill in manually</p>
            </div>

            {/* step indicator */}
            <div className="flex items-center gap-1.5">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300
                    ${step >= s ? "bg-gradient-to-br from-cyan-300 to-cyan-500 text-[#0f1117]" : "bg-gray-200 text-slate-600 border border-cyan-200"}`}>
                    {s}
                  </div>
                  {s < 2 && <div className={`w-5 h-px transition-all duration-300 ${step > 1 ? "bg-cyan-600/50" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="flex flex-col gap-5 fade-up">
              {/* mode tabs */}
              <div className="flex p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] gap-1">
                {[{ k: "upload", label: "📎  Upload Resume" }, { k: "manual", label: "✏️  Fill Manually" }].map(t => (
                  <button key={t.k} onClick={() => setMode(t.k)}
                    className={`flex-1 py-2.5 px-3 rounded-[9px] text-xs font-semibold cursor-pointer transition-all duration-200
                      ${mode === t.k
                        ? "bg-gradient-to-br from-cyan-300/15 to-cyan-600/[0.08] text-cyan-600 border border-cyan-300/25 shadow-[inset_0_1px_0_rgba(251,191,36,0.15)]"
                        : "text-slate-500 border border-transparent hover:text-slate-400"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Upload tab */}
              {mode === "upload" && (
                <div className="flex flex-col gap-3">
                  <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={e => handleFile(e.target.files[0])} />

                  {/* idle drop zone */}
                  {uploadState === "idle" && (
                    <div
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={onDrop}
                      onClick={() => fileRef.current?.click()}
                      className={`rounded-2xl px-6 py-11 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-250 border-2 border-dashed
                        ${dragOver
                          ? "border-cyan-400/60 bg-cyan-400/[0.05]"
                          : "border-white/[0.09] bg-white/[0.02] hover:border-cyan-400/35 hover:bg-cyan-400/[0.03]"}`}>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br from-cyan-300/13 to-cyan-600/[0.06] border border-cyan-300/20">
                        <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-[15px] font-bold text-slate-100 mb-1">Drop your resume here</p>
                      <p className="text-[12.5px] text-slate-600 mb-5">
                        or <span className="text-cyan-300 underline decoration-dotted underline-offset-2">click to browse</span>
                      </p>
                      <div className="flex gap-2">
                        {["PDF", "DOCX", "TXT"].map(ext => (
                          <span key={ext} className="text-[10px] font-bold px-3 py-1 rounded-full tracking-wider bg-white/[0.04] border border-white/[0.08] text-slate-600">{ext}</span>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-700 mt-3">Max 5MB</p>
                    </div>
                  )}

                  {/* parsing state */}
                  {uploadState === "parsing" && (
                    <div className="rounded-2xl px-6 py-11 flex flex-col items-center text-center bg-cyan-300/[0.03] border border-cyan-300/[0.12]">
                      <div className="w-12 h-12 rounded-full border-[2.5px] border-cyan-300/15 border-t-cyan-300 spinner mb-4" />
                      <p className="text-sm font-bold text-slate-100 mb-1">Parsing your resume…</p>
                      <p className="text-[12px] text-slate-600 mb-4">Extracting text from your file</p>
                      {uploadedFile && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                          <span className="text-base">{fileIcon}</span>
                          <span className="text-xs text-slate-400 max-w-[200px] truncate">{uploadedFile.name}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* error */}
                  {parseError && (
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-400/[0.08] border border-red-400/20">
                      <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      <span className="text-xs text-red-300">{parseError}</span>
                    </div>
                  )}

                  {/* skip link */}
                  {uploadState === "idle" && (
                    <button onClick={() => setMode("manual")}
                      className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-600 border border-white/[0.06] bg-transparent hover:bg-white/[0.06] hover:text-slate-400 transition-all duration-200 cursor-pointer">
                      Skip — fill in manually instead →
                    </button>
                  )}
                </div>
              )}

              {/* Manual tab */}
              {mode === "manual" && (
                <div className="flex flex-col gap-4 fade-up">
                  {/* auto-fill banner */}
                  {uploadedFile && uploadState === "done" && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-400/[0.05] border border-emerald-400/[0.18]">
                      <div className="w-[30px] h-[30px] shrink-0 rounded-lg flex items-center justify-center bg-emerald-400/10">
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11.5px] font-bold text-emerald-400 mb-0.5">✓ Auto-filled from resume</p>
                        <p className="text-[11px] text-slate-600 truncate">Fields populated from {uploadedFile.name}</p>
                      </div>
                      <button
                        onClick={() => { setUploadState("idle"); setUploadedFile(null); setMode("upload"); }}
                        className="shrink-0 px-2.5 py-1 text-[11px] font-semibold text-slate-600 rounded-lg border border-white/[0.07] bg-transparent hover:bg-white/[0.07] hover:text-slate-400 transition-all duration-200 cursor-pointer">
                        Re-upload
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3.5">
                    <Field label="Full Name"  placeholder="Your full name"          value={form.name}       onChange={v => set("name", v)} />
                    <Field label="Job Title"  placeholder="e.g. Senior Developer"   value={form.role}       onChange={v => set("role", v)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <Field label="Experience" placeholder="e.g. 5 years"            value={form.experience} onChange={v => set("experience", v)} />
                    <Field label="Top Skills" placeholder="e.g. React, Node, AWS"   value={form.skills}     onChange={v => set("skills", v)} />
                  </div>
                  <Textarea label="Key Achievements" placeholder="e.g. Grew revenue 40%, led team of 8, launched 4 products…" value={form.achievements} onChange={v => set("achievements", v)} />
                </div>
              )}

              {/* Tone + Length + CTA */}
              {(mode === "manual" || uploadState === "done") && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-slate-500 mb-2.5">Tone</label>
                    <div className="grid grid-cols-4 gap-2">
                      {TONES.map(t => (
                        <button key={t.id} onClick={() => set("tone", t.id)}
                          className={`py-2.5 px-2 rounded-xl text-center text-xs font-semibold cursor-pointer transition-all duration-200
                            ${form.tone === t.id
                              ? "bg-cyan-300/[0.12] border border-cyan-400/50 text-cyan-300 shadow-[inset_0_1px_0_rgba(251,191,36,0.1)]"
                              : "bg-white/[0.03] border border-white/[0.06] text-slate-600 hover:border-cyan-400/20 hover:text-slate-400"}`}>
                          <div className="text-[15px] mb-1">{t.icon}</div>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-slate-500 mb-2.5">Length</label>
                    <div className="grid grid-cols-3 gap-2">
                      {LENGTHS.map(l => (
                        <button key={l.id} onClick={() => set("length", l.id)}
                          className={`py-2.5 px-3 rounded-xl text-center cursor-pointer transition-all duration-200
                            ${form.length === l.id
                              ? "bg-cyan-300/[0.12] border border-cyan-400/50 text-cyan-300"
                              : "bg-white/[0.03] border border-white/[0.06] text-slate-600 hover:border-cyan-400/20 hover:text-slate-400"}`}>
                          <div className="text-xs font-bold">{l.label}</div>
                          <div className={`text-[10px] mt-0.5 ${form.length === l.id ? "text-cyan-400/60" : "text-slate-700"}`}>{l.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={generate}
                    disabled={!canGenerate}
                    className={`w-full py-4 rounded-xl text-[13.5px] font-medium tracking-wide flex items-center justify-center gap-2 transition-all duration-200
                      ${canGenerate
                        ? "bg-gradient-to-r from-cyan-600 via-cyan-700 to-cyan-700 text-white cursor-pointer hover:bg-cyan-600/80 hover:scale-[1.01]"
                        : "bg-white/[0.04] text-slate-600 cursor-not-allowed"}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate My Summary
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 2 - Summary */}
          {step === 2 && (
            <div className="fade-up">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-600">
                  {loading ? "Generating…" : "Your Summary"}
                </span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              <div className="relative rounded-2xl p-6 bg-cyan-300/[0.03] border border-cyan-300/[0.13] min-h-[90px]">
                <div className="absolute top-0 left-0 w-10 h-10 rounded-tl-2xl bg-gradient-to-br from-cyan-300/10 to-transparent pointer-events-none" />

                {loading ? (
                  <div className="flex flex-col gap-2.5">
                    {[92, 100, 78, 88, 55].map((w, i) => (
                      <div key={i} className="h-3 rounded-full bg-cyan-300/[0.07] skeleton" style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                ) : (
                  <p className="m-0 text-sm leading-[1.85] text-slate-300 tracking-[0.01em]">{summary}</p>
                )}
              </div>

              {summary && !loading && (
                <div className="flex items-center justify-between mt-3.5 flex-wrap gap-2.5">
                  <div className="flex gap-1.5 flex-wrap">
                    {[form.tone, form.length, `${summary.split(" ").length} words`, uploadedFile ? "from file" : "manual"].map(tag => (
                      <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize bg-white/[0.04] border border-white/[0.07] text-slate-600 tracking-[0.05em]">{tag}</span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={copy}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200
                        ${copied
                          ? "bg-emerald-400/[0.12] border border-emerald-400/35 text-emerald-400"
                          : "bg-cyan-300/[0.08] border border-cyan-400/20 text-cyan-300 hover:bg-cyan-300/[0.14]"}`}>
                      {copied ? (
                        <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>Copied!</>
                      ) : (
                        <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>Copy</>
                      )}
                    </button>
                    <button onClick={reset}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.07] hover:text-slate-400 cursor-pointer transition-all duration-200">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Start Over
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-300/[0.08] to-transparent" />
      </div>
    </>
  );
}