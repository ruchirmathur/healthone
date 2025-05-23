import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsightsIcon from '@mui/icons-material/Insights';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HearingIcon from '@mui/icons-material/Hearing';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff',
                    borderRight: '1px solid #e0e0e0',
                },
            }}
        >
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Typography variant="h6" component="div" style={{ fontWeight: 'bold', color: '#1e293b' }}>
                    MENU
                </Typography>
            </div>
            <Divider />
            <List>
                <ListItem component={Link} to="/dashboard">
                    <ListItemIcon>
                        <DashboardIcon style={{ color: '#1e293b' }} />
                    </ListItemIcon>
                    <ListItemText primary="Underwriters Dashboard" style={{ color: '#1e293b' }} />
                </ListItem>
                <ListItem component={Link} to="/feedback">
                    <ListItemIcon>
                        <InsightsIcon style={{ color: '#1e293b' }} />
                    </ListItemIcon>
                    <ListItemText primary="User Feedback Analytics" style={{ color: '#1e293b' }} />
                </ListItem>
                <ListItem component={Link} to="/hospital">
                    <ListItemIcon>
                        <LocalHospitalIcon style={{ color: '#1e293b' }} />
                    </ListItemIcon>
                    <ListItemText primary="Hospital Transparency" style={{ color: '#1e293b' }} />
                </ListItem>
                <ListItem component={Link} to="/memberdashboard">
                    <ListItemIcon>
                        <CardGiftcardIcon style={{ color: '#1e293b' }} />
                    </ListItemIcon>
                    <ListItemText primary="Member Dashboard" style={{ color: '#1e293b' }} />
                </ListItem>
                <ListItem component={Link} to="/audio-accessible-app">
                    <ListItemIcon>
                        <HearingIcon style={{ color: '#1e293b' }} />
                    </ListItemIcon>
                    <ListItemText primary="Audio Accessible App" style={{ color: '#1e293b' }} />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;