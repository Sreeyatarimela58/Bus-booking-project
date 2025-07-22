// src/components/Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 flex-1 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
