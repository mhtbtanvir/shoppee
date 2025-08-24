
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react"; // import tick icon
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Redux imports
import { useDispatch } from "react-redux";
import { setResetEmail, setOtpMode } from "../../store/auth-slice"; // Adjust path as needed

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(8);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate("/auth/otp");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to register");

      // Dispatch email and otpMode to Redux here
      dispatch(setResetEmail(email));
      dispatch(setOtpMode("register"));

      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setCountdown(8); // Reset countdown for redirect
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
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-300">
            Hello Shopper
          </h2>
          <p className="text-sm sm:text-md font-medium text-slate-500">
            Welcome to Shoppee!
          </p>
          <p className="text-sm text-gray-400">
            Fill up a few informations below . . .
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
              <User className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Sign Up
              </h2>
            </div>

            {/* Success Message */}
              {success && (
              <div className="flex flex-col items-center justify-center gap-2 mb-4 text-green-400 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  <span>One more step to complete your Registration!</span>
                </div>
                
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                />
              </div>

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
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-500 font-medium text-sm text-center">
                  {error}
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
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-emerald-700"
                }`}
              >
                {isLoading ? (
                  <Loader className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>
               {success && (
              <p className="text-center text-sm text-gray-300 p-3 bg-gray-800 rounded-md shadow-inner select-none">
                  🔔 Please wait! OTP has been sent to your email. Redirecting to verification page in <span className="font-semibold">{countdown}</span> second{countdown !== 1 ? "s" : ""}...
              </p>

        )}
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 bg-gray-800/80 text-center border-t border-white/10">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-white hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
