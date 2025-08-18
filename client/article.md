
# Fixing OTP and Email Handling in Password Reset Flow

Implementing a password reset flow may seem simple, but I faced several challenges. Here’s how the journey went—from brute-force fixes to a clean, scalable solution.

---

## Phase 1: Brute-Force Frontend Fixes

### Challenges

- **Email lost on refresh:** Passing email via \`location.state\` made it disappear on reload, breaking OTP verification.
- **OTP verification fails on frontend:** OTPs were sometimes sent as arrays instead of strings, causing backend comparison errors (Postman worked fine).

### Initial Fix

Persist email and OTP in \`localStorage\`:

\`\`\`javascript
// In ForgotPassword.jsx
localStorage.setItem("resetEmail", email);

// In Otp.jsx
localStorage.setItem("resetOTP", otp);

// In RecreatePassword.jsx
const email = localStorage.getItem("resetEmail");
const otp = localStorage.getItem("resetOTP");

// Send OTP as string
body: JSON.stringify({ email, otp });
\`\`\`

> Redux was considered for state management, but its state resets on reload unless persisted. LocalStorage provided a quick and simple solution.

---

## Phase 2: Backend Security Fix

**Problem:** Backend accepted password reset requests with only email + new password—no OTP verification. Serious security risk.

**Fix:** Require OTP and expiry verification:

\`\`\`javascript
if (user.resetOTP !== otp || user.resetOTPExpiry < Date.now()) {
  return res.status(400).json({ message: 'Invalid or expired OTP.' });
}

user.password = newPassword; // hashed via pre-save hook
user.resetOTP = undefined;
user.resetOTPExpiry = undefined;
await user.save();
\`\`\`

**Password Hashing:**

\`\`\`javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
\`\`\`

---

## Phase 3: Moving Beyond Brute-Force – Redux & Redis

### Redux (Frontend State Management)

- Stores email, OTP, loading, and errors across pages.
- Keeps state consistent: \`Forgot Password → OTP → Reset Password\`.
- UI stays reactive and synchronized with backend responses.

### Redis (Backend Temporary Storage)

- **Temporary OTP storage:** Short TTL (e.g., 5 min).
- **Fast in-memory reads/writes:** Much faster than DB queries.
- **Built-in expiry:** Automatic deletion of expired keys.
- **Decouples OTP from main DB:** Improves security.
- **Stateless backend:** Any server instance can access OTPs.
- **Scalable & concurrent:** Handles multi-server and high-throughput scenarios.

> Redux handles frontend state, Redis handles temporary backend data—together, they make the password reset flow secure, reactive, and scalable.

---

## Key Takeaways

1. Use \`localStorage\` or Redux to persist email/OTP across pages.
2. Always verify OTP and expiry on the backend.
3. Hash passwords securely before saving.
4. Clear sensitive OTP data after reset.
5. Redux + Redis = scalable, reactive, secure multi-step flow.

---

This approach ensures a **secure, reliable, and user-friendly password reset experience**.

