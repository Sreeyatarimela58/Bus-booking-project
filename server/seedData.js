require('dotenv').config();
const mongoose = require('mongoose');
const Bus = require('./models/busModel');
const User = require('./models/userModel');
const Booking = require('./models/bookingModel');
const connectDB = require('./utils/db');

// This file is a utility to check and seed data if needed

const checkData = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    // Check if buses exist
    const busCount = await Bus.countDocuments();
    console.log(`✅ Found ${busCount} buses in the database`);
    
    // Check if users exist
    const userCount = await User.countDocuments();
    console.log(`✅ Found ${userCount} users in the database`);
    
    // Check if admin exists
    const adminCount = await User.countDocuments({ isAdmin: true });
    console.log(`✅ Found ${adminCount} admin users in the database`);
    
    // Check if bookings exist
    const bookingCount = await Booking.countDocuments();
    console.log(`✅ Found ${bookingCount} bookings in the database`);
    
    console.log('✅ Database check completed successfully');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('📌 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
};

// Run the check
checkData();