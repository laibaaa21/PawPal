import React, { useState } from 'react';
import { Box, TextField, Button, Avatar, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const CommentReply = ({ comment, onReply }) => {
  const [replyContent, setReplyContent] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onReply(replyContent);
    setReplyContent('');
  };

  return (
    <Box sx={{ mt: 2, ml: 4 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar src={user?.profilePicture} alt={user?.username} />
          <TextField
            fullWidth
            size="small"
            placeholder="Reply to this comment..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <Button type="submit" variant="contained" disabled={!replyContent.trim()}>
            Reply
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CommentReply;
