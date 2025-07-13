const express = require('express');
const multer = require('multer');
const path = require('path');
const Menu = require('../models/menu');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'menu_images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

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
    const imageUrl = req.file.path; // CloudinaryStorage returns the secure URL
    
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

// PUT update a menu item by ID (with optional image upload)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (req.file) {
      // If a new image is uploaded, update the image URL
      updateData.image = req.file.path; // CloudinaryStorage returns the secure URL
    }
    const menuItem = await Menu.findByIdAndUpdate(id, updateData, { new: true });
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item updated', menuItem });
  } catch (err) {
    res.status(500).json({ message: 'Error updating menu item', error: err.message });
  }
});

// DELETE a menu item by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findByIdAndDelete(id);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting menu item', error: err.message });
  }
});

module.exports = router; 