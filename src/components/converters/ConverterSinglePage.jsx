import React from 'react'
import { useParams } from 'react-router-dom';
import converters from '../../data/converterTools';

const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, "-");

const ConverterSinglePage = () => {
    const { slug } = useParams();

    const tool = converters.find(
        (t) => slugify(t.title) === slug
    );

    // ✅ Safety check (important)
    if (!tool) {
        return <div className="p-10 text-center text-red-500">Tool not found</div>;
    }

    // ✅ Title split correct way
    const firstWord = tool.title.split(" ")[0];
    const restWords = tool.title.split(" ").slice(1).join(" ");

    return (
        <section className="relative bg-white text-gray-900 overflow-hidden">

            {/* 🔳 Grid Background */}
            <div className="absolute inset-0 -z-10">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            {/* 🌟 Cyan Glow */}
            <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 -z-10 w-[500px] h-[500px] bg-cyan-400/20 blur-[120px] rounded-full"></div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-20 text-center">

                {/* Tool Badge */}
                <div className="inline-block px-4 py-1 mb-6 text-sm rounded-full bg-cyan-100 text-cyan-700 font-medium">
                    ⚡ Free Online Tool
                </div>

                {/* ✅ Fixed Title */}
                <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                    {firstWord}{" "}
                    <span className="text-cyan-600">
                        {restWords}
                    </span>
                </h1>

                {/* ✅ Description */}
                <p className="mt-4 text-gray-500 max-w-xl mx-auto text-lg">
                    {tool.description}
                </p>

                {/* Input Box */}
                <div className="mt-10 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-3 items-center justify-center">

                    <input
                        type="text"
                        placeholder="Enter value..."
                        className="w-full md:w-1/2 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />

                    <button className="px-6 py-3 rounded-md bg-cyan-600 text-white font-medium hover:bg-cyan-700 transition">
                        Convert Now
                    </button>
                </div>

            </div>
        </section>
    )
}

export default ConverterSinglePage;