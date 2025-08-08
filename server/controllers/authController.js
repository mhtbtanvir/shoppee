const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');


// Utility to sign JWT
const signToken = (id) => 
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Register

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'email already exists' });
    }
     if (await User.findOne({ name })) {
      return res.status(400).json({ message: 'Username already exists.choose another.' });
    }
    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ message: 'User registered', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Logged in successfully', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password — generate OTP and "send" email

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = crypto.randomInt(100000, 999999).toString();

    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

await sendEmail(user.email, 'Your Password Reset OTP', otp);

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (
      !user ||
      !user.resetOTP ||
      user.resetOTP !== otp ||
      user.resetOTPExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP is valid: clear otp and expiry if needed
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();
//     console.log("User resetOTP:", user.resetOTP);
// console.log("Provided OTP:", otp);
// console.log("OTP expiry:", user.resetOTPExpiry);


    return res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// Reset Password


const recreatePassword = async (req, res) => {
  const { email, newPassword, otp } = req.body;

//  const email = localStorage.getItem("resetEmail");
  if (!email || !newPassword || !otp) {
    return res.status(400).json({ message: 'Email and new password are required.' });
  }

  try {
    // console.log('Request body:', req.body); // For debugging

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
// Verify OTP is correct and not expired
    if (user.resetOTP !== otp || user.resetOTPExpiry < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = newPassword;  // assign plain password
    
    // Clear reset tokens if you have them
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOTP,
  recreatePassword,
};
