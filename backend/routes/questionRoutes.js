const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const { auth } = require('../middleware/auth');

// Get all questions with filters
router.get('/', async (req, res) => {
  try {
    const { category, course, tag, search, sort = 'createdAt' } = req.query;
    const query = {};

    // Apply filters
    if (category) query.category = category;
    if (course) query.course = course;
    if (tag) query.tags = tag;
    if (search) {
      query.$text = { $search: search };
    }

    // Apply sorting
    const sortOptions = {
      createdAt: { createdAt: -1 },
      views: { views: -1 },
      upvotes: { 'upvotes.length': -1 }
    };

    const questions = await Question.find(query)
      .sort(sortOptions[sort] || sortOptions.createdAt)
      .populate('author', 'name profilePicture')
      .populate({
        path: 'answers',
        populate: { path: 'author', select: 'name profilePicture' }
      });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single question
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'name profilePicture')
      .populate({
        path: 'answers',
        populate: { path: 'author', select: 'name profilePicture' }
      });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Increment view count
    question.views += 1;
    await question.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new question
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags, category, course } = req.body;
    const question = new Question({
      title,
      content,
      tags,
      category,
      course,
      author: req.user._id
    });

    await question.save();
    await question.populate('author', 'name profilePicture');

    // Add question to user's questionsAsked array
    req.user.questionsAsked.push(question._id);
    await req.user.save();

    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update question
router.patch('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is the author
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this question' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'content', 'tags', 'category', 'course'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    updates.forEach(update => question[update] = req.body[update]);
    await question.save();

    res.json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete question
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is the author or admin
    if (question.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }

    // Remove question from user's questionsAsked array
    req.user.questionsAsked = req.user.questionsAsked.filter(
      q => q.toString() !== question._id.toString()
    );
    await req.user.save();

    // Delete all associated answers
    await Answer.deleteMany({ question: question._id });

    await Question.findByIdAndDelete(question._id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upvote question
router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const hasUpvoted = question.upvotes.includes(req.user._id);
    const hasDownvoted = question.downvotes.includes(req.user._id);

    if (hasUpvoted) {
      // Remove upvote
      question.upvotes = question.upvotes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      // Add upvote and remove downvote if exists
      question.upvotes.push(req.user._id);
      if (hasDownvoted) {
        question.downvotes = question.downvotes.filter(
          id => id.toString() !== req.user._id.toString()
        );
      }
    }

    await question.save();
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Downvote question
router.post('/:id/downvote', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const hasUpvoted = question.upvotes.includes(req.user._id);
    const hasDownvoted = question.downvotes.includes(req.user._id);

    if (hasDownvoted) {
      // Remove downvote
      question.downvotes = question.downvotes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      // Add downvote and remove upvote if exists
      question.downvotes.push(req.user._id);
      if (hasUpvoted) {
        question.upvotes = question.upvotes.filter(
          id => id.toString() !== req.user._id.toString()
        );
      }
    }

    await question.save();
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 