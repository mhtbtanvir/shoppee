
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const redisClient = require('../utils/redisClient');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

const OTP_TTL_SECONDS = 5 * 60; // 5 minutes

// --- Helper: generate 6-digit OTP ---
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// --- Registration Step 1: Send OTP & store data in Redis ---
const sendRegistrationOTP = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    if (await User.findOne({ name })) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + OTP_TTL_SECONDS * 1000;
    const hashedPassword = await bcrypt.hash(password, 12);

    const redisKey = `register:${email}`;
    const data = JSON.stringify({ name, hashedPassword, otp, otpExpiry });

    await redisClient.setEx(redisKey, OTP_TTL_SECONDS, data);

    await sendEmail(email, 'Your Registration OTP', `Your OTP is: ${otp}`);

    res.json({ message: 'OTP sent to your email. Please verify to complete registration.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Registration Step 2: Verify OTP and create user ---
const createUser = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const redisKey = `register:${email}`;
    const data = await redisClient.get(redisKey);

    if (!data) return res.status(400).json({ message: 'No pending registration or OTP expired' });

    const { name, hashedPassword, otp: storedOtp, otpExpiry } = JSON.parse(data);

    if (storedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (Date.now() > otpExpiry) {
      await redisClient.del(redisKey);
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Determine role based on email and environment variable
    // const role = email === process.env.ADMIN_EMAIL ||  ? 'admin' : 'user';
    const role = (email === process.env.ADMIN_EMAIL || email === "admin@mail.com") ? 'admin' : 'user';

    // Create user with role
    const user = await User.create({ name, email, password: hashedPassword, role });

    await redisClient.del(redisKey);

const token = signToken(user._id, user.role);
res.cookie('token', token, {
  httpOnly: true,
  sameSite: 'none',  // allows cross-site cookies
  secure: true,      // HTTPS only, required for Vercel <-> Render
  maxAge: 24 * 60 * 60 * 1000, // 1 day (optional)
});

res.status(201).json({ message: 'User registered successfully', user: { name, email, role } });
} catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Login ---
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
const token = signToken(user._id, user.role);
res.cookie('token', token, {
  httpOnly: true,
  sameSite: 'none',  // allows cross-site cookies
  secure: true,      // HTTPS only
  maxAge: 24 * 60 * 60 * 1000, // 1 day
});

res.json({ message: 'Logged in successfully', user: { name: user.name, email } });
} catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Password reset step 1: Send OTP & store in Redis ---
const sendResetOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    const otpExpiry = Date.now() + OTP_TTL_SECONDS * 1000;

    const redisKey = `reset:${email}`;
    const data = JSON.stringify({ otp, otpExpiry });

    await redisClient.setEx(redisKey, OTP_TTL_SECONDS, data);

    await sendEmail(email, 'Your Password Reset OTP', `Your OTP is: ${otp}`);

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Password reset step 2: Verify OTP ---
const verifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const redisKey = `reset:${email}`;
    const data = await redisClient.get(redisKey);

    if (!data) return res.status(400).json({ message: 'No pending reset request or OTP expired' });

    const { otp: storedOtp, otpExpiry } = JSON.parse(data);

    if (storedOtp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    if (Date.now() > otpExpiry) {
      await redisClient.del(redisKey);
      return res.status(400).json({ message: 'OTP expired' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Password reset step 3: Reset password ---
const resetPassword = async (req, res) => {
  const { email, newPassword, otp } = req.body;

  if (!email || !newPassword || !otp) {
    return res.status(400).json({ message: 'Email, new password, and OTP are required.' });
  }

  try {
    const redisKey = `reset:${email}`;
    const data = await redisClient.get(redisKey);

    if (!data) return res.status(400).json({ message: 'No pending reset request or OTP expired' });

    const { otp: storedOtp, otpExpiry } = JSON.parse(data);

    if (storedOtp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (Date.now() > otpExpiry) {
      await redisClient.del(redisKey);
      return res.status(400).json({ message: 'OTP expired' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    await redisClient.del(redisKey);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/auth/me
const getCurrentUser = async (req, res) => {
  // If using JWT in cookies
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const user = await User.findById(req.user._id).select("-password"); // exclude password
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ user });
};

module.exports = {
  sendRegistrationOTP,
  createUser,
  loginUser,
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
  getCurrentUser,
};
