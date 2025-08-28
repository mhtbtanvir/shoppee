// server/middleware/access.js
const asyncHandler = require('./asyncHandler'); // your asyncHandler wrapper

// Middleware to restrict access based on user roles
const access = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }

    next(); // user has allowed role → proceed
  });
};

module.exports = access;
