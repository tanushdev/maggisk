const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getDistinctValues
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Base route
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/distinct', getDistinctValues);

// New explicit slug route: GET /api/products/slug/:slug
router.route('/slug/:slug')
  .get(getProductBySlug);

// Old route kept for backwards compatibility: GET /api/products/id/:id
router.route('/id/:id')
  .get(getProductById);

// Reviews before /:id so it isn't swallowed
router.route('/:id/reviews')
  .post(protect, createProductReview);

// /:id smart handler:
// MongoDB ObjectId (24-char hex) → getProductById
// Anything else → treat as slug (backwards compat for old frontend calls)
router.get('/:id', (req, res, next) => {
  const param = req.params.id;
  const isObjectId = /^[a-f\d]{24}$/i.test(param);
  if (isObjectId) {
    req.params.id = param;
    return getProductById(req, res, next);
  } else {
    req.params.slug = param;
    return getProductBySlug(req, res, next);
  }
});

// PUT and DELETE still use /:id (admin only)
router.route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;