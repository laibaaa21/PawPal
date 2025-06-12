import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './notifications/NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          component={RouterLink}
          to="/"
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
        >
          <PetsIcon />
        </IconButton>
        
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          PawPal
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NotificationBell />
          {user ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/create-post"
                sx={{ mr: 2 }}
              >
                Create Post
              </Button>
              <IconButton
                component={RouterLink}
                to="/profile"
                sx={{ mr: 2 }}
              >
                <Avatar
                  alt={user.username}
                  src={user.profilePicture}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
                variant="outlined"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 