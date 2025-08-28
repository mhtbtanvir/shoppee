import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import ScrollToTop from "./components/scrollToTop";

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
import ProductDetails from "./pages/productsDetails";
import About from "./pages/navLink/About";
import Contact from "./pages/navLink/Contact";
import Checkout from "./pages/HeaderLinks/Order/checkout";
import CartPage from "./pages/HeaderLinks/cart";
import Profile from "./pages/HeaderLinks/profile";
import OrderHistory from "./pages/HeaderLinks/Order/orderHistory";
import AdminDashboard from "./pages/admin/dashboard";
import AdminProducts from "./pages/admin/products";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess} from "./store/auth-slice";

function App() {
  const dispatch = useDispatch();
  

 
useEffect(() => {
  const initAuth = async () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      try {
        const res = await fetch(`api/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${storedToken}`,
          },
          credentials: "include", // send cookies too
        });

        const data = await res.json();

        if (res.ok && data.user) {
          dispatch(loginSuccess(data.user));
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          console.warn("Token invalid or expired");
          localStorage.removeItem("token");
          if (storedUser) {
            dispatch(loginSuccess(JSON.parse(storedUser))); // fallback
          } else {
            localStorage.removeItem("user");
          }
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        if (storedUser) dispatch(loginSuccess(JSON.parse(storedUser)));
      }
    } else if (storedUser) {
      dispatch(loginSuccess(JSON.parse(storedUser))); // fallback if no token
    }
  };

  initAuth();
}, [dispatch]);


  return (
    <>
    <ScrollToTop />
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
          // <PrivateRoute user={user} role="admin">
            <AdminLayout />
          // </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
