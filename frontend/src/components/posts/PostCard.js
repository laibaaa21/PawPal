import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Chip,
  Menu,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  MoreVert,
  Comment,
  Edit as EditIcon,
  Delete as DeleteIcon,
  BookmarkBorder,
  Bookmark,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import api, { savePost, unsavePost } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CommentReply from '../comments/CommentReply';
import ShareButton from '../sharing/ShareButton';

const PostCard = ({ post, onDelete, onUpdate, onRemoveFromSaved }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [saved, setSaved] = useState(post?.savedBy?.includes(user?._id) || false);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${post._id}`);
      onDelete(post._id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
    handleMenuClose();
  };

  const handleLike = async () => {
    try {
      await api.put(`/posts/${post._id}/like`);
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await api.post(`/posts/${post._id}/comment`, {
        content: comment,
      });
      onUpdate(response.data);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditComment = async () => {
    try {
      const response = await api.put(
        `/posts/${post._id}/comment/${editingComment._id}`,
        { content: editCommentContent }
      );
      onUpdate(response.data);
      setEditingComment(null);
      setEditCommentContent('');
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await api.delete(
        `/posts/${post._id}/comment/${commentId}`
      );
      onUpdate(response.data);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const openEditDialog = (comment) => {
    setEditingComment(comment);
    setEditCommentContent(comment.content);
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (saved) {
        await unsavePost(post._id);
      } else {
        await savePost(post._id);
      }
      setSaved(!saved);
      onUpdate && onUpdate({
        ...post,
        savedBy: saved 
          ? post.savedBy.filter(id => id !== user?._id)
          : [...(post.savedBy || []), user?._id]
      });
    } catch (error) {
      console.error('Error saving/unsaving post:', error);
    }
  };

  const handleReply = async (commentId, content) => {
    try {
      const response = await api.post(`/posts/${post._id}/comment/${commentId}/reply`, {
        content
      });
      onUpdate(response.data);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.5 }
    }
  };

  const commentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  if (!post) {
    return null;
  }

  return (
    <Card
      component={motion.div}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      sx={{
        maxWidth: { xs: '100%', sm: 600 },
        mx: 'auto',
        mb: 4,
        overflow: 'visible',
      }}
    >
      <Box
        component={motion.div}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={post.user?.profilePicture}
              alt={post.user?.username}
              sx={{ 
                width: 40, 
                height: 40,
                marginRight: 2
              }}
            />
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                {post.user?.username || 'puffy'}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ color: 'text.secondary' }}
              >
                {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : '36 minutes ago'}
              </Typography>
            </Box>
          </Box>
          {post.user?._id === user?._id && (
            <IconButton 
              onClick={handleMenuOpen}
              sx={{ ml: 'auto' }}
            >
              <MoreVert />
            </IconButton>
          )}
          <Menu
            id="post-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => {
              navigate(`/posts/edit/${post._id}`);
              handleMenuClose();
            }}>
              Edit
            </MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </Box>
      </Box>

      <Box 
        sx={{ 
          position: 'relative',
          '&:hover .overlay': {
            opacity: 1
          }
        }}
        onMouseEnter={() => setShowOverlay(true)}
        onMouseLeave={() => setShowOverlay(false)}
      >
        <CardMedia
          component="img"
          image={post.imageUrl}
          alt={post.title}
          sx={{ 
            height: 'auto',
            maxHeight: '600px',
            width: '100%',
            objectFit: 'cover'
          }}
        />
        
        <Box
          className="overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
            opacity: 0,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              gap: 1,
            }}
          >
            <FavoriteIcon sx={{ fontSize: '2rem' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {post.likes?.length || 0}
            </Typography>
          </Box>
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              gap: 1,
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: '2rem' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {post.comments?.length || 0}
            </Typography>
          </Box>
        </Box>
      </Box>

      <CardContent>
        <Typography 
          variant="h5" 
          sx={{ 
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            mb: 2,
            fontWeight: 600,
          }}
        >
          {post.title}
        </Typography>
        <Typography 
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          {post.content}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {post.tags?.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.06)',
                color: 'text.primary',
              }}
            />
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <motion.div whileHover={{ scale: 1.1 }}>
          <IconButton onClick={handleLike}>
            {liked ? (
              <Favorite sx={{ color: 'red' }} />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </motion.div>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {likesCount} likes
        </Typography>
        <motion.div whileHover={{ scale: 1.1 }}>
          <IconButton onClick={() => setShowComments(!showComments)}>
            <Comment />
          </IconButton>
        </motion.div>
        <Typography variant="body2">
          {post.comments?.length || 0} comments
        </Typography>
        <motion.div whileHover={{ scale: 1.1 }}>
          <IconButton 
            onClick={handleSave}
            disabled={!user}
          >
            {saved ? (
              <Bookmark sx={{ color: 'primary.main' }} />
            ) : (
              <BookmarkBorder />
            )}
          </IconButton>
        </motion.div>
        <ShareButton post={post} />
      </CardActions>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ px: 2, pb: 2 }}>
              {post.comments?.map((comment) => (
                <Box key={comment._id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={comment.user?.profilePicture}
                        alt={comment.user?.username}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      />
                      <Typography variant="subtitle2">{comment.user?.username}</Typography>
                    </Box>
                    {user?._id === comment.user?._id && (
                      <Box>
                        <IconButton size="small" onClick={() => openEditDialog(comment)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteComment(comment._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ ml: 5 }}>
                    {comment.content}
                  </Typography>
                  
                  <CommentReply
                    comment={comment}
                    onReply={(content) => handleReply(comment._id, content)}
                  />
                  
                  {comment.replies?.map((reply) => (
                    <Box key={reply._id} sx={{ ml: 8, mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={reply.user?.profilePicture}
                            alt={reply.user?.username}
                            sx={{ width: 24, height: 24, mr: 1 }}
                          />
                          <Typography variant="subtitle2">{reply.user?.username}</Typography>
                        </Box>
                        {user?._id === reply.user?._id && (
                          <Box>
                            <IconButton size="small" onClick={() => openEditDialog(reply)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteComment(reply._id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ ml: 4 }}>
                        {reply.content}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ))}
              
              <Box component="form" onSubmit={handleComment} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="small"
                  disabled={!comment.trim()}
                >
                  Post
                </Button>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Comment Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={editCommentContent}
            onChange={(e) => setEditCommentContent(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditComment} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PostCard; 