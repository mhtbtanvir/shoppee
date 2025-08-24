const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Rate Limiter ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many requests from this IP, try later.',
});
app.use(limiter);

// --- CORS: permissive ---
app.use(cors({
  origin: true, // allow all origins
  credentials: true,
}));

// --- Helmet: permissive CSP ---
app.use(
  helmet({
    contentSecurityPolicy: false, // disable CSP entirely
  })
);

// --- Serve uploads ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Serve frontend build if needed ---
app.use(express.static(path.join(__dirname, 'dist')));

// --- API Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// --- Root route ---
app.get('/', (req, res) => res.send('Shoppee API running 🚀'));

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
