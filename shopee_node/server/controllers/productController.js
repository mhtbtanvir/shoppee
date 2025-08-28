const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");
const mongoose = require("mongoose");
// Helper to map uploaded files to URLs
// -------------------- Toggle Like --------------------


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
//admin has another controllerpage

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
// -------------------- Wishlist --------------------
exports.getWishlist = asyncHandler(async (req, res) => {
  const userEmail = req.user?.email;
  if (!userEmail) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    // Fetch only products liked by this user
    const likedProducts = await Product.find({ likedBy: userEmail }).lean();

    // Normalize products
    const normalized = likedProducts.map(product => ({
      ...product,
      _id: product._id.toString(),
      likedBy: (product.likedBy || []).map(String),
    }));

    res.json({
      success: true,
      userEmail,
      products: normalized,
    });
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

const normalizeProduct = (product) => ({
  ...product.toObject(), // convert Mongoose doc to plain JS object
  _id: product._id.toString(),
  likedBy: product.likedBy.map(String), // ensure emails are strings
});

// -------------------- Toggle Like --------------------
exports.toggleLike = asyncHandler(async (req, res) => {
  if (!req.user?.email) {
    return res.status(401).json({ success: false, message: "User not authorized" });
  }

  const productId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const userEmail = req.user.email;

  if (!Array.isArray(product.likedBy)) product.likedBy = [];

  if (product.likedBy.includes(userEmail)) {
    // Unlike
    product.likedBy = product.likedBy.filter((email) => email !== userEmail);
    product.like = Math.max((product.like || 1) - 1, 0);
    product.likedByCurrentUser = false;
  } else {
    // Like
    product.likedBy.push(userEmail);
    product.like = (product.like || 0) + 1;
    product.likedByCurrentUser = true;
  }

  await product.save();

  // send back the updated product
  res.json({ success: true, product });
});
// -------------------- Add Review --------------------
exports.addReview = asyncHandler(async (req, res) => {
  const { comment, rating } = req.body;
  const productId = req.params.id;

  if (!req.user?.email) {
    return res.status(401).json({ success: false, message: "Please log in to add a review" });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  // Add the new review including its rating
  product.review.push({
    name: req.user.name || req.user.email,
    comment: comment || "",
    rating: rating || 0,
  });

  // Incremental update of ratings
  product.ratings.average =
    ((product.ratings.average * product.ratings.count) + (rating || 0)) /
    (product.ratings.count + 1);
  product.ratings.count = product.ratings.count + 1;

  await product.save();

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    ratings: product.ratings,
    review: product.review,
  });
});


// exports.placeOrder = asyncHandler(async (req, res) => {
//   const { products, totalPrice, shippingAddress, paymentMethod } = req.body;

//   if (!products || products.length === 0) {
//     res.status(400);
//     throw new Error("No products in the order");
//   }

//   if (!shippingAddress) {
//     res.status(400);
//     throw new Error("Shipping address is required");
//   }

//   const order = new Order({
//     user: req.user._id,
//     products: products.map((item) => ({
//       product: item.product,
//       quantity: item.quantity,
//       price: item.price,
//       color: item.color || null,
//       size: item.size || null,
//     })),
//     totalPrice,
//     shippingAddress,
//     paymentMethod: paymentMethod || "cod", // Default to Cash on Delivery
//   });

//   const createdOrder = await order.save();
//   res.status(201).json(createdOrder);
// });


