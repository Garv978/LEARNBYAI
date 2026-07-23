import { Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { FaBrain } from "react-icons/fa";

const Navbar = () => {
  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Features", id: "features" },
    { name: "Pricing", id: "pricing" },
    { name: "Contact", id: "contact" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-zinc-950/80 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <button
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-3"
        >
          <div className="rounded-xl bg-blue-600 p-2">
            <FaBrain size={22} className="text-white" />
          </div>

          <span className="text-2xl font-bold">
            <span className="text-white">AI</span>
            <span className="text-blue-500">Learn</span>
          </span>
        </button>
        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="group relative text-zinc-300 transition hover:text-white"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-500 opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-100" />
            </button>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href="/login"
            className="text-zinc-300 transition hover:text-white"
          >
            Login
          </a>

          <a
            href="/register"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          aria-label="Toggle Menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="text-white md:hidden"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          isMenuOpen
            ? "max-h-80 opacity-100 bg-zinc-950"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-6 py-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-zinc-300 transition hover:text-blue-500"
            >
              {link.name}
            </button>
          ))}

          <a href="/login" className="text-white">
            Login
          </a>

          <a
            href="/register"
            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
