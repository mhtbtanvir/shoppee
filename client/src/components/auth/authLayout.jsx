import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import heroBg from '../../assets/bg-hero.jpg';
import Header from '../home/header';
import Navbar from '../home/navBar';

const AuthLayout = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen m-6 border-2 md:border-r-0 border-gray-500 rounded-lg overflow-hidden">
      {/* Left Side: Header + Background + Buttons */}
      <div className="relative md:w-1/2 h-96 md:h-full flex flex-col">
        {/* Header and Navbar */}
        <header className=" relative z-20">
          <Header />
          {/* <Navbar /> */}
         
        </header>

        {/* Background image with overlays */}
        <div className=" md:h-full h-96 overflow-hidden relative">
              <img
                src={heroBg}
                alt="Fashion"
                className="w-full h-full object-cover object-top transform scale-105"
              />
            
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-700 opacity-20 z-0"></div>

          {/* Buttons and Text */}
          {/* <div className="relative z-10 w-full max-w-sm text-center space-y-6">
            {/* <div className="flex flex-col gap-4">
              <Link
                to="/auth/login"
                className="text-lg px-6 py-2 text-white rounded-lg font-bold bg-green-900/60 border-2 border-white/60 shadow-lg ring-1 ring-white/10 transition-transform transform hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="text-lg px-6 py-2 text-white rounded-lg font-semibold bg-blue-900/50 border-4 border-white/60 shadow-lg ring-1 ring-white/10 transition-transform transform hover:scale-105"
              >
                Register
              </Link>
            </div> */}
            {/* <p className="text-base sm:text-lg text-slate-200">
              Login or register to continue...
            </p>
          // </div> */} */
        </div>
      </div>

      {/* Right Side: Form Outlet */}
      <div className="md:w-1/2  h-96 md:h-full flex justify-center items-start p-6 sm:p-10 bg-[#fbfcfd]   
      md:border-t-0 md:border-l-2 border-gray-500 overflow-auto">
  <Outlet />
</div>

    </div>
  );
};

export default AuthLayout;
