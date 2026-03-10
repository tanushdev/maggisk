const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  res.json(coupons);
});

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount, discountType, expiry, usageLimit } = req.body;

  const couponExists = await Coupon.findOne({ code });

  if (couponExists) {
    res.status(400);
    throw new Error('Coupon already exists');
  }

  const coupon = await Coupon.create({
    code,
    discount,
    discountType,
    expiry,
    usageLimit,
  });

  res.status(201).json(coupon);
});

// @desc    Validate a coupon
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });


  if (coupon) {
    if (new Date(coupon.expiry) < new Date()) {
      res.status(400);
      throw new Error('Coupon has expired');
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      res.status(400);
      throw new Error('Coupon usage limit reached');
    }

    res.json(coupon);
  } else {
    res.status(404);
    throw new Error('Invalid coupon code');
  }
});

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    await coupon.deleteOne();
    res.json({ message: 'Coupon manifestation dissolved' });
  } else {
    res.status(404);
    throw new Error('Voucher not found in vault');
  }
});

module.exports = {
  getCoupons,
  createCoupon,
  validateCoupon,
  deleteCoupon,
};

