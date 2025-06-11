const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/upload');
const {
  createPost,
  getPosts,
  getUserPosts,
  getSavedPosts,
  updatePost,
  deletePost,
  toggleLike,
  toggleSave
} = require('../controllers/postController');

// Public routes
router.get('/', getPosts);
router.get('/user/:userId', getUserPosts);

// Protected routes
router.post('/', protect, upload.single('image'), createPost);
router.get('/saved', protect, getSavedPosts);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, toggleLike);
router.delete('/:id/like', protect, toggleLike);
router.post('/:id/save', protect, toggleSave);
router.delete('/:id/save', protect, toggleSave);

module.exports = router; 