import { useState } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";

export default function ToolInterface({ tool }) {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("formal");
    const [copied, setCopied] = useState(false);

    // 🔑 Google Gemini API Configuration
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY; // Your API key
    const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;

    // Get prompt based on mode
    const getPrompt = (text, selectedMode) => {
        const modePrompts = {
            formal: `Rewrite the following text in a professional, formal tone. Maintain the core meaning but make it more polished and suitable for business or academic contexts:\n\n${text}`,

            casual: `Rewrite the following text in a casual, conversational tone. Make it sound natural, friendly, and easy to read like a chat with a friend:\n\n${text}`,

            expand: `Expand and elaborate on the following text. Add more details, examples, or explanations while keeping the core message intact. Make it longer and more comprehensive:\n\n${text}`,

            shorten: `Summarize and shorten the following text while preserving the key message. Make it concise and to the point:\n\n${text}`,
        };

        return modePrompts[selectedMode] || modePrompts.formal;
    };

    // 🎯 Generate text using Gemini API
    const generateText = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setResult("");
        setCopied(false);

        try {
            const prompt = getPrompt(input, mode);

            console.log("🔄 Calling Gemini API with mode:", mode);

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: mode === "creative" ? 0.9 : 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_ONLY_HIGH"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_ONLY_HIGH"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_ONLY_HIGH"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_ONLY_HIGH"
                        }
                    ]
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("Gemini API error response:", errorData);
                throw new Error(`Gemini API failed: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Gemini API response received");

            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!generatedText) {
                throw new Error("No text generated from Gemini");
            }

            // Clean up the response (remove any markdown or extra formatting)
            let cleanText = generatedText
                .replace(/```/g, '')
                .replace(/^["']|["']$/g, '')
                .trim();

            setResult(cleanText);

        } catch (error) {
            console.error("❌ Gemini API error:", error);

            // Fallback responses if API fails
            const fallbackResponses = {
                formal: `I apologize, but I'm currently unable to process your request. Please try again in a moment. Your text was: "${input}"`,

                casual: `Hey! Sorry, something went wrong with the AI. Mind trying again? Here's what you wrote: "${input}"`,

                expand: `The system is temporarily unavailable. Here's the original text you provided:\n\n${input}\n\nPlease try again in a few moments.`,

                shorten: `Unable to process at the moment. Your original text: "${input}"\n\nPlease refresh and try again.`,
            };

            setResult(fallbackResponses[mode] || fallbackResponses.formal);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const modes = [
        { label: "Formal", value: "formal", emoji: "👔" },
        { label: "Casual", value: "casual", emoji: "😊" },
        { label: "Expand", value: "expand", emoji: "📈" },
        { label: "Shorten", value: "shorten", emoji: "📏" },
    ];

    // Character count
    const inputChars = input.length;
    const resultChars = result.length;

    return (
        <div id="tool" className="min-h-screen bg-white scroll-smooth">
            {/* Full-width hero-ish header */}
            <div className="relative max-w-6xl mx-auto border-b border-gray-200 dark:border-gray-800/50 bg-white/40 dark:bg-gray-900/30 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:pt-14 lg:pt-16 pb-5">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl font-medium tracking-tight flex items-center justify-center gap-2">
                            Free AI Text Generator
                           
                        </h1>
                        <p className="mt-2 text-base text-gray-700 dark:text-gray-300">
                            Transform text instantly — formal, casual, longer, shorter
                        </p>
                    </div>
                </div>
            </div>

            {/* Main content — full width feel with generous but not crazy max-width */}
            <div className="max-w-7xl mx-auto px-5 pt-10 pb-20">
                <div className="grid lg:grid-cols-2 gap-8 xl:gap-12">
                    {/* Left: Input side */}
                    <div className="space-y-6">
                        {/* Mode pills - with emojis */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                            {modes.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setMode(opt.value)}
                                    className={`
                                        px-4 py-2 text-xs font-medium rounded-full tracking-wide
                                        transition-all duration-250 shadow-sm cursor-pointer
                                        border flex items-center gap-2
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

                        {/* Input textarea with character counter */}
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
                            <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 dark:bg-gray-900/80 px-2 py-1 rounded">
                                {inputChars} chars
                            </div>
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
                                `Generate ${modes.find(m => m.value === mode)?.label} Text`
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
                                            flex items-center gap-2
                                        "
                                        title="Copy result"
                                    >
                                        <ClipboardIcon className="w-5 h-5" />
                                        {copied && <span className="text-xs">Copied!</span>}
                                    </button>

                                    <div className="pr-20 text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line text-[15.5px] lg:text-base">
                                        {result}
                                    </div>

                                    {/* Character count for result */}
                                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 dark:bg-gray-900/80 px-2 py-1 rounded">
                                        {resultChars} chars
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[min(80vh,500px)] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-center px-8">
                             
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