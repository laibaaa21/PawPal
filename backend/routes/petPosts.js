const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getUserPosts,
} = require('../controllers/petPostController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/upload');

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/user/:userId', getUserPosts);

// Protected routes
router.post('/create', protect, upload.single('image'), createPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);

module.exports = router; 