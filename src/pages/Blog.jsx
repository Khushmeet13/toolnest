import { Link } from "react-router-dom";
import { useState } from "react";

const categories = [
    "All",
    "Generators",
    "Converters",
    "Dev Tools",
    "Image Tools",
    "Text Tools",
    "Popular Tools",
    "Newly Added",
];

const blogs = [
    {
        id: 1,
        title: "Secure Password Generator",
        description:
            "Create strong and secure passwords instantly with customizable length, symbols, numbers, and uppercase options.",
        date: "Mar 01, 2026",
        category: "Generators",
        featured: true,
        image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7",
    },
    {
        id: 2,
        title: "Image to PNG Converter",
        description:
            "Convert JPG, WEBP, and other image formats to high-quality PNG in seconds without losing resolution.",
        date: "Feb 26, 2026",
        category: "Image Tools",
        image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97",
    },
    {
        id: 3,
        title: "JSON Formatter & Validator",
        description:
            "Format, beautify, and validate JSON data instantly for clean and readable structured output.",
        date: "Feb 22, 2026",
        category: "Dev Tools",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    },
    {
        id: 4,
        title: "Text Case Converter",
        description:
            "Convert text to uppercase, lowercase, title case, and more with one click.",
        date: "Feb 20, 2026",
        category: "Text Tools",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
    },
    {
        id: 5,
        title: "Unit Converter",
        description:
            "Convert length, weight, temperature, speed, and other units quickly and accurately.",
        date: "Feb 18, 2026",
        category: "Converters",
        image: "https://images.unsplash.com/photo-1581090700227-1e8fef6e8c63",
    },
    {
        id: 6,
        title: "Base64 Encoder & Decoder",
        description:
            "Encode and decode Base64 strings instantly for development and security needs.",
        date: "Feb 15, 2026",
        category: "Dev Tools",
        image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
    },
    {
        id: 7,
        title: "Image Compressor",
        description:
            "Reduce image file size without compromising quality. Perfect for websites and social media.",
        date: "Feb 12, 2026",
        category: "Image Tools",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    },
    {
        id: 8,
        title: "QR Code Generator",
        description:
            "Generate custom QR codes for URLs, text, contact details, and more instantly.",
        date: "Feb 10, 2026",
        category: "Generators",
        image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf",
    },
    {
        id: 9,
        title: "Word Counter Tool",
        description:
            "Count words, characters, sentences, and paragraphs in real-time while typing.",
        date: "Feb 08, 2026",
        category: "Text Tools",
        image: "https://images.unsplash.com/photo-1484417894907-623942c8ee29",
    },
    {
        id: 10,
        title: "Color Picker & HEX Generator",
        description:
            "Pick colors visually and generate HEX, RGB, and HSL codes instantly.",
        date: "Feb 05, 2026",
        category: "Dev Tools",
        image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    },
    {
        id: 11,
        title: "Percentage Calculator",
        description:
            "Quickly calculate percentages, discounts, and increases with accurate results.",
        date: "Feb 03, 2026",
        category: "Converters",
        image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0",
    },
    {
        id: 12,
        title: "New Tools Added This Month",
        description:
            "Explore the latest tools added to ToolNest to boost your productivity and workflow.",
        date: "Feb 01, 2026",
        category: "Newly Added",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
];

const Blog = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBlogs = blogs.filter((blog) => {
        const matchesCategory =
            activeCategory === "All" || blog.category === activeCategory;

        const matchesSearch =
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const latestBlog = blogs.find((b) => b.featured);

    // Blogs that match search only (for the div under search)
    const searchResults = blogs.filter(
        (blog) =>
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full bg-white">
            {/* ================= HERO ================= */}
            <section className="relative flex items-center justify-center px-6 pt-14">
                <div className="text-center space-y-3">
                    <h1 className="text-3xl sm:text-3xl text-black font-medium">
                        ToolNest Tools
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
                        Discover powerful generators, converters, developer tools, image tools and more — all in one place.
                    </p>
                </div>
            </section>

            {/* ================= SEARCH + CATEGORY FILTER ================= */}
            <section className="max-w-7xl mx-auto px-6 pb-10 space-y-8 pt-8">
                {/* SEARCH BAR */}
                <div className="flex justify-center relative">
                    <div className="w-full max-w-xl relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search blogs..."
                            className="w-full px-5 py-2 rounded-full border border-gray-300 text-sm text-black placeholder-gray-400 focus:outline-none"
                        />
                        <svg
                            className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                            />
                        </svg>

                        {/* SEARCH RESULTS DIV */}
                        {searchQuery && searchResults.length > 0 && (
                            <div className="absolute top-full mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                {searchResults.map((blog) => {
                                    const slug = blog.title
                                        .toLowerCase()
                                        .replace(/[^a-z0-9]+/g, "-")
                                        .replace(/^-+|-+$/g, "");

                                    return (
                                        <Link
                                            key={blog.id}
                                            to={`/blog/${slug}`}
                                            className="px-4 py-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0 flex justify-between items-start cursor-pointer"
                                        >
                                            <div className="flex-1 pr-4">
                                                <p className="text-sm font-medium text-black">{blog.title}</p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                    {blog.description}
                                                </p>
                                            </div>

                                            <span className="text-xs font-medium text-cyan-600 hover:underline mt-10 flex-shrink-0">
                                                Read more →
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}


                    </div>
                </div>

                {/* CATEGORIES */}
                <div className="flex flex-wrap gap-3 justify-center">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-1 rounded-full text-sm border transition cursor-pointer ${activeCategory === cat
                                ? "bg-gray-50 text-cyan-600 "
                                : "bg-white text-gray-600 border-gray-300"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* ================= LATEST BLOG ================= */}
            {/* {latestBlog && (
                <section className="max-w-7xl mx-auto px-6 mb-20">
                    <Link
                        to={`/blog/${latestBlog.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "")}`}
                        className="block border border-gray-200 rounded-2xl p-8 md:p-12 hover:shadow-md transition"
                    >
                        <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
                            Latest Blog
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-black mb-4">
                            {latestBlog.title}
                        </h2>
                        <p className="text-gray-500 max-w-3xl mb-6">{latestBlog.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">{latestBlog.date}</span>
                            <span className="text-sm font-medium text-black hover:underline">
                                Read more →
                            </span>
                        </div>
                    </Link>
                </section>
            )} */}


            {/* ================= BLOG GRID ================= */}
            <section className="max-w-7xl mx-auto px-6 pb-10">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBlogs.map((blog) => {
                        const slug = blog.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "");

                        return (
                            <>
                                <div className="group overflow-hidden bg-white flex flex-col">
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <span className="text-xs text-gray-400 mb-2">{blog.category}</span>
                                        <h3 className="text-lg font-semibold text-black mb-2 leading-snug">
                                            {blog.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm flex-grow">{blog.description}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-400">{blog.date}</span>
                                            <Link
                                                key={blog.id}
                                                to={`/blog/${slug}`}
                                                className=""
                                            >
                                                <span className="text-sm text-cyan-600 font-medium">
                                                    Read more →
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Blog;
