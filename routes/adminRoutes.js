const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const { protect } = require('../middleware/authMiddleware');

// Import models
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");
const Bus = require("../models/busModel");

// Import controllers
const { addBus, updateBus, deleteBus } = require('../controllers/busController');
const { clearAllBookings } = require('../controllers/bookingController');

// ✅ GET Dashboard Stats (Real-Time)
router.get("/dashboard-stats", protect, adminMiddleware, async (req, res) => {
  try {
    // Get total number of users (excluding admins)
    const totalUsers = await User.countDocuments({ isAdmin: false });

    // Get total number of buses
    const totalBuses = await Bus.countDocuments();

    // Get total number of bookings
    const totalBookings = await Booking.countDocuments();

    // Get today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: today }
    });

    // Calculate total revenue
    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('bus', 'name from to date')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBuses,
        totalBookings,
        todayBookings,
        totalRevenue,
        recentBookings
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard stats' });
  }
});

// Bus routes
router.post('/buses', protect, adminMiddleware, addBus);
router.put('/buses/:id', protect, adminMiddleware, updateBus);
router.delete('/buses/:id', protect, adminMiddleware, deleteBus);

// Clear all bookings
router.delete('/bookings/clear-all', protect, adminMiddleware, clearAllBookings);

module.exports = router;
