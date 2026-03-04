import React from "react";
import { SparklesIcon, ArrowPathIcon, BugAntIcon } from '@heroicons/react/24/solid';
import { changelogData } from "../data/changelogData";

// Group changelog entries by date and version
const groupedChangelog = changelogData.reduce((acc, log) => {
  const key = `${log.date}-${log.version}`;
  if (!acc[key]) {
    acc[key] = { date: log.date, version: log.version, logs: [] };
  }
  acc[key].logs.push(log);
  return acc;
}, {});

export default function Changelog() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* <Seo
        title="Changelog | $website Docs"
        description="Keep up with the latest updates, improvements, and new features at $website. Check our changelog for recent changes and enhancements to our APIs and services."
      /> */}
      <h1 className="pb-5 mb-8 border-b border-b-blue-50 text-3xl">Changelog</h1>
      {/* Timeline container only around changelog blocks */}
      <div className="relative flex flex-col gap-10">
        {/* Vertical line only spans this block */}
        <div className="absolute lg:left-[136px] left-[1rem] top-[2px] bottom-0 w-1.5 bg-blue-50 rounded-sm z-0"></div>

        {Object.values(groupedChangelog).map((group, index) => (
          <div key={index} className="relative flex gap-6">
            {/* Sticky Date */}
            <div className="lg:w-40 w-[1.2rem] flex-shrink-0 relative">
              <div className="sticky top-32 flex items-center gap-3">
                <div className="absolute lg:left-34 left-[8.5rem] top-0 w-[6px] h-[6px] rounded-full bg-blue-600 z-20 shadow-[0_0_8px_8px_white]" />
                <span className="hidden lg:block text-sm font-medium whitespace-nowrap px-3 py-1 rounded-full bg-blue-50 text-[#111A4A99]">
                  {group.date}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 border-b border-b-blue-50 pb-8 space-y-2 lg:space-y-0">
            <span className="lg:hidden text-sm font-medium whitespace-nowrap px-3 py-1 mb-4 rounded-full bg-blue-50 text-[#111A4A99]">
                  {group.date}
                </span>
              {/* Version Heading */}
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Version {group.version}</h2>

              {group.logs.map((log, logIndex) => (
                <div key={logIndex} className={logIndex > 0 ? "mt-6" : ""}>
                  <h3 className="text-lg text-default font-semibold mb-3">{log.title}</h3>

                  {/* Type Badge */}
                  {log.type === "New" && (
                    <div className="flex items-center gap-1 text-sm font-medium text-blue-600 mb-3">
                      <SparklesIcon className="w-4 h-4" /> New
                    </div>
                  )}
                  {log.type === "Improved" && (
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600 mb-3">
                      <ArrowPathIcon className="w-4 h-4" /> Improved
                    </div>
                  )}
                  {log.type === "Bug Fixes" && (
                    <div className="flex items-center gap-1 text-sm font-medium text-red-600 mb-3">
                      <BugAntIcon className="w-4 h-4" /> Bug Fixes
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-default leading-relaxed whitespace-pre-line">
                    {log.description.split(log.linkText || "").map((part, idx, arr) =>
                      idx < arr.length - 1 ? (
                        <span key={idx}>
                          {part}
                          <a
                            href={log.linkUrl}
                            className="text-gray-600 underline underline-offset-2 hover:text-gray-800"
                          >
                            {log.linkText}
                          </a>
                        </span>
                      ) : (
                        part
                      )
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}