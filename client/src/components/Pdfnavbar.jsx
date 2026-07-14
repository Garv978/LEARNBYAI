import { Menu, X } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";

import { useState } from "react";

const PdfNavbar = () => {
  const { pdfId } = useParams();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Chat", path: "chat" },
    { name: "Flashcards", path: "flashcards" },
    { name: "Quiz", path: "quiz" },
    { name: "Summary", path: "summary" },
    { name: "Notes", path: "notes" },
  ];

  return (
    <nav className="mx-6 mt-6 rounded-xl border border-slate-700 bg-slate-900 text-white">

      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center gap-10 py-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={`/user/pdfs/${pdfId}/${link.path}`}
            className={({ isActive }) =>
              `transition font-medium ${
                isActive
                  ? "text-indigo-400 border-b-2 border-indigo-400 pb-1"
                  : "text-slate-300 hover:text-white"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Mobile */}
      <div className="flex items-center justify-between px-4 py-4 md:hidden">
        <span className="font-semibold">PDF Workspace</span>

        <button onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col border-t border-slate-700 px-4 py-4 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={`/user/pdfs/${pdfId}/${link.path}`}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-2 ${
                  isActive
                    ? "text-indigo-400"
                    : "text-slate-300 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default PdfNavbar;