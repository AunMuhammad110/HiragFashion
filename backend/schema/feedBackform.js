// Import the necessary modules
const mongoose = require('mongoose');

// Define the Mongoose schema for the feedback collection
const feedbackSchema = new mongoose.Schema({
  namee: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  review: {
    type: String
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a Mongoose model for the feedback collection
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Export the model for use in other parts of the application
module.exports = Feedback;
