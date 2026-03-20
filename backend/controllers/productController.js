const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const slugify = require('slugify');
const Category = require('../models/Category'); // Required for populate('categories') to work

// @desc    Fetch all products (with filtering, search, pagination)
// @route   GET /api/products
// @access  Public
// Query params:
//   keyword       - search by name
//   category      - filter by category ObjectId
//   headerSection - 'Category' | 'Stone' | 'Home Decor'
//   stoneType     - e.g. 'Amethyst'
//   minPrice      - number
//   maxPrice      - number
//   isFeatured    - 'true'
//   pageNumber     - page (default 1)
//   pageSize      - results per page (default 20)
const getProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const pageNumber = Number(req.query.pageNumber) || 1;

    const filter = {};

    if (req.query.keyword) {
      filter.title = { $regex: req.query.keyword, $options: 'i' };
    }

    if (req.query.category) {
      filter.categories = req.query.category; 
    }

    if (req.query.categorySlug) {
      // Escape all regex special characters first to avoid 'missing parenthesis' errors
      const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      let safeSlug = escapeRegExp(req.query.categorySlug);
      
      // Now we can safely replace the hyphens with a regex snippet that matches spaces, slashes, or hyphens
      safeSlug = safeSlug.replace(/-/g, '[ /\\-]+');
      
      filter.categories = { $regex: new RegExp(`^${safeSlug}$`, 'i') };
    }

    if (req.query.headerSection) {
      let section = req.query.headerSection;
      
      // Look at the DB state: If the DB has `headerSection: ['Shop By Category']` from the CSV's `Header` column:
      if (section === 'Category') {
         filter.headerSection = { $in: ['Shop By Category', 'Category'] };
      } else if (section === 'Stone') {
         filter.headerSection = { $in: ['Shop By Stone', 'Stone'] };
      } else {
         filter.headerSection = section;
      }
    }

    if (req.query.stoneType) {
      filter.stoneType = { $regex: new RegExp(`^${req.query.stoneType}$`, 'i') };
    }

    if (req.query.isFeatured === 'true') {
      filter.isFeatured = true;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    const count = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    const isPaginated = req.query.pageNumber || req.query.pageSize;
    if (isPaginated) {
      res.json({
        products,
        page: pageNumber,
        pages: Math.ceil(count / pageSize),
        total: count,
      });
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @desc    Fetch single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Fetch product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// Helper to determine product header sections based on its category/stone
const syncProductSections = async (product) => {
  try {
    const categories = await Category.find({ name: { $in: product.categories } });
    const stones = await Category.find({ name: { $in: product.stoneType }, type: 'Stone' });
    
    const sections = new Set();
    categories.forEach(c => (c.displaySections || []).forEach(s => sections.add(s)));
    stones.forEach(s => (s.displaySections || []).forEach(sec => sections.add(sec)));
    
    if (sections.size > 0) {
      product.headerSection = Array.from(sections);
    }
  } catch (err) {
    console.error('Section sync error:', err);
  }
};

// @desc    Get distinct values for filters
// @route   GET /api/products/extras/distinct
// @access  Public
const getDistinctValues = asyncHandler(async (req, res) => {
  // Hardcoded Master Lists logic to prevent legacy data pollution
  const BASE_CATEGORIES = [
    "Anklet", "Bracelet", "Bottle", "Crystal Towers", "Crystal Balls", "Fossils", 
    "Geode/Caves", "Gemstone Trees", "Gift Box", "Ganesh Idol", "Hearts", "Jap Mala", 
    "Keychains", "Lingam", "Miner Miniature", "Pyramids", "Pendant", "Pyrite Frames", 
    "Rudraksha", "Rough Natural crystals", "Raw Crystal Chips", "Rings", "Selenite", 
    "Tumbled Stones", "Wish/Glass Dome Tree", "Zibu Coin"
  ];

  const BASE_STONES = [
    "Amethyst", "Clear Quartz", "Pyrite", "Lapis Lazuli", "Tiger Eye", 
    "Black Tourmaline", "Rose Quartz", "Citrine", "Carnelian", "Malachite", 
    "Labradorite", "Aura Quartz", "Green Jade", "Mahogany", "Red jasper", 
    "Hematite", "Smoky Quartz", "Selenite"
  ];

  const BASE_HOME_DECOR = [
    "Crystal Balls", "Crystal Towers", "Fossils", "Gemstone Trees", "Geode/Caves", 
    "Hearts", "Miner Miniature", "Pyramids", "Pyrite Frames", "Wish/Glass Dome Tree"
  ];

  res.json({
    categories: [...new Set([...BASE_CATEGORIES, ...BASE_HOME_DECOR])],
    stones: BASE_STONES,
    groupedCategories: {
      Category: BASE_CATEGORIES,
      "Home Decor": BASE_HOME_DECOR,
      "Stone": BASE_STONES
    }
  });
});

// @desc    Create a category/stone
// @route   POST /api/products/extras/category
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, type, displaySections } = req.body;
  const slug = slugify(name, { lower: true });
  
  const existing = await Category.findOne({ name });
  if (existing) {
    existing.type = type || existing.type;
    existing.displaySections = displaySections || existing.displaySections;
    await existing.save();
    return res.json(existing);
  }

  const category = await Category.create({
    name,
    slug,
    type: type || 'Category',
    displaySections: displaySections || ['Category']
  });

  res.status(201).json(category);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    title, slug, url, price, sale_price,
    categories, tags,
    short_description_html, long_description_html,
    images, countInStock, isFeatured, stoneType
  } = req.body;

  const product = new Product({
    title,
    slug: slug || slugify(title, { lower: true }),
    url: url || '',
    price: price || 0,
    sale_price: sale_price || 0,
    categories: categories || [],
    tags: tags || [],
    short_description_html: short_description_html || '',
    long_description_html: long_description_html || '',
    images: images || [],
    countInStock: countInStock || 100,
    isFeatured: isFeatured || false,
    stoneType: stoneType || ''
  });

  await syncProductSections(product);
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    title, slug, url, price, sale_price,
    categories, tags,
    short_description_html, long_description_html,
    images, countInStock, isFeatured, stoneType
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    if (title) product.title = title;
    if (slug) product.slug = slug;
    if (url !== undefined) product.url = url;
    if (price !== undefined) product.price = price;
    if (sale_price !== undefined) product.sale_price = sale_price;
    if (categories !== undefined) product.categories = categories;
    if (tags !== undefined) product.tags = tags;
    if (short_description_html !== undefined) product.short_description_html = short_description_html;
    if (long_description_html !== undefined) product.long_description_html = long_description_html;
    if (images !== undefined) product.images = images;
    if (countInStock !== undefined) product.countInStock = countInStock;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (stoneType !== undefined) product.stoneType = stoneType;

    await syncProductSections(product);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user && req.user && r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

module.exports = {
  getProducts,
  getProductBySlug,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getDistinctValues,
  getTopProducts,
  createCategory
};