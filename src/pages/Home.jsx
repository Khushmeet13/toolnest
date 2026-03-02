import { toolCategories } from "../data/toolCategories";
import HeroSection from "../components/home/HeroSection";
import {
  QrCode,
  FileText,
  Image,
  Ruler,
  Calculator,
  Type,
  Code,
  ShieldCheck,
  Braces,
  Folder,
  Archive,
  ClipboardList,
  Link,
  Palette,
  PenTool,
  Search,
  CalendarDays,
  Receipt,
  Code2,
  GraduationCap,
  Globe,
  Briefcase,
  Database,
  Sparkles,
  BarChart3,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import {
  BoltIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
  CursorArrowRaysIcon,
  ArrowUpTrayIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";
import whychoose from "../assets/img/whychoose.png";
import step1 from "../assets/videos/step1.mp4";
import step2 from "../assets/videos/step2.mp4";
import step3 from "../assets/videos/step3.mp4";
import step4 from "../assets/videos/step4.mp4";

const features = [
  {
    name: "Lightning Fast.",
    description:
      "All tools run instantly in your browser with optimized performance and zero waiting time.",
    icon: BoltIcon,
  },
  {
    name: "Privacy Focused.",
    description:
      "Your files and data never leave your device. Everything is processed locally.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Completely Free.",
    description:
      "No subscriptions, no hidden costs, and no usage limits. Just open and use.",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Fully Responsive.",
    description:
      "Seamless experience across desktop, tablet, and mobile devices.",
    icon: DevicePhoneMobileIcon,
  },
];


export default function Home() {
  return (
    <div className="">
      <HeroSection />

      <section className="relative py-20 bg-white overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6">

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 tracking-tight">
              Powerful Tools for Modern Workflows
            </h2>

            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              A curated suite of professional utilities built for developers,
              creators, and businesses — fast, secure, and beautifully designed.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="mt-24 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">

            {[
              { icon: QrCode, name: "QR Generator" },
              { icon: FileText, name: "PDF Tools" },
              { icon: Image, name: "Image Converter" },
              { icon: Ruler, name: "Unit Converter" },
              { icon: Calculator, name: "Calculator" },
              { icon: Type, name: "Text Tools" },
              { icon: Code, name: "Code Formatter" },
              { icon: ShieldCheck, name: "Password Generator" },
              { icon: Braces, name: "JSON Formatter" },
              { icon: Folder, name: "File Converter" },
              { icon: Archive, name: "ZIP Extractor" },
              { icon: ClipboardList, name: "Form Builder" },
              { icon: Link, name: "URL Shortener" },
              { icon: Palette, name: "Color Picker" },
              { icon: PenTool, name: "Signature Maker" },
              { icon: Search, name: "SEO Tools" },
              { icon: CalendarDays, name: "Date Calculator" },
              { icon: Receipt, name: "Invoice Generator" }
            ].map((tool, i) => {
              const Icon = tool.icon;

              return (
                <div
                  key={i}
                  className="group relative bg-white/70 backdrop-blur-sm border border-gray-200
                       rounded-lg p-4 flex flex-col items-center justify-center
                       transition-all duration-300
                       hover:border-cyan-600 hover:shadow-md hover:shadow-cyan-100 hover:-translate-y-1 cursor-pointer"
                >

                  {/* Icon */}
                  <div className="
                            flex items-center justify-center
                            group-hover:bg-gray-50 transition">
                    <Icon className="w-6 h-6 text-gray-700 group-hover:text-cyan-600 transition" />
                  </div>

                  {/* Tool Name */}
                  <p className="mt-4 text-sm font-medium text-gray-800 text-center">
                    {tool.name}
                  </p>

                  {/* Subtle hover glow */}
                  {/* <div className="absolute inset-0 rounded-lg opacity-0 
                            group-hover:opacity-100 transition
                            bg-gradient-to-br from-indigo-500/5 to-purple-500/5" /> */}
                </div>
              );
            })}

          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <button className="px-5 py-2.5 rounded-lg bg-cyan-600 text-white 
                         font-medium text-sm tracking-wide
                         hover:bg-cyan-700 transition cursor-pointer">
              View All Tools
            </button>
          </div>

        </div>
      </section>

      {/* 3️⃣ Popular Tools Section */}
      <section className="relative py-20 bg-gray-50">

        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 tracking-tight">
              Browse by Category
            </h2>
            <p className="mt-4 text-base text-gray-600">
              Explore powerful tools organized by workflow — built for developers,
              students, businesses, and creators.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              {
                icon: Code2,
                title: "Developer Tools",
                desc: "Format code, validate JSON, generate APIs, encode/decode data.",
              },
              {
                icon: GraduationCap,
                title: "Study & Education",
                desc: "Calculators, unit converters, note helpers, exam utilities.",
              },
              {
                icon: FileText,
                title: "PDF & File Tools",
                desc: "Merge, compress, convert, edit and manage documents.",
              },
              {
                icon: Image,
                title: "Image & Media",
                desc: "Resize, convert, compress, crop and enhance visuals.",
              },
              {
                icon: Calculator,
                title: "Calculators",
                desc: "Financial, date, age, scientific and business calculators.",
              },
              {
                icon: Palette,
                title: "Design Tools",
                desc: "Color picker, gradient maker, signature and branding tools.",
              },
              {
                icon: Globe,
                title: "Web & SEO",
                desc: "URL shortener, meta preview, sitemap tools, SEO analyzers.",
              },
              {
                icon: ShieldCheck,
                title: "Security Tools",
                desc: "Password generator, hash generator, encryption utilities.",
              },
              {
                icon: Briefcase,
                title: "Business Tools",
                desc: "Invoice generator, tax calculator, productivity utilities.",
              },
              {
                icon: Database,
                title: "Data & Conversion",
                desc: "CSV/JSON/XML tools, formatters, validators, converters.",
              },
              {
                icon: Sparkles,
                title: "AI Utilities",
                desc: "Text enhancer, content generator, smart automation tools.",
              },
              {
                icon: BarChart3,
                title: "Analytics Tools",
                desc: "Data visualizers, metrics calculators, reporting utilities.",
              },
            ].map((category, i) => {
              const Icon = category.icon;

              return (
                <div
                  key={i}
                  className="group relative bg-white border border-gray-200
                       rounded-lg p-4
                       transition-all duration-300
                       hover:shadow-md hover:shadow-cyan-100 hover:-translate-y-1 hover:border-cyan-600"
                >
                  {/* Icon */}
                  <div className="flex items-center gap-2">
                    <Icon className="w-6 h-6 text-gray-700 group-hover:text-cyan-600 transition" />
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900">
                      {category.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {category.desc}
                  </p>


                </div>
              );
            })}

          </div>

        </div>
      </section>



      <section className="bg-white py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-20 sm:rounded-3xl sm:px-12 lg:px-20 lg:py-12">

            {/* Glow background */}
            <div
              aria-hidden="true"
              className="absolute -top-40 left-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 blur-3xl"
            >
              <div className="h-full w-full bg-gradient-to-tr from-cyan-500 to-purple-600 opacity-20" />
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-2 lg:items-center">

              {/* Left Content */}
              <div>
                <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
                  Why Choose ToolNest?
                </h2>

                <p className="mt-2 text-base text-gray-300">
                  A powerful suite of modern utilities designed for speed,
                  privacy, and productivity. Everything you need — in one place.
                </p>

                <dl className="mt-10 space-y-6 text-base text-gray-300">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative">
                      <dt className="ml-9 font-semibold text-white">
                        <feature.icon
                          className="absolute left-0 top-1 h-5 w-5 text-cyan-600"
                          aria-hidden="true"
                        />
                        {feature.name}
                      </dt>
                      <dd className="ml-9 mt-2 text-gray-400">
                        {feature.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Right Screenshot */}
              <div>
                <img
                  src={whychoose}
                  alt="ToolNest Dashboard"
                  className="rounded-xl shadow-2xl ring-1 ring-white/10"
                />
              </div>

            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">

          {/* Heading */}
          <h2 className="text-center text-base font-semibold text-cyan-600 dark:text-indigo-400 uppercase">
            Simple Process
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-medium text-gray-950 dark:text-white">
            How ToolNest Works
          </p>

          {/* Grid */}
          <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">

            {/* STEP 1 — Large */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl dark:bg-gray-800" />

              <div className="relative flex h-full flex-col overflow-hidden rounded-xl lg:rounded-l-xl">

                <div className="p-6">
                  <p className="uppercase text-sm text-cyan-600 font-medium">Step 1</p>
                  <p className="text-lg font-semibold text-gray-950 dark:text-white">
                    Choose Tool
                  </p>

                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-justify">
                    Browse the categories, select the tool that fits your needs, and access it instantly with a seamless experience.
                    Built for efficiency, each tool is optimized to deliver fast, reliable results for both personal and professional use.
                  </p>
                </div>

                <div className="relative min-h-80 w-full grow">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  >
                    <source src={step1} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-px rounded-lg shadow outline outline-black/5 lg:rounded-l-xl dark:outline-white/15" />
            </div>

            {/* STEP 2 */}
            <div className="relative">
              <div className="absolute inset-px rounded-lg bg-white dark:bg-gray-800" />

              <div className="relative flex h-full flex-col overflow-hidden rounded-lg">

                <div className="p-6">
                  <p className="uppercase text-sm text-cyan-600 font-medium">Step 2</p>
                  <p className="text-lg font-semibold text-gray-950 dark:text-white">
                    Input Data
                  </p>

                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-justify">
                    Enter text or upload files through our secure input system designed for speed and accuracy.
                    The platform supports multiple formats and processes your data instantly to ensure reliable results.
                  </p>
                </div>

                <div className="relative min-h-40 w-full max-w-[350px] mx-auto grow rounded-xl mb-6">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover rounded-xl"
                  >
                    <source src={step2} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-px rounded-lg shadow outline outline-black/5 dark:outline-white/15" />
            </div>

            {/* STEP 3 */}
            <div className="relative lg:col-start-2 lg:row-start-2">
              <div className="absolute inset-px rounded-lg bg-white dark:bg-gray-800" />

              <div className="relative flex h-full flex-col overflow-hidden rounded-lg">

                <div className="p-6">
                  <p className="uppercase text-sm text-cyan-600 font-medium">Step 3</p>
                  <p className="text-lg font-semibold text-gray-950 dark:text-white">
                    Get Results
                  </p>

                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-justify">
                    Get instant, high-quality results generated in real time.
                    Preview, download, or export your output in multiple formats with ease.
                  </p>
                </div>

               <div className="relative min-h-50 w-full max-w-[350px] mx-auto grow rounded-xl mb-6">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover rounded-xl"
                  >
                    <source src={step3} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-px rounded-lg shadow outline outline-black/5 dark:outline-white/15" />
            </div>

            {/* EXTRA FEATURE — Large */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-r-xl dark:bg-gray-800" />

              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-r-2xl">

                <div className="p-6">
                  <p className="uppercase text-sm text-cyan-600 font-medium">Step 4</p>
                  <p className="text-lg font-semibold text-gray-950 dark:text-white">
                    Instant & Secure
                  </p>

                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-justify">
                    Enjoy real-time processing powered by advanced security and privacy protection.
                    Your data remains confidential while results are delivered instantly and safely.
                  </p>
                </div>

                <div className="relative min-h-80 w-full grow">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  >
                    <source src={step4} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-px rounded-lg shadow outline outline-black/5 lg:rounded-r-xl dark:outline-white/15" />
            </div>

          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-4xl font-medium text-gray-900 dark:text-white">
              Newly Added Tools
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
               Explore our newest tools created to streamline your work and improve efficiency. 
            </p>
          </div>

          {/* Layout */}
          <div className="mt-16 grid lg:grid-cols-3 gap-8">

            {/* Featured Tool (Large) */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-cyan-600 p-6 text-white shadow-xl">

              <span className="inline-block bg-white/20 px-3 py-1 text-sm rounded-full mb-6">
                Featured
              </span>

              <h3 className="text-3xl font-medium">
                AI Text Generator
              </h3>

              <p className="mt-2 text-white/80 max-w-lg">
                Generate high-quality content instantly using advanced AI technology.
                Perfect for blogs, ads, and social media posts.
              </p>

              <button className="mt-8 flex items-center gap-1 border border-white text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
                Try Now <ArrowRight size={14} className="mt-1" />
              </button>

              {/* Glow Effect */}
              <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-white/20 rounded-full blur-3xl"></div>
            </div>

            {/* Side Tools */}
            <div className="space-y-8">

              <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm shadow-cyan-500/50 hover:shadow-md transition relative overflow-hidden cursor-pointer">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Image Background Remover
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Remove backgrounds from images with one click.
                </p>

                <span className="absolute top-6 right-6 text-sm text-cyan-600 font-semibold opacity-0 group-hover:opacity-100 transition">
                  <ArrowRight size={16} />
                </span>
              </div>

              <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm shadow-cyan-500/50  hover:shadow-md transition relative overflow-hidden">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  JSON Formatter
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Beautify and validate JSON data instantly.
                </p>

                <span className="absolute top-6 right-6 text-sm text-cyan-600 font-semibold opacity-0 group-hover:opacity-100 transition">
                   <ArrowRight size={16} />
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
