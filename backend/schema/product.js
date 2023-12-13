const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
  },
  subBrandName: {
    type: String,
  },
  productId: {
    type: String,
    required: true,
  },
  productTitle: {
    type: String,
    required: true,
  },
  productDetails: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
  },
  stockCount: {
    type: Number,
    required: true,
  },
  productWeight: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String, // Store image URLs as strings
    },
  ],
});

// Add the collection name as the second argument to mongoose.model
const Product = mongoose.model('Product', productSchema, 'productCollection');

module.exports = Product;
