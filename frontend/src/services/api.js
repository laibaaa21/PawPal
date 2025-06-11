import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

// Post endpoints
export const createPost = async (postData) => {
  const response = await api.post('/posts/create', postData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getPosts = async (params = {}) => {
  const response = await api.get('/posts', { params });
  return response.data;
};

export const getPost = async (postId) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

export const updatePost = async (postId, postData) => {
  const response = await api.put(`/posts/${postId}`, postData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};

export const likePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`);
  return response.data;
};

export const unlikePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}/like`);
  return response.data;
};

export const savePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/save`);
  return response.data;
};

export const unsavePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}/save`);
  return response.data;
};

export const getUserPosts = async (userId) => {
  const response = await api.get(`/posts/user/${userId}`);
  return response.data;
};

export const getSavedPosts = async () => {
  const response = await api.get('/posts/saved');
  return response.data;
};

// Profile endpoints
export const updateProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put('/auth/change-password', passwordData);
  return response.data;
};

export default api; 