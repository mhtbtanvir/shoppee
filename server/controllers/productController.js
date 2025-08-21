const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");
const mongoose = require("mongoose");
// Helper to map uploaded files to URLs

const testUserId = "6898b98957c39b12c1c82c8c";
console.log("Is valid ObjectId?", mongoose.Types.ObjectId.isValid(testUserId));

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

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      brand: req.body.brand || "",
      stock: req.body.stock || 0,
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
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get a single product by ID
// @route  GET /api/products/:id
// @access Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update a product
// @route  PUT /api/admin/products/:id
// @access Admin
exports.updateProductAdmin = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      images: req.files && req.files.length > 0 ? mapImagesToUrls(req.files) : undefined,
    };

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

// @desc   Get featured products
// @route  GET /api/products/featured
// @access Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get products by category
// @route  GET /api/products/category/:category
// @access Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// -------------------- Wishlist --------------------
exports.getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ success: false, message: "Not authorized" });

  try {
    const likedProducts = await Product.find({ likedBy: mongoose.Types.ObjectId(userId) }).lean();
    const normalized = likedProducts.map(normalizeProduct);
    res.json({ success: true, products: normalized });
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------- Toggle Like --------------------
exports.toggleLike = asyncHandler(async (req, res) => {
  if (!req.user?._id) return res.status(401).json({ success: false, message: "User not authorized" });

  const productId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).json({ success: false, message: "Invalid product ID" });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  const userId = req.user._id.toString();
  const likedByIds = product.likedBy.map((id) => id.toString());

  if (likedByIds.includes(userId)) {
    product.likedBy = product.likedBy.filter((id) => id.toString() !== userId);
    product.like = Math.max((product.like || 1) - 1, 0);
  } else {
    product.likedBy.push(req.user._id);
    product.like = (product.like || 0) + 1;
  }

  await product.save();
  res.json({ success: true, product: normalizeProduct(product) });
});

// -------------------- Helper --------------------
const normalizeProduct = (product) => ({
  ...product,
  _id: product._id.toString(),
  likedBy: product.likedBy.map((id) => id.toString()),
});
