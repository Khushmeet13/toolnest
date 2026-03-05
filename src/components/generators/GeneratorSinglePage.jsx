import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import generators from "../../data/generatorTools";
import { ArrowRight, ChevronRightIcon } from "lucide-react";
import ToolInterface from "./ToolInterface";
import {
    BoltIcon,
    SparklesIcon,
    ShieldCheckIcon,
    CpuChipIcon,
    GlobeAltIcon,
    AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";

const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, "-");


const toolFeatures = [
    {
        title: "Lightning Fast",
        description:
            "Generate AI text instantly with optimized processing and powerful AI models.",
        icon: BoltIcon
    },
    {
        title: "AI Powered",
        description:
            "Advanced AI technology generates accurate, high-quality text for any use case.",
        icon: CpuChipIcon
    },
    {
        title: "Multiple Writing Styles",
        description:
            "Choose from Formal, Casual, Expand, or Shorten to get the exact tone you need.",
        icon: AdjustmentsHorizontalIcon
    },
    {
        title: "Secure & Private",
        description:
            "Your prompts and generated results stay completely private and secure.",
        icon: ShieldCheckIcon
    },
    {
        title: "Works Everywhere",
        description:
            "Access the tool from any device — desktop, tablet, or mobile.",
        icon: GlobeAltIcon
    },
    {
        title: "Smart Results",
        description:
            "AI understands your input and generates meaningful and relevant results.",
        icon: SparklesIcon
    }
];

const slides = [
  {
    prompt: "Generate a caption for a graphic designer's latest logo reveal.",
    result:
      "Excited to unveil my latest creation! 🎨✨ Here's the new logo that captures the essence of the brand. #LogoDesign #CreativeProcess",
  },
  {
    prompt: "Explain blockchain technology in simple terms.",
    result:
      "Blockchain is a digital ledger that stores transactions securely across many computers. It ensures transparency and prevents data manipulation.",
  },
  {
    prompt: "Write a short product description for wireless earbuds.",
    result:
      "Experience crystal-clear sound with our wireless earbuds. Lightweight design, long battery life, and immersive audio for your everyday music.",
  },
];


export default function GeneratorSinglePage() {
    const { slug } = useParams();

    const tool = generators.find(
        (t) => slugify(t.title) === slug
    );

    const features = [
        { name: "Fast generation", value: "Instant" },
        { name: "Free to use", value: "100%" },
        { name: "No signup required", value: "0 Steps" },
        { name: "Tool category", value: tool.category },
    ];

    const links = [
        { name: "How it works", href: "#how-it-works" },
        { name: "Examples", href: "#examples" },
        { name: "Related tools", href: "#related-tools" },
        { name: "FAQs", href: "#faq" },
    ];

    const relatedTools = generators
        .filter((t) => t.category === tool.category && t.id !== tool.id)
        .slice(0, 4);

    if (!tool) return <div className="p-20 text-center">Tool not found</div>;

     const [active, setActive] = useState(0);

  const prevIndex = (active - 1 + slides.length) % slides.length;
  const nextIndex = (active + 1) % slides.length;

    return (
        <div className="bg-white dark:bg-gray-900">

            <div className="relative isolate overflow-hidden bg-white py-20 dark:bg-gray-900">

                {/* Background image */}
                <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
                    className="absolute inset-0 -z-10 h-full w-full object-cover opacity-10 dark:opacity-5"
                    alt=""
                />

                {/* Gradient Blur */}
                <div
                    aria-hidden="true"
                    className="absolute -top-40 left-1/2 -z-10 transform -translate-x-1/2 blur-3xl"
                >
                    <div
                        style={{
                            clipPath:
                                "polygon(74% 44%,100% 61%,97% 27%,85% 0%,80% 2%,72% 32%,60% 62%,52% 68%,47% 58%,45% 34%,27% 76%,0% 64%,17% 100%,27% 76%,76% 97%,74% 44%)",
                        }}
                        className="aspect-[1097/845] w-[70rem] bg-gradient-to-tr from-cyan-400 to-blue-500 opacity-20"
                    />
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8">

                    {/* Breadcrumb */}
                    <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Link to="/" className="hover:text-cyan-600">Home</Link>

                        <ChevronRightIcon className="w-4 h-4 mx-1" />

                        <Link to="/generators" className="hover:text-cyan-600">Generators</Link>

                        <ChevronRightIcon className="w-4 h-4 mx-1" />

                        <span className="text-cyan-600 dark:text-gray-200">{tool.title}</span>
                    </div>

                    <div className="mx-auto max-w-2xl lg:mx-0">

                        {/* Tool Title */}
                        <h1 className="text-5xl font-medium tracking-tight text-gray-900 dark:text-white">
                            {tool.title}
                        </h1>

                        {/* Description */}
                        <p className="mt-3 text-base text-gray-700 dark:text-gray-300">
                            {tool.description}
                        </p>

                        {/* Category Badge */}
                        {/* <span className="inline-block mt-6 rounded-full bg-cyan-100 px-4 py-1 text-sm font-medium text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                            {tool.category}
                        </span> */}

                        {/* CTA Button */}
                        <div className="mt-8">
                            <a
                                href="#tool"
                                className="inline-flex items-center rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-cyan-700 transition"
                            >
                                Use Tool →
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mx-auto mt-6 max-w-2xl lg:mx-0 lg:max-w-none">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold text-gray-900 sm:grid-cols-2 md:flex lg:gap-x-6 dark:text-white">
                            {links.map((link) => (
                                <a key={link.name} href={link.href} className="hover:text-cyan-600 flex items-center gap-2">
                                    {link.name} <ArrowRight size={14} className="mt-1" />
                                </a>
                            ))}
                        </div>

                        {/* Tool Stats */}
                        <dl className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature) => (
                                <div key={feature.name} className="flex flex-col-reverse gap-1">
                                    <dt className="text-base text-gray-700 dark:text-gray-300">
                                        {feature.name}
                                    </dt>
                                    <dd className="text-3xl font-semibold text-cyan-600 dark:text-white">
                                        {feature.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                    </div>
                </div>
            </div>

            <ToolInterface tool={tool} />


            {/* Features Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">

                <div className="max-w-7xl mx-auto px-6">

                    {/* Heading */}
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Powerful Features
                        </h2>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                            Everything you need to generate AI text quickly and efficiently.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

                        {toolFeatures.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={index}
                                    className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 transition hover:shadow-xl hover:-translate-y-1"
                                >

                                    {/* Icon */}
                                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white mb-5">
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Hover Glow */}
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-indigo-500/5 to-cyan-500/5"></div>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </section>


            {/* How It Works */}
               <section className="py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          See how it works
        </h2>

        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Get inspired by these text generation prompts
        </p>

        <div className="relative mt-16">

          {/* LEFT CARD */}
          <div className="hidden lg:block absolute left-0 top-14 w-72 transform -translate-x-10 opacity-40 blur-sm transition-all duration-500">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
              <p className="text-sm text-gray-500">
                {slides[prevIndex].prompt}
              </p>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="hidden lg:block absolute right-0 top-14 w-72 transform translate-x-10 opacity-40 blur-sm transition-all duration-500">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
              <p className="text-sm text-gray-500">
                {slides[nextIndex].prompt}
              </p>
            </div>
          </div>

          {/* CENTER PROMPT */}
          <div className="inline-block bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow mb-6 text-sm font-medium">
            {slides[active].prompt}
          </div>

          {/* RESULT CARD */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-left transition-all duration-500">

            <SparklesIcon className="w-6 h-6 text-emerald-500 mb-4" />

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {slides[active].result}
            </p>

          </div>

          {/* DOTS */}
          <div className="flex justify-center gap-3 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  active === i
                    ? "w-8 bg-emerald-600"
                    : "w-3 bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* CTA */}
          <button className="mt-10 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-medium transition">
            Try AI text generator
          </button>

        </div>
      </div>
    </section>

            {/* Example Output */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-4xl mx-auto px-6 text-center">

                    <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                        Example Output
                    </h2>

                    <div className="space-y-3">

                        <div className="bg-white dark:bg-gray-900 border rounded-lg p-4">
                            Example Result 1
                        </div>

                        <div className="bg-white dark:bg-gray-900 border rounded-lg p-4">
                            Example Result 2
                        </div>

                        <div className="bg-white dark:bg-gray-900 border rounded-lg p-4">
                            Example Result 3
                        </div>

                    </div>

                </div>
            </section>

            {/* Related Tools */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-6">

                    <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
                        Related Tools
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6">

                        {relatedTools.map((tool) => (
                            <Link
                                key={tool.id}
                                to={`/generators/${slugify(tool.title)}`}
                                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow"
                            >
                                <h3 className="font-semibold">{tool.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    {tool.description}
                                </p>
                            </Link>
                        ))}

                    </div>

                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-4xl mx-auto px-6">

                    <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">

                        <div>
                            <h3 className="font-semibold text-lg">
                                Is this tool free to use?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Yes, all tools on ToolNest are completely free to use.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">
                                Can I use it unlimited times?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Yes, there are no usage limits.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">
                                Do I need to sign up?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                No signup is required.
                            </p>
                        </div>

                    </div>

                </div>
            </section>

        </div>
    );
}