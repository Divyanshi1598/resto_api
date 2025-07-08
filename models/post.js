const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  // Add other fields as needed
});

module.exports = mongoose.model('Post', postSchema); 