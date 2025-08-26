// utils/sendTokenResponse.js
const jwt = require("jsonwebtoken"); 
function sendTokenResponse(user, statusCode, res) {
  const signToken = (id, role) => {
  return jwt.sign(
    { id, role },                  // payload
    process.env.JWT_SECRET,        // secret key from .env
    { expiresIn: "1d" }            // token validity
  );
};
  const token = signToken(user._id, user.role);
  // 1️⃣ Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // 2️⃣ Set Authorization header
  res.setHeader("Authorization", `Bearer ${token}`);

  // 3️⃣ Send JSON with token + user info
  res.status(statusCode).json({
    success: true,
    token, // frontend can store/use this
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

module.exports = sendTokenResponse;
