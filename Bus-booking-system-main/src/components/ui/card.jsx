import * as React from "react";

function Card({ className = "", children }) {
  return (
    <div className={`rounded-xl border border-gray-300 bg-[#fff7f7] shadow-md ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className = "" }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

export { Card, CardContent };
