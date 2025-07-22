// src/components/ProfileView.jsx
import React from "react";

const ProfileView = () => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="text-gray-600 block text-sm mb-1">Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded bg-gray-50"
            value="Admin User"
            readOnly
          />
        </div>
        <div>
          <label className="text-gray-600 block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded bg-gray-50"
            value="admin@example.com"
            readOnly
          />
        </div>
        <div>
          <label className="text-gray-600 block text-sm mb-1">Role</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded bg-gray-50"
            value="Administrator"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
