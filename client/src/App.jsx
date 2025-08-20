import { Route, Routes, Navigate } from "react-router-dom";
import AuthLayout from "./components/auth/authLayout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgotPassword";
import OTP from "./pages/auth/otp";
import RecreatePassword from "./pages/auth/recreatePassword";
import HomeLayout from "./components/Layout/homeLayout";
import HomePage from "./pages/homepage/homePage";
import Product from "./pages/Products/product";

// Admin panel
import AdminLayout from "./components/Layout/adminLayout.jsx";
import AdminDashboard from "./pages/admin/dashboard.jsx";
import AdminProducts from "./pages/admin/products.jsx";

// PrivateRoute wrapper
// const PrivateRoute = ({ children, user, role }) => {
//   if (!user) return <Navigate to="/auth/login" replace />;
//   if (role && user.role !== role) return <Navigate to="/" replace />;
//   return children;
// };

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
        <Route path="homepage" element={<HomePage />} />
        <Route path="products" element={<Product />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          // <PrivateRoute user={user} role="admin">
            <AdminLayout />
          // </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
      </Route>

      {/* Optional 404 */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
