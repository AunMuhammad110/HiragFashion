const mongoose = require("mongoose");

const imagesSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String, // Store image URLs as strings
    },
  ],
});

// Add the collection name as the second argument to mongoose.model
const Images = mongoose.model("Images", imagesSchema, "imagesCollection");

module.exports = Images;
