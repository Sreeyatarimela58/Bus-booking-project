console.log("✅ authController loaded");
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const requestOtp = async (req, res) => {
  const { email } = req.body;
  console.log("📩 requestOtp hit, email:", email);

  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ success: false, message: 'Email already registered' });

  const otp = generateOTP();

  try {
    // Save OTP in DB
    await Otp.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 mins
    });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Registration',
      html: `<p>Your OTP is: <strong>${otp}</strong></p><p>This OTP will expire in 5 minutes.</p>`,
    });

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error in requestOtp:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

const verifyOtpAndRegister = async (req, res) => {
  try {
    let { email, otp, name, password, phone } = req.body;
    email = email.trim().toLowerCase();
    console.log("📩 Received for verification:", { email, otp, name, phone });

    if (!email || !otp || !name || !password || !phone) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const allOtps = await Otp.find({ email });
    console.log("📄 All OTPs for this email:", allOtps);

    const latestOtp = allOtps.sort((a, b) => b.expiresAt - a.expiresAt)[0];
    console.log("✅ Latest OTP for verification:", latestOtp);
    console.log('Comparing:', { entered: otp.toString(), stored: latestOtp ? latestOtp.otp : null });

    if (!latestOtp) {
      return res.status(400).json({ success: false, message: "No OTP found. Please request a new one." });
    }

    if (latestOtp.otp !== otp.toString()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (latestOtp.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Clean up used OTPs
    await Otp.deleteMany({ email });

    // Return success with token and user data
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error in verifyOtpAndRegister:', error);
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

module.exports = {
  requestOtp,
  verifyOtpAndRegister,
  login
};
