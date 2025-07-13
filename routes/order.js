const express = require('express');
const Order = require('../models/order');
const User = require('../models/login');
const Payment = require('../models/payment');
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

// GET all orders (admin)
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all orders' });
  }
});

// POST a new order with delivery address
router.post('/', async (req, res) => {
  const { userId, items, totalAmount, deliveryAddress, orderDate, status } = req.body;
  try {
    if (!userId || !items || !totalAmount || !deliveryAddress) {
      return res.status(400).json({ 
        message: 'userId, items, totalAmount, and deliveryAddress are required' 
      });
    }

    // Validate delivery address
    if (!deliveryAddress.fullName || !deliveryAddress.streetAddress || 
        !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zipCode) {
      return res.status(400).json({ 
        message: 'Complete delivery address is required' 
      });
    }

    const order = new Order({ 
      userId, 
      items, 
      total: totalAmount,
      deliveryAddress,
      orderDate: orderDate || new Date(),
      status: status || 'pending'
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Error placing order: ' + err.message });
  }
});

module.exports = router; 