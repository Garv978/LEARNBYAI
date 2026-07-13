import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 h-16">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/logo.png" alt="LearnWithAI" className="w-8 h-8" />
          <span className="text-xl font-semibold text-emerald-400">
            LearnWithAI
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/flashcards", label: "Flashcards" },
            { to: "/quizzes", label: "Quizzes" },
            { to: "/notes", label: "Notes" },
            { to: "/history", label: "History" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-slate-300 hover:text-emerald-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-sm font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
          >
            Login
          </Link>

          <div className="flex items-center gap-2 bg-emerald-600 px-4 py-2 rounded-full">
            <div className="w-7 h-7 rounded-full bg-white text-emerald-700 flex items-center justify-center font-bold text-sm">
              G
            </div>
            <span className="text-white font-medium">Garv</span>
          </div>
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden text-slate-200 hover:text-emerald-400 transition">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}
