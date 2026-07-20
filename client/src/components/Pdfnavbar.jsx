import { FaBars, FaTimes } from "react-icons/fa";
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
    <nav className="mx-6 mt-6 rounded-xl border border-zinc-800 bg-zinc-950 text-white">

      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center gap-10 py-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={`/user/pdfs/${pdfId}/${link.path}`}
            className={({ isActive }) =>
              `transition font-medium ${
                isActive
                  ? "text-blue-500 border-b-2 border-blue-500 pb-1"
                  : "text-zinc-400 hover:text-white"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Mobile */}
      <div className="flex items-center justify-between px-4 py-4 md:hidden">
        <span className="font-semibold text-white">PDF Workspace</span>

        <button onClick={() => setOpen(!open)} className="text-white">
          {open ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col border-t border-zinc-800 px-4 py-4 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={`/user/pdfs/${pdfId}/${link.path}`}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-2 ${
                  isActive
                    ? "text-blue-500"
                    : "text-zinc-400 hover:text-white"
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
