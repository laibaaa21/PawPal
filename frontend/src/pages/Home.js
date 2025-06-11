import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          bgcolor: '#FFFFFF',
          backgroundImage: 'url(/images/hero-dog.jpg)', // Make sure to add this image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 700,
              mb: 2,
              color: '#000000',
            }}
          >
            Welcome to PetPal
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              color: '#666666',
              mb: { xs: 4, sm: 5, md: 6 },
              maxWidth: '800px',
              mx: 'auto',
              fontFamily: 'Open Sans',
            }}
          >
            Connect with pet lovers, share adorable moments, and discover new furry friends.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/gallery')}
            sx={{
              bgcolor: '#000000',
              color: '#FFFFFF',
              px: { xs: 4, sm: 6, md: 8 },
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#333333',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            Explore
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 