// src/components/DashboardView.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Activity, Users, Bus, AlertCircle, Loader2 } from "lucide-react";
import BusesView from "./BusesView";
import BookingsView from "./BookingsView";

const DashboardView = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalBuses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const busesRef = useRef(null);
  const bookingsRef = useRef(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/admin/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        }
      });
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard stats");
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)] text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-5 h-5 text-red-600" />
            <h3 className="text-gray-500 text-sm">Total Bookings</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-red-600" />
            <h3 className="text-gray-500 text-sm">Total Users</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <Bus className="w-5 h-5 text-red-600" />
            <h3 className="text-gray-500 text-sm">Total Buses</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalBuses}</p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="flex gap-4">
        <button 
          onClick={() => scrollToSection(busesRef)}
          className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Bus size={18} />
          View Buses
        </button>
        <button 
          onClick={() => scrollToSection(bookingsRef)}
          className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Activity size={18} />
          View Bookings
        </button>
      </div>

      {/* Buses Section */}
      <div ref={busesRef} className="scroll-mt-16">
        <BusesView />
      </div>

      {/* Bookings Section */}
      <div ref={bookingsRef} className="scroll-mt-16">
        <BookingsView />
      </div>
    </div>
  );
};

export default DashboardView;
