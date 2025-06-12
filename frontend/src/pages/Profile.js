import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { Edit, PhotoCamera } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import {
  getUserProfile,
  updateProfile,
  changePassword,
  getUserPosts,
  getSavedPosts,
} from '../services/api';
import PostCard from '../components/posts/PostCard';
import { motion } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const Profile = () => {
  const { user, login } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [value, setValue] = useState(0);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: '',
    bio: '',
    profilePicture: null,
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [stats, setStats] = useState({
    posts: 0,
    saved: 0,
    likes: 0
  });

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
    fetchSavedPosts();
    fetchUserStats();
  }, []);

  // Handle new post from navigation state
  useEffect(() => {
    if (location.state?.newPost) {
      setPosts(prevPosts => [location.state.newPost, ...prevPosts]);
      // Clear the state to prevent duplicate additions on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
      setEditFormData({
        username: data.username,
        bio: data.bio || '',
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const posts = await getUserPosts(user._id);
      setPosts(Array.isArray(posts) ? posts : []);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setPosts([]);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const posts = await getSavedPosts();
      setSavedPosts(Array.isArray(posts) ? posts : []);
    } catch (err) {
      console.error('Error fetching saved posts:', err);
      setSavedPosts([]);
    }
  };

  const fetchUserStats = async () => {
    try {
      const [posts, saved, likes] = await Promise.all([
        getUserPosts(user._id),
        getSavedPosts(),
        getUserPosts(user._id, 'likes')
      ]);
      setStats({
        posts: posts.data.length,
        saved: saved.data.length,
        likes: likes.data || 0
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEditFormChange = (e) => {
    if (e.target.name === 'profilePicture') {
      const file = e.target.files[0];
      setEditFormData({
        ...editFormData,
        profilePicture: file,
      });
      setProfilePicturePreview(URL.createObjectURL(file));
    } else {
      setEditFormData({
        ...editFormData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handlePasswordFormChange = (e) => {
    setPasswordFormData({
      ...passwordFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('username', editFormData.username);
      formData.append('bio', editFormData.bio);
      if (editFormData.profilePicture) {
        formData.append('profilePicture', editFormData.profilePicture);
      }

      const updatedProfile = await updateProfile(formData);
      setProfile(updatedProfile);
      login({ ...user, ...updatedProfile });
      setEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword,
      });
      setPasswordDialogOpen(false);
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError('Failed to change password');
      console.error(err);
    }
  };

  const handlePostDelete = async (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  const handlePostUpdate = async (updatedPost) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleRemoveFromSaved = (postId) => {
    setSavedPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  useEffect(() => {
    const loadSavedPosts = async () => {
      try {
        await fetchSavedPosts();
        setError('');
      } catch (err) {
        setError('Failed to load saved posts. Please try again later.');
      }
    };

    if (value === 1) {
      loadSavedPosts();
    }
  }, [value]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
      },
    },
  };

  const calculateTotalLikes = () => {
    return posts.reduce((total, post) => total + (post.likes?.length || 0), 0);
  };

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
    <Box
      sx={{
        minHeight: '100vh',
        background: '#FFF0E6', // Light peachy background matching gallery/create pages
        position: 'relative',
        overflow: 'hidden',
        pt: 4,
        pb: 6,
      }}
    >
      {/* Particles Background */}
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

      {/* Profile Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Profile Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              src={user?.profilePicture}
              sx={{
                width: 100,
                height: 100,
                mr: 3,
                border: '3px solid #FF7F50',
              }}
            />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {user?.username}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>

          {/* Tabs */}
          <Tabs
            value={value}
            onChange={(e, newValue) => setValue(newValue)}
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                color: '#FF7F50',
                '&.Mui-selected': {
                  color: '#FF6347',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FF6347',
              },
            }}
          >
            <Tab label="My Posts" />
            <Tab label="Saved Posts" />
          </Tabs>

          {/* Content */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress sx={{ color: '#FF7F50' }} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Bio
                </Typography>
                <Typography paragraph>
                  {user?.bio || 'I always slay-XOXO'}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Stats
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6">{stats.posts}</Typography>
                      <Typography color="textSecondary">Posts</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6">{stats.saved}</Typography>
                      <Typography color="textSecondary">Saved</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6">{stats.likes}</Typography>
                      <Typography color="textSecondary">Likes</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Paper>

        <Box sx={{ mt: 4 }}>
          <Tabs value={value} onChange={handleTabChange} centered>
            <Tab label="My Posts" />
            <Tab label="Saved Posts" />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {value === 0 ? (
              posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onDelete={handlePostDelete}
                    onUpdate={handlePostUpdate}
                  />
                ))
              ) : (
                <Typography variant="body1" align="center" color="text.secondary">
                  No posts yet
                </Typography>
              )
            ) : (
              savedPosts.length > 0 ? (
                savedPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onDelete={handlePostDelete}
                    onUpdate={handlePostUpdate}
                    onRemoveFromSaved={handleRemoveFromSaved}
                  />
                ))
              ) : (
                <Typography variant="body1" align="center" color="text.secondary">
                  No saved posts
                </Typography>
              )
            )}
          </Box>
        </Box>

        {/* Edit Profile Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={editFormData.username}
                onChange={handleEditFormChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={editFormData.bio}
                onChange={handleEditFormChange}
                multiline
                rows={4}
                margin="normal"
              />
              <Box sx={{ mt: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-picture-upload"
                  type="file"
                  name="profilePicture"
                  onChange={handleEditFormChange}
                />
                <label htmlFor="profile-picture-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCamera />}
                  >
                    Change Profile Picture
                  </Button>
                </label>
                {profilePicturePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={profilePicturePreview}
                      alt="Profile Preview"
                      style={{ maxWidth: '100%', maxHeight: 200 }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog
          open={passwordDialogOpen}
          onClose={() => setPasswordDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordFormData.currentPassword}
                onChange={handlePasswordFormChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordFormData.newPassword}
                onChange={handlePasswordFormChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordFormData.confirmPassword}
                onChange={handlePasswordFormChange}
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePasswordSubmit} variant="contained">
              Change Password
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Profile; 