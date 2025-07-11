const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  termsAccepted: { type: Boolean, required: true },
  userType: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
    required: true
  },
  address: {
    fullName: { type: String },
    phoneNumber: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    landmark: { type: String }
  }
});

module.exports = mongoose.model('User', userSchema);
