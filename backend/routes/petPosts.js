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
  editComment,
  deleteComment,
  getSavedPosts,
  toggleSave,
  addReply,
  editReply,
  deleteReply,
} = require('../controllers/petPostController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/upload');

// Public routes
router.get('/', getPosts);
router.get('/user/:userId', getUserPosts);
router.get('/saved', protect, getSavedPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/create', protect, upload.single('image'), createPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/save', protect, toggleSave);
router.delete('/:id/save', protect, toggleSave);
router.post('/:id/comment', protect, addComment);
router.put('/:id/comment/:commentId', protect, editComment);
router.delete('/:id/comment/:commentId', protect, deleteComment);
router.post('/:id/comment/:commentId/reply', protect, addReply);
router.put('/:id/comment/:commentId/reply/:replyId', protect, editReply);
router.delete('/:id/comment/:commentId/reply/:replyId', protect, deleteReply);

module.exports = router; 