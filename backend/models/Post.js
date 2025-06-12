const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [2000, 'Content cannot be more than 2000 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image is required']
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Add index for better query performance
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ breed: 1 });
postSchema.index({ tags: 1 });

module.exports = mongoose.model('Post', postSchema); 