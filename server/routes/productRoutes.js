// server/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
} = require("../controllers/productController");

// Public routes
router.get("/", asyncHandler(getProducts));

router.get("/featured", asyncHandler(getFeaturedProducts));
router.get("/category/:category", asyncHandler(getProductsByCategory));
router.get("/:id", asyncHandler(getProductById));

module.exports = router;
