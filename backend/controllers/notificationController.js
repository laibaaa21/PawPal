const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'username profilePicture')
      .populate('post', 'title imageUrl')
      .sort('-createdAt')
      .lean();  // Added for better performance

    if (!notifications) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    res.json(notifications);
  } catch (error) {
    console.error('Error in getNotifications:', error);
    res.status(500).json({ 
      message: 'Server error while fetching notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    // Return the populated notification
    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'username profilePicture')
      .populate('post', 'title imageUrl');

    res.json(populatedNotification);
  } catch (error) {
    console.error('Error in markAsRead:', error);
    res.status(500).json({ 
      message: 'Server error while marking notification as read',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead
};
