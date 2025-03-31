const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Scholarship', 'Workshop', 'Event']
  },
  location: {
    type: String,
    required: true,
    enum: ['Mogadishu', 'Hargeisa', 'Kismayo', 'Bosaso', 'Baidoa']
  },
  field: {
    type: String,
    required: true,
    enum: ['Technology', 'Education', 'Health', 'Business', 'Engineering', 'Arts']
  },
  deadline: {
    type: Date,
    required: true
  },
  link: {
    type: String,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Opportunity', opportunitySchema); 