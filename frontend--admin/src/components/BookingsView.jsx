// src/components/BookingsView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const BookingsView = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/admin/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(res.data.bookings);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Bookings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="overflow-auto rounded-lg shadow">
          <table className="min-w-full bg-white text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Bus</th>
                <th className="py-2 px-4">From</th>
                <th className="py-2 px-4">To</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Seats</th>
                <th className="py-2 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{booking.user?.name || "N/A"}</td>
                  <td className="py-2 px-4">{booking.bus?.name || "N/A"}</td>
                  <td className="py-2 px-4">{booking.from}</td>
                  <td className="py-2 px-4">{booking.to}</td>
                  <td className="py-2 px-4">{new Date(booking.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{booking.seats.join(", ")}</td>
                  <td className="py-2 px-4">₹{booking.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingsView;
