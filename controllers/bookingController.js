const Booking = require("../models/bookingModel")
const Bus = require("../models/busModel")

// POST: Book one or more seats
exports.bookSeats = async (req, res, next) => {
  try {
    console.log("Booking request received:", req.body, "User:", req.user)
    const { busId, seats, paymentMethod = "Credit Card", paymentStatus = "Completed" } = req.body

    // Validate input
    if (!busId || !Array.isArray(seats) || seats.length === 0) {
      console.log("Booking failed: Missing busId or seats")
      return res.status(400).json({ success: false, message: "Bus ID and seats are required" })
    }

    const bus = await Bus.findById(busId)
    if (!bus) {
      console.log("Booking failed: Bus not found")
      return res.status(404).json({ success: false, message: "Bus not found" })
    }

    // Check if the bus date is in the past
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    const busDate = new Date(bus.date)
    busDate.setHours(0, 0, 0, 0)

    if (busDate < currentDate) {
      console.log("Booking failed: Cannot book tickets for past dates")
      return res.status(400).json({ success: false, message: "Tickets for past dates are not available for booking" })
    }

    // Check if any seat is already booked
    const alreadyBooked = seats.some((seat) => bus.bookedSeats.includes(seat))
    if (alreadyBooked) {
      console.log("Booking failed: Some seats are already booked")
      return res.status(400).json({ success: false, message: "Some seats are already booked" })
    }

    // Book the seats
    bus.bookedSeats.push(...seats)
    await bus.save()

    // Create booking document with payment status
    const booking = await Booking.create({
      user: req.user._id,
      bus: busId,
      seatsBooked: seats,
      totalAmount: seats.length * bus.fare,
      travelDate: bus.date,
      paymentStatus: paymentStatus, // Use the provided payment status
      paymentMethod: paymentMethod, // Use the provided payment method
      status: paymentStatus === "Completed" ? "Confirmed" : "Confirmed", // Set booking status based on payment
    })

    console.log("Booking successful:", booking)

    res.status(201).json({
      success: true,
      message: "Booking successful",
      booking,
    })
  } catch (err) {
    console.error("Booking error:", err)
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ success: false, message: "Validation error", errors: Object.values(err.errors).map((e) => e.message) })
    } else if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid ID format" })
    }
    next(err)
  }
}

// GET: Logged-in user's bookings
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("bus").sort({ createdAt: -1 })

    if (bookings.length === 0) {
      return res.json({ success: true, message: "No bookings found", bookings: [] })
    }

    res.json({ success: true, message: "Bookings fetched successfully", bookings })
  } catch (err) {
    console.error("Get my bookings error:", err)
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid user ID format" })
    }
    next(err)
  }
}

// GET: Admin - All bookings
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("bus").populate("user").sort({ createdAt: -1 })

    res.json({ success: true, bookings })
  } catch (err) {
    console.error("Get all bookings error:", err)
    next(err)
  }
}

// DELETE: Cancel a booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" })

    const bus = await Bus.findById(booking.bus)
    if (!bus) return res.status(404).json({ success: false, message: "Bus not found" })

    // Remove booked seats from the bus
    bus.bookedSeats = bus.bookedSeats.filter((seat) => !booking.seatsBooked.includes(seat))
    await bus.save()

    await booking.deleteOne()

    res.json({ success: true, message: "Booking cancelled successfully" })
  } catch (err) {
    console.error("Booking cancellation error:", err)
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid booking ID format" })
    }
    next(err)
  }
}

// DELETE: Clear all bookings (Admin only)
exports.clearAllBookings = async (req, res, next) => {
  try {
    // First, get all buses and clear their booked seats
    const buses = await Bus.find()
    for (const bus of buses) {
      bus.bookedSeats = []
      await bus.save()
    }

    // Then delete all bookings
    await Booking.deleteMany({})

    res.json({
      success: true,
      message: "All bookings have been cleared and bus seats have been reset",
    })
  } catch (err) {
    console.error("Clear all bookings error:", err)
    next(err)
  }
}
