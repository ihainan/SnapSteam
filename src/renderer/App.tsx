import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
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
  alpha,
  CircularProgress,
  Typography
} from '@mui/material';
import { LibraryBooks, Settings, Search } from '@mui/icons-material';
import Library from './pages/Library';
import SettingsPage from './pages/Settings';
import ScreenshotManagerRoute from './pages/ScreenshotManagerRoute';
import { translations } from './locales';
import { useLanguage } from './contexts/LanguageContext';
import { ipcRenderer } from 'electron';

const drawerWidth = 180;

interface SteamUser {
  id: number;
  name: string;
  avatar: string | null;
}

interface Game {
  id: number;
  name: string;
  coverUrl: string;
  favorite: boolean;
  userId: number;
}

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

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="error" gutterBottom>
            出错了
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {this.state.error?.message || '发生了未知错误'}
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentUser, setCurrentUser] = useState<SteamUser | null>(null);
  const [users, setUsers] = useState<SteamUser[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [isSteamPathValid, setIsSteamPathValid] = useState<boolean | null>(null);
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // 检查 Steam 路径是否有效
  useEffect(() => {
    const checkSteamPath = async () => {
      const steamPath = await ipcRenderer.invoke('get-store-value', 'steamPath');
      const isValid = await ipcRenderer.invoke('validate-steam-path', steamPath);
      setIsSteamPathValid(isValid);
      
      // 如果路径无效且不在设置页面，则跳转到设置页面
      if (!isValid && location.pathname !== '/settings') {
        navigate('/settings');
      }
    };

    checkSteamPath();
  }, [location.pathname, navigate]);

  // 加载 Steam 用户列表
  useEffect(() => {
    const loadUsers = async () => {
      const steamUsers = await ipcRenderer.invoke('get-steam-users');
      setUsers(steamUsers);
      
      // 如果有保存的用户 ID，则加载对应的用户
      const savedUserId = await ipcRenderer.invoke('get-store-value', 'currentUserId');
      if (savedUserId) {
        const user = steamUsers.find((u: SteamUser) => u.id === savedUserId);
        if (user) {
          setCurrentUser(user);
        } else if (steamUsers.length > 0) {
          // 如果保存的用户 ID 不存在，则选择第一个用户
          setCurrentUser(steamUsers[0]);
          await ipcRenderer.invoke('set-store-value', { key: 'currentUserId', value: steamUsers[0].id });
        }
      } else if (steamUsers.length > 0) {
        // 如果没有保存的用户 ID，则选择第一个用户
        setCurrentUser(steamUsers[0]);
        await ipcRenderer.invoke('set-store-value', { key: 'currentUserId', value: steamUsers[0].id });
      }
    };
    
    loadUsers();
  }, []);

  // 加载当前用户的游戏库
  useEffect(() => {
    const loadGames = async () => {
      if (currentUser) {
        // 从 Steam 获取游戏库数据
        const userGames = await ipcRenderer.invoke('get-user-games', currentUser.id);
        
        // 从持久化存储中获取收藏状态
        const savedGames = await ipcRenderer.invoke('get-store-value', `userGames_${currentUser.id}`);
        
        if (savedGames && Array.isArray(savedGames)) {
          // 合并 Steam 游戏数据和保存的收藏状态
          const mergedGames = userGames.map((game: Game) => {
            const savedGame = savedGames.find((g: Game) => g.id === game.id);
            return savedGame ? { ...game, favorite: savedGame.favorite } : game;
          });
          
          setGames(mergedGames);
        } else {
          setGames(userGames);
        }
      }
    };
    
    loadGames();
  }, [currentUser]);

  console.log('App rendered, language:', language);

  // 检查语言和翻译是否可用
  if (!language) {
    console.log('Language not ready, showing loading...');
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: 2
      }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          加载中...
        </Typography>
      </Box>
    );
  }

  // 确保翻译可用
  if (!translations[language]) {
    console.error(`Missing translations for language: ${language}`);
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          语言配置错误
        </Typography>
        <Typography variant="body2" color="text.secondary">
          找不到语言 {language} 的翻译文件
        </Typography>
      </Box>
    );
  }

  const t = translations[language];
  console.log('Translations loaded:', t);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserChange = async (user: SteamUser) => {
    setCurrentUser(user);
    setAnchorEl(null);
    
    // 保存用户选择
    await ipcRenderer.invoke('set-store-value', { key: 'currentUserId', value: user.id });
    
    // 加载新用户的游戏库
    const userGames = await ipcRenderer.invoke('get-user-games', user.id);
    setGames(userGames);
  };

  const showTopBar = location.pathname === '/';

  const menuItems = [
    { 
      text: t.library.allGames, 
      icon: <LibraryBooks />, 
      path: '/',
      disabled: !isSteamPathValid // 如果 Steam 路径无效，禁用游戏库选项
    },
    { text: t.settings.title, icon: <Settings />, path: '/settings' },
  ];

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', height: '100vh' }}>
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
                disabled={item.disabled}
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
                  '&.Mui-disabled': {
                    opacity: 0.5,
                    cursor: 'not-allowed',
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
                  {currentUser?.name[0]}
                </Avatar>
                <ListItemText
                  primary={currentUser?.name}
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
                {users.map((user) => (
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
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: theme => theme.palette.background.default,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {showTopBar && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <SearchBox>
                <SearchIconWrapper>
                  <Search />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="搜索游戏..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </SearchBox>
            </Box>
          )}

          <Routes>
            <Route path="/" element={<Library searchTerm={searchTerm} games={games} setGames={setGames} />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route 
              path="/screenshots/:gameId" 
              element={<ScreenshotManagerRoute games={games} />} 
            />
          </Routes>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default App; 