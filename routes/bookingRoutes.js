const express = require('express');
const { bookSeats, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Book a seat
router.post('/', protect, (req, res, next) => {
  console.log('POST /api/bookings hit:', req.body, 'User:', req.user);
  bookSeats(req, res, next);
});

// Get logged-in user's bookings
router.get('/my', protect, (req, res, next) => {
  console.log('GET /api/bookings/my hit:', 'User:', req.user);
  getMyBookings(req, res, next);
});

// Cancel a booking
router.delete('/:bookingId', protect, (req, res, next) => {
  console.log('DELETE /api/bookings/:bookingId hit:', req.params, 'User:', req.user);
  cancelBooking(req, res, next);
});

module.exports = router;
