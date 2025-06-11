import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Chip,
} from '@mui/material';
import { AddPhotoAlternate, EmojiEmotions } from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    breed: '',
    tags: [],
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEmojiClick = (emojiData) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content + emojiData.emoji,
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()],
        }));
      }
      setCurrentTag('');
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('content', formData.content);
      postData.append('breed', formData.breed);
      postData.append('tags', JSON.stringify(formData.tags));
      postData.append('image', image);

      await api.post('/posts/create', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create a New Pet Post
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
          <TextField
            fullWidth
            label="Breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Box sx={{ position: 'relative', mb: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              margin="normal"
              required
            />
            <IconButton
              sx={{ position: 'absolute', right: 8, bottom: 8 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <EmojiEmotions />
            </IconButton>
            {showEmojiPicker && (
              <Box sx={{ position: 'absolute', right: 0, zIndex: 1 }}>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </Box>
            )}
          </Box>
          <TextField
            fullWidth
            label="Add Tags"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleTagKeyDown}
            margin="normal"
            helperText="Press Enter to add tags"
          />
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {formData.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleTagDelete(tag)}
              />
            ))}
          </Stack>
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<AddPhotoAlternate />}
              >
                Upload Image
              </Button>
            </label>
          </Box>
          {imagePreview && (
            <Box sx={{ mb: 2 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: 300,
                  objectFit: 'cover',
                }}
              />
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!formData.title || !formData.content || !formData.breed || !image}
          >
            Create Post
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost; 