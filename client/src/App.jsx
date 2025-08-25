import {  useEffect } from "react";
import { Route, Routes } from "react-router-dom";


import PrivateRoute from "./components/PrivateRoute";
import AuthLayout from "./components/auth/authLayout";
import HomeLayout from "./components/Layout/homeLayout";
import AdminLayout from "./components/Layout/adminLayout";

// pages ...
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgotPassword";
import OTP from "./pages/auth/otp";
import RecreatePassword from "./pages/auth/recreatePassword";
import HomePage from "./pages/homepage/homePage";
import Product from "./pages/navLink/product";
import WishList from "./pages/HeaderLinks/wishList";
import ProductDetails from "./pages/navLink/productsDetails";
import About from "./pages/navLink/About";
import Contact from "./pages/navLink/Contact";
import Checkout from "./pages/HeaderLinks/Order/checkout";
import CartPage from "./pages/HeaderLinks/cart";
import Profile from "./pages/HeaderLinks/profile";
import OrderHistory from "./pages/HeaderLinks/Order/orderHistory";
import AdminDashboard from "./pages/admin/dashboard";
import AdminProducts from "./pages/admin/products";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth,logout } from "./store/auth-slice";
import { useNavigate } from "react-router-dom";
function App() {
  const dispatch = useDispatch();
 const navigate = useNavigate();

const { user, isAuthenticated } = useSelector(selectAuth);

  // Check Redux state on every render
   useEffect(() => {
    if (!isAuthenticated) {
      dispatch(logout());
      navigate("/auth/login"); // ✅ use navigate() function
      console.log("User logged out automatically");
    }
  }, [isAuthenticated, dispatch, navigate]);
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
        <Route path="products" element={<Product />} />
        <Route path="wishlist" element={<WishList />} />
        <Route path="productsDetails/:id" element={<ProductDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="cart/checkout" element={<Checkout />} />
        <Route path="order-history" element={<OrderHistory />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute user={user} role="admin">
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
      </Route>
    </Routes>
  );
}

export default App;
