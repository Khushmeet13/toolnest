import { useState, useEffect, useRef } from "react";
import { Menu, X, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import allTools from "../data/allTools";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!searchRef.current?.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    setActiveIndex(-1);
    if (!value.trim()) { setResults([]); setShowDropdown(false); return; }
    const q = value.toLowerCase();
    const filtered = allTools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.section.toLowerCase().includes(q)
    );
    setResults(filtered);
    setShowDropdown(true);
  };

  const handleSelect = (tool) => {
    setQuery("");
    setShowDropdown(false);
    navigate(tool.path);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || !results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && activeIndex >= 0) handleSelect(results[activeIndex]);
    if (e.key === "Escape") setShowDropdown(false);
  };

  // Group results by section for display
  const grouped = results.reduce((acc, tool) => {
    (acc[tool.section] = acc[tool.section] || []).push(tool);
    return acc;
  }, {});

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-gray-900 text-white shadow-lg" : "bg-transparent text-black shadow-xs"}`}>
      <div className="px-10 py-3 flex items-center justify-between">

        <div className="text-2xl font-bold italic tracking-wide text-cyan-600">ToolNest</div>

        {/* Desktop Search */}
        <div ref={searchRef} className="hidden md:block relative w-1/3">
          <div className={`flex items-center rounded-lg px-3 py-2 transition ${scrolled ? "bg-gray-800" : "bg-gray-100 border border-gray-200"}`}>
            <Search size={18} className={`mr-2 ${scrolled ? "text-gray-300" : "text-gray-500"}`} />
            <input
              type="text"
              value={query}
              placeholder="Search tools..."
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => query && setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              className={`bg-transparent outline-none text-sm w-full ${scrolled ? "placeholder-gray-300" : "placeholder-gray-500"}`}
            />
            {query && (
              <button onClick={() => { setQuery(""); setShowDropdown(false); }} className="cursor-pointer">
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-4 py-6 text-sm text-gray-400 text-center">No tools found for "{query}"</div>
              ) : (
                Object.entries(grouped).map(([section, tools]) => (
                  <div key={section}>
                    <div className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                      {section}
                    </div>
                    {tools.map((tool) => {
                      const idx = results.indexOf(tool);
                      return (
                        <button
                          key={tool.id + tool.section}
                          className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-[13.5px] text-gray-800 hover:text-cyan-600 hover:bg-gray-50 transition cursor-pointer ${idx === activeIndex ? "bg-gray-50" : ""}`}
                          onClick={() => handleSelect(tool)}
                          onMouseEnter={() => setActiveIndex(idx)}
                        >
                          <div className="flex-1">
                            <span className="font-medium">{tool.title}</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{tool.category}</span>
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-16">
          <div className="space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-cyan-600 font-semibold"
                  : "hover:text-cyan-600"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/generators"
              className={({ isActive }) =>
                isActive
                  ? "text-cyan-600 font-semibold"
                  : "hover:text-cyan-600"
              }
            >
              Generators
            </NavLink>

            <NavLink
              to="/converters"
              className={({ isActive }) =>
                isActive
                  ? "text-cyan-600 font-semibold"
                  : "hover:text-cyan-600"
              }
            >
              Converters
            </NavLink>

            <NavLink
              to="/image-tools"
              className={({ isActive }) =>
                isActive
                  ? "text-cyan-600 font-semibold"
                  : "hover:text-cyan-600"
              }
            >
              Image Tools
            </NavLink>

            <NavLink
              to="/dev-tools"
              className={({ isActive }) =>
                isActive
                  ? "text-cyan-600 font-semibold"
                  : "hover:text-cyan-600"
              }
            >
              Dev Tools
            </NavLink>
          </div>

          {/* <div className="flex items-center gap-2">
            <button className="bg-cyan-600 px-4 py-1.5 rounded-lg hover:bg-cyan-600 cursor-pointer text-white">
              Login
            </button>

            <button className="border border-cyan-600 px-4 py-1.5 rounded-lg cursor-pointer text-cyan-600">
              Signup
            </button>
          </div> */}
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
          className={`md:hidden px-4 pb-4 space-y-3 ${scrolled ? "bg-gray-900" : "bg-black/70 backdrop-blur"
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

          {/* <button className="w-full bg-cyan-500 py-2 rounded-lg">
            Login
          </button>

          <button className="w-full border border-cyan-500 py-2 rounded-lg">
            Signup
          </button> */}
        </div>
      )}
    </nav>
  );
}