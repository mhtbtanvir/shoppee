"use client";
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Navbar from "./navBar";
import Footer from "./footer";
import ScrollToTop from "../scrollToTop";

const HomeLayout = () => {
  return (
    <>
    <ScrollToTop />
    <div className="flex flex-col min-h-screen rounded-md">
      {/* Header and Navbar always visible */}
      <header>
        <div className = "relative">
         <Header />
        <Navbar />
        </div>

        
       
      </header>

      {/* Page content */}
      <main className="flex-1 ">
        <Outlet />
      </main>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>
    </div>
    </>
  );
};

export default HomeLayout;
