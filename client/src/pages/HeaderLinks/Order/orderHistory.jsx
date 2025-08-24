import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectAuth } from "@/store/auth-slice";
import {
  FaChevronDown,
  FaChevronUp,
  FaBox,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import jsPDF from "jspdf";

const OrderHistory = () => {
  const { isAuthenticated } = useSelector(selectAuth);
  const [orders, setOrders] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

  const fetchOrders = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/orders", {
      withCredentials: true, // ✅ send cookie (jwt) to backend
    });

    setOrders(Array.isArray(data.orders) ? data.orders : []);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    setOrders([]);
  }
};


    fetchOrders();
  }, [isAuthenticated]);

  const toggleOpen = (index) => setOpenIndex(openIndex === index ? null : index);

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 38);
    doc.text(`Name: ${order.shippingAddress.fullName}`, 14, 46);
    doc.text(
      `Address: ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`,
      14,
      54
    );
    doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 14, 62);

    let startY = 70;
    doc.text("Products:", 14, startY);
    startY += 6;

    order.products.forEach((item) => {
      const productName = item.product?.name || item.product || "Unknown Product";
      doc.text(
        `${productName} | Size: ${item.size || "-"} | Color: ${item.color || "-"} | Qty: ${item.quantity} | $${item.price.toFixed(2)}`,
        14,
        startY
      );
      startY += 6;
    });

    doc.text(`Total Price: $${order.totalPrice.toFixed(2)}`, 14, startY + 6);
    doc.save(`Invoice-${order._id}.pdf`);
  };

  const statusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="badge-yellow"><FaBox /> {status}</span>;
      case "Delivered":
        return <span className="badge-green"><FaCheckCircle /> {status}</span>;
      case "Cancelled":
        return <span className="badge-red"><FaTimesCircle /> {status}</span>;
      default:
        return <span>{status}</span>;
    }
  };

 return (
  <div className="max-w-6xl mx-auto  p-12 space-y-8">
    <h1 className="text-4x font-prata flex justify-center items-center pb-5 font-extrabold text-gray-900 tracking-tight">
      My Orders
    </h1>

    {orders.length === 0 ? (
      <div className="bg-gray-50 border-2 border-red-800 rounded-xl p-6 text-center">
        <p className="text-gray-500 text-lg">You don’t have any orders yet.</p>
      </div>
    ) : (
      orders.map((order, index) => (
        <div
          key={order._id}
          className="bg-white shadow-sm rounded-2xl border border-gray-500 overflow-hidden transition hover:shadow-xl"
        >
          {/* Header */}
          <div
            className="flex justify-between items-center px-6 py-5 cursor-pointer hover:bg-gray-50 transition"
            onClick={() => toggleOpen(index)}
          >
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <FaBox className="text-yellow-600 text-xl" />
              </div>
              <div>
                <p className="font-semibold text-lg text-gray-900">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span>{statusBadge(order.status)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  generateInvoice(order);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
              >
                <FaDownload className="text-gray-600" /> Invoice
              </button>
              {openIndex === index ? (
                <FaChevronUp className="text-gray-500 text-lg" />
              ) : (
                <FaChevronDown className="text-gray-500 text-lg" />
              )}
            </div>
          </div>

          {/* Details Dropdown */}
          <div
            className={`px-6 border-t border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out ${
              openIndex === index
                ? "max-h-[1000px] py-6"
                : "max-h-0 overflow-hidden"
            }`}
          >
            {/* Order summary */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
              <p>
                <span className="font-medium text-gray-900">
                  Payment Method:
                </span>{" "}
                {order.paymentMethod.toUpperCase()}
              </p>
              <p>
                <span className="font-medium text-gray-900">Total Price:</span>{" "}
                ${order.totalPrice.toFixed(2)}
              </p>
              <p className="sm:col-span-2">
                <span className="font-medium text-gray-900">Shipping To:</span>{" "}
                {order.shippingAddress.fullName},{" "}
                {order.shippingAddress.address},{" "}
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
            </div>

            {/* Products Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-3 text-left font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Size</th>
                    <th className="px-4 py-3 font-medium">Color</th>
                    <th className="px-4 py-3 font-medium">Qty</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.products.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-white transition-colors"
                    >
                      <td className="px-4 py-3 flex items-center gap-3">
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt={item.product?.name || "Product"}
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                        )}
                        <span className="font-medium text-gray-900">
                          {item.product?.name ||
                            item.product ||
                            "Unknown Product"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.size || "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.color || "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        ${item.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

};

export default OrderHistory;
