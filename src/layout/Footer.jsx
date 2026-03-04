export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto py-14 grid gap-20 md:grid-cols-[400px_1fr]">

        {/* 1️⃣ Brand */}
        <div>
          <h3 className="text-xl font-bold text-white mb-3">ToolNest</h3>
          <p className="text-sm">
            Free Online Tools for Everyone. Convert, generate & simplify daily tasks.
          </p>
        </div>

        <div className="grid grid-cols-3">



          {/* 2️⃣ Tools */}
          <div>
            <h4 className="text-white font-semibold mb-3">Popular Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/image-compressor" className="hover:text-white transition">Image Compressor</a></li>
              <li><a href="/pdf-to-word" className="hover:text-white transition">PDF to Word</a></li>
              <li><a href="/qr-generator" className="hover:text-white transition">QR Generator</a></li>
              <li><a href="/password-generator" className="hover:text-white transition">Password Generator</a></li>
            </ul>
          </div>

          {/* 3️⃣ Company */}
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white transition">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
               <li><a href="/roadmap" className="hover:text-white transition">Roadmap</a></li>
            </ul>
          </div>

          {/* 4️⃣ Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</a></li>
               <li><a href="/changelog" className="hover:text-white transition">Changelog</a></li>
                    <li><a href="/faq" className="hover:text-white transition">FAQs</a></li>
            </ul>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © 2026 ToolNest. All rights reserved.
      </div>
    </footer>
  );
}
