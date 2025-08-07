import { motion } from "framer-motion";
import { Mail, Lock, User, Loader } from "lucide-react";
import { Link } from "react-router-dom";

const Register = ({ isLoading = false, error = null }) => {
  return (
    <div className="w-full max-w-md bg-white/5 backdrop-blur-xl p-10 rounded-xl shadow-lg space-y-3">
    <h2 className="text-3xl flex items-center justify-center font-semibold text-slate-300 ">
        Hello Shopper
    </h2>
    <p className="text-md flex items-center justify-center font-semibold text-slate-500">Welcome to Shoppee!</p>

    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
    >

      {/* Top: Header */}
      <div className="px-8 pt-10 pb-6">
        <div
       
          className="flex justify-center gap-2 items-center text-xl font-extrabold text-center bg-gradient-to-r from-blue-200 to-indigo-300 text-transparent bg-clip-text mb-8"
        >
          <User className="w-6 h-6 text-gray-600" />
          <h2 className="text-2xl font-semibold text-white">Sign Up</h2>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Name Field */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              required
              autoComplete="name"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              required
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              required
              autoComplete="new-password"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 font-medium text-sm text-center">{error}</p>
          )}

          {/* Submit Button */}
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
      </div>

      {/* Bottom: Login link */}
      <div className="px-8 py-4 bg-gray-800/80 text-center border-t border-white/10">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-white hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </motion.div>
    </div>
  );
};

export default Register;