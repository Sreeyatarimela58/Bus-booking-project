





// src/components/BusesView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusIcon, ArrowRightIcon, PencilIcon, TrashIcon, Bus } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const BusesView = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    from: "",
    to: "",
    date: "",
    departure: "",
    arrival: "",
    seats: 40,
    price: 0
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  // Update the state in BusesView
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  
  // Add this to the fetchBuses function
  const fetchBuses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`http://localhost:5000/api/admin/buses?date=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBuses(response.data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post("http://localhost:5000/api/admin/buses", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowAddModal(false);
      fetchBuses();
      // Reset form
      setFormData({
        name: "",
        from: "",
        to: "",
        date: "",
        departure: "",
        arrival: "",
        seats: 40,
        price: 0
      });
    } catch (error) {
      console.error("Error adding bus:", error);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bus Management</h2>
          <p className="text-gray-600 mt-1">Manage your bus fleet and schedules</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <PlusIcon className="w-5 h-5" /> Add New Bus
        </button>
      </div>

      {/* Date Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            fetchBuses();
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
        />
      </div>

      {loading ? (
        <div className="h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : buses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Bus size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">No buses found</p>
          <p className="text-sm">Add a new bus to get started</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {buses.map((bus) => (
                  <tr key={bus._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bus.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center gap-2">
                        {bus.from} 
                        <ArrowRightIcon className="w-4 h-4" /> 
                        {bus.to}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(bus.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bus.departure} - {bus.arrival}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {bus.seats - bus.bookedSeats.length}/{bus.seats}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{bus.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Bus Modal with complete form */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Bus</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bus Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="text"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="text"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                  <input
                    type="time"
                    name="departure"
                    value={formData.departure}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
                  <input
                    type="time"
                    name="arrival"
                    value={formData.arrival}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Add Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusesView;
