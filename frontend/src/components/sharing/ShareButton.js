import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import {
  Facebook,
  Twitter,
  WhatsApp,
  ContentCopy
} from '@mui/icons-material';

const ShareButton = ({ post }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  const handleShare = (platform) => {
    const url = `${window.location.origin}/post/${post._id}`;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${url}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        // Show success message
        break;
    }
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <ShareIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleShare('facebook')}>
          <Facebook sx={{ mr: 1 }} /> Facebook
        </MenuItem>
        <MenuItem onClick={() => handleShare('twitter')}>
          <Twitter sx={{ mr: 1 }} /> Twitter
        </MenuItem>
        <MenuItem onClick={() => handleShare('whatsapp')}>
          <WhatsApp sx={{ mr: 1 }} /> WhatsApp
        </MenuItem>
        <MenuItem onClick={() => handleShare('copy')}>
          <ContentCopy sx={{ mr: 1 }} /> Copy Link
        </MenuItem>
      </Menu>
    </>
  );
};

export default ShareButton;
