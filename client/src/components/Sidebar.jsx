import {
  FileText,
  History,
  LayoutDashboard,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-slate-300 hover:bg-slate-800"
    }`;

  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800">

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-indigo-400">
          LearnWithAI
        </h1>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3 space-y-2">

        <NavLink to="/user/dashboard" className={linkStyle}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/user/pdfs" className={linkStyle}>
          <FileText size={20} />
          <span>My PDFs</span>
        </NavLink>

        <NavLink to="/user/history" className={linkStyle}>
          <History size={20} />
          <span>History</span>
        </NavLink>

        <NavLink to="/user/settings" className={linkStyle}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

      </nav>

    </aside>
  );
};

export default Sidebar;