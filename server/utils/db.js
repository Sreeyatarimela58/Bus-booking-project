const mongoose = require('mongoose');

mongoose.set('debug', true); // Enable debug mode to log all MongoDB operations

const connectDB = async () => {
  try {
    // Mask password in URI for logging
    const safeUri = process.env.MONGO_URI.replace(/:\w+@/, ':<password>@');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected to:', safeUri);
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1); // Exit process on failure
  }
};

module.exports = connectDB;
