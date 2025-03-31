const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const auth = require('../middleware/auth');

// Create a new opportunity
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      field,
      deadline,
      link,
      authorId
    } = req.body;

    const opportunity = new Opportunity({
      title,
      description,
      category,
      location,
      field,
      deadline,
      link,
      author: authorId
    });

    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all opportunities with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, location, field } = req.query;
    const query = {};

    if (category) query.category = category;
    if (location) query.location = location;
    if (field) query.field = field;

    const opportunities = await Opportunity.find(query)
      .populate('author', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 