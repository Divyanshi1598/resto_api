const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  termsAccepted: { type: Boolean, required: true },
  // confirmPassword is not stored in DB, only used for validation
});

module.exports = mongoose.model('User', userSchema);
