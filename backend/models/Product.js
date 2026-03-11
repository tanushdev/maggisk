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
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, default: '' },
    type: { type: String, default: 'simple' }, // simple, variable, etc.
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    
    // Pricing
    price: { type: Number, required: true, default: 0 }, // Regular Price
    salePrice: { type: Number, default: 0 },             // Discount/Sale Price
    
    // Relationships
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    tags: [{ type: String }],
    
    // Inventory
    countInStock: { type: Number, required: true, default: 0 },
    
    // Specs
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 }
    },
    
    // Attributes (e.g., Color, Weight options)
    attributes: [
      {
        name: { type: String },
        values: [{ type: String }]
      }
    ],

    // Media
    images: [{ type: String, required: true }],
    
    // Preserved from your old model
    headerSection: { 
      type: String, 
      enum: ['Category', 'Stone', 'Home Decor'],
      default: 'Category'
    },
    stoneType: { type: String, default: 'Unknown' },
    metaTitle: { type: String },
    metaDescription: { type: String },
    
    // Reviews
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);