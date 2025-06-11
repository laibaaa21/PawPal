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
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  MoreVert,
  Comment,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PostCard = ({ post, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
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

  if (!post) {
    return null;
  }

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        maxWidth: 600,
        mb: 4,
        mx: 'auto',
        overflow: 'visible',
        '&:hover': {
          '& .post-actions': {
            opacity: 1,
          },
        },
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

      {post.imageUrl && (
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <CardMedia
            component={motion.img}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            height="450"
            image={post.imageUrl}
            alt={post.title}
            sx={{ objectFit: 'cover' }}
          />
          <Box
            className="post-actions"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <IconButton
              sx={{ color: 'white', mr: 2 }}
              onClick={handleLike}
            >
              {liked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton
              sx={{ color: 'white' }}
              onClick={() => setShowComments(!showComments)}
            >
              <Comment />
            </IconButton>
          </Box>
        </Box>
      )}

      <CardContent>
        <Typography 
          variant="h5" 
          sx={{ 
            fontFamily: 'Open Sans',
            fontSize: '1.5rem',
            fontWeight: 600,
            letterSpacing: '0.01em',
            mb: 2,
            color: '#333333',
          }}
        >
          {post.title || "Puffy Tha Legend"}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{
            fontFamily: 'Open Sans',
            color: 'text.primary',
            lineHeight: 1.6,
            fontSize: '1rem'
          }}
        >
          {post.content || "I love myself. I always slay. I'm expensive. I throw an tantrum when I don't get things done my way."}
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          {post.tags?.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.08)',
                borderRadius: '16px',
              }}
            />
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {likesCount} likes
        </Typography>
        <Typography variant="body2">
          {post.comments?.length || 0} comments
        </Typography>
      </CardActions>

      {/* Comments Section */}
      {showComments && (
        <Box sx={{ px: 2, pb: 2 }}>
          {post.comments?.map((comment, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar
                  src={comment.user?.profilePicture}
                  alt={comment.user?.username}
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    mr: 1,
                    bgcolor: comment.user?.username ? 'primary.main' : 'grey.400'
                  }}
                >
                  {comment.user?.username ? comment.user.username[0].toUpperCase() : 'A'}
                </Avatar>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary'
                  }}
                >
                  {comment.user?.username || 'Anonymous'}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    ml: 1,
                    color: 'text.secondary'
                  }}
                >
                  {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ pl: 4 }}>
                {comment.content}
              </Typography>
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
      )}
    </Card>
  );
};

export default PostCard; 