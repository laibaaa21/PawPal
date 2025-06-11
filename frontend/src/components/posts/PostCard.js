import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  MoreVert,
  BookmarkBorder,
  Bookmark,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { savePost, unsavePost, likePost, unlikePost } from '../../services/api';

const PostCard = ({ post, onPostUpdate, onDeletePost }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?._id));
  const [isSaved, setIsSaved] = useState(post.savedBy?.includes(user?._id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDeletePost(post._id);
  };

  const handleEdit = () => {
    handleMenuClose();
    // Navigate to edit page or open edit modal
  };

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        await unlikePost(post._id);
        setLikesCount(prev => prev - 1);
      } else {
        await likePost(post._id);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
      if (onPostUpdate) onPostUpdate();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await unsavePost(post._id);
      } else {
        await savePost(post._id);
      }
      setIsSaved(!isSaved);
      if (onPostUpdate) onPostUpdate();
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  return (
    <Card sx={{ maxWidth: '100%', mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar
            component={RouterLink}
            to={`/profile/${post.user._id}`}
            src={post.user.profilePicture}
            alt={post.user.username}
          />
        }
        action={
          post.user._id === user?._id && (
            <>
              <IconButton onClick={handleMenuClick}>
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )
        }
        title={
          <Typography
            component={RouterLink}
            to={`/profile/${post.user._id}`}
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            {post.user.username}
          </Typography>
        }
        subheader={new Date(post.createdAt).toLocaleDateString()}
      />
      <CardMedia
        component="img"
        height="400"
        image={post.imageUrl}
        alt={post.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {post.content}
        </Typography>
        <Box sx={{ mb: 1 }}>
          <Chip
            label={post.breed}
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
          />
          {post.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ mr: 1 }}
            />
          ))}
        </Box>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLikeToggle}>
          {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {likesCount}
        </Typography>
        <IconButton onClick={handleSaveToggle}>
          {isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PostCard; 