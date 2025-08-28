import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "../../../src/store/auth-slice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submit
 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ ensures cookie comes back
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to login");

    // ✅ Grab token from login response
    const authHeader = res.headers.get("Authorization");
    const headerToken = authHeader?.split(" ")[1];
    const bodyToken = data.token;

    // ✅ Prefer header token if it exists, else fallback to body
    const token = headerToken || bodyToken;

      if (token) {
        localStorage.setItem("token", token);
      }
      if (!res.ok) {
          localStorage.removeItem("token");
          throw new Error(data.message || "Failed to login");
        }


    // ✅ Get current user with both cookie + header support
    const meRes = await fetch(`/api/auth/me`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }), // ✅ send header if exists
      },
      credentials: "include", // ✅ send cookie too
    });

    const meData = await meRes.json();
    if (!meRes.ok) throw new Error(meData.message || "Failed to fetch user");

    // Save user in Redux
    dispatch(loginSuccess(meData.user || meData));

    // ✅ Persist user
    localStorage.setItem("user", JSON.stringify(meData.user || meData));

    navigate("/"); // redirect home
  } catch (err) {
    setError(err.message);
    dispatch(loginFailure(err.message));
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
            Welcome
          </h2>
          <p className="text-sm sm:text-md font-medium text-gray-500">
            Registered? To get started, fill up the credentials . . .
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
              <Lock className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-100">
                Login
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                />
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-slate-200 hover:text-slate-400 transition-all"
                >
                  Forgot password?
                </Link>
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
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-green-600 hover:to-emerald-700"
                }`}
              >
                {isLoading ? (
                  <Loader className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "Login"
                )}
              </motion.button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 bg-gray-800/80 text-center border-t border-white/10">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link to="/auth/register" className="text-white hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
