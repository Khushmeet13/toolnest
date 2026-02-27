import React from 'react'

const HeroSection = () => {
    return (
        <div>
            <div className="relative isolate overflow-hidden">

                {/* 🔥 Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
                    alt=""
                    className="absolute inset-0 -z-10 size-full object-cover"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/70 -z-10" />

                {/* Gradient Glow */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu blur-3xl"
                >
                    <div
                        style={{
                            clipPath:
                                "polygon(74% 44%,100% 62%,97% 27%,85% 0%,80% 2%,72% 33%,60% 62%,52% 68%,47% 58%,45% 34%,27% 76%,0% 65%,17% 100%,27% 76%,76% 97%,74% 44%)",
                        }}
                        className="relative left-1/2 aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-cyan-500 to-blue-600 opacity-30"
                    />
                </div>

                {/* Content */}
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl py-28 sm:py-36 text-center">

                        {/* Badge */}
                        <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm text-gray-200 backdrop-blur">
                            ⚡ 50+ Powerful Generators
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl font-medium tracking-tight text-white">
                            All Generators in One Place
                        </h1>

                        {/* Subtitle */}
                        <p className="mt-4 text-lg sm:text-xl text-gray-300">
                            Create names, passwords, text, colors, business ideas and more — instantly.
                        </p>

                        {/* 🔍 BIG SEARCH BAR */}
                        <div className="mt-10 flex justify-center">
                            <div className="flex w-full max-w-2xl items-center rounded-xl bg-white/10 backdrop-blur border border-white/20 px-4 py-3 shadow-lg">

                                <svg
                                    className="h-5 w-5 text-gray-300 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                    />
                                </svg>

                                <input
                                    type="text"
                                    placeholder="Search generators (Password, Business Name, QR Code...)"
                                    className="w-full bg-transparent outline-none text-white placeholder-gray-300"
                                />

                                <button className="ml-3 rounded-lg bg-cyan-500 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-400 transition">
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Popular quick links */}
                        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
                            <span className="text-gray-400">Popular:</span>
                            <a href="#" className="text-cyan-400 hover:underline">Password</a>
                            <a href="#" className="text-cyan-400 hover:underline">Username</a>
                            <a href="#" className="text-cyan-400 hover:underline">Business Name</a>
                            <a href="#" className="text-cyan-400 hover:underline">QR Code</a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection
