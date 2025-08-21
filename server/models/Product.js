const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive'],
  },
  discount: {
    type: Number,
    default: 0, // discount in percentage
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  brand: {
    type: String,
    default: 'Generic',
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  inStock: {
    type: Boolean,
    default: function() { return this.stock > 0; },
  },
  size: [
    {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], // optional predefined sizes
    },
  ],
  color: [
    {
      type: String,
    },
  ],
  images: [String],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  like: {
    type: Number,
    default: 0, // number of likes/favorites
    min: [0, 'Like count cannot be negative'],
  },
  likedBy: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
],

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
