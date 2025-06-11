import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              src={profile?.profilePicture}
              alt={user?.username}
              sx={{
                width: 150,
                height: 150,
                mx: 'auto',
                mb: 2,
              }}
            />
            <Typography variant="h5" gutterBottom>
              {user?.username}
            </Typography>
            <Typography color="textSecondary">{user?.email}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Bio
            </Typography>
            <Typography paragraph>
              {profile?.bio || 'No bio added yet.'}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Stats
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">0</Typography>
                  <Typography color="textSecondary">Posts</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">0</Typography>
                  <Typography color="textSecondary">Saved</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">0</Typography>
                  <Typography color="textSecondary">Likes</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 