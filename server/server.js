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

// --- Trust first proxy (for Render, Vercel, Heroku) ---
app.set('trust proxy', 1);

// --- Middleware ---
app.use(helmet()); // security headers
app.use(morgan('dev')); // logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Rate Limiter ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// --- CORS ---
const allowedOrigins = [
  'https://shoppee-psi.vercel.app',
  'https://shoppee-mr6ffyrfr-tanvir-mahtabs-projects.vercel.app',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow curl, mobile apps, etc.
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed for this origin'), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// --- Helmet Content Security Policy (CSP) for images ---
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: [
      "'self'",
      "data:",
      "https://shoppee-psi.vercel.app",
      "https://shoppee-mr6ffyrfr-tanvir-mahtabs-projects.vercel.app",
      "https://shoppee-sb9u.onrender.com" // your image host
    ],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
  }
}));

// --- Serve uploads ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Serve frontend build (if any) ---
app.use(express.static(path.join(__dirname, 'dist')));

// --- API Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// --- Root route ---
app.get('/', (req, res) => {
  res.send('Welcome to Shoppee API! Backend is running 🚀');
});

// --- Health Check ---
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

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
