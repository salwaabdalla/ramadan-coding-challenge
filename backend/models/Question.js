const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    trim: true
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  views: {
    type: Number,
    default: 0
  },
  isSolved: {
    type: Boolean,
    default: false
  },
  solvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }
}, {
  timestamps: true
});

// Index for search functionality
questionSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question; 