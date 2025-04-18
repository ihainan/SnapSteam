import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material';
import { LibraryBooks, Settings } from '@mui/icons-material';
import Library from './pages/Library';
import SettingsPage from './pages/Settings';

const drawerWidth = 240;

const MainContent = styled(Box)(() => ({
  marginLeft: drawerWidth,
  padding: '20px',
  backgroundColor: '#1b2838',
  minHeight: '100vh',
}));

const StyledDrawer = styled(Drawer)(() => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: '#2a475e',
    color: '#ffffff',
    borderRight: 'none',
  },
}));

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Library', icon: <LibraryBooks />, path: '/' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledDrawer variant="permanent" anchor="left">
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#66c0f4',
                  '&:hover': {
                    backgroundColor: '#66c0f4',
                  },
                },
                '&:hover': {
                  backgroundColor: '#66c0f4',
                  opacity: 0.8,
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </StyledDrawer>

      <MainContent>
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </MainContent>
    </Box>
  );
};

export default App; 