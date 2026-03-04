import {
    SparklesIcon,
    PhotoIcon,
    CodeBracketIcon,
    CalculatorIcon,
} from "@heroicons/react/24/outline";
import {
    ChevronDown,
    BookOpen,
    PlayCircle,
    FileText,
    HelpCircle,
} from "lucide-react";
import { useState } from "react";
import ContactForm from "../components/contact/ContactForm";


export default function Contact() {
    const [openIndex, setOpenIndex] = useState(null);
    return (
        <div className="relative isolate bg-white">
            {/* ================= HERO ================= */}
            <div className="mx-auto max-w-7xl px-6 pt-20 pb-10">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-medium text-gray-900">
                        Support & Help Center
                    </h1>
                    <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                        Need help? Find answers quickly or reach out to our support team.
                        We’re here to help students, teachers, and institutes.
                    </p>
                </div>
            </div>

            {/* ================= QUICK HELP ================= */}
            <div className="mx-auto max-w-7xl px-6 mt-5">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            title: "Generator Tools",
                            desc: "Password, QR Code & more instant generators",
                            icon: SparklesIcon,
                        },
                        {
                            title: "Image Tools",
                            desc: "Compress, convert & optimize images easily",
                            icon: PhotoIcon,
                        },
                        {
                            title: "Developer Tools",
                            desc: "JSON formatter, Base64 & color utilities",
                            icon: CodeBracketIcon,
                        },
                        {
                            title: "Converters & Calculators",
                            desc: "Unit, percentage & smart converters",
                            icon: CalculatorIcon,
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="rounded-lg border border-gray-200 p-4 hover:shadow-md hover:shadow-cyan-100 transition"
                        >
                            <div className="flex items-center gap-2">

                                <item.icon className="h-6 w-6 text-cyan-600" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {item.title}
                                </h3>
                            </div>
                            <p className="mt-3 text-sm text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= FAQ ================= */}
            <div className="mx-auto max-w-4xl px-6 mt-10">
                <h2 className="text-3xl font-semibold text-gray-900 text-center mb-5">
                    Common Queries
                </h2>

                <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
                    {[
                        {
                            q: "Is ToolNest completely free to use?",
                            a: "Yes, most tools on ToolNest are free to use with no registration required.",
                        },
                        {
                            q: "Do you store uploaded images or data?",
                            a: "No, we respect your privacy. Files and data are processed instantly and not stored on our servers.",
                        },
                        {
                            q: "Why is my image not uploading?",
                            a: "Please check the file size and format. Supported formats are JPG, PNG, and WEBP.",
                        },
                        {
                            q: "How accurate are the calculators and converters?",
                            a: "All tools use reliable calculation logic to ensure accurate and real-time results.",
                        },
                    ].map((faq, i) => {
                        const isOpen = openIndex === i;

                        return (
                            <div key={i} className="bg-white">
                                {/* Question */}
                                <button
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : i)
                                    }
                                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left cursor-pointer"
                                >
                                    <span className="text-sm sm:text-base font-medium text-slate-900">
                                        {faq.q}
                                    </span>

                                    <ChevronDown
                                        size={18}
                                        className={`shrink-0 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {/* Answer */}
                                {isOpen && (
                                    <div className="px-5 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed text-start">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ================= CONTACT + FORM ================= */}
            <ContactForm />

            {/* ================= HELP BY CATEGORY ================= */}
            <div className="mx-auto max-w-7xl px-6 mt-16">
                <h2 className="text-3xl font-semibold text-gray-900 text-center">
                    Find help by category
                </h2>
                <p className="mt-3 text-center text-gray-600 max-w-2xl mx-auto">
                    Browse our help center by topic and get quick answers with detailed guides
                    and step-by-step instructions.
                </p>


                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        "Getting Started",
                        "Using Tools",
                        "Account & Access",
                        "Bug Reports",
                        "Feature Requests",
                        "Privacy & Data Policy",
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="rounded-lg border border-gray-200 p-4 hover:shadow-cyan-100 hover:shadow-md transition"
                        >
                            <h3 className="text-lg font-semibold text-gray-900">{item}</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Explore guides and step-by-step help articles.
                            </p>
                            <button className="mt-4 text-sm font-medium text-cyan-600 hover:underline">
                                View articles →
                            </button>
                        </div>
                    ))}
                </div>
            </div>


            {/* ================= SELF HELP RESOURCES ================= */}
            <div className="mx-auto max-w-7xl px-6 mt-20">
                <h2 className="text-3xl font-semibold text-gray-900 text-center">
                    Helpful resources
                </h2>
                <p className="mt-3 text-center text-gray-600 max-w-2xl mx-auto">
                    Access detailed guides, documentation, and tutorials to make the most of our
                    platform.
                </p>


                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            title: "Guides",
                            desc: "Step-by-step instructions to help you get started quickly.",
                            icon: BookOpen,
                        },
                        {
                            title: "Tool Usage Tips",
                            desc: "Best practices for getting accurate and fast results.",
                            icon: PlayCircle,
                        },
                        {
                            title: "Developer Resources",
                            desc: "Advanced formatting, encoding, and conversion documentation.",
                            icon: FileText,
                        },
                        {
                            title: "FAQs & Help",
                            desc: "Find quick answers to common questions and troubleshooting tips.",
                            icon: HelpCircle,
                        },
                    ].map((res, i) => (
                        <div
                            key={i}
                            className="group relative rounded-lg border border-gray-200 bg-white p-6 transition cursor-pointer"
                        >
                            {/* Icon */}
                            <div className="flex items-center gap-2">
                                <res.icon className="h-5 w-5 text-cyan-600" />
                                 {/* Content */}
                            <h3 className="text-base font-semibold text-gray-900">
                                {res.title}
                            </h3>
                            </div>

                            <p className="mt-3 text-sm text-gray-600">
                                {res.desc}
                            </p>

                            {/* CTA */}
                            <button className="mt-4 text-sm font-medium text-cyan-600 group-hover:underline">
                                Explore →
                            </button>
                        </div>
                    ))}
                </div>

            </div>



            {/* ================= FEEDBACK ================= */}
            <div className="mx-auto max-w-4xl px-6 mt-20 pb-10 text-center">
                <h2 className="text-3xl font-semibold text-gray-900">
                    Was this helpful?
                </h2>

                <textarea
                    rows={3}
                    placeholder="Share your feedback or suggestions..."
                    className="mt-6 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />

                <button className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600/80 cursor-pointer">
                    Submit Feedback
                </button>
            </div>



        </div>
    );
}
