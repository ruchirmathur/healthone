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
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HearingIcon from '@mui/icons-material/Hearing';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;
const headerHeight = 64;

interface SidebarProps {
  selectedUseCase: string[];
  orgName;
}

const navItems = [
  { 
    key: 'Healthcare Underwriter Dashboard',
    text: 'Underwriters Dashboard', 
    icon: <DashboardIcon />,
    path: '/dashboard'
  },
  { 
    key: 'User Feedback Analysis Dashboard',
    text: 'User Feedback Analytics', 
    icon: <HearingIcon />,
    path: '/feedback'
  },
  { 
    key: 'Healthcare Price Transparency',
    text: 'Hospital Transparency', 
    icon: <LocalHospitalIcon />,
    path: '/hospital'
  },
  { 
    key: 'Member Dashboard',
    text: 'Member Dashboard', 
    icon: <CardGiftcardIcon />,
    path: '/memberdashboard'
  },
  { 
    key: 'Voice enabled Healthcare Price Transparency',
    text: 'Voice enabled Healthcare Price Transparency', 
    icon: <LocalHospitalIcon />,
    path: '/voicechat'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ selectedUseCase,orgName }) => {
  const location = useLocation();
  const filteredItems = navItems.filter(item => selectedUseCase.includes(item.key));

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
          {orgName}
        </Typography>
      </Box>
      <Divider />
      <List>
        {filteredItems.map(({ text, icon, path }) => (
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
    </Drawer>
  );
};

export default Sidebar;
