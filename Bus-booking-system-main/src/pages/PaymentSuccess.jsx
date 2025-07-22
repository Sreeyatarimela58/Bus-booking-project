"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { bus, finalPrice, basePrice, gstAmount, travelDate, selectedSeats, seatNumbers, bookingId, paymentMethod } =
    location.state || {}
  const [seconds, setSeconds] = useState(8)

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified"
    const date = new Date(dateString)
    if (isNaN(date)) {
      const parts = dateString.split("/")
      if (parts.length === 3) {
        return dateString
      }
      return dateString
    }
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  // Countdown timer
  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => setSeconds((s) => s - 1), 1000)
      return () => clearInterval(timer)
    } else {
      navigate("/")
    }
  }, [seconds, navigate])

  if (!bus || !finalPrice) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600">Invalid booking data. Please start your booking again.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Success Header */}
        <div className="bg-green-600 text-white p-6 text-center">
          <div className="animate-bounce mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">🎉 Payment Successful!</h2>
          <p className="mt-2">Your bus ticket has been booked successfully</p>
          <div className="mt-3 bg-green-500 bg-opacity-30 rounded-lg p-2">
            <p className="text-sm">✅ Payment Completed via {paymentMethod || "Credit Card"}</p>
            {bookingId && <p className="text-xs">Booking ID: {bookingId}</p>}
          </div>
        </div>

        {/* Booking Details */}
        <div className="p-6 space-y-6">
          {/* Bus Details */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">🚌</span>
              Bus Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <p>
                <span className="font-medium">Bus Name:</span> {bus.name} {bus.type ? `(${bus.type})` : ""}
              </p>
              <p>
                <span className="font-medium">Travel Date:</span> {formatDate(travelDate)}
              </p>
              <p>
                <span className="font-medium">From:</span> {bus.from || "Not specified"}
              </p>
              <p>
                <span className="font-medium">To:</span> {bus.to || "Not specified"}
              </p>
              <p>
                <span className="font-medium">Departure:</span> {bus.departureTime || bus.departure || "Not specified"}
              </p>
              <p>
                <span className="font-medium">Arrival:</span> {bus.arrivalTime || bus.arrival || "Not specified"}
              </p>
            </div>
          </div>

          {/* Seat and Payment Details */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">🎫</span>
              Booking Details
            </h3>
            <div className="space-y-3">
              <p>
                <span className="font-medium">Seat Numbers:</span> {(selectedSeats || seatNumbers || []).join(", ")}
              </p>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Fare</span>
                    <span>₹{basePrice?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (5%)</span>
                    <span>₹{gstAmount?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-green-300">
                    <span>Total Paid</span>
                    <span className="text-green-600">₹{finalPrice?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
              </div>
              <p>
                <span className="font-medium">Payment Method:</span> {paymentMethod || "Credit Card"}
              </p>
              <p>
                <span className="font-medium">Booking Date:</span> {formatDate(new Date().toISOString())}
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-700 font-medium">📱 SMS and Email confirmation sent!</p>
              </div>
            </div>
          </div>

          {/* Redirect Notice */}
          <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-700">
            <p>You will be redirected to the home page in {seconds} seconds</p>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((8 - seconds) / 8) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-4">
            <button
              onClick={() => navigate("/mybookings")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>📋</span>
              <span>View My Bookings</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <span>🏠</span>
              <span>Go to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
