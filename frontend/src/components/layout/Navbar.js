import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  MenuItem,
} from '@mui/material';
import { Menu as MenuIcon, Pets } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleCloseUserMenu();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: '#E8E6E1',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - Desktop */}
          <Pets sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            mr: 1,
            color: '#FF7F50'
          }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: '#FF7F50',
              textDecoration: 'none',
              '&:hover': {
                color: '#FF6347',
              }
            }}
          >
            PawPal
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ 
                color: '#FF7F50',
                '&:hover': {
                  backgroundColor: 'rgba(255,127,80,0.1)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem component={Link} to="/" onClick={handleCloseNavMenu}>
                <Typography textAlign="center" sx={{ color: '#FF7F50' }}>Home</Typography>
              </MenuItem>
              <MenuItem component={Link} to="/gallery" onClick={handleCloseNavMenu}>
                <Typography textAlign="center" sx={{ color: '#FF7F50' }}>Explore</Typography>
              </MenuItem>
              {user && (
                <MenuItem component={Link} to="/posts/create" onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" sx={{ color: '#FF7F50' }}>Create</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Logo - Mobile */}
          <Pets sx={{ 
            display: { xs: 'flex', md: 'none' }, 
            mr: 1,
            color: '#FF7F50'
          }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: '#FF7F50',
              textDecoration: 'none',
              '&:hover': {
                color: '#FF6347',
              }
            }}
          >
            PawPal
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button
              component={Link}
              to="/"
              onClick={handleCloseNavMenu}
              sx={{
                color: '#FF7F50',
                '&:hover': {
                  backgroundColor: 'rgba(255,127,80,0.1)',
                  color: '#FF6347',
                }
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/gallery"
              onClick={handleCloseNavMenu}
              sx={{
                color: '#FF7F50',
                '&:hover': {
                  backgroundColor: 'rgba(255,127,80,0.1)',
                  color: '#FF6347',
                }
              }}
            >
              Explore
            </Button>
            {user && (
              <Button
                component={Link}
                to="/posts/create"
                onClick={handleCloseNavMenu}
                sx={{
                  color: '#FF7F50',
                  '&:hover': {
                    backgroundColor: 'rgba(255,127,80,0.1)',
                    color: '#FF6347',
                  }
                }}
              >
                Create
              </Button>
            )}
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                <NotificationBell />
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user.username}
                    src={user.profilePicture}
                    sx={{ 
                      bgcolor: '#FF7F50',
                      color: 'white'
                    }}
                  >
                    {user.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
                    <Typography sx={{ color: '#FF7F50' }}>Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography sx={{ color: '#FF7F50' }}>Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{
                    color: '#FF7F50',
                    borderColor: '#FF7F50',
                    '&:hover': {
                      borderColor: '#FF6347',
                      backgroundColor: 'rgba(255,127,80,0.1)',
                      color: '#FF6347',
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    bgcolor: '#FF7F50',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#FF6347',
                    }
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 