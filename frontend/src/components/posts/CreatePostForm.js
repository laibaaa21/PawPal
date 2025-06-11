import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Autocomplete,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { PhotoCamera, Clear } from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';
import { createPost } from '../../services/api';

const COMMON_BREEDS = [
  'Labrador Retriever',
  'German Shepherd',
  'Golden Retriever',
  'French Bulldog',
  'Persian Cat',
  'Siamese Cat',
  'Maine Coon',
  'British Shorthair',
  // Add more breeds as needed
];

const CreatePostForm = ({ onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    breed: '',
    tags: [],
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEmojiClick = (emojiData) => {
    setFormData({
      ...formData,
      content: formData.content + emojiData.emoji,
    });
  };

  const handleTagsChange = (event, newValue) => {
    setFormData({
      ...formData,
      tags: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('breed', formData.breed);
      formData.tags.forEach(tag => {
        formDataToSend.append('tags[]', tag);
      });
      if (image) {
        formDataToSend.append('image', image);
      }

      await createPost(formDataToSend);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        breed: '',
        tags: [],
      });
      setImage(null);
      setImagePreview('');
      setShowEmojiPicker(false);

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Post
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          margin="normal"
          required
        />

        <Autocomplete
          freeSolo
          options={COMMON_BREEDS}
          value={formData.breed}
          onChange={(event, newValue) => {
            setFormData({
              ...formData,
              breed: newValue || '',
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Pet Breed"
              margin="normal"
              required
            />
          )}
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCamera />}
            >
              Upload Image
            </Button>
          </label>

          {imagePreview && (
            <Box sx={{ mt: 2, position: 'relative' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  objectFit: 'cover',
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'background.paper',
                }}
                onClick={() => {
                  setImage(null);
                  setImagePreview('');
                }}
              >
                <Clear />
              </IconButton>
            </Box>
          )}
        </Box>

        <TextField
          fullWidth
          label="Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          multiline
          rows={4}
          margin="normal"
          required
        />

        <Button
          type="button"
          variant="outlined"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          sx={{ mt: 1, mb: 1 }}
        >
          Add Emoji
        </Button>

        {showEmojiPicker && (
          <Box sx={{ mt: 1, mb: 1 }}>
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width="100%"
            />
          </Box>
        )}

        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={formData.tags}
          onChange={handleTagsChange}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                key={option}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags"
              placeholder="Add tags"
              helperText="Press enter to add tags"
              margin="normal"
            />
          )}
        />

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Post'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CreatePostForm; 