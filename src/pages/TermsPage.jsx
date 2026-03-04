import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

const sections = [
  { id: "intro", title: "Agreement to Terms" },
  { id: "services", title: "Use of Our Services" },
  { id: "user-responsibilities", title: "User Responsibilities" },
  { id: "intellectual-property", title: "Intellectual Property Rights" },
  { id: "limitations", title: "Limitations of Liability" },
  { id: "prohibited", title: "Prohibited Activities" },
  { id: "termination", title: "Termination of Access" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "changes", title: "Changes to These Terms" },
  { id: "contact", title: "Contact Information" },
];

const termsContent = {
  intro: `
By accessing or using ToolNest, you agree to be bound by these Terms & Conditions.
If you do not agree with any part of these terms, you must discontinue use of our services immediately.
`,

  services: `
ToolNest provides free online productivity, developer, and image processing tools.
We reserve the right to modify, suspend, or discontinue any tool at any time without prior notice.
`,

  "user-responsibilities": `
Users agree to:
• Use the platform only for lawful purposes
• Not attempt to disrupt or compromise system security
• Not misuse tools for illegal, harmful, or abusive activities
• Provide accurate information when contacting support
`,

  "intellectual-property": `
All content, branding, design, and tool logic on ToolNest are protected by intellectual property laws.
You may not copy, reproduce, or redistribute platform materials without written permission.
`,

  limitations: `
ToolNest provides tools "as is" without warranties of any kind.
We are not responsible for:
• Data loss
• Incorrect results due to improper input
• Temporary service interruptions
• Damages resulting from tool usage
`,

  prohibited: `
You may not:
• Use automated bots to overload the system
• Upload malicious or harmful files
• Attempt to reverse-engineer or exploit our services
• Violate any applicable laws while using the platform
`,

  termination: `
We reserve the right to restrict or terminate access to users who violate these terms without prior notice.
`,

  "third-party": `
Some features may rely on third-party services such as hosting or analytics providers.
ToolNest is not responsible for third-party service disruptions or policies.
`,

  changes: `
We may update these Terms & Conditions at any time.
Continued use of ToolNest after changes are posted constitutes acceptance of the updated terms.
`,

  contact: `
If you have any questions regarding these Terms & Conditions, please contact us through our official Contact page.
We aim to respond within 24–48 hours.
`,
};

export default function Terms() {
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
          if (top - 130 <= 0) current = section.id; // 130 = sticky header offset
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
        <h1 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-4">
          Terms & Conditions
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
          Please read these Terms & Conditions carefully before using ToolNest.
          By accessing our tools, you agree to comply with these terms.
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
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {termsContent[section.id]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
