const Order = require("../models/order");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { products, totalPrice, shippingAddress, paymentMethod, cardDetails } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in order" });
    }

    const order = await Order.create({
      user: req.user._id,
      userName: req.user.name, // <-- save the user's name
      products,
      totalPrice,
      shippingAddress,
      paymentMethod,
      ...(paymentMethod === "card" && { cardDetails }),
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all orders for a user
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name image") // optional: populate product details
      .sort({ createdAt: -1 });

    // Return as an object to be consistent
    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product", "name image"); // optional: populate product details

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Convert both IDs to strings for comparison
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createOrder, getOrders, getOrderById };
