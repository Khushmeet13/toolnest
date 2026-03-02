import { Sparkles } from "lucide-react";

const timeline = [
    {
        name: "Built for Simplicity",
        description:
            "ToolNest is designed with a clean and minimal interface so users can complete tasks without confusion or unnecessary steps.",
        date: "User First",
        dateTime: "2025-01",
    },
    {
        name: "Performance & Speed",
        description:
            "We continuously optimize our platform to ensure fast processing, smooth performance, and instant results across all devices.",
        date: "Optimized",
        dateTime: "2025-02",
    },
    {
        name: "Privacy Focused Platform",
        description:
            "User data security and privacy remain a top priority. ToolNest ensures safe file handling and secure processing.",
        date: "Secure",
        dateTime: "2025-03",
    },
    {
        name: "Accessible for Everyone",
        description:
            "Our tools are completely free and accessible worldwide — helping students, creators, developers, and professionals work smarter.",
        date: "Global",
        dateTime: "2025-04",
    },
];

const blogPosts = [
    {
        id: 1,
        title: "How to Compress Images Without Losing Quality",
        href: "/blog/compress-images-without-losing-quality",
        description:
            "Learn the best techniques to reduce image size while maintaining clarity for websites, social media, and faster loading speeds.",
        imageUrl:
            "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2000&auto=format&fit=crop",
        date: "Mar 10, 2026",
        datetime: "2026-03-10",
        author: {
            name: "ToolNest Team",
            imageUrl:
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2000&auto=format&fit=crop",
        },
    },
    {
        id: 2,
        title: "PDF to Word: The Fastest Way to Convert Documents",
        href: "/blog/pdf-to-word-conversion-guide",
        description:
            "Step-by-step guide to converting PDF files into editable Word documents quickly and securely.",
        imageUrl:
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2000&auto=format&fit=crop",
        date: "Feb 28, 2026",
        datetime: "2026-02-28",
        author: {
            name: "ToolNest Editorial",
            imageUrl:
                "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2000&auto=format&fit=crop",
        },
    },
    {
        id: 3,
        title: "Why Strong Passwords Matter in 2026",
        href: "/blog/why-strong-passwords-matter",
        description:
            "Discover how secure passwords protect your accounts and how to generate strong passwords instantly using online tools.",
        imageUrl:
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop",
        date: "Feb 15, 2026",
        datetime: "2026-02-15",
        author: {
            name: "ToolNest Security Desk",
            imageUrl:
                "https://images.unsplash.com/photo-1502767089025-6572583495b0?q=80&w=2000&auto=format&fit=crop",
        },
    },
];

const values = [
    {
        title: "Simplicity First",
        desc: "We design clean and intuitive tools so users can complete tasks instantly without confusion or unnecessary steps.",
        color: "bg-blue-600",
    },
    {
        title: "Free & Accessible",
        desc: "ToolNest is built to be 100% free and accessible worldwide — no subscriptions, no hidden costs.",
        color: "bg-orange-500",
    },
    {
        title: "Privacy Focused",
        desc: "Your files and data remain secure. We prioritize safe processing and respect user privacy at every stage.",
        color: "bg-yellow-500",
    },
    {
        title: "Performance Driven",
        desc: "Fast processing and optimized performance ensure smooth experience across all devices and browsers.",
        color: "bg-purple-600",
    },
    {
        title: "Continuous Improvement",
        desc: "We constantly improve our tools based on user feedback to deliver better functionality and usability.",
        color: "bg-green-600",
    },
];

export default function About() {

    return (
        <>
            <div className="bg-white dark:bg-gray-900">

                <div className="relative isolate overflow-hidden pt-14">
                    <img
                        alt=""
                        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
                        className="absolute inset-0 -z-10 size-full object-cover not-dark:hidden"
                    />
                    <img
                        alt=""
                        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=fff&sat=-100&exp=15&blend-mode=overlay"
                        className="absolute inset-0 -z-10 size-full object-cover opacity-10 dark:hidden"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    >
                        <div
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
                        />
                    </div>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl py-20">
                            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                                <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:text-gray-400 dark:ring-white/10 dark:hover:ring-white/20">
                                    New tools added. {' '}
                                    <a href="#" className="font-medium text-xs text-cyan-600 dark:text-indigo-400">
                                        <span aria-hidden="true" className="absolute inset-0" />
                                        Browse latest tools <span aria-hidden="true">&rarr;</span>
                                    </a>
                                </div>
                            </div>
                            <div className="text-center">
                                <h1 className="text-5xl font-medium tracking-tight text-gray-900 dark:text-white">
                                    Simplify Your Daily Tasks with ToolNest
                                </h1>
                                <p className="mt-4 text-lg font-medium text-pretty text-gray-600 dark:text-gray-400">
                                    ToolNest is your all-in-one platform for free online tools.
                                    From image compression and PDF conversion to generators and productivity utilities —
                                    we help you complete everyday digital tasks quickly, securely, and effortlessly.
                                </p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    <a
                                        href="/tools"
                                        className="rounded-md bg-cyan-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-cyan-600/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                                    >
                                        Explore Tools
                                    </a>

                                    <a href="/contact" className="text-sm/6 font-semibold text-cyan-600 px-3.5 py-2 rounded-lg dark:text-white border border-cyan-600 ">
                                        Contact Us
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                    >
                        <div
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75"
                        />
                    </div>
                </div>
            </div>


            {/* 🚀 Our Mission Section */}
            <div className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-5xl mx-auto text-center">

                    <h2 className="text-4xl font-semibold text-gray-900 dark:text-white">
                        Our Mission
                    </h2>

                    <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        At ToolNest, our mission is to simplify everyday digital tasks by providing
                        powerful, secure, and easy-to-use online tools — completely free.
                        We aim to make productivity accessible for students, developers,
                        professionals, and businesses worldwide.
                    </p>

                    <div className="mt-10">
                        <div className="inline-block bg-gray-900 dark:bg-gray-800 px-8 py-6 rounded-xl shadow-md shadow-cyan-200">
                            <p className="text-cyan-600 font-medium text-lg">
                                "Simple tools. Faster work. Better productivity."
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Timeline section */}
            <div className="bg-white">
                <div className="mx-auto max-w-7xl  px-6 lg:px-8 py-10">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
                        {timeline.map((item) => (
                            <div key={item.name}>
                                <time
                                    dateTime={item.dateTime}
                                    className="flex items-center text-sm/6 font-semibold text-cyan-600 dark:text-indigo-400"
                                >
                                    <svg viewBox="0 0 4 4" aria-hidden="true" className="mr-4 size-1 flex-none">
                                        <circle r={2} cx={2} cy={2} fill="currentColor" />
                                    </svg>
                                    {item.date}
                                    <div
                                        aria-hidden="true"
                                        className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0 dark:bg-white/15"
                                    />
                                </time>
                                <p className="mt-6 text-lg/8 font-semibold tracking-tight text-gray-900 dark:text-white">{item.name}</p>
                                <p className="mt-1 text-base/7 text-gray-600 dark:text-gray-400">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 🌟 Our Values Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Header */}
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-16 flex items-center justify-center gap-1">
                        Our Values
                        <Sparkles className="w-5 h-5 text-cyan-600 mb-2" />
                    </h2>

                    {/* FIRST 3 VALUES — 3 COLUMNS */}
                    <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        {values.slice(0, 3).map((value, index) => (
                            <ValueCard key={index} value={value} />
                        ))}
                    </div>

                    {/* LAST 2 VALUES — 2 COLUMNS */}
                    <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto mt-12">
                        {values.slice(3).map((value, index) => (
                            <ValueCard key={index} value={value} />
                        ))}
                    </div>
                </div>
            </section>




            {/* Stats */}
            <div className="bg-white">


                <div className="mx-auto max-w-7xl  py-20">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-4xl font-medium tracking-tight text-pretty text-gray-900 dark:text-white">
                            Powering Productivity Worldwide
                        </h2>
                        <p className="mt-2 text-base/7 text-gray-600 dark:text-gray-300">
                            ToolNest helps users complete everyday digital tasks quickly and efficiently.
                            From file conversion and compression to generators and utility tools,
                            we focus on speed, simplicity, and reliability.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">

                        {/* Tools Count */}
                        <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-xl bg-gray-100 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start dark:bg-white/5 dark:inset-ring dark:inset-ring-white/10">
                            <p className="flex-none text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                25+
                            </p>
                            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                                <p className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                                    Free Tools Available
                                </p>
                                <p className="mt-2 text-base/7 text-gray-600 dark:text-gray-300">
                                    A growing collection of online tools including file converters,
                                    image compressors, text utilities, and productivity helpers.
                                </p>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-900 p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-30 dark:bg-gray-700 dark:inset-ring dark:inset-ring-white/10">
                            <p className="flex-none text-3xl font-bold tracking-tight text-white">
                                8+
                            </p>
                            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                                <p className="text-lg font-semibold tracking-tight text-white">
                                    Tool Categories
                                </p>
                                <p className="mt-2 text-base/7 text-gray-400 dark:text-gray-300">
                                    Organized into categories like PDF tools, image tools,
                                    text generators, security utilities, and developer tools.
                                </p>
                            </div>
                        </div>

                        {/* Free */}
                        <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-cyan-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-18 dark:inset-ring dark:inset-ring-white/10">
                            <p className="flex-none text-3xl font-bold tracking-tight text-white">
                                100%
                            </p>
                            <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                                <p className="text-lg font-semibold tracking-tight text-white">
                                    Free to Use
                                </p>
                                <p className="mt-2 text-base/7 text-indigo-200 dark:text-indigo-100">
                                    No subscriptions, no hidden fees. ToolNest is completely free,
                                    allowing everyone to access powerful tools without limitations.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Logo cloud */}
            <div className="mx-auto py-20 max-w-7xl sm:px-6 lg:px-8">
                <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl shadow-cyan-100 sm:rounded-xl sm:px-16 dark:shadow-none dark:after:pointer-events-none dark:after:absolute dark:after:inset-0 dark:after:inset-ring dark:after:inset-ring-white/10 dark:after:sm:rounded-3xl">
                    <h2 className="mx-auto max-w-2xl text-3xl font-medium tracking-tight text-white sm:text-4xl">
                        Built for Simplicity & Speed
                    </h2>
                    <p className="mx-auto mt-6 max-w-2xl text-base text-gray-300">
                        ToolNest is a growing collection of simple and powerful online tools.
                        We’re focused on creating a clean, fast, and accessible experience
                        for everyday digital tasks — without ads overload or unnecessary complexity.
                    </p>
                    <div className="mx-auto mt-20 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:max-w-4xl lg:grid-cols-3">
                        <div>
                            <p className="text-lg font-semibold text-white">🚀 Fast & Lightweight</p>
                            <p className="mt-2 text-sm text-gray-400">
                                Optimized for quick processing and smooth performance across devices.
                            </p>
                        </div>

                        <div>
                            <p className="text-lg font-semibold text-white">🔒 Privacy Focused</p>
                            <p className="mt-2 text-sm text-gray-400">
                                Your files and data stay secure. We prioritize safe and minimal data handling.
                            </p>
                        </div>

                        <div>
                            <p className="text-lg font-semibold text-white">🌍 Free & Open Access</p>
                            <p className="mt-2 text-sm text-gray-400">
                                No subscriptions. No hidden charges. Just useful tools available to everyone.
                            </p>
                        </div>
                    </div>
                    <div aria-hidden="true" className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl">
                        <div
                            style={{
                                clipPath:
                                    'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
                            }}
                            className="aspect-1404/767 w-351 bg-linear-to-r from-[#80caff] to-[#4f46e5] opacity-25"
                        />
                    </div>
                </div>
            </div>

            {/* Blog section */}
            <div className="bg-white py-20">


                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                        <h2 className="text-3xl font-medium tracking-tight text-balance text-gray-900 sm:text-4xl dark:text-white">
                            From the blog
                        </h2>
                        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                            Learn how to grow your business with our expert advice.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {blogPosts.map((post) => (
                            <article
                                key={post.id}
                                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pt-80 pb-8 sm:pt-48 lg:pt-80 dark:bg-gray-800"
                            >
                                <img alt="" src={post.imageUrl} className="absolute inset-0 -z-10 size-full object-cover" />
                                <div className="absolute inset-0 -z-10 bg-linear-to-t from-gray-900 via-gray-900/40 dark:from-black/80 dark:via-black/40" />
                                <div className="absolute inset-0 -z-10 rounded-2xl inset-ring inset-ring-gray-900/10 dark:inset-ring-white/10" />

                                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-gray-300">
                                    <time dateTime={post.datetime} className="mr-8">
                                        {post.date}
                                    </time>
                                    <div className="-ml-4 flex items-center gap-x-4">
                                        <svg viewBox="0 0 2 2" className="-ml-0.5 size-0.5 flex-none fill-white/50 dark:fill-gray-300/50">
                                            <circle r={1} cx={1} cy={1} />
                                        </svg>
                                        <div className="flex gap-x-2.5">
                                            <img
                                                alt=""
                                                src={post.author.imageUrl}
                                                className="size-6 flex-none rounded-full bg-white/10 dark:bg-gray-800/10"
                                            />
                                            {post.author.name}
                                        </div>
                                    </div>
                                </div>
                                <h3 className="mt-3 text-lg/6 font-semibold text-white">
                                    <a href={post.href}>
                                        <span className="absolute inset-0" />
                                        {post.title}
                                    </a>
                                </h3>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

const ValueCard = ({ value }) => (
    <div
        className="group relative flex flex-col items-start space-y-3 
               transition-all duration-500 hover:-translate-y-2"
    >
        {/* Colored bar */}
        <div
            className={`absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 
                 rounded-r-full transition-all duration-500 
                 group-hover:w-1 group-hover:bg-cyan-600 
                 `}
        />

        {/* Content */}
        <div className="pl-6">
            <h3
                className="text-xl font-semibold text-gray-900 
                   group-hover:text-transparent group-hover:bg-clip-text 
                   group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 
                   transition-all duration-500"
            >
                {value.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
        </div>

        {/* Glow */}
        <div
            className={`absolute -inset-4 bg-cyan-600 opacity-0 
                 blur-3xl rounded-3xl transition-opacity duration-500 
                 group-hover:opacity-10 -z-10`}
        />
    </div>
);
