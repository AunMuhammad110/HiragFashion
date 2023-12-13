const mongoose = require('mongoose');

const brandDetails = new mongoose.Schema({
    brandName: {
      type: String,

    },
    subCategory: [
                ]
    
  });
  
  const Brand = mongoose.model('BrandDetail', brandDetails  ,'BrandDetailsColllection');
  
  module.exports = Brand;
  