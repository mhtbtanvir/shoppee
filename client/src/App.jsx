import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/authLayout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgotPassword";
import OTP from "./pages/auth/otp";
import RecreatePassword from "./pages/auth/recreatePassword";
import HomeLayout from "./components/home/HomeLayout";
 // optional wrapper for HomePage
import HomePage from "./pages/homePage";

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="otp" element={<OTP />} />
        <Route path="recreate-password" element={<RecreatePassword />} />
      </Route>

      {/* Home routes */}
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<HomePage />} />
        {/* Add more routes here if needed */}
      </Route>

      {/* Optional: 404 */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
