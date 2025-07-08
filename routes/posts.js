// server.js or routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/post'); // Your Mongoose model

// Get all posts
router.get('/posts', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// Create a new post
router.post('/posts', async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.status(201).json(newPost);
});

module.exports = router;