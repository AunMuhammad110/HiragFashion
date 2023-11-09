const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  countryName: {
    type: String,
  },
  firstKg: {
    type: Number,
  },
  addKg: {
    type: Number,
  },
});

const Country = mongoose.model('DeliveryPricing', countrySchema,'deliveryPricing');

module.exports = Country;
