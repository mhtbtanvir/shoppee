import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Loader, ShieldCheck, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { selectAuth, setOtp, loginSuccess } from "../../store/auth-slice"; // adjust path

const OTP = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, otpMode } = useSelector(selectAuth);

  const [otpInput, setOtpInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  // Redirect if no otpMode
  useEffect(() => {
    if (!otpMode) navigate("/auth");
  }, [otpMode, navigate]);

  // Countdown redirect after success
  useEffect(() => {
    if (!success) {
      setCountdown(5);
      return;
    }

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          if (otpMode === "register") {
            navigate("/auth/login"); // after registration OTP success
          } else if (otpMode === "forgot-password") {
            navigate("/auth/recreate-password"); // after forgot-password OTP
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [success, otpMode, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);
    setSuccessMessage("");

    try {
      const apiUrl =
        otpMode === "register"
          ? "http://localhost:5000/api/auth/register/verify-otp"
          : "http://localhost:5000/api/auth/forgot-password/verify-otp";

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpInput }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      dispatch(setOtp(otpInput));

      // ✅ Log user in after registration OTP success
      if (otpMode === "register" && data.user) {
        dispatch(loginSuccess(data.user));
      }

      setSuccess(true);
      setSuccessMessage(data.message || "OTP verified successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-500">
            Enter OTP
          </h2>
          <p className="text-sm sm:text-md font-medium text-gray-500">
            We've sent a one-time password to{" "}
            <span className="font-semibold">{email}</span>. Enter it below to
            continue.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="px-6 sm:px-8 pt-8 pb-4">
            <div className="flex justify-center gap-2 items-center mb-6">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-100">
                OTP Verification
              </h2>
            </div>

            <form className="space-y-5" onSubmit={handleVerify}>
              <input
                type="text"
                placeholder="Enter OTP"
                required
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                disabled={isLoading || success}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />

              {error && (
                <p className="text-red-500 font-medium text-sm text-center">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green-500 font-medium text-sm text-center">
                  {successMessage} Redirecting in {countdown} second
                  {countdown !== 1 ? "s" : ""}...
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || success}
                className={`w-full py-3 px-4 font-bold rounded-lg shadow-md text-white transition-all focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isLoading
                    ? "bg-green-500/70 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-blue-600 hover:to-blue-500"
                }`}
              >
                {isLoading ? (
                  <Loader className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "Verify OTP"
                )}
              </motion.button>
            </form>
          </div>

          <div className="px-6 sm:px-8 py-4 bg-gray-800/80 text-center border-t border-white/10">
            <Link
              to={otpMode === "register" ? "/auth/register" : "/auth/forgot-password"}
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {otpMode === "register" ? "Registration" : "Email Entry"}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OTP;
