import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, Avatar, Tooltip } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAuth0 } from "@auth0/auth0-react";

interface HeaderProps {
  orgName: string;
  tenantId: string;
  color: string;
}

const Header: React.FC<HeaderProps> = ({ orgName, tenantId, color }) => {
  const { user, logout, isAuthenticated, isLoading } = useAuth0();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: color,
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: 64,
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(33,85,205,0.08)"
      }}
    >
      <Toolbar sx={{ minHeight: 64, display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            letterSpacing: 1,
            fontFamily: "Montserrat, Roboto, sans-serif",
            flex: 1,
            textAlign: "center"
          }}
        >
          {orgName || "HealthOne Platform"}
        </Typography>
        {!isLoading && isAuthenticated && (
          <Box display="flex" alignItems="center" gap={1}>
            {tenantId && (
              <Typography variant="body2" sx={{ color: "#e3eafc", fontWeight: 500, mr: 1 }}>
                {tenantId}
              </Typography>
            )}
            <Tooltip title={user?.email || ""}>
              <IconButton onClick={handleMenu} sx={{ color: "#fff" }}>
                {user?.picture ? (
                  <Avatar alt={user.name} src={user.picture} />
                ) : (
                  <AccountCircle fontSize="large" />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem disabled>{user?.email}</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
