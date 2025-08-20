// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');

const {
  sendRegistrationOTP,
  createUser,
  loginUser,
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
} = require('../controllers/authController');

// Registration with OTP
router.post('/register/send-otp', asyncHandler(sendRegistrationOTP));
router.post('/register/verify-otp', asyncHandler(createUser));

// Login
router.post('/login', asyncHandler(loginUser));

// Password reset with OTP
router.post('/forgot-password/send-otp', asyncHandler(sendResetOTP));
router.post('/forgot-password/verify-otp', asyncHandler(verifyResetOTP));
router.post('/recreate-password/reset', asyncHandler(resetPassword));

module.exports = router;
