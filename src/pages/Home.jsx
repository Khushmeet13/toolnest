import { toolCategories } from "../data/toolCategories";
import HeroSection from "../components/home/HeroSection";

export default function Home() {
  return (
    <div className="space-y-20">
      <HeroSection />

      <section className="relative py-28 bg-gray-50 to-white overflow-hidden">

        {/* Soft background gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-indigo-200 blur-[120px] opacity-20 rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-cyan-200 blur-[120px] opacity-20 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6">

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              Most Popular Tools
            </h2>

            <p className="mt-5 text-lg text-gray-600">
              Everything you need to work faster and smarter — powerful tools
              designed for productivity, creativity, and development.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">

            {[
              { icon: "🔗", name: "QR Generator" },
              { icon: "📄", name: "PDF Tools" },
              { icon: "🖼️", name: "Image Converter" },
              { icon: "📐", name: "Unit Converter" },
              { icon: "🧮", name: "Calculator" },
              { icon: "✍️", name: "Text Tools" },
              { icon: "💻", name: "Code Formatter" },
              { icon: "🔐", name: "Password Generator" },
              { icon: "📊", name: "JSON Formatter" },
              { icon: "📁", name: "File Converter" },
              { icon: "🗂️", name: "ZIP Extractor" },
              { icon: "📝", name: "Form Builder" },
              { icon: "🌐", name: "URL Shortener" },
              { icon: "🎨", name: "Color Picker" },
              { icon: "🖊️", name: "Signature Maker" },
              { icon: "🔍", name: "SEO Tools" },
              { icon: "📅", name: "Date Calculator" },
              { icon: "🧾", name: "Invoice Generator" }
            ].map((tool, i) => (
              <div
                key={i}
                className="group relative rounded-2xl bg-white border border-gray-200
                     p-6 flex flex-col items-center text-center gap-4
                     shadow-sm hover:shadow-2xl transition-all duration-300
                     cursor-pointer hover:-translate-y-2 hover:border-indigo-200"
              >
                {/* Icon Container */}
                <div className="w-14 h-14 flex items-center justify-center rounded-xl
                          bg-gradient-to-br from-indigo-50 to-cyan-50
                          text-2xl shadow-inner
                          group-hover:scale-110 transition">
                  {tool.icon}
                </div>

                {/* Tool Name */}
                <p className="font-semibold text-gray-800">
                  {tool.name}
                </p>

                {/* Subtle hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                          transition duration-300 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5" />
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* 3️⃣ Popular Tools Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center">
            Browse by Category
          </h2>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold">💻 Developer Tools</h3>
              <p className="mt-2 opacity-90">
                Format code, encode data, generate APIs and more.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold">📚 Study Tools</h3>
              <p className="mt-2 opacity-90">
                Calculators, converters, note helpers.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold">📄 PDF & File Tools</h3>
              <p className="mt-2 opacity-90">
                Merge, compress, convert files instantly.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold">
            Why Choose ToolNest?
          </h2>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

            <div>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-semibold text-lg">Lightning Fast</h3>
              <p className="text-gray-400 mt-2">
                Tools that work instantly without delays.
              </p>
            </div>

            <div>
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-semibold text-lg">Privacy First</h3>
              <p className="text-gray-400 mt-2">
                Your data never leaves your device.
              </p>
            </div>

            <div>
              <div className="text-4xl mb-4">💯</div>
              <h3 className="font-semibold text-lg">Completely Free</h3>
              <p className="text-gray-400 mt-2">
                No hidden charges, no subscriptions.
              </p>
            </div>

            <div>
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-semibold text-lg">Mobile Friendly</h3>
              <p className="text-gray-400 mt-2">
                Works perfectly on all devices.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold text-gray-900">
            How It Works
          </h2>

          <div className="mt-16 grid md:grid-cols-3 gap-10">

            <div className="bg-white p-8 rounded-xl shadow">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="font-semibold text-lg">Choose Tool</h3>
              <p className="text-gray-500 mt-2">
                Pick the tool you need from our library.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="font-semibold text-lg">Input Data</h3>
              <p className="text-gray-500 mt-2">
                Upload file or enter your data.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="font-semibold text-lg">Get Results</h3>
              <p className="text-gray-500 mt-2">
                Instant output ready to download.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center">
            🆕 Newly Added Tools
          </h2>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">
              <h3 className="text-xl font-semibold">AI Text Generator</h3>
              <p className="text-gray-500 mt-2">
                Generate high-quality content instantly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">
              <h3 className="text-xl font-semibold">Image Background Remover</h3>
              <p className="text-gray-500 mt-2">
                Remove backgrounds with one click.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">
              <h3 className="text-xl font-semibold">JSON Formatter</h3>
              <p className="text-gray-500 mt-2">
                Beautify and validate JSON data instantly.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
