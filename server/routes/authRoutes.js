const express = require('express');
const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOTP,
  recreatePassword,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/recreate-password', recreatePassword);


module.exports = router;
