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

// Mapping of use case names to sidebar items
const useCaseNavMap = [
  {
    useCase: 'Healthcare Underwriter Dashboard',
    text: 'Underwriters Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard'
  },
  {
    useCase: 'User Feedback Analysis Dashboard',
    text: 'User Feedback Analytics',
    icon: <HearingIcon />,
    path: '/feedback'
  },
  {
    useCase: 'Healthcare Price Transparency',
    text: 'Hospital Transparency',
    icon: <LocalHospitalIcon />,
    path: '/hospital'
  },
  {
    useCase: 'Member Dashboard',
    text: 'Member Dashboard',
    icon: <CardGiftcardIcon />,
    path: '/memberdashboard'
  }
];

interface SidebarProps {
  selectedUseCase?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ selectedUseCase }) => {
  const location = useLocation();

  // Only show nav items that match selectedUseCase
  const filteredNavItems = useCaseNavMap.filter(item =>
    selectedUseCase?.includes(item.useCase)
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: headerHeight
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 80,
          mt: 2,
          mb: 2
        }}
      >
        <Avatar sx={{ bgcolor: '#2155CD', mr: 1 }}>H</Avatar>
        <Typography variant="h6" noWrap>
          HealthOne
        </Typography>
      </Box>
      <Divider />
      <List>
        {filteredNavItems.map(({ text, icon, path }) => (
          <ListItemButton
            key={path}
            component={Link}
            to={path}
            selected={location.pathname === path}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="caption" color="textSecondary">
          © {new Date().getFullYear()} HealthOne. All rights reserved.
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
