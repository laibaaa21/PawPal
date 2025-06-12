import React, { useState, useCallback } from 'react';
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
  Container,
  Paper,
  CircularProgress,
} from '@mui/material';
import { AddPhotoAlternate, EmojiEmotions } from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

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

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

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

  // Animation variants for floating bubbles
  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Define zig-zag positions for left bubbles
  const leftBubblePositions = [
    { left: '20%', top: '10%' },    // First bubble closer to edge
    { left: '55%', top: '40%' },   // Second bubble more towards center
    { left: '4%', top: '70%' },    // Third bubble back towards edge
  ];

  // Define zig-zag positions for right bubbles
  const rightBubblePositions = [
    { right: '55%', top: '10%' },  // First bubble more towards center
    { right: '4%', top: '40%' },   // Second bubble closer to edge
    { right: '45%', top: '70%' },  // Third bubble back towards center
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#FFF0E6', // Light peachy background like gallery page
        position: 'relative',
        overflow: 'hidden',
        pt: 4,
        pb: 6,
      }}
    >
      {/* Particles Background - matching gallery page */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            opacity: 0,
          },
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#FF7F50", // Coral color for particles
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.3,
              random: true,
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false,
              },
            },
            size: {
              value: 4,
              random: true,
              animation: {
                enable: true,
                speed: 3,
                minimumValue: 2,
                sync: false,
              },
            },
            move: {
              enable: true,
              speed: 1.5,
              direction: "none",
              random: true,
              straight: false,
              outModes: {
                default: "bounce",
              },
            },
          },
          interactivity: {
            detectsOn: "canvas",
            events: {
              onHover: {
                enable: true,
                mode: "grab",
              },
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: 0.3,
                }
              },
            },
          },
          retina_detect: true,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* Left side bubbles */}
      <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '25%' }}>
        {['cat', 'dog', 'rabbit'].map((animal, index) => (
          <motion.div
            key={animal}
            variants={floatingAnimation}
            initial="initial"
            animate="animate"
            style={{
              position: 'absolute',
              ...leftBubblePositions[index],
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: '3px solid #FF7F50',
              boxShadow: '0 4px 8px rgba(255, 127, 80, 0.3)',
              overflow: 'hidden',
              background: '#FFFFFF',
              zIndex: 1,
            }}
          >
            <img
              src={`/images/bubble-${animal}.png`}
              alt={animal}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </motion.div>
        ))}
      </Box>

      {/* Right side bubbles */}
      <Box sx={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '25%' }}>
        {['hamster', 'bird', 'fish'].map((animal, index) => (
          <motion.div
            key={animal}
            variants={floatingAnimation}
            initial="initial"
            animate="animate"
            style={{
              position: 'absolute',
              ...rightBubblePositions[index],
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: '3px solid #FF7F50',
              boxShadow: '0 4px 8px rgba(255, 127, 80, 0.3)',
              overflow: 'hidden',
              background: '#FFFFFF',
              zIndex: 1,
            }}
          >
            <img
              src={`/images/bubble-${animal}.png`}
              alt={animal}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </motion.div>
        ))}
      </Box>

      {/* Main content */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 127, 80, 0.1)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: '#6B4423',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Create a Post
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
        </Paper>
      </Container>
    </Box>
  );
};

export default CreatePost; 