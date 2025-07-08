const express = require('express');
const Order = require('../models/order');
const router = express.Router();

// GET order history for a user
router.get('/', async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// POST a new order
router.post('/', async (req, res) => {
  const { userId, items, total } = req.body;
  try {
    if (!userId || !items || !total) return res.status(400).json({ message: 'userId, items, and total are required' });
    const order = new Order({ userId, items, total });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error placing order' });
  }
});

module.exports = router; 