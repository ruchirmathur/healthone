import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  Typography,
  Avatar
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsightsIcon from '@mui/icons-material/Insights';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HearingIcon from '@mui/icons-material/Hearing';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;
const headerHeight = 64;

const iconMap: Record<string, React.ReactNode> = {
  '/dashboard': <DashboardIcon />,
  '/feedback': <InsightsIcon />,
  '/hospital': <LocalHospitalIcon />,
  '/memberdashboard': <CardGiftcardIcon />,
  '/audioaccessible': <HearingIcon />
};

interface RouteConfig {
  path: string;
  label: string;
}

interface SidebarProps {
  links: RouteConfig[];
}

const Sidebar: React.FC<SidebarProps> = ({ links }) => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: headerHeight,
          height: `calc(100% - ${headerHeight}px)`,
          background: '#f7fafd',
          borderRight: '1px solid #e3eafc',
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      <Box sx={{ py: 2, px: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ bgcolor: '#2155CD', width: 36, height: 36, fontWeight: 700 }}>H</Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2155CD', letterSpacing: 1 }}>
          HealthOne
        </Typography>
      </Box>
      <Divider sx={{ mb: 1 }} />
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List>
          {links.map(({ label, path }) => (
            <ListItemButton
              key={path}
              component={Link}
              to={path}
              selected={location.pathname === path}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                color: location.pathname === path ? '#2155CD' : '#1a237e',
                background: location.pathname === path ? '#e3eafc' : 'transparent',
                fontWeight: location.pathname === path ? 700 : 400,
                '&:hover': {
                  background: '#e3eafc',
                  color: '#2155CD'
                }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === path ? '#2155CD' : '#1a237e', minWidth: 40 }}>
                {iconMap[path] || <DashboardIcon />}
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box sx={{ p: 2, borderTop: '1px solid #e3eafc', textAlign: 'center' }}>
        <Typography variant="caption" color="#64748b">
          &copy; {new Date().getFullYear()} HealthOne. All rights reserved.
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
