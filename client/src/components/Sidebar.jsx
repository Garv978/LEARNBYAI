import { FaCog, FaFileAlt, FaHistory, FaTachometerAlt } from "react-icons/fa";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-800">

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-blue-500">
          LearnWithAI
        </h1>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3 space-y-2">

        <NavLink to="/user/dashboard" className={linkStyle}>
          <FaTachometerAlt size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/user/pdfs" className={linkStyle}>
          <FaFileAlt size={20} />
          <span>My PDFs</span>
        </NavLink>

        <NavLink to="/user/history" className={linkStyle}>
          <FaHistory size={20} />
          <span>History</span>
        </NavLink>

        <NavLink to="/user/settings" className={linkStyle}>
          <FaCog size={20} />
          <span>Settings</span>
        </NavLink>

      </nav>

    </aside>
  );
};

export default Sidebar;
