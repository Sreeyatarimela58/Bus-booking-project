const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  date: { type: Date, required: true },
  totalSeats: { type: Number, default: 40 },
  bookedSeats: { type: [Number], default: [] },
  fare: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Virtual property to calculate available seats
busSchema.virtual('seatsAvailable').get(function() {
  return this.totalSeats - this.bookedSeats.length;
});

// Ensure virtuals are included in JSON output
busSchema.set('toJSON', { virtuals: true });
busSchema.set('toObject', { virtuals: true });

module.exports =
  mongoose.models.Bus || mongoose.model("Bus", busSchema);
