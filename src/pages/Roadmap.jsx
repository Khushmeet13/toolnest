// src/pages/Roadmap.jsx
import React from 'react';

const milestones = [
  {
    quarter: "2026",
    status: "completed",
    title: "Platform Foundation & Core Tools",
    desc: "Launch of essential tools including Password Generator, Image Compressor, Unit Converter, and Basic Calculators with responsive UI and fast processing.",
  },
  {
    quarter: "2026",
    status: "in-progress",
    title: "Performance & UX Enhancements",
    desc: "Improved tool speed, optimized file handling, dark mode support, better mobile experience, and enhanced accessibility features.",
  },
  {
    quarter: "2026",
    status: "planned",
    title: "Advanced Developer & Productivity Tools",
    desc: "Launch of JSON Formatter, Base64 Encoder/Decoder, Code Beautifier, Advanced Converters, and batch-processing capabilities.",
  },
  {
    quarter: "2026",
    status: "planned",
    title: "User Accounts & Cloud Features",
    desc: "Optional user accounts, tool history tracking, saved preferences, and personalized dashboard experience.",
  },
  {
    quarter: "2027",
    status: "idea",
    title: "AI-Powered Smart Tools",
    desc: "Introduction of AI-based content tools, smart image optimization, text summarizer, and automation-focused utilities.",
  },
];


export default function Roadmap() {
  return (
    <div className="min-h-screen bg-white text-black pb-20">
      {/* Header */}
      <div className="pt-16 pb-12 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 text-center">
        <h1 className="text-2xl sm:text-4xl font-medium tracking-tight text-black">
          Our Roadmap
        </h1>
        <p className="mt-2 text-base  text-slate-400 max-w-3xl mx-auto">
          Building the future of personalized, joyful and result-oriented learning — step by step.
        </p>
      </div>

      {/* Timeline */}
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-cyan-500/30 via-cyan-500/30 to-transparent pointer-events-none hidden md:block" />

          {milestones.map((milestone, idx) => (
            <div
              key={milestone.quarter}
              className={`relative flex flex-col md:flex-row items-center ${
                idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Card */}
              <div className="w-full md:w-5/12">
                <div
                  className={`p-6 rounded-lg border border-cyan-600/80 shadow-lg shadow-cyan-50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] `}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl text-black font-semibold mb-2">{milestone.quarter}</h2>
                   
                  </div>

                  <h3 className="text-xl font-medium mb-2 text-black">{milestone.title}</h3>
                    <p className="text-gray-500"> {milestone.desc} </p>
                </div>
              </div>

              {/* Quarter circle marker */}
              <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-cyan-600/60 items-center justify-center z-10 shadow-xl shadow-indigo-900/30">
                <span className="text-xs font-bold text-cyan-600">{milestone.quarter}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Final message */}
        {/* <div className="text-center mt-20">
          <p className="text-black text-lg">
            More features are already being discussed for 2027
          </p>
          <p className=" text-gray-500">
            Got a feature idea that would make learning better? 
            <a href="/feedback" className="underline hover:text-indigo-300 ml-1.5">
              Tell us!
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
}