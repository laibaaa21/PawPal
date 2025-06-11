import React from 'react';
import { Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreatePostForm from '../components/posts/CreatePostForm';

const CreatePost = () => {
  const navigate = useNavigate();

  const handlePostCreated = (newPost) => {
    // Navigate to profile page with the new post data
    navigate('/profile', { state: { newPost } });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
        Create a New Post
      </Typography>
      <CreatePostForm onPostCreated={handlePostCreated} />
    </Container>
  );
};

export default CreatePost; 