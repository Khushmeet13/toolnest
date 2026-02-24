import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300
        ${
          scrolled
            ? "bg-gray-900 text-white shadow-lg"
            : "bg-transparent text-black shadow-xs"
        }`}
    >
      <div className="px-10 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="text-2xl font-bold italic tracking-wide text-cyan-500">
          ToolNest
        </div>

        {/* Search Bar — Desktop */}
        <div
          className={`hidden md:flex items-center rounded-lg px-3 py-2 w-1/3 transition
          ${
            scrolled
              ? "bg-gray-800"
              : "bg-gray-100 backdrop-blur-lg border border-gray-200"
          }`}
        >
          <Search size={18} className={`text-gray-300 mr-2 ${
            scrolled
              ? "text-gray-300"
              : "text-gray-500"
          }  `} />
          <input
            type="text"
            placeholder="Search tools..."
            className={`bg-transparent outline-none text-sm w-full    ${
            scrolled
              ? "placeholder-gray-300"
              : "placeholder-gray-500"
          } `}
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-16">
          <div className="space-x-6">
            <a href="#" className="hover:text-cyan-400">Home</a>
            <a href="#" className="hover:text-cyan-400">Generators</a>
            <a href="#" className="hover:text-cyan-400">Converters</a>
            <a href="#" className="hover:text-cyan-400">Image Tools</a>
            <a href="#" className="hover:text-cyan-400">Dev Tools</a>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-cyan-500 px-4 py-1.5 rounded-lg hover:bg-cyan-600 cursor-pointer">
              Login
            </button>

            <button className="border border-cyan-500 px-4 py-1.5 rounded-lg hover:bg-cyan-500 cursor-pointer">
              Signup
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`md:hidden px-4 pb-4 space-y-3 ${
            scrolled ? "bg-gray-900" : "bg-black/70 backdrop-blur"
          }`}
        >
          <input
            type="text"
            placeholder="Search tools..."
            className="w-full px-3 py-2 rounded-lg bg-gray-700 outline-none"
          />

          <a href="#" className="block">Home</a>
          <a href="#" className="block">Generators</a>
          <a href="#" className="block">Converters</a>
          <a href="#" className="block">Image Tools</a>
          <a href="#" className="block">Dev Tools</a>

          <button className="w-full bg-cyan-500 py-2 rounded-lg">
            Login
          </button>

          <button className="w-full border border-cyan-500 py-2 rounded-lg">
            Signup
          </button>
        </div>
      )}
    </nav>
  );
}