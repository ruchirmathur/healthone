import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const NotFound: React.FC = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h1" gutterBottom>
      404 - Page Not Found
    </Typography>
    <Typography variant="h5" sx={{ mb: 4 }}>
      The requested page could not be found.
    </Typography>
    <Button
      variant="contained"
      component={Link}
      to="/"
      sx={{ mt: 2 }}
    >
      Return to Dashboard
    </Button>
  </Box>
);

export default NotFound;
