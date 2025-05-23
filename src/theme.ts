import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2F80ED', // Blue color for highlights
    },
    secondary: {
      main: '#F1F3F4', // Light background for cards and sidebar
    },
    text: {
      primary: '#333333', // Dark text color for contrast
      secondary: '#828282', // Light gray text
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    fontSize: 14,
    button: {
      textTransform: 'none',
    },
  },
});

export default theme;