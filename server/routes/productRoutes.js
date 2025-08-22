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
  addReview,

  getWishlist, // new controller function
} = require("../controllers/productController");
router.get("/wishlist", protect, asyncHandler(getWishlist)); // new route for wishlist

// Public routes
router.get("/", asyncHandler(getProducts));
router.get("/featured", asyncHandler(getFeaturedProducts));
router.get("/category/:category", asyncHandler(getProductsByCategory));
router.post("/:id/like", protect, asyncHandler(toggleLike));

router.get("/:id", asyncHandler(getProductById));

router.post("/:id/review",protect, asyncHandler(addReview));


module.exports = router;
