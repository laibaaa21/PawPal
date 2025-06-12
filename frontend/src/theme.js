import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B5E3C', // Lighter brown for navbar
      light: '#A67B5B',
      dark: '#6B4423',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF7F50', // Coral color
      light: '#FF9F7F',
      dark: '#FF6347',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFF8F3', // Light cream background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C1810', // Dark brown text
      secondary: '#5D4037', // Medium brown text
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#8B5E3C', // Lighter brown for navbar
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '30px',
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#F5F5F5',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 32,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: 'postTitle' },
          style: {
            fontFamily: 'Press Start 2P',
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            lineHeight: 1.5,
            color: '#000000',
          },
        },
        {
          props: { variant: 'postDescription' },
          style: {
            fontFamily: 'Open Sans',
            fontSize: '1rem',
            lineHeight: 1.6,
            color: '#333333',
          },
        },
      ],
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: 8,
        }
      }
    }
  },
  typography: {
    fontFamily: 'Open Sans, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      '@media (min-width:600px)': {
        fontSize: '3.5rem',
      },
      '@media (min-width:900px)': {
        fontSize: '4.5rem',
      },
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#5D4037',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    postTitle: {
      fontFamily: 'Press Start 2P', // Pixel-style font for post titles
      fontSize: '1.25rem',
      fontWeight: 700,
      letterSpacing: '0.02em',
      lineHeight: 1.5,
      color: '#000000',
    },
    postDescription: {
      fontFamily: 'Open Sans',
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#333333',
    },
  },
  shape: {
    borderRadius: 12,
  },
  transitions: {
    smooth: 'all 0.3s ease-in-out',
    bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
});

export default theme; 