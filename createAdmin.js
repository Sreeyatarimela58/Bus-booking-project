require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('⚠️ Admin already exists');
    } else {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123', // Will be hashed by pre-save hook
        isAdmin: true
      });
      console.log('✅ Admin user created:', admin.email);
    }

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });
