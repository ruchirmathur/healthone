// LoadingSpinner.tsx
import React from "react";
import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner: React.FC = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "200px",
      width: "100%",
    }}
  >
    <CircularProgress color="primary" size={48} aria-label="Loading..." />
  </Box>
);

export default LoadingSpinner;
