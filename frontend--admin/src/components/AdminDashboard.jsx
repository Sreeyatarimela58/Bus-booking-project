"use client"

import { useState, useEffect } from "react"
import {
  Bus,
  Users,
  Calendar,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  MapPin,
  Clock,
  Wifi,
  Zap,
  Shield,
} from "lucide-react"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [buses, setBuses] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBus, setSelectedBus] = useState(null)
  const [showBusModal, setShowBusModal] = useState(false)

  // Mock data for demonstration
  const mockBuses = [
    {
      _id: "1",
      number: "BUS001",
      name: "Express Travels",
      from: "Bangalore",
      to: "Hyderabad",
      departureTime: "06:00",
      arrivalTime: "12:00",
      date: new Date().toISOString(),
      totalSeats: 40,
      bookedSeats: [1, 2, 5, 8, 12],
      fare: 800,
      type: "AC",
      rating: "4.5",
      amenities: ["WiFi", "AC", "Charging Point", "Water Bottle"],
      isActive: true,
    },
    {
      _id: "2",
      number: "BUS002",
      name: "Luxury Coach",
      from: "Chennai",
      to: "Bangalore",
      departureTime: "10:00",
      arrivalTime: "16:00",
      date: new Date().toISOString(),
      totalSeats: 40,
      bookedSeats: [3, 7, 9, 15, 20, 25],
      fare: 600,
      type: "Sleeper",
      rating: "4.2",
      amenities: ["AC", "Charging Point", "Blanket", "Pillow"],
      isActive: true,
    },
    {
      _id: "3",
      number: "BUS003",
      name: "City Express",
      from: "Hyderabad",
      to: "Bangalore",
      departureTime: "14:00",
      arrivalTime: "20:00",
      date: new Date().toISOString(),
      totalSeats: 40,
      bookedSeats: [4, 6, 11, 18],
      fare: 750,
      type: "AC",
      rating: "4.3",
      amenities: ["WiFi", "Charging Point", "Water Bottle"],
      isActive: true,
    },
    {
      _id: "4",
      number: "BUS004",
      name: "Royal Travels",
      from: "Bangalore",
      to: "Chennai",
      departureTime: "18:00",
      arrivalTime: "24:00",
      date: new Date().toISOString(),
      totalSeats: 40,
      bookedSeats: [2, 8, 14, 22, 28, 35],
      fare: 650,
      type: "Non-AC",
      rating: "4.0",
      amenities: ["Charging Point", "Water Bottle", "First Aid"],
      isActive: true,
    },
  ]

  const mockBookings = [
    {
      _id: "1",
      busNumber: "BUS001",
      busName: "Express Travels",
      passengerName: "John Doe",
      seatNumbers: [1, 2],
      totalAmount: 1600,
      bookingDate: new Date().toISOString(),
      status: "confirmed",
    },
    {
      _id: "2",
      busNumber: "BUS002",
      busName: "Luxury Coach",
      passengerName: "Jane Smith",
      seatNumbers: [15],
      totalAmount: 600,
      bookingDate: new Date().toISOString(),
      status: "confirmed",
    },
  ]

  useEffect(() => {
    setBuses(mockBuses)
    setBookings(mockBookings)
  }, [])

  const stats = {
    totalBuses: buses.length,
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
    occupancyRate:
      buses.length > 0
        ? Math.round((buses.reduce((sum, bus) => sum + bus.bookedSeats.length, 0) / (buses.length * 40)) * 100)
        : 0,
  }

  const getAmenityIcon = (amenity) => {
    switch (amenity?.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-4 h-4" />
      case "charging point":
        return <Zap className="w-4 h-4" />
      case "ac":
        return <Shield className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const getBusTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "ac":
        return "bg-blue-100 text-blue-800"
      case "sleeper":
        return "bg-purple-100 text-purple-800"
      case "non-ac":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredBuses = buses.filter(
    (bus) =>
      bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.to.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Buses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBuses}</p>
            </div>
            <Bus className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{booking.passengerName}</p>
                  <p className="text-sm text-gray-600">
                    {booking.busName} ({booking.busNumber}) - Seats: {booking.seatNumbers.join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{booking.totalAmount}</p>
                  <p className="text-sm text-green-600 capitalize">{booking.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const BusesView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Bus Management</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add New Bus
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search buses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Bus List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bus Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupancy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBuses.map((bus) => (
                <tr key={bus._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{bus.name}</span>
                        <span className="text-xs text-gray-500">({bus.number})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBusTypeColor(bus.type)}`}>
                          {bus.type}
                        </span>
                        {bus.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600">{bus.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {bus.amenities?.slice(0, 3).map((amenity, index) => (
                          <div key={index} className="flex items-center gap-1 text-gray-500">
                            {getAmenityIcon(amenity)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{bus.from}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-sm text-gray-900">{bus.to}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div className="text-sm text-gray-900">
                        {bus.departureTime} - {bus.arrivalTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {bus.bookedSeats.length}/{bus.totalSeats}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(bus.bookedSeats.length / bus.totalSeats) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">₹{bus.fare}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedBus(bus)
                          setShowBusModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const BookingsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Passenger
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bus Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{booking._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.passengerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.busName}</div>
                    <div className="text-sm text-gray-500">{booking.busNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.seatNumbers.join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{booking.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Bus Details Modal
  const BusModal = () => {
    if (!showBusModal || !selectedBus) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Bus Details</h3>
              <button onClick={() => setShowBusModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Bus Name</label>
                <p className="text-gray-900">{selectedBus.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Bus Number</label>
                <p className="text-gray-900">{selectedBus.number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Route</label>
                <p className="text-gray-900">
                  {selectedBus.from} → {selectedBus.to}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBusTypeColor(selectedBus.type)}`}>
                  {selectedBus.type}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Departure</label>
                <p className="text-gray-900">{selectedBus.departureTime}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Arrival</label>
                <p className="text-gray-900">{selectedBus.arrivalTime}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fare</label>
                <p className="text-gray-900">₹{selectedBus.fare}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Rating</label>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-gray-900">{selectedBus.rating}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Amenities</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedBus.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                    {getAmenityIcon(amenity)}
                    <span className="text-xs text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Seat Occupancy</label>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Booked: {selectedBus.bookedSeats.length}</span>
                  <span>Available: {selectedBus.totalSeats - selectedBus.bookedSeats.length}</span>
                  <span>Total: {selectedBus.totalSeats}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(selectedBus.bookedSeats.length / selectedBus.totalSeats) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Bus Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "dashboard" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("buses")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "buses" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Buses
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "bookings" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Bookings
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "buses" && <BusesView />}
          {activeTab === "bookings" && <BookingsView />}
        </div>
      </main>

      {/* Bus Modal */}
      <BusModal />
    </div>
  )
}

export default AdminDashboard
