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
} from '@mui/material';
import PostCard from './PostCard';
import api from '../../services/api';

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
    total: 0,
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
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }));
      setAvailableBreeds(response.data.filters.breeds);
      setAvailableTags(response.data.filters.tags);
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

  return (
    <Box sx={{ py: 4, px: 2 }}>
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
  );
};

export default PetGallery; 