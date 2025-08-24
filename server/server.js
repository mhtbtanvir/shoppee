// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Security & Logging ---
app.use(helmet()); // basic security headers
app.use(morgan('dev')); // request logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.set('trust proxy', 1); // trust first proxy
// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // max requests per IP
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// --- CORS Configuration ---
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Expires', 'Pragma'],
}));

// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/orders', require('./routes/orderRoutes.js'));

// --- Health Check ---
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => {
  res.send('Welcome to Shoppee API! Backend is running 🚀');
});
// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
