const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);
const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    price: { type: Number, required: true, default: 0 },
    discountPrice: { type: Number, default: 0 },
    category: { type: String, required: true },
    headerSection: { 
      type: String, 
      required: true, 
      enum: ['Category', 'Stone', 'Home Decor'],
      default: 'Category'
    },
    stoneType: { type: String, required: true },

    images: [{ type: String, required: true }],
    countInStock: { type: Number, required: true, default: 0 },
    metaTitle: { type: String },
    metaDescription: { type: String },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
