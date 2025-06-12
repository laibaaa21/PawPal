const mongoose = require('mongoose');
const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');
const { uploadToCloudinary } = require('../utils/upload');
const Notification = require('../models/Notification');

// Make sure Post model is registered
if (!mongoose.models.Post) {
  mongoose.model('Post', require('../models/Post').schema);
}

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { title, content, breed, tags } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Upload image to Cloudinary
    const result = await uploadToCloudinary(req.file.path);
    
    const post = await Post.create({
      title,
      content,
      imageUrl: result.secure_url,
      breed,
      tags: tags ? JSON.parse(tags) : [],
      user: req.user._id
    });

    // Populate user data
    await post.populate('user', 'username profilePicture');

    res.status(201).json(post);
  } catch (error) {
    console.error('Error in createPost:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

// @desc    Get all posts with filters
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const { breed, tags, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (breed) {
      query.breed = breed;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error('Error in getPosts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Public
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Error in getUserPosts:', error);
    res.status(500).json({ message: 'Error fetching user posts' });
  }
};

// @desc    Get saved posts
// @route   GET /api/posts/saved
// @access  Private
const getSavedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ savedBy: req.user._id })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });

    if (!posts) {
      return res.json([]);
    }

    res.json(posts);
  } catch (error) {
    console.error('Error in getSavedPosts:', error);
    res.status(500).json({ message: 'Error fetching saved posts' });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, content, breed, tags } = req.body;
    let imageUrl = post.imageUrl;

    // If new image is uploaded
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      imageUrl = result.secure_url;
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    post.breed = breed;
    post.tags = tags ? JSON.parse(tags) : post.tags;

    await post.save();
    await post.populate('user', 'username profilePicture');

    res.json(post);
  } catch (error) {
    console.error('Error in updatePost:', error);
    res.status(500).json({ message: 'Error updating post' });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await post.remove();
    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error('Error in deletePost:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex === -1) {
      // Like post
      post.likes.push(req.user._id);
      
      // Create notification for post like
      if (post.user.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: post.user,
          sender: req.user._id,
          type: 'like',
          post: post._id
        });
      }
    } else {
      // Unlike post
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error in toggleLike:', error);
    res.status(500).json({ message: 'Error toggling like' });
  }
};

// @desc    Save/Unsave post
// @route   POST/DELETE /api/posts/:id/save
// @access  Private
const toggleSave = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const saveIndex = post.savedBy.indexOf(req.user._id);
    
    if (req.method === 'POST' && saveIndex === -1) {
      // Save post
      post.savedBy.push(req.user._id);
    } else if (req.method === 'DELETE' && saveIndex > -1) {
      // Unsave post
      post.savedBy.splice(saveIndex, 1);
    }

    await post.save();
    // Populate necessary fields before sending response
    await post.populate('user', 'username profilePicture');
    
    res.json(post);
  } catch (error) {
    console.error('Error in toggleSave:', error);
    res.status(500).json({ message: 'Error toggling save status' });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      user: req.user._id,
      content: req.body.content
    };

    post.comments.unshift(comment);
    
    // Create notification for comment
    if (post.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.user,
        sender: req.user._id,
        type: 'comment',
        post: post._id
      });
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPost,
  getPosts,
  getUserPosts,
  getSavedPosts,
  updatePost,
  deletePost,
  toggleLike,
  toggleSave,
  addComment
}; 