import React, { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTruck, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreditCard from "./CreditCard";
import { clearCart } from "@/store/cart-slice";

const Checkout = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ init dispatch

  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [focus, setFocus] = useState("");

  // ✅ store placed order
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first!");
      navigate("/auth/login");
      return;
    }

    if (items.length === 0) {
      toast.warn("Cart is empty!");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        products: items.map((item) => ({
          product: item.productId || item._id,
          quantity: item.quantity,
          price: item.price,
          color: item.color || null,
          size: item.size || null,
        })),
        totalPrice: totalAmount,
        shippingAddress: shipping,
        paymentMethod,
        ...(paymentMethod === "card" && { cardDetails: { number, name, date, cvc } }),
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        orderData,
        { withCredentials: true }
      );

      setLoading(false);
      toast.success("Order placed successfully!");
      dispatch(clearCart());
      // ✅ show invoice
      setPlacedOrder(data);

    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to place order.");
    }
  };
  
  // ✅ Render invoice only if order is placed
  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-6">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <h2 className="text-3xl font-bold text-gray-900">Invoice</h2>
        <p><strong>Order ID:</strong> {placedOrder._id}</p>
        <p><strong>Date:</strong> {new Date(placedOrder.createdAt).toLocaleString()}</p>
        <p><strong>Name:</strong> {placedOrder.shippingAddress.fullName}</p>
        <p>
          <strong>Address:</strong> {placedOrder.shippingAddress.address},{" "}
          {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.postalCode},{" "}
          {placedOrder.shippingAddress.country}
        </p>
        <p><strong>Payment Method:</strong> {placedOrder.paymentMethod.toUpperCase()}</p>

        <ul className="divide-y divide-gray-200 mt-4">
          {placedOrder.products.map((item) => (
            <li key={item.product} className="flex justify-between py-2">
              <span>{item.product} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between mt-4 text-lg font-bold">
          <span>Total</span>
          <span>${placedOrder.totalPrice.toFixed(2)}</span>
        </div>

       
<button
  onClick={() => navigate("/order-history")} // navigate to OrderHistory page
  className="mt-6 w-full py-3 bg-gray-500/80 border border-black/80 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 transition"
>
  Order History
</button>
      </div>
    );
  }

  // ✅ Original checkout form
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2 className="text-4xl font-bold text-gray-900">Checkout</h2>

      {/* Order Summary */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FaTruck className="text-yellow-500" /> Order Summary
        </h3>
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.productId || item._id} className="flex justify-between py-4">
              <div className="text-gray-700 font-medium">
                {item.name} × {item.quantity}
                {item.color && ` | Color: ${item.color}`}
                {item.size && ` | Size: ${item.size}`}
              </div>
              <span className="font-semibold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center mt-6 text-xl font-bold text-gray-900">
          <span>Total</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping & Payment Form */}
      <div className="bg-gray-950 shadow-2xl rounded-3xl p-10 md:max-w-2xl max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold ml-2 mb-4 font-prata text-gray-100">Shipping & Payment</h3>
        <form onSubmit={handleSubmit} className="space-y-2">
          {["fullName", "address", "city", "postalCode", "country"].map((field) => (
            <div key={field} className="flex flex-col p-2">
              <label className="text-gray-300 mb-2 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                placeholder={field}
                value={shipping[field]}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-400 bg-gray-900 text-white placeholder-gray-400 p-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-md transition"
              />
            </div>
          ))}

          <div>
            <label className="font-medium text-gray-300 mb-2 block">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-700 rounded-xl p-4 bg-gray-900 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-md transition"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="card">Credit/Debit Card</option>
            </select>
          </div>

          <div className="flex items-center gap-4 mt-3 text-gray-300 text-xl">
            {paymentMethod === "cod" && <FaMoneyBillWave className="m-2 h-8 w-8 text-green-400" />}
            {paymentMethod === "card" && <FaCreditCard className="text-blue-400 m-2 h-8 w-8" />}
          </div>

          {paymentMethod === "card" && (
            <CreditCard
              number={number}
              setNumber={setNumber}
              name={name}
              setName={setName}
              date={date}
              setDate={setDate}
              cvc={cvc}
              setCvc={setCvc}
              focus={focus}
              setFocus={setFocus}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold py-4 rounded-2xl shadow-xl hover:from-yellow-600 hover:to-yellow-700 transition flex justify-center items-center gap-2"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
