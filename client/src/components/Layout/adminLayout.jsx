import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiHome, FiBox } from "react-icons/fi";
import {  useDispatch } from "react-redux";
import {  logout } from "../../store/auth-slice";
import axios from "axios";
const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const validateAdmin = async () => {
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "You are not an admin");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateAdmin();
  }, []);
const dispatch = useDispatch();
const handleLogout = async () => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
  } catch (err) {
    console.log(err);
  } finally {
    // Clear Redux state
    dispatch(logout());

    // ✅ Clear localStorage
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/auth/login");
  }
};
  const isActive = (path) => location.pathname === path;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600 font-bold">
        <p>{error}</p>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-4 flex justify-center items-center">
          <button
            className="text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu size={24} />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-2 p-2">
          <Link
            to="/admin"
            className={`flex items-center justify-center px-4 py-2 rounded hover:bg-gray-700 ${
              isActive("/admin") ? "bg-gray-700 font-semibold" : ""
            }`}
          >
            {sidebarOpen ? "Dashboard" : <FiHome size={20} />}
          </Link>
          <Link
            to="/admin/products"
            className={`flex items-center justify-center px-4 py-2 rounded hover:bg-gray-700 ${
              isActive("/admin/products") ? "bg-gray-700 font-semibold" : ""
            }`}
          >
            {sidebarOpen ? "Products" : <FiBox size={20} />}
          </Link>
        </nav>

        {sidebarOpen && (
          <button
            onClick={handleLogout}
            className="m-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Logout
          </button>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <button
            className="md:hidden text-gray-800"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu size={24} />
          </button>
          <div className="font-semibold text-gray-700">Admin Panel</div>
          <div>User Info / Quick Actions</div>
        </header>

        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
