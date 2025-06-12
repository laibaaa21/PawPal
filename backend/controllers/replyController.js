const Reply = require('../models/Reply');
const Comment = require('../models/Comment');

exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;

    const reply = await Reply.create({
      content,
      user: req.user._id,
      comment: commentId
    });

    await reply.populate('user', 'username profilePicture');

    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
