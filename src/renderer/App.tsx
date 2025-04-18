import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material';
import { LibraryBooks, Settings } from '@mui/icons-material';
import Library from './pages/Library';
import SettingsPage from './pages/Settings';

const drawerWidth = 180;

const MainContent = styled(Box)(() => ({
  marginLeft: drawerWidth,
  backgroundColor: '#1b2838',
  minHeight: '100vh',
  padding: '8px 8px 8px 4px',
}));

const StyledDrawer = styled(Drawer)(() => ({
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
}));

const StyledListItemButton = styled(ListItemButton)(() => ({
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
}));

const StyledListItemIcon = styled(ListItemIcon)(() => ({
  color: '#959da6',
  minWidth: '32px',
  '& .MuiSvgIcon-root': {
    fontSize: '20px',
  },
}));

const StyledListItemText = styled(ListItemText)(() => ({
  '& .MuiListItemText-primary': {
    fontSize: '13px',
  },
  marginLeft: '-8px',
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
            <StyledListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
            >
              <StyledListItemIcon>{item.icon}</StyledListItemIcon>
              <StyledListItemText primary={item.text} />
            </StyledListItemButton>
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