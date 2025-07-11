const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' }
});

module.exports = mongoose.model('Payment', paymentSchema); 