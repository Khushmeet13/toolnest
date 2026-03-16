import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import generators from "../../data/generatorTools";
import { ArrowRight, ArrowUp, ArrowUpIcon, ChevronRightIcon } from "lucide-react";
import ToolInterface from "./tools/AITextToolInterface";
import {
    BoltIcon,
    SparklesIcon,
    ShieldCheckIcon,
    CpuChipIcon,
    GlobeAltIcon,
    AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";
import HowItWorks from "./HowItWorks";
import FeatureSection from "./FeatureSection";
import ExampleSection from "./ExampleSection";
import FAQSection from "./FAQSection";
import InstagramCaptionGenerator from "./tools/InstagramCaption";
import EmailTemplateGenerator from "./tools/EmailTemplateGenerator";
import ResumeSummaryTool from "./tools/ResumeSummaryTool";
import FakeDataGenerator from "./tools/FakeDataGenerator";
import PasswordGenerator from "./tools/PasswordGenerator";
import UUIDGenerator from "./tools/UUIDGenerator";
import FakeCardGenerator from "./tools/FakeCardGenerator";
import QRCodeGenerator from "./tools/Qrcodegenerator";
import BarcodeGenerator from "./tools/Barcodegenerator";
import ColorPaletteGenerator from "./tools/Colorpalettegenerator";
import GradientGenerator from "./tools/Gradientgenerator";
import RandomNameGenerator from "./tools/Randomnamegenerator";
import RandomNumberGenerator from "./tools/Randomnumbergenerator";
import InvoiceGenerator from "./tools/InvoiceGenerator";
import DomainNameGenerator from "./tools/DomainNameGenerator";
import BrandNameGenerator from "./tools/BrandNameGenerator";
import MarketingStrategyGenerator from "./tools/MarketingStrategyGenerator";
import PricingsStrategyGenerator from "./tools/PricingStrategyGenerator";
import MemeGenerator from "./tools/MemeGenerator";
import EmojiGenerator from "./tools/EmojiGenerator";
import ChallengeGenerator from "./tools/ChallengeGenerator";
import PollGenerator from "./tools/PollGenerator";
import TruthOrDare from "./tools/TruthOrDareGenerator";
import EmojiMovieGuess from "./tools/EmojiMovieGuess";
import DumbCharades from "./tools/DumbCharades";
import ColorCodeGenerator from "./tools/ColorCodeGenerator";
import ColorShadesGenerator from "./tools/ColorShadesGenerator";
import SkeletonLoaderGenerator from "./tools/SkeletonLoaderGenerator";

const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, "-");

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

const toolComponents = {
    "instagram-caption-generator": InstagramCaptionGenerator,
    "ai-text-generator": ToolInterface,
    "email-template-generator": EmailTemplateGenerator,
    "resume-summary-generator": ResumeSummaryTool,
    "fake-data-generator": FakeDataGenerator,
    "password-generator": PasswordGenerator,
    "uuid-generator": UUIDGenerator,
    "fake-credit-card-generator": FakeCardGenerator,
    "qr-code-generator": QRCodeGenerator,
    "barcode-generator": BarcodeGenerator,
    "color-palette-generator": ColorPaletteGenerator,
    "gradient-generator": GradientGenerator,
    "color-code-generator": ColorCodeGenerator,
    "color-shades-generator": ColorShadesGenerator,
    "skeleton-loader-generator": SkeletonLoaderGenerator,
    "random-name-generator": RandomNameGenerator,
    "random-number-generator": RandomNumberGenerator,
    "invoice-generator": InvoiceGenerator,
    "domain-name-generator": DomainNameGenerator,
    "brand-name-generator": BrandNameGenerator,
    "marketing-strategy-generator": MarketingStrategyGenerator,
    "pricing-strategy-generator": PricingsStrategyGenerator,
    "meme-generator": MemeGenerator,
    "emoji-generator": EmojiGenerator,
    "random-challenge-generator": ChallengeGenerator,
    "poll-generator": PollGenerator,
    "truth-or-dare-generator": TruthOrDare,
    "emoji-movie-guess": EmojiMovieGuess,
    "dumb-charades-generator": DumbCharades
};


export default function GeneratorSinglePage() {
    const { slug } = useParams();
    const ToolComponent = toolComponents[slug];


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

            {ToolComponent ? (
                <ToolComponent />
            ) : (
                <ToolInterface tool={tool} />
            )}
            <FeatureSection />
            <HowItWorks />
            <ExampleSection />

            {/* Related Tools */}
            <section className="relative bg-white py-16 px-6 overflow-hidden">

                {/* Subtle dot grid */}

                <div className="relative z-20 max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
                        <div>

                            <h2 className="text-4xl font-medium text-gray-900 tracking-tight leading-tight">
                                Related <span className="text-cyan-700">generators</span>
                            </h2>
                            <p className="mt-2 text-base text-gray-500 max-w-md leading-relaxed">
                                Explore more AI-powered tools built to save you time and sharpen your writing.
                            </p>
                        </div>

                        <Link
                            to="/generators"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-emerald-800 transition-colors duration-150 whitespace-nowrap group"
                        >
                            View all tools
                            <span className="transition-transform duration-200 group-hover:translate-x-1">
                                <ArrowUp size={14} />
                            </span>
                        </Link>
                    </div>

                    {/* Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden">
                        {relatedTools.map((tool) => {
                            const Icon = tool.icon;

                            return (

                                <Link
                                    key={tool.id}
                                    to={`/generators/${slugify(tool.title)}`}
                                    className="group relative bg-white  p-7 flex flex-col gap-4 transition-colors duration-200 cursor-pointer overflow-hidden"
                                >
                                    {/* Top hover accent */}
                                    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Spotlight */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                        style={{
                                            background:
                                                "radial-gradient(circle at 50% 0%, rgba(8,145,178,0.08) 0%, transparent 70%)",
                                        }}
                                    />

                                    {/* Icon + badge row */}
                                    <div className="flex items-start gap-2">
                                        <div className="flex items-center justify-center text-xl rounded-xl transition-all duration-300">
                                            <Icon className="w-5 h-5 text-cyan-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 leading-snug tracking-tight group-hover:text-cyan-800 transition-colors duration-150">
                                            {tool.title}
                                        </h3>
                                    </div>

                                    {/* Text */}
                                    <div>
                                        <p className=" text-xs text-gray-400 group-hover:text-gray-500 leading-relaxed transition-colors duration-150">
                                            {tool.description}
                                        </p>
                                    </div>

                                    {/* Arrow — appears on hover */}
                                    <div className="flex items-center gap-1 text-xs font-semibold text-cyan-600 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                                        Try it free <ArrowUpIcon size={14} />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
                        <p className="text-sm text-gray-400">
                            Can't find what you need?{" "}
                            <Link to="/suggest" className="text-cyan-600 font-semibold hover:underline">
                                Suggest a tool →
                            </Link>
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                            {relatedTools.length} tools available · New added weekly
                        </div>
                    </div>

                </div>
            </section>

            <FAQSection />

        </div>
    );
}