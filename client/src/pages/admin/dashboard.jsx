import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBox, FaUsers, FaShoppingCart, FaDollarSign } from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/stats", { credentials: "include" }),
        fetch("http://localhost:5000/api/admin/orders?limit=5", { credentials: "include" }),
        fetch("http://localhost:5000/api/admin/products?limit=5", { credentials: "include" }),
      ]);

      if (!statsRes.ok) throw new Error("Failed to fetch stats");
      if (!ordersRes.ok) throw new Error("Failed to fetch orders");
      if (!productsRes.ok) throw new Error("Failed to fetch products");

      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      setStats(statsData);
      setRecentOrders(ordersData);
      setRecentProducts(productsData);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (error)
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">{error}</div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { title: "Total Products", value: stats.products, icon: <FaBox className="w-6 h-6" /> },
          { title: "Total Users", value: stats.users, icon: <FaUsers className="w-6 h-6" /> },
          { title: "Orders", value: stats.orders, icon: <FaShoppingCart className="w-6 h-6" /> },
          { title: "Revenue", value: `$${stats.revenue}`, icon: <FaDollarSign className="w-6 h-6" /> },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-shadow border border-gray-200"
          >
            <div>
              <h2 className="text-gray-500 font-medium">{stat.title}</h2>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
            </div>
            <div className="text-purple-500 text-3xl">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow hover:scale-105 transition-transform font-semibold"
          >
            View All Orders
          </Link>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : recentOrders.length === 0 ? (
          <p className="text-gray-600">No recent orders.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-md">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  {["Order ID", "User", "Total", "Status", "Date"].map((th, idx) => (
                    <th key={idx} className="p-3 text-left border-b text-gray-600">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={`transition-colors hover:bg-gray-100 ${idx % 2 === 0 ? "bg-gray-50" : ""}`}
                  >
                    <td className="p-3 border-b font-mono">{order._id.slice(-6)}</td>
                    <td className="p-3 border-b">{order.userName}</td>
                    <td className="p-3 border-b font-semibold">${order.total}</td>
                    <td className="p-3 border-b">{order.status}</td>
                    <td className="p-3 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Products */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recent Products</h2>
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow hover:scale-105 transition-transform font-semibold"
          >
            Manage Products
          </Link>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : recentProducts.length === 0 ? (
          <p className="text-gray-600">No recent products.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-md">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  {["Name", "Category", "Price", "Stock", "Featured"].map((th, idx) => (
                    <th key={idx} className="p-3 text-left border-b text-gray-600">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p, idx) => (
                  <tr
                    key={p._id}
                    className={`transition-colors hover:bg-gray-100 ${idx % 2 === 0 ? "bg-gray-50" : ""}`}
                  >
                    <td className="p-3 border-b">{p.name}</td>
                    <td className="p-3 border-b">{p.category}</td>
                    <td className="p-3 border-b font-semibold">${p.price}</td>
                    <td className="p-3 border-b">{p.stock}</td>
                    <td className="p-3 border-b">{p.isFeatured ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
