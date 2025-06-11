import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black for primary elements
      light: '#333333',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#666666', // Gray for secondary elements
      light: '#999999',
      dark: '#444444',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Open Sans, sans-serif',
    h1: {
      fontSize: '4rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
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
      fontSize: '1.25rem',
      fontWeight: 600,
      fontFamily: 'Bangers, cursive',
      letterSpacing: '0.05em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#666666',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
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
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: 'none',
          borderBottom: '1px solid #EEEEEE',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.9rem',
          transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          backgroundColor: '#000000',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#F5F5F5',
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          height: 28,
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
  shape: {
    borderRadius: 8,
  },
  transitions: {
    smooth: 'all 0.3s ease-in-out',
    bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
});

export default theme; 