import { motion } from "framer-motion";
import { KeyRound, ArrowLeft, Loader, RotateCcw } from "lucide-react";
import { Link, useNavigate, useLocation, useEffect, useRef } from "react-router-dom";
import { useState } from "react";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
 const storedEmail = localStorage.getItem("resetEmail");
const email = location.state?.email || storedEmail || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Resend OTP state
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState(null);
  const [resendSuccess, setResendSuccess] = useState(null);

  // refs for inputs to control focus
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!email) {
      console.warn("No email found in location state, redirecting to forgot password");
      navigate("/auth/forgot-password");
    } else {
      // Focus first OTP input when component mounts and email is present
      inputsRef.current[0]?.focus();
    }
  }, [email, navigate]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input if available and value entered
      if (value && index < otp.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
      // If user clears input, optionally focus previous input (optional UX)
      else if (!value && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }
    console.log("Payload to backend:", { email, otp: code });

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp:code }),
      });

      const data = await res.json();

        if (res.ok) {
        setSuccess("OTP verified successfully! Redirecting...");
        localStorage.removeItem("resetEmail");
        setTimeout(() => {
          navigate("/auth/recreatePassword", { state: { email } });
        }, 3000);
      } else {
        setError(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendError(null);
    setResendSuccess(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setResendSuccess("OTP resent successfully! Check your email.");
      } else {
        setResendError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setResendError("Something went wrong. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md space-y-4">
        {/* Intro Text */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-500">OTP Verification</h2>
          <p className="text-sm sm:text-md font-medium text-gray-500">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        {/* Animated Form Container */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Form Header */}
          <div className="px-6 sm:px-8 pt-8 pb-4">
            <div className="flex justify-center gap-2 items-center mb-6">
              <KeyRound className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-100">Enter OTP</h2>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* OTP Inputs */}
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputsRef.current[index] = el)}
                    className="w-12 h-12 text-center rounded-lg bg-gray-800 text-white text-lg focus:outline-none focus:ring-2 focus:ring-white transition-all"
                    inputMode="numeric"
                    pattern="\d*"
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 font-medium text-sm text-center">{error}</p>}

              {/* Success Message */}
              {success && <p className="text-green-500 font-medium text-sm text-center">{success}</p>}

              {/* Verify Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 font-bold rounded-lg shadow-md text-white transition-all focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isLoading
                    ? "bg-green-500/70 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-green-600 hover:to-emerald-700"
                }`}
              >
                {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Verify"}
              </motion.button>

              {/* Resend OTP */}
              <div className="flex flex-col items-center mt-3 space-y-1">
                {resendError && <p className="text-red-500 font-medium text-xs text-center">{resendError}</p>}
                {resendSuccess && <p className="text-green-500 font-medium text-xs text-center">{resendSuccess}</p>}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className={`flex items-center gap-1 text-sm transition-all ${
                    resendLoading ? "text-gray-500 cursor-not-allowed" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  {resendLoading ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 bg-gray-800/80 text-center border-t border-white/10">
            <Link
              to="/auth/forgot-password"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Forgot Password
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OTP;
