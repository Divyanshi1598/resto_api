const express = require('express');
const Reservation = require('../models/reservation');
const router = express.Router();

// GET all reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reservations' });
  }
});

// POST a new reservation
router.post('/', async (req, res) => {
  const { name, date, time, memberNumber } = req.body;
  try {
    const reservation = new Reservation({ name, date, time, memberNumber });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: 'Error adding reservation' });
  }
});

module.exports = router; 