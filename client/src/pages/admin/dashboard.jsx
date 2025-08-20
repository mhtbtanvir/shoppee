import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

  // Fetch stats, recent orders, and products
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/stats", { credentials: "include" }),
        fetch("http://localhost:5000/api/admin/orders?limit=5", { credentials: "include" }),
        fetch("http://localhost:5000/api/admin/products?limit=5", { credentials: "include" }),
      ]);

      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      setStats(statsData);
      setRecentOrders(ordersData);
      setRecentProducts(productsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-2xl mt-2">{stats.products}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl mt-2">{stats.users}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="text-2xl mt-2">{stats.orders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Revenue</h2>
          <p className="text-2xl mt-2">${stats.revenue}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        {loading ? (
          <p>Loading...</p>
        ) : recentOrders.length === 0 ? (
          <p>No recent orders.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 border">Order ID</th>
                  <th className="p-2 border">User</th>
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-100">
                    <td className="p-2 border">{order._id.slice(-6)}</td>
                    <td className="p-2 border">{order.userName}</td>
                    <td className="p-2 border">${order.total}</td>
                    <td className="p-2 border">{order.status}</td>
                    <td className="p-2 border">{new Date(order.createdAt).toLocaleDateString()}</td>
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
          <h2 className="text-2xl font-bold">Recent Products</h2>
          <Link to="/admin/products" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            Manage Products
          </Link>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : recentProducts.length === 0 ? (
          <p>No recent products.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Stock</th>
                  <th className="p-2 border">Featured</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-100">
                    <td className="p-2 border">{p.name}</td>
                    <td className="p-2 border">{p.category}</td>
                    <td className="p-2 border">${p.price}</td>
                    <td className="p-2 border">{p.stock}</td>
                    <td className="p-2 border">{p.isFeatured ? "Yes" : "No"}</td>
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
