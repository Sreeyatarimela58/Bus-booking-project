const mongoose = require('mongoose');

// Bus Schema defines the structure for buses in the system
const busSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Bus name is required'],
      trim: true
    },
    from: {
      type: String,
      required: [true, 'Starting point is required']
    },
    to: {
      type: String,
      required: [true, 'Destination is required']
    },
    date: {
      type: Date,
      required: [true, 'Date of travel is required']
    },
    departure: {
      type: String,
      required: [true, 'Departure time is required']
    },
    arrival: {
      type: String,
      required: [true, 'Arrival time is required']
    },
    seats: {
      type: Number,
      default: 40
    },
    price: {
      type: Number,
      required: [true, 'Ticket price is required']
    },
    bookedSeats: {
      type: [Number],
      default: []
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

// Export the Bus model
module.exports = mongoose.model('Bus', busSchema);
