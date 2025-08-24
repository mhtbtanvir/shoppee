import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaUser } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();

  const handleAdminPanel = () => {
    navigate("/admin");
  };

  const handleUserInterface = () => {
    navigate("/");
  };

  return (

            <div className="m-6 border-2 border-gray-500/30 shadow-xl p-6">

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-white p-6">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-12 max-w-xl w-full text-center space-y-8 border border-gray-200">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide">
          Welcome to Your Profile
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Do you have <span className="font-semibold">admin access</span> to create, update, or delete products in the database? 
          Please make sure you are logged in with proper credentials before proceeding.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
          {/* Admin Panel Button */}
          <button
            onClick={handleAdminPanel}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform font-semibold text-lg"
          >
            <FaUserShield className="w-5 h-5" />
            Proceed to Admin Panel
          </button>

          {/* User Interface Button */}
          <button
            onClick={handleUserInterface}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-100 text-gray-800 rounded-2xl shadow-md hover:bg-gray-200 hover:scale-105 transition-all font-semibold text-lg"
          >
            <FaUser className="w-5 h-5" />
            Back to User Interface
          </button>
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-sm mt-4">
          © 2025 Your Company. All rights reserved.
        </p>
      </div>
    </div>
    </div>
  );
};

export default Profile;
