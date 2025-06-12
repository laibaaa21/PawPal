import React, { useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  InputBase,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const Home = () => {
  const navigate = useNavigate();

  // Particles initialization
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6B4423 0%, #8B4513 100%)',
        pt: 8,
        pb: 6,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          particles: {
            number: {
              value: 50,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: "#FF7F50"
            },
            shape: {
              type: "circle"
            },
            opacity: {
              value: 0.5,
              random: true
            },
            size: {
              value: 3,
              random: true
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "out",
              bounce: false
            }
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: true,
                mode: "repulse"
              }
            },
            modes: {
              repulse: {
                distance: 100,
                duration: 0.4
              }
            }
          },
          retina_detect: true
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 4, md: 8 },
          }}
        >
          {/* Left Section */}
          <Box
            sx={{
              flex: 1,
              color: 'white',
              textAlign: { xs: 'center', md: 'left' },
              position: 'relative',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  fontWeight: 700,
                  mb: 2,
                  color: 'white',
                  lineHeight: 1.2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                Welcome to PawPal
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  maxWidth: '800px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                Connect with pet lovers, share adorable moments, and discover new furry friends.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/gallery')}
                sx={{
                  bgcolor: '#FF7F50',
                  color: 'white',
                  px: { xs: 4, sm: 6, md: 8 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                  borderRadius: '30px',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: '#FF6347',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                Explore
              </Button>
            </motion.div>
          </Box>

          {/* Right Section - Image Gallery */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              height: { xs: '300px', md: '500px' },
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{ 
                width: '100%', 
                height: '100%', 
                position: 'relative',
                padding: '20px', // Space for the border effect
              }}
            >
              {/* Border Effect */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  border: '3px solid #FF7F50',
                  borderRadius: '25px',
                  animation: 'borderPulse 2s infinite',
                  '@keyframes borderPulse': {
                    '0%': {
                      transform: 'scale(1)',
                      opacity: 0.7,
                    },
                    '50%': {
                      transform: 'scale(1.02)',
                      opacity: 0.5,
                    },
                    '100%': {
                      transform: 'scale(1)',
                      opacity: 0.7,
                    },
                  },
                }}
              />

              {/* Main Image */}
              <Box
                component="img"
                src="/images/hero-pet.jpg"
                alt="Happy Pets"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(255,127,80,0.3)',
                  position: 'relative',
                  zIndex: 1,
                }}
              />

              {/* Glowing Orbs */}
              {[...Array(4)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: { xs: '60px', md: '100px' },
                    height: { xs: '60px', md: '100px' },
                    background: 'rgba(255, 127, 80, 0.2)',
                    borderRadius: '50%',
                    filter: 'blur(20px)',
                    animation: `float${i + 1} ${3 + i}s infinite ease-in-out`,
                    '@keyframes float1': {
                      '0%, 100%': { transform: 'translate(0, 0)' },
                      '50%': { transform: 'translate(20px, -20px)' },
                    },
                    '@keyframes float2': {
                      '0%, 100%': { transform: 'translate(0, 0)' },
                      '50%': { transform: 'translate(-20px, 20px)' },
                    },
                    '@keyframes float3': {
                      '0%, 100%': { transform: 'translate(0, 0)' },
                      '50%': { transform: 'translate(20px, 20px)' },
                    },
                    '@keyframes float4': {
                      '0%, 100%': { transform: 'translate(0, 0)' },
                      '50%': { transform: 'translate(-20px, -20px)' },
                    },
                    ...{
                      0: { top: '10%', left: '-5%' },
                      1: { top: '60%', right: '-5%' },
                      2: { bottom: '-5%', left: '20%' },
                      3: { top: '30%', right: '10%' },
                    }[i],
                  }}
                />
              ))}
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 