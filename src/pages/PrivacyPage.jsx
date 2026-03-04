import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

const sections = [
  { id: "intro", title: "Introduction" },
  { id: "data-collection", title: "Information We Collect" },
  { id: "data-use", title: "How We Use Your Information" },
  { id: "data-sharing", title: "Data Sharing & Third Parties" },
  { id: "data-security", title: "Data Storage & Security" },
  { id: "user-rights", title: "User Rights" },
  { id: "cookies", title: "Cookies & Tracking" },
  { id: "children", title: "Children's Privacy" },
  { id: "policy-changes", title: "Changes to Privacy Policy" },
  { id: "contact", title: "Contact Information" },
];

const privacyContent = {
  intro: `
ToolNest respects your privacy and is committed to protecting your personal information.
This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and tools.
By accessing ToolNest, you agree to the practices described in this policy.
`,

  "data-collection": `
We may collect limited information including:
• Basic usage data (browser type, device, pages visited)
• Voluntary information submitted via contact forms
• Uploaded files for processing (temporary and not permanently stored)

We do not require account registration for most tools.
`,

  "data-use": `
We use collected information to:
• Improve tool performance and user experience
• Monitor website traffic and analytics
• Respond to support inquiries
• Maintain platform security and prevent abuse

We do not sell your personal data.
`,

  "data-sharing": `
ToolNest does not sell or rent your personal information.
We may use trusted third-party services for:
• Website analytics
• Performance monitoring
• Hosting infrastructure

These providers only access necessary technical data.
`,

  "data-security": `
We implement industry-standard security practices to protect user data.
Uploaded files are processed instantly and not stored permanently.
We regularly monitor our systems for vulnerabilities and threats.
`,

  "user-rights": `
You have the right to:
• Request information about collected data
• Ask for correction or deletion of submitted information
• Disable cookies via browser settings
• Contact us regarding privacy concerns

For any data-related request, please contact our support team.
`,

  cookies: `
ToolNest uses cookies to:
• Improve website functionality
• Analyze traffic and performance
• Remember user preferences (if applicable)

You can disable cookies in your browser settings at any time.
`,

  children: `
ToolNest is not intended for children under the age of 13.
We do not knowingly collect personal information from children.
If you believe a child has submitted personal data, please contact us for removal.
`,

  "policy-changes": `
We may update this Privacy Policy from time to time.
Changes will be reflected on this page with an updated revision date.
We encourage users to review this page periodically.
`,

  contact: `
If you have questions about this Privacy Policy, you may contact us via:
• Our Contact page
• Official support email (listed on the website)

We aim to respond within 24–48 hours.
`,
};

export default function PrivacyPage() {
  const [activeId, setActiveId] = useState(sections[0].id);
  const sectionRefs = useRef({});

  // Scroll to section with offset
  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      const yOffset = -120; // height of sticky sidebar + heading
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      let current = sections[0].id;

      sections.forEach((section) => {
        const el = sectionRefs.current[section.id];
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top - 20 <= 0) current = section.id; // 130 = sticky header offset
        }
      });

      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // set initial active section
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Page Heading */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
           Learn how ToolNest collects, processes, and protects your information while using our online tools and services.
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex gap-8">
        {/* Left Sidebar */}
        <div className="w-1/4 sticky top-32 self-start">
          <ul className="space-y-4">
            {sections.map((section, index) => (
              <li
                key={section.id}
                className={`flex items-center cursor-pointer transition-colors ${activeId === section.id
                    ? "text-cyan-600 font-semibold"
                    : "text-gray-600"
                  }`}
                onClick={() => scrollToSection(section.id)}
              >
                <span className="mr-2 font-bold">{index + 1}.</span>
                <span>{section.title}</span>
                {activeId === section.id && (
                  <ChevronRight className="ml-auto w-5 h-5" />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Content */}
        <div className="w-3/4 space-y-16">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className="scroll-mt-32"
            >
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              {/* <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                convallis dolor sit amet eros cursus, eget tristique felis
                facilisis. Pellentesque habitant morbi tristique senectus et
                netus et malesuada fames ac turpis egestas. Integer vel turpis
                non sapien viverra tempus.
              </p> */}
              {privacyContent[section.id]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
