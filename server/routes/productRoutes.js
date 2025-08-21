const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");
const { protect } = require("../middleware/protectauth");
const Product = require("../models/Product");
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  toggleLike,
  getWishlist, // new controller function
} = require("../controllers/productController");

// Public routes
router.get("/", asyncHandler(getProducts));
router.get("/featured", asyncHandler(getFeaturedProducts));
router.get("/category/:category", asyncHandler(getProductsByCategory));
router.get("/:id", asyncHandler(getProductById));


// Toggle like route
router.post("/:id/like", protect, asyncHandler(toggleLike));

module.exports = router;
