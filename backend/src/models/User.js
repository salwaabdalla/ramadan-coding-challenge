const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  field: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String
  },
  university: {
    type: String,
    trim: true
  },
  course: {
    type: String,
    trim: true
  },
  year: {
    type: Number
  },
  notificationPreferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    answerNotifications: {
      type: Boolean,
      default: true
    },
    upvoteNotifications: {
      type: Boolean,
      default: true
    },
    mentionNotifications: {
      type: Boolean,
      default: true
    }
  },
  privacySettings: {
    showEmail: {
      type: Boolean,
      default: false
    },
    showUniversity: {
      type: Boolean,
      default: true
    },
    showCourse: {
      type: Boolean,
      default: true
    },
    showYear: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 