import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Avatar
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
    // Add polling for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setError(null); // Clear any previous errors
      const response = await api.get('/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.response?.data?.message || 'Error fetching notifications');
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'reply':
        return 'replied to your comment';
      default:
        return 'interacted with your post';
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ color: 'text.primary' }} />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 350, maxHeight: 400 }
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography>No notifications</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => markAsRead(notification._id)}
              sx={{
                backgroundColor: notification.read ? 'transparent' : 'action.hover',
                whiteSpace: 'normal'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={notification.sender?.profilePicture}
                  sx={{ width: 32, height: 32 }}
                />
                <Box>
                  <Typography variant="body2">
                    <strong>{notification.sender?.username}</strong>
                    {' '}
                    {getNotificationText(notification)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
