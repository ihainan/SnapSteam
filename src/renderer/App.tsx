import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { LibraryBooks, Settings } from '@mui/icons-material';
import Library from './pages/Library';
import SettingsPage from './pages/Settings';

const drawerWidth = 180;

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Library', icon: <LibraryBooks />, path: '/' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#0e141d',
            color: '#959da6',
            borderRight: 'none',
            paddingTop: '8px',
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                padding: '6px 12px',
                margin: '1px 6px',
                borderRadius: '2px',
                '&.Mui-selected': {
                  backgroundColor: '#2f89bc',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#2f89bc',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#ffffff',
                  },
                },
                '&:hover': {
                  backgroundColor: '#2f89bc',
                  opacity: 0.8,
                  color: '#ffffff',
                  '& .MuiListItemIcon-root': {
                    color: '#ffffff',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: '#959da6',
                  minWidth: '32px',
                  '& .MuiSvgIcon-root': {
                    fontSize: '20px',
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '13px',
                  },
                  marginLeft: '-8px',
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        sx={{
          backgroundColor: '#1b2838',
          minHeight: '100vh',
          padding: '0 16px',
          width: `calc(100% - ${drawerWidth}px)`,
          flexGrow: 1
        }}
      >
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App; 