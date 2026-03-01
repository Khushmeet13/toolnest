import devTools from "../../data/devTools";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

export default function DevToolsSection({ activeTab }) {

  const categories = [
    "All",
    "Data",
    "Encode",
    "Formatting",
    "Converter",
    "Web",
    "Security",
    "File",
    "Productivity",
  ];

  const filteredTools =
    activeTab === "All"
      ? devTools
      : devTools.filter((tool) => tool.category === activeTab);

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-semibold text-gray-900 dark:text-white">
            Developer Tool Suite
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful, browser-based utilities designed for developers.
            Fast, secure and beautifully crafted.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="group relative p-6 rounded-lg bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200 dark:border-gray-800 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-100/20 transition-all duration-300 cursor-pointer"
            >
              {/* Category Badge */}
              <div className="absolute top-4 right-4 text-xs dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300 px-2 py-1 rounded-full">
                {tool.category}
              </div>

              <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-cyan-600 transition">
                {tool.title}
              </h3>

              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {tool.description}
              </p>

              <div className="mt-4 flex items-center text-sm font-medium text-cyan-600 opacity-0 group-hover:opacity-100 transition">
                Open Tool
                <ArrowUpRightIcon className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}