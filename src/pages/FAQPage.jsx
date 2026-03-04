import { useState } from "react";
import { ChevronDown } from "lucide-react";

const categories = [
  "General",
  "Using Tools",
  "Account & Access",
  "Privacy & Security",
  "Technical Issues",
  "Support",
];

const faqsData = {
  General: [
    {
      q: "What is ToolNest?",
      a: "ToolNest is a free online platform offering productivity, developer, image, and converter tools to simplify everyday tasks.",
    },
    {
      q: "Do I need to create an account to use tools?",
      a: "No, most tools are completely free and do not require registration.",
    },
    {
      q: "Are the tools really free?",
      a: "Yes, ToolNest provides free access to all core tools without hidden charges.",
    },
    {
      q: "Can I use ToolNest on mobile devices?",
      a: "Yes, ToolNest is fully responsive and works smoothly on mobile, tablet, and desktop devices.",
    },
  ],

  "Using Tools": [
    {
      q: "How do I use the Password Generator?",
      a: "Simply select your desired length and options, then click generate to create a secure password instantly.",
    },
    {
      q: "How does the Image Compressor work?",
      a: "Upload your image and the tool automatically reduces file size while maintaining quality.",
    },
    {
      q: "Can I convert multiple files at once?",
      a: "Currently, tools support single-file processing for better speed and accuracy.",
    },
    {
      q: "Are the calculator results accurate?",
      a: "Yes, all calculations are processed using reliable mathematical logic for accurate results.",
    },
  ],

  "Account & Access": [
    {
      q: "How do I reset my password?",
      a: "Use the 'Forgot Password' option on the login page and follow the instructions sent to your email.",
    },
    {
      q: "Why can’t I access a specific tool?",
      a: "Ensure your browser is updated and JavaScript is enabled for proper functionality.",
    },
    {
      q: "Do you offer premium plans?",
      a: "Currently, ToolNest focuses on providing free tools. Premium features may be introduced in the future.",
    },
  ],

  "Privacy & Security": [
    {
      q: "Do you store uploaded files?",
      a: "No, uploaded files are processed instantly and not stored permanently on our servers.",
    },
    {
      q: "Is my data secure?",
      a: "Yes, we follow secure processing practices to ensure user data privacy.",
    },
    {
      q: "Are generated passwords saved?",
      a: "No, generated passwords are not stored or tracked.",
    },
  ],

  "Technical Issues": [
    {
      q: "Why is my file not uploading?",
      a: "Please check file size and format. Supported formats are mentioned on each tool page.",
    },
    {
      q: "The tool is not responding. What should I do?",
      a: "Try refreshing the page or clearing your browser cache.",
    },
    {
      q: "Which browsers are supported?",
      a: "ToolNest works best on modern browsers like Chrome, Edge, Firefox, and Safari.",
    },
  ],

  Support: [
    {
      q: "How can I contact support?",
      a: "You can contact us through the Contact page for inquiries, bug reports, or feature requests.",
    },
    {
      q: "How long does it take to receive a response?",
      a: "We typically respond within 24–48 hours.",
    },
    {
      q: "Can I request a new tool?",
      a: "Yes! We welcome feature requests and suggestions from users.",
    },
  ],
};

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState("General");
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="bg-white">
            {/* Hero */}
            <section className="pb-8 pt-20 px-6 text-center max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-medium text-gray-900">
                    Frequently Asked Questions
                </h1>
                <p className="mt-4 text-sm sm:text-base text-gray-600">
                    Everything you need to know about ToolNest. Can’t find an answer?
                    Contact our support team.
                </p>
            </section>

            {/* Categories */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                setOpenIndex(null);
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer
                                ${activeCategory === cat
                                    ? "bg-cyan-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <section className="max-w-4xl mx-auto px-6">
                    <div className="rounded-xl border border-slate-200 divide-y divide-slate-200 bg-white">
                        {faqsData[activeCategory].map((faq, index) => {
                            const isOpen = openIndex === index

                            return (
                                <div key={index}>
                                    {/* Question */}
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left group cursor-pointer"
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
                                        <div className="px-5 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>

            </div>

            {/* CTA */}
            <section className="mt-24 border-t border-gray-200 py-20 text-center px-6">
                <h2 className="text-3xl font-medium text-gray-900">
                    Still have questions?
                </h2>
                <p className="mt-3 text-gray-600">
                    Our support team is here to help you anytime.
                </p>
                <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="px-4 py-2 rounded-md bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-600/80">
                        Get started
                    </button>

                    <button className="px-4 py-2 rounded-md border border-cyan-600 text-cyan-600 text-sm font-medium hover:bg-slate-50">
                        Contact Us
                    </button>
                </div>

                {/* Helper text */}
                <p className="mt-6 text-sm text-slate-500">
                    Free trial available • No credit card required
                </p>
            </section>
        </div>
    );
}
