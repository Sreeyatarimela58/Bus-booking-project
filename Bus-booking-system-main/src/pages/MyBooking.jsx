"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Users, Download, X, AlertCircle, CreditCard } from "lucide-react"
import { useNavigate } from "react-router-dom"

const MyBooking = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [heldSeats, setHeldSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("bookings") // "bookings" or "held"

  // Format booking date for 'Booked on' display
  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const d = new Date(dateString)
    if (isNaN(d)) return dateString
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Load held seats from localStorage
  const loadHeldSeats = () => {
    try {
      const heldSeatsData = JSON.parse(localStorage.getItem("heldSeats") || "{}")
      const currentTime = Date.now()
      const allHeldSeats = []

      Object.keys(heldSeatsData).forEach((busId) => {
        heldSeatsData[busId].forEach((heldSeat) => {
          if (heldSeat.expiryTime > currentTime) {
            allHeldSeats.push({
              ...heldSeat,
              busId,
              timeRemaining: heldSeat.expiryTime - currentTime,
            })
          }
        })
      })

      // Group held seats by bus
      const groupedHeldSeats = {}
      allHeldSeats.forEach((seat) => {
        const key = `${seat.busId}-${seat.travelDate}`
        if (!groupedHeldSeats[key]) {
          groupedHeldSeats[key] = {
            busId: seat.busId,
            busName: seat.busName,
            route: seat.route,
            travelDate: seat.travelDate,
            fare: seat.fare,
            departureTime: seat.departureTime,
            arrivalTime: seat.arrivalTime,
            searchData: seat.searchData,
            seats: [],
            heldAt: seat.heldAt,
            expiryTime: seat.expiryTime,
            timeRemaining: seat.timeRemaining,
          }
        }
        groupedHeldSeats[key].seats.push(seat.seatNumber)
      })

      setHeldSeats(Object.values(groupedHeldSeats))
    } catch (error) {
      console.error("Error loading held seats:", error)
    }
  }

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true)
      setError(null)

      // Get user from localStorage
      let user = null
      try {
        const userStr = localStorage.getItem("user")
        if (userStr && userStr !== "undefined") {
          user = JSON.parse(userStr)
        }
      } catch (err) {
        console.error("Error parsing user from localStorage:", err)
      }

      if (!user || !user.token) {
        setError("Please login to view your bookings")
        setLoading(false)
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
        return
      }

      try {
        const response = await fetch("http://localhost:5000/api/bookings/my", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()

        if (response.ok && data.success) {
          const sortedBookings = data.bookings || []
          setBookings(sortedBookings)

          // Update localStorage with latest bookings
          localStorage.setItem("bookings", JSON.stringify(sortedBookings))
        } else {
          throw new Error(data.message || "Failed to load bookings")
        }
      } catch (err) {
        console.error("Error loading bookings:", err)
        if (err.message.includes("401") || err.message.includes("Unauthorized")) {
          localStorage.removeItem("user")
          setError("Session expired. Please login again.")
          setTimeout(() => {
            window.location.href = "/login"
          }, 2000)
          return
        }
        setError(err.message || "Failed to load bookings. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
    loadHeldSeats()

    // Refresh bookings every 30 seconds
    const interval = setInterval(() => {
      loadBookings()
      loadHeldSeats()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Release held seats
  const releaseHeldSeats = (busId, seatNumbers) => {
    try {
      const heldSeatsData = JSON.parse(localStorage.getItem("heldSeats") || "{}")

      if (heldSeatsData[busId]) {
        heldSeatsData[busId] = heldSeatsData[busId].filter((heldSeat) => !seatNumbers.includes(heldSeat.seatNumber))

        if (heldSeatsData[busId].length === 0) {
          delete heldSeatsData[busId]
        }
      }

      localStorage.setItem("heldSeats", JSON.stringify(heldSeatsData))
      loadHeldSeats()
      alert("Held seats have been released successfully.")
    } catch (error) {
      console.error("Error releasing held seats:", error)
      alert("Failed to release held seats.")
    }
  }

  // Proceed with payment for held seats
  const proceedWithHeldSeats = (heldSeatGroup) => {
    const basePrice = heldSeatGroup.fare * heldSeatGroup.seats.length
    const gstAmount = basePrice * 0.05
    const totalAmount = basePrice + gstAmount

    const bus = {
      _id: heldSeatGroup.busId,
      name: heldSeatGroup.busName,
      fare: heldSeatGroup.fare,
      departureTime: heldSeatGroup.departureTime,
      arrivalTime: heldSeatGroup.arrivalTime,
      from: heldSeatGroup.searchData?.from,
      to: heldSeatGroup.searchData?.to,
    }

    navigate("/payment", {
      state: {
        bus,
        selectedSeats: heldSeatGroup.seats,
        basePrice,
        gstAmount,
        finalPrice: totalAmount,
        travelDate: heldSeatGroup.travelDate,
        searchData: heldSeatGroup.searchData,
        fromHeldSeats: true, // Flag to indicate this came from held seats
      },
    })
  }

  // Format time remaining
  const formatTimeRemaining = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  // Sort bookings so that upcoming journeys appear at the top
  const now = new Date()
  const sortedBookings = [...bookings].sort((a, b) => {
    const getTravelTime = (booking) => {
      if (booking.travelDate) {
        const d = new Date(booking.travelDate)
        return isNaN(d) ? null : d
      }
      const d = new Date(booking.createdAt || 0)
      return isNaN(d) ? null : d
    }
    const aTime = getTravelTime(a)
    const bTime = getTravelTime(b)

    if (aTime && bTime) {
      const aFuture = aTime >= now
      const bFuture = bTime >= now
      if (aFuture && !bFuture) return -1
      if (!aFuture && bFuture) return 1
      return bTime - aTime
    }
    if (aTime && !bTime) return -1
    if (!aTime && bTime) return 1
    return 0
  })

  // Format travel date as DD/MM/YYYY
  const formatTravelDate = (dateString) => {
    if (!dateString) return "Not specified"
    const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      const [_, y, m, d] = match
      return `${d}/${m}/${y}`
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString
    }
    return dateString
  }

  // Format time as HH:mm
  const formatTime = (timeString) => {
    if (!timeString) return "-"
    const match = timeString.match(/(\d{2}):(\d{2})/)
    if (match) {
      return `${match[1]}:${match[2]}`
    }
    return timeString
  }

  const [cancelModal, setCancelModal] = useState({ open: false, bookingId: null })
  const [agreeRefund, setAgreeRefund] = useState(false)

  // Cancel a booking
  const handleCancelBooking = async (bookingId) => {
    let user = null
    try {
      const userStr = localStorage.getItem("user")
      if (userStr && userStr !== "undefined") {
        user = JSON.parse(userStr)
      }
    } catch (err) {
      console.error("Error parsing user from localStorage:", err)
    }

    if (!user || !user.token) {
      window.location.href = "/login"
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setBookings((prevBookings) => prevBookings.filter((b) => b._id !== bookingId))
        setCancelModal({ open: false, bookingId: null })
        setAgreeRefund(false)
        alert("Your booking has been cancelled. Refund will be processed within 2-3 days.")
      } else {
        throw new Error(data.message || "Failed to cancel booking")
      }
    } catch (err) {
      console.error("Error cancelling booking:", err)
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        localStorage.removeUser("user")
        window.location.href = "/login"
        return
      }
      alert(err.message || "Failed to cancel booking")
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF1E9]">
      {/* Header */}
      <div className="bg-[#e57373] text-white p-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">🚌 My Bookings & Held Seats</h1>
            <p className="text-[#ffe0e0]">View and manage your bus ticket bookings and held seats</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === "bookings" ? "bg-white text-[#e57373] shadow-sm" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            My Bookings ({sortedBookings.length})
          </button>
          <button
            onClick={() => setActiveTab("held")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === "held" ? "bg-white text-[#e57373] shadow-sm" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Held Seats ({heldSeats.length})
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e57373] mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-8 text-center mt-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Bookings</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              className="bg-[#e57373] text-white px-6 py-2 rounded-lg hover:bg-[#ff8a80]"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <>
                {sortedBookings.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center mt-8">
                    <div className="text-6xl mb-4">🚌</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h2>
                    <p className="text-gray-600 mb-4">You haven't made any bus bookings yet.</p>
                    <button
                      className="bg-[#e57373] text-white px-6 py-2 rounded-lg hover:bg-[#ff8a80]"
                      onClick={() => (window.location.href = "/")}
                    >
                      Book Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 mt-8">
                    {sortedBookings.map((booking) => (
                      <div key={booking._id} className="bg-[#fff7f7] rounded-lg shadow-lg overflow-hidden">
                        {/* Ticket Header */}
                        <div className="bg-[#e57373] text-white p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold mb-1">Bus Ticket</h3>
                              <p className="text-[#ffd6d6]">Booking ID: #{booking._id}</p>
                            </div>
                            <div className="text-right">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  booking.paymentStatus === "Completed"
                                    ? "bg-green-500 text-white"
                                    : "bg-yellow-500 text-white"
                                }`}
                              >
                                {booking.paymentStatus === "Completed" ? "✅ Paid" : "⏳ Pending"}
                              </span>
                            </div>
                          </div>

                          {/* Route Display */}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-center">
                              <div className="text-2xl font-bold">{booking.bus?.from || "N/A"}</div>
                              <div className="text-sm text-[#ffd6d6]">Departure</div>
                            </div>
                            <div className="flex-1 mx-4">
                              <div className="border-t-2 border-dashed border-[#ffd6d6] relative">
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white text-[#e57373] px-2 text-xs font-medium rounded">
                                  🚌
                                </div>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold">{booking.bus?.to || "N/A"}</div>
                              <div className="text-sm text-[#ffd6d6]">Arrival</div>
                            </div>
                          </div>
                        </div>

                        {/* Ticket Content */}
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Journey Details */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-800 flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-[#e57373]" />
                                Journey Details
                              </h4>
                              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Travelling Date:</span>
                                  <span className="font-medium text-gray-800">
                                    {formatTravelDate(booking.travelDate)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Passengers:</span>
                                  <span className="font-medium">{booking.seatsBooked?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Seat no(s):</span>
                                  <span className="font-medium">{booking.seatsBooked?.join(", ") || "-"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Bus Details */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-800 flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-[#e57373]" />
                                Bus Details
                              </h4>
                              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Operator:</span>
                                  <span className="font-medium">{booking.bus?.name || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Departure:</span>
                                  <span className="font-medium">{formatTime(booking.bus?.departureTime)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Arrival:</span>
                                  <span className="font-medium">{formatTime(booking.bus?.arrivalTime)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Payment Details */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-800 flex items-center">
                                <Users className="w-4 h-4 mr-2 text-[#e57373]" />
                                Payment
                              </h4>
                              <div
                                className={`p-4 rounded-lg ${
                                  booking.paymentStatus === "Completed" ? "bg-green-50" : "bg-yellow-50"
                                }`}
                              >
                                <div className="text-center">
                                  <div
                                    className={`text-2xl font-bold mb-1 ${
                                      booking.paymentStatus === "Completed" ? "text-green-600" : "text-yellow-600"
                                    }`}
                                  >
                                    ₹{booking.totalAmount || 0}
                                  </div>
                                  <div
                                    className={`text-sm font-medium ${
                                      booking.paymentStatus === "Completed" ? "text-green-700" : "text-yellow-700"
                                    }`}
                                  >
                                    {booking.paymentStatus === "Completed"
                                      ? "✅ Paid Successfully"
                                      : "⏳ Payment Pending"}
                                  </div>
                                  {booking.paymentMethod && (
                                    <div className="text-xs text-gray-600 mt-1">via {booking.paymentMethod}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-6 pt-6 border-t flex flex-wrap gap-4 justify-between items-center">
                            <div className="flex gap-4">
                              <button
                                className="flex items-center text-[#e57373] hover:text-[#ff8a80] font-medium"
                                onClick={() => alert("Ticket downloaded!")}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download Ticket
                              </button>
                              <button
                                className="flex items-center text-gray-600 hover:text-gray-800 font-medium"
                                onClick={() => setCancelModal({ open: true, bookingId: booking._id })}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancel Booking
                              </button>
                            </div>
                            <div className="text-sm text-gray-500">Booked on {formatDate(booking.createdAt)}</div>
                          </div>
                        </div>

                        {/* Cancel Modal */}
                        {cancelModal.open && cancelModal.bookingId === booking._id && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                              <h3 className="text-lg font-bold mb-2 text-[#e57373]">Refund Policy</h3>
                              <p className="text-gray-700 mb-4 text-sm">
                                If you cancel your ticket, a refund will be processed to your original payment method
                                within 2-3 business days. Cancellation charges may apply as per our policy. Are you sure
                                you want to cancel this ticket?
                              </p>
                              <div className="flex items-center mb-4">
                                <input
                                  id="agreeRefund"
                                  type="checkbox"
                                  checked={agreeRefund}
                                  onChange={(e) => setAgreeRefund(e.target.checked)}
                                  className="mr-2 accent-red-600"
                                />
                                <label htmlFor="agreeRefund" className="text-sm text-gray-700">
                                  I agree to the refund policy
                                </label>
                              </div>
                              <div className="flex gap-3 mt-2">
                                <button
                                  className={`flex-1 py-2 rounded-lg font-semibold text-white ${
                                    agreeRefund ? "bg-[#e57373] hover:bg-[#ff8a80]" : "bg-[#ffd6d6] cursor-not-allowed"
                                  }`}
                                  disabled={!agreeRefund}
                                  onClick={() => handleCancelBooking(booking._id)}
                                >
                                  Cancel Ticket
                                </button>
                                <button
                                  className="flex-1 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  onClick={() => {
                                    setCancelModal({ open: false, bookingId: null })
                                    setAgreeRefund(false)
                                  }}
                                >
                                  No, Don't Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Held Seats Tab */}
            {activeTab === "held" && (
              <>
                {heldSeats.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center mt-8">
                    <div className="text-6xl mb-4">⏰</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">No Held Seats</h2>
                    <p className="text-gray-600 mb-4">You don't have any seats on hold currently.</p>
                    <button
                      className="bg-[#e57373] text-white px-6 py-2 rounded-lg hover:bg-[#ff8a80]"
                      onClick={() => (window.location.href = "/")}
                    >
                      Search Buses
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 mt-8">
                    {heldSeats.map((heldSeatGroup, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Header */}
                        <div className="bg-yellow-500 text-white p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-5 h-5" />
                              <h3 className="text-lg font-semibold">Seats on Hold</h3>
                            </div>
                            <div className="bg-yellow-400 bg-opacity-30 rounded-lg px-3 py-1">
                              <p className="text-sm font-medium">
                                {formatTimeRemaining(heldSeatGroup.timeRemaining)} left
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Bus Details */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-800">Bus Details</h4>
                              <div className="space-y-2 text-sm">
                                <p>
                                  <span className="font-medium">Bus:</span> {heldSeatGroup.busName}
                                </p>
                                <p>
                                  <span className="font-medium">Route:</span> {heldSeatGroup.route}
                                </p>
                                <p>
                                  <span className="font-medium">Travel Date:</span>{" "}
                                  {formatTravelDate(heldSeatGroup.travelDate)}
                                </p>
                                <p>
                                  <span className="font-medium">Departure:</span>{" "}
                                  {formatTime(heldSeatGroup.departureTime)}
                                </p>
                                <p>
                                  <span className="font-medium">Arrival:</span> {formatTime(heldSeatGroup.arrivalTime)}
                                </p>
                              </div>
                            </div>

                            {/* Seat & Price Details */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-800">Seat & Price Details</h4>
                              <div className="space-y-2 text-sm">
                                <p>
                                  <span className="font-medium">Seat Numbers:</span> {heldSeatGroup.seats.join(", ")}
                                </p>
                                <p>
                                  <span className="font-medium">Price per Seat:</span> ₹{heldSeatGroup.fare}
                                </p>
                                <p>
                                  <span className="font-medium">Total Amount:</span> ₹
                                  {(heldSeatGroup.fare * heldSeatGroup.seats.length * 1.05).toFixed(2)}{" "}
                                  <span className="text-gray-500">(incl. GST)</span>
                                </p>
                                <p>
                                  <span className="font-medium">Held At:</span> {formatDate(heldSeatGroup.heldAt)}
                                </p>
                                <p>
                                  <span className="font-medium">Expires At:</span>{" "}
                                  {formatDate(heldSeatGroup.expiryTime)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">
                            <button
                              onClick={() => proceedWithHeldSeats(heldSeatGroup)}
                              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                            >
                              <CreditCard className="w-4 h-4" />
                              Proceed with Payment
                            </button>
                            <button
                              onClick={() => releaseHeldSeats(heldSeatGroup.busId, heldSeatGroup.seats)}
                              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
                            >
                              <X className="w-4 h-4" />
                              Release Seats
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16 p-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="text-2xl">🚌</div>
            <h3 className="text-xl font-bold">Bus B</h3>
          </div>
          <p className="text-gray-400">&copy; 2025 Bus B. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default MyBooking
