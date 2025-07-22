"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { bus, selectedSeats } = location.state || {}

  const [payClicked, setPayClicked] = useState(false)
  const [travelDate, setTravelDate] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("Credit Card")
  const [processing, setProcessing] = useState(false)

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

  useEffect(() => {
    let tDate = null
    if (location.state && location.state.searchData && location.state.searchData.date) {
      tDate = location.state.searchData.date
    } else if (location.state && location.state.date) {
      tDate = location.state.date
    } else if (bus && bus.date) {
      tDate = bus.date
    } else if (location.state && location.state.travelDate) {
      tDate = location.state.travelDate
    }
    if (!tDate) {
      try {
        const lastSearch = JSON.parse(localStorage.getItem("lastSearch"))
        if (lastSearch && lastSearch.date) tDate = lastSearch.date
      } catch {}
    }
    setTravelDate(tDate)
  }, [location.state, bus])

  const handlePayment = async () => {
    if (payClicked) return // Prevent double click
    setPayClicked(true)
    setProcessing(true)

    // Check if user is logged in
    const userStr = localStorage.getItem("user")
    const user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null
    if (!user) {
      alert("Please login to book tickets.")
      navigate("/login")
      return
    }

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Calculate prices
        const basePrice = bus.fare * selectedSeats.length
        const gstAmount = basePrice * 0.05
        const totalAmount = basePrice + gstAmount

        // Create booking with payment completed status
        const bookingData = {
          busId: bus._id || bus.id,
          seats: selectedSeats.map((seat) => Number.parseInt(seat)),
          totalAmount: totalAmount,
          travelDate: new Date(travelDate).toISOString(),
          paymentMethod: paymentMethod,
          paymentStatus: "Completed", // ✅ Explicitly set as Completed
        }

        console.log("Creating booking with data:", bookingData)

        const response = await fetch("http://localhost:5000/api/bookings", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          // Clear held seats if this booking came from held seats
          if (location.state?.fromHeldSeats) {
            try {
              const heldSeatsData = JSON.parse(localStorage.getItem("heldSeats") || "{}")
              if (heldSeatsData[bus._id]) {
                heldSeatsData[bus._id] = heldSeatsData[bus._id].filter(
                  (heldSeat) => !selectedSeats.includes(heldSeat.seatNumber),
                )
                if (heldSeatsData[bus._id].length === 0) {
                  delete heldSeatsData[bus._id]
                }
                localStorage.setItem("heldSeats", JSON.stringify(heldSeatsData))
              }
            } catch (error) {
              console.error("Error clearing held seats:", error)
            }
          }

          // Navigate to success page
          navigate("/payment-success", {
            state: {
              bus,
              finalPrice: totalAmount,
              selectedSeats,
              seatNumbers: selectedSeats,
              travelDate,
              basePrice,
              gstAmount,
              bookingId: data.booking._id,
              paymentMethod,
            },
          })
        } else {
          throw new Error(data.message || "Booking failed")
        }
      } catch (error) {
        console.error("Payment/Booking error:", error)
        alert(error.message || "Payment failed. Please try again.")
        setPayClicked(false)
        setProcessing(false)
      }
    }, 2000) // 2 second delay to simulate processing
  }

  if (!bus || !selectedSeats || (!bus.fare && !bus.price)) {
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

  // Calculate prices - use fare if available, otherwise use price
  const farePrice = bus.fare || bus.price || 0
  const basePrice = farePrice * selectedSeats.length
  const gstAmount = basePrice * 0.05
  const totalAmount = basePrice + gstAmount

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <h2 className="text-2xl font-bold text-center">Complete Your Payment</h2>
        </div>

        {/* Bus Details */}
        <div className="p-6 space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Bus Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <p>
                <span className="font-medium">Bus Name:</span> {bus.name} {bus.type ? `(${bus.type})` : ""}
              </p>
              <p>
                <span className="font-medium">Travel Date:</span> {formatTravelDate(travelDate)}
              </p>
              <p>
                <span className="font-medium">From:</span>{" "}
                {bus.from || location.state?.searchData?.from || "Not specified"}
              </p>
              <p>
                <span className="font-medium">To:</span> {bus.to || location.state?.searchData?.to || "Not specified"}
              </p>
              <p>
                <span className="font-medium">Departure:</span> {bus.departureTime || bus.departure || "Not specified"}
              </p>
              <p>
                <span className="font-medium">Arrival:</span> {bus.arrivalTime || bus.arrival || "Not specified"}
              </p>
            </div>
          </div>

          {/* Seat Details */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Seat Details</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Selected Seats:</span> {selectedSeats.join(", ")}
              </p>
              <p>
                <span className="font-medium">Price per Seat:</span> ₹{bus.fare || bus.price || 0}
              </p>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
            <div className="space-y-3">
              {["Credit Card", "Debit Card", "UPI", "Net Banking"].map((method) => (
                <label key={method} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Price Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base Fare ({selectedSeats.length} seats)</span>
                <span>₹{basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="text-center pt-4">
            {processing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="text-gray-600">Processing Payment...</span>
              </div>
            ) : (
              <button
                className={`w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg font-semibold
                  hover:bg-green-700 transition-colors ${payClicked ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handlePayment}
                disabled={payClicked}
              >
                {payClicked ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)} via ${paymentMethod}`}
              </button>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 p-4 rounded-lg text-center text-green-700 text-sm">
            <p>🔒 Your payment is secure and encrypted</p>
            <p>This is a demo payment - no real money will be charged</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
