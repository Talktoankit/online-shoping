const express = require('express');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get('/', protect, admin, async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

router.put('/:id', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.role = req.body.role || user.role;
    const updatedUser = await user.save();
    res.json({ _id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});
module.exports = router;