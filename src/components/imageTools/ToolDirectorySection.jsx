import { useState } from "react";
import imageTools from "../../data/imageTools";
import {
    MagnifyingGlassIcon,
    ArrowUpRightIcon,
} from "@heroicons/react/20/solid";

export default function ToolDirectorySection({
    activeCategory,
    setActiveCategory,
}) {
    // const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");

    const categories = [
        "All",
        "Basic",
        "Editor",
        "Convert",
        "AI Tools",
        "OCR",
        "Social",
        "Creative",
    ];

    const filteredTools = imageTools.filter((tool) => {
        const matchCategory =
            activeCategory === "All" || tool.category === activeCategory;
        const matchSearch = tool.title
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchCategory && matchSearch;
    });

    return (
        <section className="bg-white dark:bg-gray-950 py-16">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="mb-16 text-center">
                    <h2 className="text-4xl font-medium text-gray-900 dark:text-white">
                        Explore All Image Tools
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Fast, secure and beautifully simple tools built for creators,
                        developers and businesses.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-8 relative max-w-md mx-auto">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tools..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-600"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                    {/* Sidebar Categories */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`block w-full text-left px-4 py-2 rounded-lg text-sm transition ${activeCategory === cat
                                        ? "bg-cyan-600 text-white"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tool List */}
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredTools.map((tool) => (
                            <div
                                key={tool.id}
                                className="group flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-cyan-500 hover:shadow-md transition bg-white dark:bg-gray-900 cursor-pointer shadow"
                            >
                                <div>
                                    {/* Category Badge */}
                                    <span className="inline-block mb-1 text-xs font-medium rounded-full 
       text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400">
                                        {tool.category}
                                    </span>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-cyan-600 transition">
                                        {tool.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {tool.description}
                                    </p>
                                </div>

                                <ArrowUpRightIcon className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 transition" />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}