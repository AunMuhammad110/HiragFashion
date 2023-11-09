const mongoose = require('mongoose');

// Define a schema for the carrousalSettings collection
const carrousalSettingsSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  brandName: {
    type: String,
    required: true
  },
  subCategoryName:{
    type:String,
    required:true
  }
});

// Create a model based on the schema with the collection name
const CarrousalSettings = mongoose.model('CarrousalSettings', carrousalSettingsSchema, 'carrousalSettings');

module.exports = CarrousalSettings;
