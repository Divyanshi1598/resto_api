const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

module.exports = mongoose.model('Menu', menuSchema); 