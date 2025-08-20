import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import heroBg from '../../assets/bg-hero.jpg';
import Header from '../Layout/header';
import Navbar from '../Layout/navBar';
import Footer from '../Layout/footer';

const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen m-6 border-2 border-gray-500 rounded-lg overflow-hidden">
      {/* Main content (left + right) */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Side: Header + Background */}
        <div className="relative md:w-1/2 h-96 md:h-auto flex flex-col">
          <header className="relative z-20">
            <Header />
            {/* <Navbar /> */}
          </header>

          <div className="md:h-full h-auto overflow-hidden relative">
            <img
              src={heroBg}
              alt="Fashion"
              className="w-full h-full object-cover object-top transform scale-105"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-700 opacity-20 z-0"></div>
          </div>
        </div>

        {/* Right Side: Form Outlet */}
        <div className="md:w-1/2 flex justify-center items-start p-6 sm:p-10 bg-[#fbfcfd]   
        md:border-t-0 md:border-l-2 border-gray-500">
          <Outlet />
        </div>
      </div>

      {/* Footer (sticks at bottom) */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default AuthLayout;
