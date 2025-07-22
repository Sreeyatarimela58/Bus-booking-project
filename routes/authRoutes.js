const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Request OTP for registration (email-based)
router.post('/request-otp', authController.requestOtp);

// Verify OTP and register (email-based)
router.post('/verify-otp', authController.verifyOtpAndRegister);

// User Login
router.post('/login', authController.login);

module.exports = router;
