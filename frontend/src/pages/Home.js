import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to PawPal
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Share your pet moments and connect with other pet lovers
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/gallery"
            variant="contained"
            color="primary"
            size="large"
          >
            Browse Pet Gallery
          </Button>
          {!user && (
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              color="primary"
              size="large"
            >
              Join Now
            </Button>
          )}
          {user && (
            <Button
              component={RouterLink}
              to="/posts/create"
              variant="outlined"
              color="primary"
              size="large"
            >
              Create Post
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 