import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Pagination,
  Typography,
  Autocomplete,
  CircularProgress,
  Container,
} from '@mui/material';
import PostCard from './PostCard';
import api from '../../services/api';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const PetGallery = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    breed: '',
    tags: [],
    search: '',
    sort: 'newest'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPosts: 0,
    pages: 1,
    limit: 10
  });
  const [availableBreeds, setAvailableBreeds] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sort: filters.sort,
        ...(filters.breed && { breed: filters.breed }),
        ...(filters.tags.length && { tags: filters.tags.join(',') }),
        ...(filters.search && { search: filters.search })
      });

      const response = await api.get(`/posts?${queryParams}`);
      setPosts(response.data.posts);
      setPagination(prev => ({
        ...prev,
        totalPosts: response.data.totalPosts,
        pages: response.data.totalPages
      }));
      
      if (response.data.filters) {
        setAvailableBreeds(response.data.filters.breeds || []);
        setAvailableTags(response.data.filters.tags || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }));
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev =>
      prev.map(post => post._id === updatedPost._id ? updatedPost : post)
    );
  };

  const handlePostDelete = (deletedPostId) => {
    setPosts(prev => prev.filter(post => post._id !== deletedPostId));
  };

  // Particles initialization
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFE5D9 0%, #FFD6C4 100%)', // Light peach gradient
        pt: { xs: 2, sm: 4 },
        pb: 6,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left Side Particles */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '20%', // Increased width
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <Particles
          id="tsparticles-left"
          init={particlesInit}
          options={{
            particles: {
              number: {
                value: 30, // Increased number of particles
                density: {
                  enable: true,
                  value_area: 800
                }
              },
              color: {
                value: "#FF7F50" // Coral color
              },
              shape: {
                type: "circle"
              },
              opacity: {
                value: 0.6, // Increased opacity
                random: true,
                animation: {
                  enable: true,
                  speed: 1,
                  minimumValue: 0.3, // Increased minimum opacity
                  sync: false
                }
              },
              size: {
                value: 4, // Slightly larger particles
                random: true,
                animation: {
                  enable: true,
                  speed: 2,
                  minimumValue: 1,
                  sync: false
                }
              },
              move: {
                enable: true,
                speed: 1.5, // Slightly faster movement
                direction: "none",
                random: true,
                straight: false,
                outModes: {
                  default: "bounce" // Changed to bounce instead of out
                }
              }
            },
            interactivity: {
              detectsOn: "canvas",
              events: {
                onHover: {
                  enable: true,
                  mode: "bubble"
                }
              },
              modes: {
                bubble: {
                  distance: 150,
                  size: 8,
                  duration: 2,
                  opacity: 1
                }
              }
            },
            background: {
              color: "transparent"
            },
            retina_detect: true
          }}
        />
      </Box>

      {/* Right Side Particles */}
      <Box
        sx={{
          position: 'fixed',
          right: 0,
          top: 0,
          width: '20%', // Increased width
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <Particles
          id="tsparticles-right"
          init={particlesInit}
          options={{
            particles: {
              number: {
                value: 30, // Increased number of particles
                density: {
                  enable: true,
                  value_area: 800
                }
              },
              color: {
                value: "#FF7F50" // Coral color
              },
              shape: {
                type: "circle"
              },
              opacity: {
                value: 0.6, // Increased opacity
                random: true,
                animation: {
                  enable: true,
                  speed: 1,
                  minimumValue: 0.3, // Increased minimum opacity
                  sync: false
                }
              },
              size: {
                value: 4, // Slightly larger particles
                random: true,
                animation: {
                  enable: true,
                  speed: 2,
                  minimumValue: 1,
                  sync: false
                }
              },
              move: {
                enable: true,
                speed: 1.5, // Slightly faster movement
                direction: "none",
                random: true,
                straight: false,
                outModes: {
                  default: "bounce" // Changed to bounce instead of out
                }
              }
            },
            interactivity: {
              detectsOn: "canvas",
              events: {
                onHover: {
                  enable: true,
                  mode: "bubble"
                }
              },
              modes: {
                bubble: {
                  distance: 150,
                  size: 8,
                  duration: 2,
                  opacity: 1
                }
              }
            },
            background: {
              color: "transparent"
            },
            retina_detect: true
          }}
        />
      </Box>

      {/* Main Content */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative',
          zIndex: 2,
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            p: { xs: 2, sm: 3 },
            backdropFilter: 'blur(5px)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Filters */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search posts..."
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Breed</InputLabel>
                  <Select
                    value={filters.breed}
                    label="Breed"
                    onChange={(e) => handleFilterChange('breed', e.target.value)}
                  >
                    <MenuItem value="">All Breeds</MenuItem>
                    {availableBreeds.map((breed) => (
                      <MenuItem key={breed} value={breed}>
                        {breed}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Autocomplete
                  multiple
                  value={filters.tags}
                  onChange={(e, newValue) => handleFilterChange('tags', newValue)}
                  options={availableTags}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Tags" placeholder="Select tags" />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filters.sort}
                    label="Sort By"
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="likes">Most Liked</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Posts Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : posts.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {posts.map((post) => (
                  <Grid item xs={12} key={post._id}>
                    <PostCard
                      post={post}
                      onDelete={handlePostDelete}
                      onUpdate={handlePostUpdate}
                    />
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={pagination.pages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          ) : (
            <Typography variant="h6" align="center">
              No posts found
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PetGallery; 