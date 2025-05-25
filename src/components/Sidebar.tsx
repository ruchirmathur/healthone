// Sidebar.tsx
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

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  useCase: string; // Exact use case match required
}

const navItems: NavItem[] = [
  {
    text: 'Healthcare Underwriter Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    useCase: 'Healthcare Underwriter Dashboard'
  },
  {
    text: 'User Feedback Analysis Dashboard',
    icon: <InsightsIcon />,
    path: '/feedback',
    useCase: 'User Feedback Analysis Dashboard'
  },
  {
    text: 'Healthcare Price Transparency',
    icon: <LocalHospitalIcon />,
    path: '/hospital',
    useCase: 'Healthcare Price Transparency'
  },
  {
    text: 'Member Dashboard',
    icon: <CardGiftcardIcon />,
    path: '/memberdashboard',
    useCase: 'Member Dashboard'
  },
  {
    text: 'Voice Enabled Healthcare Price Transparency',
    icon: <HearingIcon />,
    path: '/voice-enabled',
    useCase: 'Voice enabled Healthcare Price Transparency'
  }
];

interface SidebarProps {
  selectedUseCase?: string;
  loading?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedUseCase, loading }) => {
  const location = useLocation();

  if (loading) {
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
            justifyContent: 'center',
            alignItems: 'center'
          }
        }}
      >
        <Typography variant="body1">Loading menu...</Typography>
      </Drawer>
    );
  }

  const activeItem = navItems.find(item => item.useCase === selectedUseCase);
  console.log('Active sidebar item:', activeItem);

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
          {activeItem && (
            <ListItemButton
              key={activeItem.text}
              component={Link}
              to={activeItem.path}
              selected={location.pathname === activeItem.path}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                color: location.pathname === activeItem.path ? '#2155CD' : '#1a237e',
                background: location.pathname === activeItem.path ? '#e3eafc' : 'transparent',
                fontWeight: location.pathname === activeItem.path ? 700 : 400,
                '&:hover': {
                  background: '#e3eafc',
                  color: '#2155CD'
                }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === activeItem.path ? '#2155CD' : '#1a237e', minWidth: 40 }}>
                {activeItem.icon}
              </ListItemIcon>
              <ListItemText primary={activeItem.text} />
            </ListItemButton>
          )}
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
