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
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true, default: 0 },
    sale_price: { type: Number, default: 0 },
    images: [{ type: String, required: true }],
    categories: [{ type: String }],
    tags: [{ type: String }],
    short_description_html: { type: String, default: '' },
    long_description_html: { type: String, default: '' },
    
    // Internal system fields (allowed for DB management)
    countInStock: { type: Number, default: 100 },
    isFeatured: { type: Boolean, default: false },
    headerSection: [{ type: String, default: 'Category' }],
    stoneType: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);