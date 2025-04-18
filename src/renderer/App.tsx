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
  borderRadius: '4px',
  backgroundColor: alpha('#000', 0.04),
  '&:hover': {
    backgroundColor: alpha('#000', 0.08),
  },
  marginRight: '16px',
  width: '240px',
}));

const SearchIconWrapper = styled('div')({
  padding: '0 12px',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#666666',
});

const StyledInputBase = styled(InputBase)({
  width: '100%',
  '& .MuiInputBase-input': {
    padding: '8px 8px 8px 40px',
    width: '100%',
    fontSize: '13px',
  },
});

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);

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
    { text: '游戏库', icon: <LibraryBooks />, path: '/' },
    { text: '设置', icon: <Settings />, path: '/settings' },
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
            backgroundColor: '#f5f5f5',
            color: '#333333',
            borderRight: '1px solid #e0e0e0',
            paddingTop: '8px',
            display: 'flex',
            flexDirection: 'column',
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
                padding: '6px 12px',
                margin: '1px 6px',
                borderRadius: '4px',
                color: '#333333',
                '&.Mui-selected': {
                  backgroundColor: '#4285f4',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#4285f4',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#ffffff',
                  },
                },
                '&:hover': {
                  backgroundColor: '#4285f4',
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
                  color: '#333333',
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

        {location.pathname === '/' && (
          <Box
            sx={{
              borderTop: '1px solid #e0e0e0',
              padding: '8px',
            }}
          >
            <ListItemButton
              onClick={handleUserMenuClick}
              sx={{
                borderRadius: '4px',
                padding: '6px 12px',
                '&:hover': {
                  backgroundColor: 'rgba(66, 133, 244, 0.08)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: '#4285f4',
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
                    color: '#333333',
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
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
          backgroundColor: '#ffffff',
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
              borderBottom: '1px solid #e0e0e0',
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

export default App; 