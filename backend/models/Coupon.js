const mongoose = require('mongoose');

const couponSchema = mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true }, // percentage or flat
    discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
    expiry: { type: Date, required: true },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
