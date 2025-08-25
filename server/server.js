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
  message: 'Too many requests from this IP, try again later.',
});
app.use(limiter);

// --- CORS: permissive ---
const allowedOrigins = [
  "https://shoppee-psi.vercel.app" // production frontend (Vercel)
           // local frontend (Vite default)
            // local frontend (CRA fallback)
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,  // allow cookies / auth headers
}));

// --- Helmet: permissive ---
app.use(
  helmet({
    contentSecurityPolicy: false, // disable CSP entirely
  })
);
// app.use(
// //   helmet({
// //     contentSecurityPolicy: {
// //       directives: {
// //         defaultSrc: ["'self'"],
// //         scriptSrc: ["'self'", "https://cdn.jsdelivr.net"], // allow scripts from CDN
// //         styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
// //         imgSrc: ["'self'", "data:", "https://your-cdn.com"],
// //         connectSrc: ["'self'", "https://shoppee-sb9u.onrender.com"],
// //       },
// //     },
// //   })
// // );


// // --- Serve uploaded files with permissive headers ---
// app.get('/uploads/:filename', (req, res) => {
//   const options = {
//     root: path.join(__dirname, 'uploads'),
//     headers: {
//       'Access-Control-Allow-Origin': '*', // allow any origin
//       'Cross-Origin-Resource-Policy': 'cross-origin', // allow cross-origin
//     },
//   };
//   const fileName = req.params.filename;
//   res.sendFile(fileName, options, (err) => {
//     if (err) res.status(404).send('File not found');
//   });
// });

// // --- Serve frontend build if needed ---
// app.use(express.static(path.join(__dirname, 'dist')));

// // --- API Routes ---
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));

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

// --- Start Server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
