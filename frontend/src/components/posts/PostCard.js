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

const PostCard = ({ post, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);

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
    <Card sx={{ maxWidth: 600, mb: 2, mx: 'auto' }}>
      <CardHeader
        avatar={
          <Avatar
            src={post.user?.profilePicture}
            alt={post.user?.username}
          />
        }
        action={
          post.user?._id === user?._id && (
            <IconButton onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          )
        }
        title={post.user?.username || 'Unknown User'}
        subheader={post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ''}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      {post.imageUrl && (
        <CardMedia
          component="img"
          height="300"
          image={post.imageUrl}
          alt={post.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {post.content}
        </Typography>
        <Box sx={{ mb: 2 }}>
          {post.breed && (
            <Chip
              label={post.breed}
              color="primary"
              size="small"
              sx={{ mr: 1 }}
            />
          )}
          {post.tags?.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{ mr: 1 }}
            />
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {likesCount} likes • {post.comments?.length || 0} comments
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLike} color={liked ? 'primary' : 'default'}>
          {liked ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <IconButton onClick={() => setShowComments(!showComments)}>
          <Comment />
        </IconButton>
      </CardActions>
      {showComments && (
        <CardContent>
          <Box component="form" onSubmit={handleComment} sx={{ mb: 2 }}>
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
          {post.comments?.map((comment, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="subtitle2" component="span">
                {comment.user?.username || 'Unknown User'}
              </Typography>
              <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                {comment.content}
              </Typography>
            </Box>
          ))}
        </CardContent>
      )}
    </Card>
  );
};

export default PostCard; 