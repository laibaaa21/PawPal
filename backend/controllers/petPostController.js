const PetPost = require('../models/PetPost');
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
      sort = '-createdAt', // default sort by newest
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};

    if (breed) {
      filter.breed = { $regex: breed, $options: 'i' }; // case-insensitive search
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

    // Build sort object
    let sortOption = {};
    switch (sort) {
      case 'likes':
        sortOption = { 'likes.length': -1, createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      default: // 'newest'
        sortOption = { createdAt: -1 };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [posts, total] = await Promise.all([
      PetPost.find(filter)
        .populate('user', 'username profilePicture')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      PetPost.countDocuments(filter)
    ]);

    // Get unique breeds and tags for filters
    const [breeds, allTags] = await Promise.all([
      PetPost.distinct('breed'),
      PetPost.distinct('tags')
    ]);

    res.json({
      posts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page: Number(page),
        limit: Number(limit)
      },
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

    // Check user ownership
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    let imageUrl = post.imageUrl;
    if (req.file) {
      // Upload new image to Cloudinary
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

    // Check user ownership
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
      post.likes.push(req.user._id);
    } else {
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

    await post.save();
    
    const populatedPost = await post.populate('comments.user', 'username profilePicture');
    res.json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding comment' });
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
}; 