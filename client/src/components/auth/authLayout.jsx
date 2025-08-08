import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import backgroundImage from '../../assets/auth-bg.jpg'; // adjust path if needed

const AuthLayout = () => {
  return (
    <div className="  flex-grow overflow-auto w-screen h-screen flex flex-col lg:flex-row ">
      {/* Left Side: Background with overlays and buttons */}
      <div
        className="relative  flex-1 flex flex-col justify-center items-center p-6 sm:p-8 lg:p-10 text-white"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-700 opacity-20 z-0"></div>

        {/* Buttons and Text */}
       <div className=" z-10 w-screen max-w-sm flex  space-y-6">
      <div className=" z-10 w-full max-w-sm text-center text-md space-y-6">
  <div className="flex flex-col gap-4">
    <Link
      to="/auth/login"
      className=" text-lg px-6 py-2 text-white  hover:text-white rounded-lg font-bold bg-green-900/60  border-2 border-white/60 shadow-lg ring-1 ring-white/10 transition-transform transform hover:scale-105"
    >
      Login
    </Link>
    <Link
      to="/auth/register"
      className=" text-lg px-6 py-2 text-white hover:text-white rounded-lg font-semibold bg-blue-900/50  border-4 border-white/60 shadow-lg ring-1 ring-white/10 transition-transform transform hover:scale-105"
    >
      Register
    </Link>
  </div>
  <p className="text-base md:my-20 sm:text-lg text-slate-200">
    Login or register to continue...
  </p>
</div>
      
      </div>
      </div>

      {/* Right Side: Form Outlet */}
      <div className="flex-1 flex justify-center items-center p-6 sm:p-10 bg-[#0a1a3a]">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;