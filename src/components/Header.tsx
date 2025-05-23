import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAuth0 } from "@auth0/auth0-react";

const namespace = 'https://myapp.example.com';

const Header = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth0();
  const userMetadata = user?.[`${namespace}/user_metadata`];
  const tenantId = userMetadata?.tenantid;

  return (
    <AppBar position="static" sx={{ background: "#1e40af" }}>
      <Toolbar>
        {/* Centered heading */}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Typography variant="h6" component="div">
            Dashboard
          </Typography>
        </Box>
        {/* Show user name and logout icon only if authenticated and not loading */}
        {!isLoading && isAuthenticated && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ mr: 2 }}>{user?.email_verified}{tenantId}</Typography>
            <IconButton
              color="inherit"
              edge="end"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              <AccountCircle />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
