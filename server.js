const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth'); // this is your /signup and /login logic
const postsRoutes = require('./routes/posts'); // optional
const menuRoutes = require('./routes/menu');
const reservationRoutes = require('./routes/reservation');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Mount your routes BEFORE the 404 handler
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservation', reservationRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/cart', cartRoutes);


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.path, method: req.method });
});

// ✅ Connect MongoDB using MONGO_URI from .env
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch(err => console.log(err));
