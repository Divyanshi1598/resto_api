const express = require('express');
const Payment = require('../models/payment');
const router = express.Router();

// POST payment info
router.post('/', async (req, res) => {
  const { userId, amount, paymentMethod, status } = req.body;
  try {
    if (!userId || !amount || !paymentMethod) return res.status(400).json({ message: 'userId, amount, and paymentMethod are required' });
    const payment = new Payment({ userId, amount, paymentMethod, status: status || 'success' });
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Error processing payment' });
  }
});

// GET payment info by userId
router.get('/', async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    const payments = await Payment.find({ userId });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payment info' });
  }
});

module.exports = router; 