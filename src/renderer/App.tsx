import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  InputBase,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  styled,
  alpha
} from '@mui/material';
import { LibraryBooks, Settings, Search } from '@mui/icons-material';
import Library from './pages/Library';
import SettingsPage from './pages/Settings';
import ScreenshotManager from './pages/ScreenshotManager';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { translations } from './locales';
import { useLanguage } from './contexts/LanguageContext';

const drawerWidth = 180;

// 模拟用户数据
const mockUsers = [
  { id: 1, name: "用户1", avatar: null },
  { id: 2, name: "用户2", avatar: null },
  { id: 3, name: "用户3", avatar: null },
];

// 自定义搜索框样式
const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
  },
  marginRight: '16px',
  width: '240px',
  transition: 'all 0.2s ease',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: '0 12px',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: '100%',
  '& .MuiInputBase-input': {
    padding: '8px 8px 8px 40px',
    width: '100%',
    fontSize: '13px',
    color: theme.palette.text.primary,
  },
}));

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);

  const t = translations[language];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserChange = (user: typeof mockUsers[0]) => {
    setCurrentUser(user);
    handleUserMenuClose();
  };

  const showTopBar = location.pathname === '/';

  const menuItems = [
    { text: t.library.allGames, icon: <LibraryBooks />, path: '/' },
    { text: t.settings.title, icon: <Settings />, path: '/settings' },
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
            backgroundColor: theme => theme.palette.background.paper,
            color: theme => theme.palette.text.primary,
            borderRight: theme => `1px solid ${theme.palette.divider}`,
            paddingTop: '8px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: theme => theme.palette.mode === 'dark' 
              ? '0 1px 3px rgba(0,0,0,0.2)' 
              : '0 1px 3px rgba(0,0,0,0.05)',
          },
        }}
      >
        <List sx={{ flex: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                padding: '8px 16px',
                margin: '2px 8px',
                borderRadius: '8px',
                color: theme => theme.palette.text.primary,
                '&.Mui-selected': {
                  backgroundColor: theme => theme.palette.primary.main,
                  color: theme => theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme => theme.palette.primary.dark,
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme => theme.palette.primary.contrastText,
                  },
                },
                '&:hover': {
                  backgroundColor: theme => theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                  color: theme => theme.palette.text.primary,
                  '& .MuiListItemIcon-root': {
                    color: theme => theme.palette.text.primary,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: theme => theme.palette.text.secondary,
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
                    fontWeight: 500,
                  },
                  marginLeft: '-8px',
                }}
              />
            </ListItemButton>
          ))}
        </List>

        {location.pathname === '/' && (
          <Box
            sx={{
              borderTop: theme => `1px solid ${theme.palette.divider}`,
              padding: '8px',
            }}
          >
            <ListItemButton
              onClick={handleUserMenuClick}
              sx={{
                borderRadius: '4px',
                padding: '6px 12px',
                '&:hover': {
                  backgroundColor: theme => theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: theme => theme.palette.primary.main,
                  fontSize: '13px',
                  marginRight: '12px',
                }}
              >
                {currentUser.name[0]}
              </Avatar>
              <ListItemText
                primary={currentUser.name}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '13px',
                    color: theme => theme.palette.text.primary,
                  },
                }}
              />
            </ListItemButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              PaperProps={{
                sx: {
                  minWidth: '120px',
                  marginTop: '4px',
                  boxShadow: theme => theme.palette.mode === 'dark'
                    ? '0 2px 8px rgba(0,0,0,0.2)'
                    : '0 2px 8px rgba(0,0,0,0.1)',
                }
              }}
            >
              {mockUsers.map((user) => (
                <MenuItem
                  key={user.id}
                  onClick={() => handleUserChange(user)}
                  sx={{
                    fontSize: '13px',
                    padding: '8px 16px',
                  }}
                >
                  {user.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </Drawer>

      <Box
        sx={{
          backgroundColor: theme => theme.palette.background.default,
          minHeight: '100vh',
          width: `calc(100% - ${drawerWidth}px)`,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {showTopBar && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '12px 16px',
              borderBottom: theme => `1px solid ${theme.palette.divider}`,
              backgroundColor: theme => theme.palette.background.paper,
              boxShadow: theme => theme.palette.mode === 'dark'
                ? '0 1px 3px rgba(0,0,0,0.2)'
                : '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <SearchBox>
              <SearchIconWrapper>
                <Search fontSize="small" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="搜索游戏..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </SearchBox>
          </Box>
        )}

        <Box sx={{ padding: '16px', flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Library searchTerm={searchTerm} />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/screenshots/:gameId" element={<ScreenshotManager gameId={1} gameName="Half-Life 2" />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App; 