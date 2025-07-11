const express = require('express');
const multer = require('multer');
const path = require('path');
const Menu = require('../models/menu');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// GET all menu items or by userId
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    let menuItems;
    if (userId) {
      menuItems = await Menu.find({ userId: userId });
    } else {
      menuItems = await Menu.find();
    }
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching menu items' });
  }
});

// POST a new menu item with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { userId, title, description, price, quantity } = req.body;
    
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });
    
    // Generate proper image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    const menuItem = new Menu({ 
      userId, 
      image: imageUrl,
      title, 
      description, 
      price, 
      quantity 
    });
    
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(500).json({ message: 'Error adding menu item: ' + err.message });
  }
});

module.exports = router; 