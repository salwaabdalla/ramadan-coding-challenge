const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// ===========================
// 🔐 Register New User
// ===========================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, university, course, year } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = new User({ name, email, password, university, course, year });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===========================
// 🔐 Login User
// ===========================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===========================
// 🧠 Get Own Profile (from JWT token)
// ===========================
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('questionsAsked')
      .populate('answersProvided');

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===========================
// 🧠 Update Own Profile
// ===========================
router.patch('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ['name', 'bio', 'university', 'course', 'year'];
  const valid = updates.every(update => allowed.includes(update));

  if (!valid) return res.status(400).json({ message: 'Invalid updates' });

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===========================
// 📷 Upload Profile Picture
// ===========================
router.post('/profile/picture', auth, upload.single('picture'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    req.user.profilePicture = result.secure_url;
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===========================
// 👤 Get Profile by User ID
// ===========================
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('questionsAsked')
      .populate('answersProvided');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===========================
// ✅ ✅ ✅ ADDED: Get current user data via /me
// This is required by the frontend to auto-fill profile on settings/profile page
// ===========================
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
