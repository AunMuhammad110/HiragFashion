const mongoose = require('mongoose');

const mainPageBrandSchema = new mongoose.Schema({
  brandName: {
    type:String,
  },
  categoryName: {
    type: String,
  },
  category:{
    type: String,
  }
});

const mainPageBrands = mongoose.model('mainPageBrands', mainPageBrandSchema,'mainPageBrands');

module.exports = mainPageBrands;
