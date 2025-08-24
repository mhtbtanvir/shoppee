const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protectauth");
const asyncHandler = require("../middleware/asyncHandler");
const {
  createOrder,
  getOrders,
  getOrderById,
} = require("../controllers/orderController");

// Place a new order
router.post("/", protect, asyncHandler(createOrder));

// Get all orders for admin or user
router.get("/", protect, asyncHandler(getOrders));

// Get a single order by ID
router.get("/:id", protect, asyncHandler(getOrderById));

module.exports = router;
