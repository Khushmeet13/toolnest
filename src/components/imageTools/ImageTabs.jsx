import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import {
  Squares2X2Icon,
  PhotoIcon,
  AdjustmentsHorizontalIcon,
  ArrowsRightLeftIcon,
  SparklesIcon,
  DocumentTextIcon,
  ShareIcon,
  PaintBrushIcon,
} from "@heroicons/react/20/solid";

const tabs = [
  { name: "All", icon: Squares2X2Icon },
  { name: "Basic", icon: PhotoIcon },
  { name: "Editor", icon: AdjustmentsHorizontalIcon },
  { name: "Convert", icon: ArrowsRightLeftIcon },
  { name: "AI Tools", icon: SparklesIcon },
  { name: "OCR", icon: DocumentTextIcon },
  { name: "Social", icon: ShareIcon },
  { name: "Creative", icon: PaintBrushIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ImageTabs({ activeCategory, setActiveCategory }) {
  // const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="bg-white dark:bg-gray-900 ">

      <div className="mx-auto max-w-4xl">

        {/* 🔥 Mobile Dropdown */}
        <div className="grid grid-cols-1 sm:hidden">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            aria-label="Select category"
            className="w-full rounded-md bg-white py-3 pr-8 pl-3 text-gray-900 outline outline-gray-300 focus:outline-cyan-600 dark:bg-white/5 dark:text-gray-100"
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>

          <ChevronDownIcon
            className="pointer-events-none absolute right-10 mt-3 size-5 text-gray-500"
          />
        </div>

        {/* 🔥 Desktop Tabs */}
        <div className="hidden sm:block">
          <div className="border-b border-gray-200 dark:border-white/10">

            <nav className="-mb-px flex flex-wrap gap-6">

              {tabs.map((tab) => {
                const isActive = activeCategory === tab.name;

                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveCategory(tab.name)}
                    className={classNames(
                      isActive
                        ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                      "group inline-flex items-center border-b-2 px-2 py-4 text-sm font-semibold transition cursor-pointer"
                    )}
                  >
                    <tab.icon
                      className={classNames(
                        isActive
                          ? "text-cyan-500 dark:text-cyan-400"
                          : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500",
                        "mr-2 size-5"
                      )}
                    />

                    {tab.name}
                  </button>
                );
              })}

            </nav>

          </div>
        </div>
      </div>
    </div>
  );
}