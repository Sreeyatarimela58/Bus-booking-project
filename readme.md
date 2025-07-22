# Bus Booking System - Backend

## Database Structure

This application uses MongoDB with Mongoose for data modeling. The database consists of three main collections:

### 1. Buses Collection

Stores information about available buses.

```javascript
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
```

### 2. Bookings Collection

Stores information about ticket bookings made by users.

```javascript
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    seatsBooked: {
      type: [Number], // e.g., [4, 5, 6]
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    status: {
      type: String,
      enum: ["Confirmed", "Cancelled", "Completed"],
      default: "Confirmed",
    },
  },
  { timestamps: true }
);
```

### 3. Users Collection

Stores information about registered users.

```javascript
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    profilePicture: { type: String },
  },
  { timestamps: true }
);
```

## Relationships Between Collections

1. **User to Booking**: One-to-Many
   - A user can have multiple bookings
   - Each booking belongs to one user
   - Referenced by `user` field in Booking schema

2. **Bus to Booking**: One-to-Many
   - A bus can have multiple bookings
   - Each booking is for one bus
   - Referenced by `bus` field in Booking schema

## Data Flow

1. **Bus Creation**: Admin creates buses with routes, schedules, and seat availability
2. **User Registration/Login**: Users register and login to the system
3. **Bus Search**: Users search for buses based on source, destination, and date
4. **Seat Selection**: Users select available seats on a bus
5. **Booking Creation**: System creates a booking record linking the user, bus, and selected seats
6. **Payment Processing**: User completes payment, and booking status is updated

## API Endpoints

The API endpoints are organized into the following routes:

- `/api/auth`: Authentication routes (login, register, etc.)
- `/api/buses`: Bus-related routes (search, details, etc.)
- `/api/bookings`: Booking-related routes (create booking, view bookings, etc.)
- `/api/admin`: Admin-specific routes (add bus, manage bookings, etc.)