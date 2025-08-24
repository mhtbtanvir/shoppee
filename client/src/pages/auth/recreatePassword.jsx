import { motion } from "framer-motion";
import { Lock, Loader, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, clearOtpData } from "../../store/auth-slice/index"; // adjust path if needed

const RecreatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email, otp } = useSelector(selectAuth);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  // Redirect if email or otp missing in Redux store
  // useEffect(() => {
  //   if (!email || !otp) {
  //     navigate("/auth/forgot-password");
  //   }
  // }, [email, otp, navigate]);

  // Clear OTP data when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearOtpData());
    };
  }, [dispatch]);

  // Redirect after success countdown
  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/auth/login"); // redirect after reset
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setCountdown(5);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/recreate-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password, otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to reset password");

     
      setSuccess(true);
      setSuccessMessage(data.message || "Password reset successfully!");
      dispatch(clearOtpData());

      // setTimeout(() => {
      //   navigate("/auth/login");
      // }, 3000);
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
            Reset Password
          </h2>
          <p className="text-sm sm:text-md font-medium text-gray-500">
            Enter your email, and new password.
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
              <Lock className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-100">
                Create New Password
              </h2>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email field readonly */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={email || ""}
                  readOnly
                  className="w-full pl-4 pr-4 py-3 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  autoComplete="email"
                />
              </div>

              {/* New password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="New Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  autoComplete="new-password"
                />
              </div>

              {/* Confirm password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <p className="text-red-500 font-medium text-sm text-center">{error}</p>
              )}

              {success && (
                <p className="text-green-500 font-medium text-sm text-center">
            {successMessage} Redirecting to Log In page in {countdown} second{countdown !== 1 ? "s" : ""}...
                  </p>
              )}

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
                {isLoading ? (
                  <Loader className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </form>
          </div>

          <div className="px-6 sm:px-8 py-4 bg-gray-800/80 text-center border-t border-white/10">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RecreatePassword;
