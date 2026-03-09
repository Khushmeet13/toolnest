import { useState } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";

export default function ToolInterface({ tool }) {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("formal");

    const generateText = async () => {
        if (!input.trim()) return;
        setLoading(true);

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: input, mode }),
            });

            const data = await res.json();
            setResult(data.text || "");
        } catch {
            setResult("Error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        // You can add a toast here later
    };

    const modes = [
        { label: "Formal", value: "formal" },
        { label: "Casual", value: "casual" },
        { label: "Expand", value: "expand" },
        { label: "Shorten", value: "shorten" },
    ];

    return (
        <div  id="tool" className="min-h-screen bg-white scroll-smooth">
            {/* Full-width hero-ish header */}
            <div className="relative max-w-6xl mx-auto border-b border-gray-200 dark:border-gray-800/50 bg-white/40 dark:bg-gray-900/30 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:pt-14 lg:pt-16 pb-5">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl font-medium tracking-tight ">
                            Free AI Text Generator
                        </h1>
                        <p className="mt-2 text-base text-gray-700 dark:text-gray-300">
                            Transform text instantly — formal, casual, longer, shorter — powered by AI
                        </p>
                    </div>
                </div>
            </div>

            {/* Main content — full width feel with generous but not crazy max-width */}
            <div className="max-w-7xl mx-auto px-5 pt-10 pb-20">
                <div className="grid lg:grid-cols-2 gap-8 xl:gap-12">
                    {/* Left: Input side */}
                    <div className="space-y-6">
                        {/* Mode pills - centered on mobile, left on desktop */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                            {modes.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setMode(opt.value)}
                                    className={`
                    px-4 py-2 text-xs font-medium rounded-full tracking-wide
                    transition-all duration-250 shadow-sm cursor-pointer
                    border
                    ${mode === opt.value
                                            ? "bg-gradient-to-r from-cyan-600 to-cyan-700 text-white border-transparent shadow-indigo-500/30"
                                            : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-cyan-600 hover:shadow-md"
                                        }
                  `}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Input textarea - tall & modern */}
                        <div className="relative">
                            <textarea
                                rows={12}
                                placeholder="Paste or write your text here... (supports long inputs)"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className={`
                                    w-full h-[min(50vh,500px)] resize-none
                                    bg-white dark:bg-gray-900/80 
                                    border border-gray-300 dark:border-gray-700 
                                    rounded-lg p-4
                                    shadow-inner shadow-gray-200/70 dark:shadow-black/40
                                    focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-cyan-600
                                    placeholder-gray-500 dark:placeholder-gray-600
                                    transition-all duration-200
                                `}
                            />
                        </div>

                        {/* Generate button - prominent */}
                        <button
                            onClick={generateText}
                            disabled={loading || !input.trim()}
                            className={`
                                w-full py-3 px-8 text-lg font-medium
                                rounded-xl
                                bg-gradient-to-r from-cyan-600 to-cyan-700
                                hover:from-cyan-700 hover:to-cyan-700
                                text-white shadow-xl shadow-indigo-600/25 hover:shadow-indigo-700/40
                                disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed
                                transition-all duration-300 active:scale-[0.98]
                                flex items-center justify-center gap-3
                            `}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="40 30" />
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                "Generate Text →"
                            )}
                        </button>
                    </div>

                    {/* Right: Output side */}
                    <div className="space-y-6 lg:border-l lg:border-gray-200/70 lg:pl-10 xl:pl-12 dark:lg:border-gray-800/50">
                        {result ? (
                            <div className="relative group h-full">
                                <div
                                    className={`
                                        bg-white/70 dark:bg-gray-900/60 
                                        backdrop-blur-md 
                                        border border-gray-200/80 dark:border-gray-700/60 
                                        rounded-2xl p-7 shadow-lg
                                        h-[min(60vh,500px)] overflow-auto
                                    `}
                                >
                                    <button
                                        onClick={copyToClipboard}
                                        className="
                      absolute top-5 right-5 p-3 rounded-lg
                      bg-white/80 dark:bg-gray-800/80 shadow-sm
                      text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400
                      opacity-80 group-hover:opacity-100
                      transition-all duration-200 hover:scale-105
                    "
                                        title="Copy result"
                                    >
                                        <ClipboardIcon className="w-6 h-6" />
                                    </button>

                                    <div className="pr-16 text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line text-[15.5px] lg:text-base">
                                        {result}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[min(60vh,500px)] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-center px-8">
                                <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
                                    Generated text will appear here
                                </p>
                                <p className="mt-2 text-gray-600 dark:text-gray-500">
                                    Choose a style and click Generate
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}