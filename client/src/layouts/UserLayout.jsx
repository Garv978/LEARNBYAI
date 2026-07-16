// src/layouts/UserLayout.jsx

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const UserLayout = () => {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-zinc-950">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
