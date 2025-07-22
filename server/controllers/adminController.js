// controllers/adminController.js

const Booking = require("../models/bookingModel");
const User = require("../models/userModel");
const Bus = require("../models/busModel");

// GET /admin/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("bus", "name from to date");

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getAllBookings,
};
