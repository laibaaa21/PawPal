import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <PetsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Welcome to PawPal
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph
        >
          A community for pet lovers to share stories, photos, and connect with
          other pet enthusiasts.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              🐾 Share Your Pet Stories
            </Typography>
            <Typography align="center" paragraph>
              Join our community to:
            </Typography>
            <Box sx={{ textAlign: 'left', width: '100%', maxWidth: 400 }}>
              <Typography paragraph>
                • Post photos and stories of your pets
              </Typography>
              <Typography paragraph>
                • Connect with other pet owners
              </Typography>
              <Typography paragraph>
                • Find pets by breed or interests
              </Typography>
              <Typography>
                • Save your favorite pet posts
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 