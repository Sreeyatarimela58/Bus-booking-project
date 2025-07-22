const mongoose = require('mongoose');

// Booking Schema defines the structure for ticket bookings
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: [true, 'Bus reference is required']
    },
    seats: {
      type: [Number],
      required: [true, 'At least one seat must be booked']
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required']
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
