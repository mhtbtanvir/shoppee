
const asyncHandler = require("../middleware/asyncHandler");
const mongoose = require("mongoose");
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

/**
 * Get admin dashboard stats
 * @route GET /api/admin/stats
 * @access Admin
 */
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();
  const ordersCount = await Order.countDocuments();

  // Total revenue (sum of all orders with status not cancelled)
  const revenueData = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
  ]);
  const revenue = revenueData[0]?.totalRevenue || 0;

  res.json({
    products: productsCount,
    users: usersCount,
    orders: ordersCount,
    revenue,
  });
});

/**
 * Get recent orders
 * @route GET /api/admin/orders
 * @access Admin
 */
exports.getRecentOrders = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email'); // Populate user info

  // Format orders for frontend
  const formatted = orders.map((o) => ({
    _id: o._id,
    userName: o.user?.name || 'Guest',
    total: o.totalPrice,
    status: o.status,
    createdAt: o.createdAt,
  }));

  res.json(formatted);
});

/**
 * Get recent products
 * @route GET /api/admin/products
 * @access Admin
 */
exports.getRecentProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json(products);
});

const mapImagesToUrls = (files) => {
  if (!files || files.length === 0) return [];
  return files.map(file => `/uploads/${file.filename}`);
};

// @desc   Create a new product
// @route  POST /api/admin/products
// @access Admin
exports.createProductAdmin = async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    if (!req.body) throw new Error("Form data missing");

    // Convert size and color arrays to uppercase
    const sizes = Array.isArray(req.body.size)
      ? req.body.size.map(C => C.toUpperCase())
      : [];
    const colors = Array.isArray(req.body.color)
      ? req.body.color.map(C => C.toUpperCase())
      : [];

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      brand: req.body.brand || "",
      stock: req.body.stock || 0,
      discount: req.body.discount || 0,
      size: sizes,
      color: colors,
      isFeatured: req.body.isFeatured || false,
      images: mapImagesToUrls(req.files),
    };

    const product = await Product.create(productData);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// @desc   Get all products
// @route  GET /api/products
// @access Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // Optional: sort by latest created
    // const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc   Get a single product by ID
// @route  GET /api/products/:id
// @access Public


// @desc   Update a product
// @route  PUT /api/admin/products/:id
// @access Admin
exports.updateProductAdmin = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      images: req.files && req.files.length > 0 ? mapImagesToUrls(req.files) : undefined,
    };

    // Convert size and color to arrays if they are strings, and uppercase all values
    if (updateData.size) {
      updateData.size = Array.isArray(updateData.size)
        ? updateData.size.map(V => V.toUpperCase())
        : updateData.size.split(',').map(v => v.trim().toUpperCase()).filter(Boolean);
    }

    if (updateData.color) {
      updateData.color = Array.isArray(updateData.color)
        ? updateData.color.map(V => V.toUpperCase())
        : updateData.color.split(',').map(v => v.trim().toUpperCase()).filter(Boolean);
    }

    // Remove undefined fields to avoid overwriting existing images
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Delete a product
// @route  DELETE /api/admin/products/:id
// @access Admin
exports.deleteProductAdmin = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
