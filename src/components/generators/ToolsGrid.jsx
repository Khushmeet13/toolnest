import React from "react";

const tabContent = {
    All: {
        title: "All Tools",
        description: "Explore our complete collection of powerful productivity tools in one place.",
    },
    Text: {
        title: "Text Generators",
        description: "Create high-quality content, captions, emails, and more in seconds.",
    },
    Security: {
        title: "Security Tools",
        description: "Generate secure passwords, UUIDs, QR codes, and protect your data.",
    },
    Design: {
        title: "Design Tools",
        description: "Build beautiful color palettes and modern gradients effortlessly.",
    },
    Random: {
        title: "Random Generators",
        description: "Generate random names, numbers, and other creative outputs instantly.",
    },
    Business: {
        title: "Business Tools",
        description: "Professional tools to streamline your business workflow.",
    },
    Fun: {
        title: "Fun Tools",
        description: "Create memes, emojis, and enjoy creative entertainment tools.",
    },
};

export default function ToolsGrid({ activeTab, generators }) {
    const filteredTools =
        activeTab === "All"
            ? generators
            : generators.filter((tool) => tool.category === activeTab);

    return (
        <section className="relative py-20 px-6">
            {/* Background Gradient Blur */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"></div>

            <div className="max-w-7xl mx-auto">

                {/* Section Heading */}
                <div className="text-center mb-14">
                    <h2 className="text-4xl font-semibold text-gray-900 dark:text-white">
                        {tabContent[activeTab]?.title}
                    </h2>

                    <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {tabContent[activeTab]?.description}
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTools.map((tool) => (
                        <div
                            key={tool.id}
                            className="group relative p-4 rounded-lg bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-cyan-400/10 to-blue-500/10 blur-xl"></div>

                            <div className="relative z-10">

                                {/* Badge */}
                                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                                    {tool.category}
                                </span>

                                {/* Title */}
                                <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                                    {tool.title}
                                </h3>

                                {/* Description */}
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {tool.description}
                                </p>

                                {/* Button */}
                                <button className="mt-6 inline-flex items-center text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 transition">
                                    Open Tool →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredTools.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 dark:text-gray-400">
                            No tools available in this category.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}