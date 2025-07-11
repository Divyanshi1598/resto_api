const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/login');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { fullName, email, phoneNumber, password, confirmPassword, termsAccepted } = req.body;
  try {
    // Validate all fields
    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    if (!termsAccepted) {
      return res.status(400).json({ message: 'You must accept the terms and conditions' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, phoneNumber, password: hashedPassword, termsAccepted });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ 
      message: 'Login successful',
      userId: user.email,
      user: {
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});



// Reset Password (by verifying email and setting new password directly)
router.post('/reset-password', async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
  
    try {
      // Validate fields
      if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
  
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update password in DB
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successfully' });
  
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Error resetting password' });
    }
  });
  

// Add or update user address
router.post('/address', async (req, res) => {
  const { userId, address } = req.body;
  try {
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    if (!address) return res.status(400).json({ message: 'address is required' });
    
    // Validate required address fields
    const requiredFields = ['fullName', 'phoneNumber', 'street', 'city', 'state', 'zip'];
    for (const field of requiredFields) {
      if (!address[field]) {
        return res.status(400).json({ message: `${field} is required in address` });
      }
    }
    
    const user = await User.findOneAndUpdate({ email: userId }, { address }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Address updated successfully', address: user.address });
  } catch (err) {
    res.status(500).json({ message: 'Error updating address' });
  }
});

// Get user address
router.get('/address', async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    
    const user = await User.findOne({ email: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (!user.address) {
      return res.status(404).json({ message: 'No address found for this user' });
    }
    
    res.json({ address: user.address });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching address' });
  }
});


module.exports = router;
