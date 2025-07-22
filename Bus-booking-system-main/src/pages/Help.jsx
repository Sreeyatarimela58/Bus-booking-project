import React from 'react';

const Help = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FFF1E9]">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h2>
      <p className="text-gray-700 mb-4">
        For any queries, support, or feedback regarding your bus bookings, please contact us:
      </p>
      <div className="mb-4">
        <div className="font-semibold">Email:</div>
        <a href="mailto:support@busb.com" className="text-blue-600 underline">support@busb.com</a>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Phone:</div>
        <a href="tel:+911234567890" className="text-blue-600 underline">+91 12345 67890</a>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Customer Support Hours:</div>
        <div>Monday - Saturday, 9:00 AM to 8:00 PM</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Address:</div>
        <div>Bus B Customer Care, 123 Main Road, Hyderabad, India</div>
      </div>
      <div className="text-gray-500 text-sm mt-6">We strive to respond to all queries within 24 hours.</div>
    </div>
  </div>
);

export default Help;
