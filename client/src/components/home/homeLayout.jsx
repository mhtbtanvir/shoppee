"use client";
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Navbar from "./navBar";
import Footer from "./footer";

const HomeLayout = () => {
  return (
    <div className="flex flex-col min-h-screen rounded-md">
      {/* Header and Navbar always visible */}
      <header>
        <Header />
        <Navbar />
      </header>

      {/* Page content */}
      <main className="flex-1 container mx-auto max-w-7xl">
        <Outlet />
      </main>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default HomeLayout;
