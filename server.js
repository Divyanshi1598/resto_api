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
const MONGO_URI = process.env.MONGODB_URI;

const app = express();

app.use(cors());
app.use(express.json());

//  Mount your routes BEFORE the 404 handler
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservation', reservationRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/cart', cartRoutes);


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.path, method: req.method });
});

// Connect MongoDB using MONGO_URI from .env
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch(err => console.log(err));


// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');

// // Load environment variables
// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB URI from environment
// const MONGODB_URI = process.env.MONGODB_URI; //  Make sure this matches Render env variable name

// // Import routes
// const authRoutes = require('./routes/auth');
// const postsRoutes = require('./routes/posts'); // Optional, include if needed
// const menuRoutes = require('./routes/menu');
// const reservationRoutes = require('./routes/reservation');
// const orderRoutes = require('./routes/order');
// const cartRoutes = require('./routes/cart');

// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/posts', postsRoutes); // Include only if you have this route
// app.use('/api/menu', menuRoutes);
// app.use('/api/reservation', reservationRoutes);
// app.use('/api/order', orderRoutes);
// app.use('/api/cart', cartRoutes);

// // Handle 404
// app.use((req, res) => {
//   res.status(404).json({
//     message: 'Route not found',
//     path: req.path,
//     method: req.method
//   });
// });

// // MongoDB Connection
// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => {
//     console.log(' MongoDB connected..');
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(` Server is running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error(' MongoDB connection error:', error.message);
//     process.exit(1); // Exit the app if DB fails to connect
//   });

