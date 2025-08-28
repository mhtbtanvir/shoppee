// models/order.js
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        color: String,
        size: String,
      },
    ],
    totalPrice: { type: Number, required: true },
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: { type: String, required: true, enum: ["cod", "card", "paypal", "stripe"] },
    cardDetails: {
      number: String,
      name: String,
      date: String,
      cvc: String,
    },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

// ✅ Avoid OverwriteModelError
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;
