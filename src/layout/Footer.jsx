export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-14 grid gap-10 md:grid-cols-4">

        {/* 1️⃣ Brand */}
        <div>
          <h3 className="text-xl font-bold text-white mb-3">ToolNest</h3>
          <p className="text-sm">
            Free Online Tools for Everyone. Convert, generate & simplify daily tasks.
          </p>
        </div>

        {/* 2️⃣ Tools */}
        <div>
          <h4 className="text-white font-semibold mb-3">Popular Tools</h4>
          <ul className="space-y-2 text-sm">
            <li>Image Compressor</li>
            <li>PDF to Word</li>
            <li>QR Generator</li>
            <li>Password Generator</li>
          </ul>
        </div>

        {/* 3️⃣ Company */}
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>About Us</li>
            <li>Contact</li>
            <li>Blog (Coming Soon)</li>
            <li>Submit Feedback</li>
          </ul>
        </div>

        {/* 4️⃣ Legal */}
        <div>
          <h4 className="text-white font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Disclaimer</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © 2026 ToolNest. All rights reserved.
      </div>
    </footer>
  );
}
