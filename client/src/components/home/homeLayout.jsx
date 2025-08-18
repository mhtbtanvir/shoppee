// components/home/HomeLayout.jsx
"use client";
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../header";
import Navbar from "../navbar";
import Footer from "../footer";

const HomeLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header and Navbar always visible */}
      <Header />
      <Navbar />

      {/* Page content */}
      <main className="flex-1 container mx-auto max-w-7xl px-4">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomeLayout;
