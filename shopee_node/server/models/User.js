const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],  // add roles you want
    default: 'user',
  },
  resetOTP: String,          // store OTP temporarily
  resetOTPExpiry: Date,      // OTP expiration time
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.password && this.password.startsWith('$2b$')) {
    // Already hashed, skip re-hashing
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
