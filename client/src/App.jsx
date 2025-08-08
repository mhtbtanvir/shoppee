import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/authLayout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgotPassword";
import OTP from "./pages/auth/otp";
import RecreatePassword from "./pages/auth/recreatePassword";
import HomePage from "./pages/homePage";

function App() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="otp" element={<OTP />} />
          <Route path="recreatepassword" element={<RecreatePassword />} />
        </Route>

        <Route path="/" element={<HomePage />} />

        {/* Optional: Redirect or 404 route */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
