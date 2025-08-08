import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to send reset code");

      setSuccess(data.message);

      // Redirect to OTP page after 2 seconds
      setTimeout(() => {
      localStorage.setItem("resetEmail", email);
      navigate("/auth/OTP", { state: { email } });
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md space-y-4">
        {/* Intro Text */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-500">
            Recover your Password
          </h2>
          <p className="text-sm sm:text-md font-medium text-gray-500">
            Enter your email address, and we’ll send you instructions to reset your password.
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
              <Mail className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-100">
                Forgot Password
              </h2>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                />
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 font-medium text-sm text-center">
                  {error}
                </p>
              )}

              {/* Success Message */}
              {success && (
                <p className="text-green-500 font-medium text-sm text-center">
                  {success}
                </p>
              )}

              {/* Submit */}
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
                  "Send Reset Code"
                )}
              </motion.button>
            </form>
          </div>

          {/* Footer */}
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

export default ForgotPassword;
