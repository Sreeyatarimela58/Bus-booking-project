// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, Bus, BookOpen, User, Menu } from "lucide-react";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm ${
      isActive ? "bg-red-600 text-white" : "text-gray-700 hover:bg-red-100"
    }`;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile topbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow w-full fixed z-20">
        <h1 className="text-lg font-semibold text-red-600">AbhiBus Admin</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full z-30 bg-white shadow-md w-64 p-4 space-y-6 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="text-2xl font-bold text-red-600 hidden md:block">
          AbhiBus Admin
        </h2>
        <nav className="space-y-2 pt-8 md:pt-0">
          <NavLink to="/" className={linkClasses}>
            <Home size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/buses" className={linkClasses}>
            <Bus size={18} />
            Buses
          </NavLink>
          <NavLink to="/bookings" className={linkClasses}>
            <BookOpen size={18} />
            Bookings
          </NavLink>
          <NavLink to="/profile" className={linkClasses}>
            <User size={18} />
            Profile
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
        {/* Topbar (hidden on mobile because we have fixed version above) */}
        <header className="hidden md:flex bg-white shadow px-6 py-3 items-center justify-between z-10">
          <h1 className="text-lg font-semibold text-gray-800">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold">
              A
            </div>
            <span className="text-gray-700 font-medium">Admin</span>
          </div>
        </header>

        {/* Routed page content */}
        <main className="p-6 overflow-y-auto mt-16 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
