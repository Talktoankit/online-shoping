const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { items, totalAmount } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ message: 'No order items' });
  
  const order = await Order.create({
    userId: req.user._id,
    items,
    totalAmount
  });
  res.status(201).json(order);
});

router.get('/my-orders', protect, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });
  res.json(orders);
});
module.exports = router;