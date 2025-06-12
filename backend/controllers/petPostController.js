const User = require('../models/User');
const PetPost = require('../models/PetPost');
const Notification = require('../models/Notification');
const { uploadToCloudinary } = require('../utils/upload');

// @desc    Create new pet post
// @route   POST /api/posts/create
// @access  Private
const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Upload image to Cloudinary
    const result = await uploadToCloudinary(req.file.path);

    const post = await PetPost.create({
      title: req.body.title,
      content: req.body.content,
      breed: req.body.breed,
      tags: JSON.parse(req.body.tags || '[]'),
      imageUrl: result.secure_url,
      user: req.user._id,
    });

    const populatedPost = await post.populate('user', 'username profilePicture');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

// @desc    Get all posts with filters
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const {
      breed,
      tags,
      search,
      sort = 'newest',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};

    if (breed) {
      filter.breed = { $regex: breed, $options: 'i' };
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    let sortQuery = {};
    switch (sort) {
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      case 'likes':
        const posts = await PetPost.aggregate([
          { $match: filter },
          {
            $addFields: {
              likesCount: { $size: "$likes" }
            }
          },
          { $sort: { likesCount: -1, createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: Number(limit) },
        ]);

        await PetPost.populate(posts, [
          { path: 'user', select: 'username profilePicture' },
          { path: 'comments.user', select: 'username profilePicture' }
        ]);

        const total = await PetPost.countDocuments(filter);

        return res.json({
          posts,
          totalPosts: total,
          totalPages: Math.ceil(total / limit),
          currentPage: Number(page),
          filters: {
            breeds: await PetPost.distinct('breed'),
            tags: await PetPost.distinct('tags')
          }
        });
      case 'newest':
      default:
        sortQuery = { createdAt: -1 };
        break;
    }

    const posts = await PetPost.find(filter)
      .populate('user', 'username profilePicture')
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'user',
            select: 'username profilePicture'
          },
          {
            path: 'replies.user',
            select: 'username profilePicture'
          }
        ]
      })
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await PetPost.countDocuments(filter);

    const [breeds, allTags] = await Promise.all([
      PetPost.distinct('breed'),
      PetPost.distinct('tags')
    ]);

    res.json({
      posts,
      totalPosts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      filters: {
        breeds,
        tags: allTags
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.id)
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching post' });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    let imageUrl = post.imageUrl;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      imageUrl = result.secure_url;
    }

    const updatedPost = await PetPost.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title || post.title,
        content: req.body.content || post.content,
        breed: req.body.breed || post.breed,
        tags: req.body.tags ? JSON.parse(req.body.tags) : post.tags,
        imageUrl,
      },
      { new: true }
    ).populate('user', 'username profilePicture');

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating post' });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await PetPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.id);

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
    console.error(error);
    res.status(500).json({ message: 'Error updating like' });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.unshift({
      user: req.user._id,
      content: req.body.content,
    });

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
    
    const populatedPost = await post.populate([
      { path: 'comments.user', select: 'username profilePicture' },
      { path: 'comments.replies.user', select: 'username profilePicture' },
      { path: 'user', select: 'username profilePicture' }
    ]);
    
    res.json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding comment' });
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Public
const getUserPosts = async (req, res) => {
  try {
    const posts = await PetPost.find({ user: req.params.userId })
      .populate('user', 'username profilePicture')
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'user',
            select: 'username profilePicture'
          },
          {
            path: 'replies.user',
            select: 'username profilePicture'
          }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user posts' });
  }
};

// @desc    Edit comment
// @route   PUT /api/posts/:id/comment/:commentId
// @access  Private
const editComment = async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    comment.content = req.body.content;
    await post.save();
    
    const populatedPost = await post.populate([
      { path: 'comments.user', select: 'username profilePicture' },
      { path: 'user', select: 'username profilePicture' }
    ]);
    
    res.json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error editing comment' });
  }
};

// @desc    Delete comment
// @route   DELETE /api/posts/:id/comment/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    post.comments.pull({ _id: req.params.commentId });
    await post.save();
    
    const populatedPost = await post.populate([
      { path: 'comments.user', select: 'username profilePicture' },
      { path: 'user', select: 'username profilePicture' }
    ]);
    
    res.json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
};

// @desc    Get saved posts
// @route   GET /api/posts/saved
// @access  Private
const getSavedPosts = async (req, res) => {
  try {
    const posts = await PetPost.find({ savedBy: req.user._id })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(posts || []);
  } catch (error) {
    console.error('Error in getSavedPosts:', error);
    res.status(500).json({ message: 'Error fetching saved posts' });
  }
};

// @desc    Save/Unsave post
// @route   PUT /api/posts/:id/save
// @access  Private
const toggleSave = async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const saveIndex = post.savedBy.indexOf(req.user._id);
    
    if (saveIndex === -1) {
      post.savedBy.push(req.user._id);
    } else {
      post.savedBy.splice(saveIndex, 1);
    }

    await post.save();
    await post.populate('user', 'username profilePicture');
    
    res.json(post);
  } catch (error) {
    console.error('Error in toggleSave:', error);
    res.status(500).json({ message: 'Error toggling save status' });
  }
};

// @desc    Add reply to comment
// @route   POST /api/pet-posts/:id/comment/:commentId/reply
// @access  Private
const addReply = async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.replies.unshift({
      user: req.user._id,
      content: req.body.content,
    });

    // Create notification for reply
    if (comment.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: comment.user,
        sender: req.user._id,
        type: 'reply',
        post: post._id
      });
    }

    await post.save();
    
    const populatedPost = await post.populate([
      { path: 'comments.user', select: 'username profilePicture' },
      { path: 'comments.replies.user', select: 'username profilePicture' },
      { path: 'user', select: 'username profilePicture' }
    ]);
    
    res.json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding reply' });
  }
};

// @desc    Edit reply
// @route   PUT /api/posts/:id/comment/:commentId/reply/:replyId
// @access  Private
const editReply = async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = comment.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (reply.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    reply.content = req.body.content;
    await post.save();

    const populatedPost = await post.populate([
      { path: 'comments.user', select: 'username profilePicture' },
      { path: 'comments.replies.user', select: 'username profilePicture' },
      { path: 'user', select: 'username profilePicture' }
    ]);

    res.json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error editing reply' });
  }
};

// @desc    Delete reply
// @route   DELETE /api/posts/:id/comment/:commentId/reply/:replyId
// @access  Private
const deleteReply = async (req, res) => {
  try {
    const post = await PetPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = comment.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (reply.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    comment.replies.pull({ _id: req.params.replyId });
    await post.save();

    const populatedPost = await post.populate([
      { path: 'comments.user', select: 'username profilePicture' },
      { path: 'comments.replies.user', select: 'username profilePicture' },
      { path: 'user', select: 'username profilePicture' }
    ]);

    res.json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting reply' });
  }
};

module.exports = {
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
};