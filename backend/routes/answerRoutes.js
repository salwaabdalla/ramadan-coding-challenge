const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const { auth } = require('../middleware/auth');

// Get answers for a question
router.get('/question/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new answer
router.post('/question/:questionId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const question = await Question.findById(req.params.questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = new Answer({
      content,
      author: req.user._id,
      question: question._id
    });

    await answer.save();
    await answer.populate('author', 'name profilePicture');

    // Add answer to question's answers array
    question.answers.push(answer._id);
    await question.save();

    // Add answer to user's answersProvided array
    req.user.answersProvided.push(answer._id);
    await req.user.save();

    res.status(201).json(answer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update answer
router.patch('/:id', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user is the author
    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this answer' });
    }

    answer.content = req.body.content;
    await answer.save();

    res.json(answer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete answer
router.delete('/:id', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user is the author or admin
    if (answer.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this answer' });
    }

    // Remove answer from question's answers array
    const question = await Question.findById(answer.question);
    question.answers = question.answers.filter(
      a => a.toString() !== answer._id.toString()
    );
    await question.save();

    // Remove answer from user's answersProvided array
    req.user.answersProvided = req.user.answersProvided.filter(
      a => a.toString() !== answer._id.toString()
    );
    await req.user.save();

    await answer.remove();
    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment to answer
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const comment = {
      content: req.body.content,
      author: req.user._id
    };

    answer.comments.push(comment);
    await answer.save();
    await answer.populate('comments.author', 'name profilePicture');

    res.status(201).json(answer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Accept answer
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const question = await Question.findById(answer.question);
    
    if (!answer || !question) {
      return res.status(404).json({ message: 'Answer or question not found' });
    }

    // Check if user is the question author
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the question author can accept an answer' });
    }

    // Update answer and question
    answer.isAccepted = true;
    question.isSolved = true;
    question.solvedBy = answer._id;

    await answer.save();
    await question.save();

    // Update user reputation
    const answerAuthor = await User.findById(answer.author);
    answerAuthor.reputation += 15;
    await answerAuthor.save();

    res.json({ answer, question });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Upvote answer
router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const hasUpvoted = answer.upvotes.includes(req.user._id);
    const hasDownvoted = answer.downvotes.includes(req.user._id);

    if (hasUpvoted) {
      // Remove upvote
      answer.upvotes = answer.upvotes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      // Add upvote and remove downvote if exists
      answer.upvotes.push(req.user._id);
      if (hasDownvoted) {
        answer.downvotes = answer.downvotes.filter(
          id => id.toString() !== req.user._id.toString()
        );
      }
    }

    await answer.save();
    res.json(answer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Downvote answer
router.post('/:id/downvote', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const hasUpvoted = answer.upvotes.includes(req.user._id);
    const hasDownvoted = answer.downvotes.includes(req.user._id);

    if (hasDownvoted) {
      // Remove downvote
      answer.downvotes = answer.downvotes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      // Add downvote and remove upvote if exists
      answer.downvotes.push(req.user._id);
      if (hasUpvoted) {
        answer.upvotes = answer.upvotes.filter(
          id => id.toString() !== req.user._id.toString()
        );
      }
    }

    await answer.save();
    res.json(answer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 