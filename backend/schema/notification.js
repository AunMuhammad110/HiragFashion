const mongoose = require('mongoose');

// Create a Mongoose schema for the productNotification collection
const productNotificationSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true, // Makes productId a required field
  },
  // You can add other fields related to product notifications here
});

// Create a Mongoose model for the productNotification collection
const ProductNotification = mongoose.model('ProductNotification', productNotificationSchema,'productNotification');

module.exports = ProductNotification;
