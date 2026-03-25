import { motion } from "framer-motion";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import converters from "../../data/converterTools";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ToolsSection({ activeTab }) {
    const navigate = useNavigate();
    const filteredTools =
        activeTab === "All"
            ? converters
            : converters.filter((tool) => tool.category === activeTab);

    const createSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/\s+/g, "-") 
            .replace(/[^\w-]+/g, "");
    };

    return (
        <section className="relative py-16 bg-white text-black overflow-hidden">

            <div className="relative max-w-7xl mx-auto px-6">

                {/* Heading */}
                <div className="mb-20 text-center">
                    <h2 className="text-4xl font-medium tracking-tight">
                        Powerful Online Converters
                    </h2>
                    <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
                        Beautifully crafted tools designed for speed, simplicity and performance.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[200px] gap-6">

                    {filteredTools.map((tool, index) => (
                        <div
                            key={tool.id}
                           onClick={() => navigate(`/converters/${createSlug(tool.title)}`)}
                            className={`group relative rounded-lg p-[1px] bg-gradient-to-br from-cyan-500/40 via-indigo-500/30 to-pink-500/40 hover:from-cyan-500 hover:to-cyan-500 transition duration-500 cursor-pointer ${index % 5 === 0 ? "lg:col-span-2" : ""
                                }`}
                        >


                            <div className="relative h-full w-full rounded-lg bg-white p-6 flex flex-col   hover:bg-gray-50 transition duration-500">
                                {/* Arrow */}
                                <div className="flex justify-end">
                                    <ArrowUpRightIcon className="w-6 h-6 text-gray-500 group-hover:text-cyan-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300" />
                                </div>

                                {/* Category */}
                                <span className="text-xs uppercase tracking-widest text-cyan-600">
                                    {tool.category}
                                </span>

                                {/* Title */}
                                <h3 className="text-xl mt-2 font-medium group-hover:text-cyan-600 transition">
                                    {tool.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 text-base mt-2 ">
                                    {tool.description}
                                </p>



                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}