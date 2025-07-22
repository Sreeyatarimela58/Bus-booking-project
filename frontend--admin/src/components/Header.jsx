// src/components/Header.jsx
import React from "react";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>
      <div className="text-sm text-gray-500">Welcome, Admin</div>
    </header>
  );
};

export default Header;
