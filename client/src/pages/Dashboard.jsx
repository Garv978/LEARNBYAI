// Dashboard.jsx

import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout(); // calls backend + clears state
    window.location.href = "/login"; // redirect to login
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome to your Dashboard
      </h1>
      <button
        onClick={handleLogout}
        className="px-6 py-2 rounded-full bg-red-500 text-white hover:opacity-90 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
