const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:slug').get(getProductBySlug);
router.route('/id/:id').get(getProductById); // New route for Admin
router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id').delete(protect, admin, deleteProduct).put(protect, admin, updateProduct);


module.exports = router;
