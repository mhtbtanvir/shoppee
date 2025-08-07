import React from 'react';
import { Outlet } from 'react-router-dom';
import backgroundImage from '../../assets/auth-bg.jpg';  // adjust path if needed
import { Link } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div 
      className="w-screen h-screen flex"
    //   style={{
    //     backgroundImage: `url(${backgroundImage})`,
    //     backgroundSize: 'cover',
    //     backgroundPosition: 'center',
    //   }}
    >

      {/* Left side with background image focused on right half */}
      
     
<div
  className="flex-1 w-fixed relative flex flex-col justify-center items-center p-4 shadow-2xl border border-gray-800 text-white"
  style={{
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'right center',
    backgroundRepeat: 'no-repeat',
  }}
>
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-l-xl -z-10"></div>

  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-700 opacity-20 rounded-l-xl -z-5"></div>
   {/* Buttons */}
  <div className="flex flex-col justify-end h-screen gap-6 z-10 relative text-center">
      <div className="flex flex-col justify-center gap-4">
      <Link
        to="/auth/login"
        className="px-6 py-2 text-slate-100 hover:text-white border-2 border-gray-200 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 transition-transform transform hover:scale-105 shadow-md"
      >
        Login
      </Link>
      <Link
        to="/auth/register"
        className="px-6 py-2 text-slate-100 hover:text-white border-2 border-gray-200 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600  transition-transform transform hover:scale-105 shadow-md"
      >
        Register
      </Link>
    </div>

    <p className="text-lg  text-slate-200">
      Login or register to continue...
    </p>

    
  
  </div>
</div>
      {/* Right side */}
     <div className="flex-1 flex justify-center items-center p-10 bg-[#0a1a3a]  rounded-r-xl">
   
   

    <Outlet />
  </div>

    </div>
  );
};

export default AuthLayout;
