const express = require('express');
const Menu = require('../models/menu');
const router = express.Router();

// GET all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching menu items' });
  }
});

// POST a new menu item
router.post('/', async (req, res) => {
  const { image, title, description, price, quantity } = req.body;
  try {
    const menuItem = new Menu({ image, title, description, price, quantity });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(500).json({ message: 'Error adding menu item' });
  }
});

module.exports = router; 