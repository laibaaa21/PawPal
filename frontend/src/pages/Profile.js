import React, { useEffect, useState } from 'react';
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
import {
  getUserProfile,
  updateProfile,
  changePassword,
  getUserPosts,
  getSavedPosts,
} from '../services/api';
import PostCard from '../components/posts/PostCard';

const Profile = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
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

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
    fetchSavedPosts();
  }, []);

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
      setUserPosts(posts);
    } catch (err) {
      console.error('Error fetching user posts:', err);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const posts = await getSavedPosts();
      setSavedPosts(posts);
    } catch (err) {
      console.error('Error fetching saved posts:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
    setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  const handlePostUpdate = async (updatedPost) => {
    setUserPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
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
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
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
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: -8,
                  bgcolor: 'background.paper',
                }}
                onClick={() => setEditDialogOpen(true)}
              >
                <Edit />
              </IconButton>
            </Box>
            <Typography variant="h5" gutterBottom>
              {user?.username}
            </Typography>
            <Typography color="textSecondary" paragraph>
              {user?.email}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setPasswordDialogOpen(true)}
              sx={{ mt: 1 }}
            >
              Change Password
            </Button>
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
                  <Typography variant="h6">{userPosts.length}</Typography>
                  <Typography color="textSecondary">Posts</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">{savedPosts.length}</Typography>
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

      <Box sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="My Posts" />
          <Tab label="Saved Posts" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tabValue === 0 ? (
            userPosts.length > 0 ? (
              userPosts.map((post) => (
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
  );
};

export default Profile; 