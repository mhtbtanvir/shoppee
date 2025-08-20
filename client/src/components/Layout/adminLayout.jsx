import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Admin validation error

  // Check if user is admin
  const validateAdmin = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/admin/products", {
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "You are not an admin");
      }

      // Optionally, you could check for specific role in data
      // const data = await res.json();
      // if (data.role !== "admin") throw new Error("You are not an admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateAdmin();
  }, []);

  const handleLogout = () => {
    navigate("/auth/login");
  };

  const isActive = (path) => location.pathname === path;

  // Display error if not admin
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

  // Admin layout
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-4 text-2xl font-bold flex justify-between items-center">
          {sidebarOpen && "Admin Panel"}
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu size={24} />
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-2 p-2">
          <Link
            to="/admin"
            className={`px-4 py-2 rounded hover:bg-gray-700 ${
              isActive("/admin") ? "bg-gray-700 font-semibold" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className={`px-4 py-2 rounded hover:bg-gray-700 ${
              isActive("/admin/products") ? "bg-gray-700 font-semibold" : ""
            }`}
          >
            Products
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Logout
        </button>
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
