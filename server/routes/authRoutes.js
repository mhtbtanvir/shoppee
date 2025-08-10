const express = require('express');
const {
  sendRegistrationOTP,
  createUser,
  loginUser,
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
} = require('../controllers/authController');

const router = express.Router();

// Registration with OTP
router.post('/register/send-otp', sendRegistrationOTP);
router.post('/register/verify-otp', createUser);

// Login
router.post('/login', loginUser);

// Password reset with OTP
router.post('/forgot-password/send-otp', sendResetOTP);
router.post('/forgot-password/verify-otp', verifyResetOTP);
router.post('/recreate-password/reset', resetPassword);

module.exports = router;
