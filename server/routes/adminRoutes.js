const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const adminOnly = require('../middleware/admin');
const upload = require('../utils/upload');

const {
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  getProducts,
  getDashboardStats,
  getRecentOrders,
  getRecentProducts
} = require('../controllers/adminController');


router.get('/stats', adminOnly, asyncHandler(getDashboardStats));

// Recent orders
router.get('/orders', adminOnly, asyncHandler(getRecentOrders));

// Recent products
router.get('/products', adminOnly, asyncHandler(getRecentProducts));

// Optional images: use .array but images may be empty
router.post(
  '/products',
  adminOnly,
  upload.array('images', 5), // 0 to 5 images
  asyncHandler(createProductAdmin)
);
router.get('/products/allproducts', adminOnly, asyncHandler(getProducts));
router.put(
  '/products/:id',
  adminOnly,
  upload.array('images', 5),
  asyncHandler(updateProductAdmin)
);

router.delete('/products/:id', adminOnly, asyncHandler(deleteProductAdmin));


module.exports = router;
