"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var Library_1 = require("./pages/Library");
var Settings_1 = require("./pages/Settings");
var ScreenshotManagerRoute_1 = require("./pages/ScreenshotManagerRoute");
var locales_1 = require("./locales");
var LanguageContext_1 = require("./contexts/LanguageContext");
var electron_1 = require("electron");
var drawerWidth = 180;
// 自定义搜索框样式
var SearchBox = (0, material_1.styled)('div')(function (_a) {
    var theme = _a.theme;
    return ({
        position: 'relative',
        borderRadius: '8px',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
        },
        marginRight: '16px',
        width: '240px',
        transition: 'all 0.2s ease',
    });
});
var SearchIconWrapper = (0, material_1.styled)('div')(function (_a) {
    var theme = _a.theme;
    return ({
        padding: '0 12px',
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.text.secondary,
    });
});
var StyledInputBase = (0, material_1.styled)(material_1.InputBase)(function (_a) {
    var theme = _a.theme;
    return ({
        width: '100%',
        '& .MuiInputBase-input': {
            padding: '8px 8px 8px 40px',
            width: '100%',
            fontSize: '13px',
            color: theme.palette.text.primary,
        },
    });
});
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false, error: null };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        return { hasError: true, error: error };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    };
    ErrorBoundary.prototype.render = function () {
        var _a;
        if (this.state.hasError) {
            return (<material_1.Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    padding: 3,
                    textAlign: 'center',
                }}>
          <material_1.Typography variant="h6" color="error" gutterBottom>
            出错了
          </material_1.Typography>
          <material_1.Typography variant="body2" color="text.secondary">
            {((_a = this.state.error) === null || _a === void 0 ? void 0 : _a.message) || '发生了未知错误'}
          </material_1.Typography>
        </material_1.Box>);
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(react_1.default.Component));
var App = function () {
    var _a = (0, react_1.useState)(''), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = (0, react_1.useState)(null), anchorEl = _b[0], setAnchorEl = _b[1];
    var _c = (0, react_1.useState)(null), currentUser = _c[0], setCurrentUser = _c[1];
    var _d = (0, react_1.useState)([]), users = _d[0], setUsers = _d[1];
    var _e = (0, react_1.useState)([]), games = _e[0], setGames = _e[1];
    var _f = (0, react_1.useState)(null), isSteamPathValid = _f[0], setIsSteamPathValid = _f[1];
    var language = (0, LanguageContext_1.useLanguage)().language;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var location = (0, react_router_dom_1.useLocation)();
    // 检查 Steam 路径是否有效
    (0, react_1.useEffect)(function () {
        var checkSteamPath = function () { return __awaiter(void 0, void 0, void 0, function () {
            var steamPath, isValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-store-value', 'steamPath')];
                    case 1:
                        steamPath = _a.sent();
                        return [4 /*yield*/, electron_1.ipcRenderer.invoke('validate-steam-path', steamPath)];
                    case 2:
                        isValid = _a.sent();
                        setIsSteamPathValid(isValid);
                        // 如果路径无效且不在设置页面，则跳转到设置页面
                        if (!isValid && location.pathname !== '/settings') {
                            navigate('/settings');
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        checkSteamPath();
    }, [location.pathname, navigate]);
    // 加载 Steam 用户列表
    (0, react_1.useEffect)(function () {
        var loadUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
            var steamUsers, savedUserId, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-steam-users')];
                    case 1:
                        steamUsers = _a.sent();
                        setUsers(steamUsers);
                        return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-store-value', 'currentUserId')];
                    case 2:
                        savedUserId = _a.sent();
                        if (!savedUserId) return [3 /*break*/, 6];
                        user = steamUsers.find(function (u) { return u.id === savedUserId; });
                        if (!user) return [3 /*break*/, 3];
                        setCurrentUser(user);
                        return [3 /*break*/, 5];
                    case 3:
                        if (!(steamUsers.length > 0)) return [3 /*break*/, 5];
                        // 如果保存的用户 ID 不存在，则选择第一个用户
                        setCurrentUser(steamUsers[0]);
                        return [4 /*yield*/, electron_1.ipcRenderer.invoke('set-store-value', { key: 'currentUserId', value: steamUsers[0].id })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        if (!(steamUsers.length > 0)) return [3 /*break*/, 8];
                        // 如果没有保存的用户 ID，则选择第一个用户
                        setCurrentUser(steamUsers[0]);
                        return [4 /*yield*/, electron_1.ipcRenderer.invoke('set-store-value', { key: 'currentUserId', value: steamUsers[0].id })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        loadUsers();
    }, []);
    // 加载当前用户的游戏库
    (0, react_1.useEffect)(function () {
        var loadGames = function () { return __awaiter(void 0, void 0, void 0, function () {
            var userGames, savedGames_1, mergedGames;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!currentUser) return [3 /*break*/, 3];
                        return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-user-games', currentUser.id)];
                    case 1:
                        userGames = _a.sent();
                        return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-store-value', "userGames_".concat(currentUser.id))];
                    case 2:
                        savedGames_1 = _a.sent();
                        if (savedGames_1 && Array.isArray(savedGames_1)) {
                            mergedGames = userGames.map(function (game) {
                                var savedGame = savedGames_1.find(function (g) { return g.id === game.id; });
                                return savedGame ? __assign(__assign({}, game), { favorite: savedGame.favorite }) : game;
                            });
                            setGames(mergedGames);
                        }
                        else {
                            setGames(userGames);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        loadGames();
    }, [currentUser]);
    console.log('App rendered, language:', language);
    // 检查语言和翻译是否可用
    if (!language) {
        console.log('Language not ready, showing loading...');
        return (<material_1.Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                gap: 2
            }}>
        <material_1.CircularProgress />
        <material_1.Typography variant="body2" color="text.secondary">
          加载中...
        </material_1.Typography>
      </material_1.Box>);
    }
    // 确保翻译可用
    if (!locales_1.translations[language]) {
        console.error("Missing translations for language: ".concat(language));
        return (<material_1.Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                padding: 3,
                textAlign: 'center',
            }}>
        <material_1.Typography variant="h6" color="error" gutterBottom>
          语言配置错误
        </material_1.Typography>
        <material_1.Typography variant="body2" color="text.secondary">
          找不到语言 {language} 的翻译文件
        </material_1.Typography>
      </material_1.Box>);
    }
    var t = locales_1.translations[language];
    console.log('Translations loaded:', t);
    var handleSearchChange = function (event) {
        setSearchTerm(event.target.value);
    };
    var handleUserMenuClick = function (event) {
        setAnchorEl(event.currentTarget);
    };
    var handleUserMenuClose = function () {
        setAnchorEl(null);
    };
    var handleUserChange = function (user) { return __awaiter(void 0, void 0, void 0, function () {
        var userGames;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setCurrentUser(user);
                    setAnchorEl(null);
                    // 保存用户选择
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke('set-store-value', { key: 'currentUserId', value: user.id })];
                case 1:
                    // 保存用户选择
                    _a.sent();
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-user-games', user.id)];
                case 2:
                    userGames = _a.sent();
                    setGames(userGames);
                    return [2 /*return*/];
            }
        });
    }); };
    var showTopBar = location.pathname === '/';
    var menuItems = [
        {
            text: t.navigation.gameLibrary,
            icon: <icons_material_1.LibraryBooks />,
            path: '/',
            disabled: !isSteamPathValid // 如果 Steam 路径无效，禁用游戏库选项
        },
        { text: t.navigation.settings, icon: <icons_material_1.Settings />, path: '/settings' },
    ];
    return (<ErrorBoundary>
      <material_1.Box sx={{ display: 'flex', height: '100vh' }}>
        <material_1.Drawer variant="permanent" anchor="left" sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor: function (theme) { return theme.palette.background.paper; },
                color: function (theme) { return theme.palette.text.primary; },
                borderRight: function (theme) { return "1px solid ".concat(theme.palette.divider); },
                paddingTop: '8px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: function (theme) { return theme.palette.mode === 'dark'
                    ? '0 1px 3px rgba(0,0,0,0.2)'
                    : '0 1px 3px rgba(0,0,0,0.05)'; },
            },
        }}>
          <material_1.List sx={{ flex: 1 }}>
            {menuItems.map(function (item) { return (<material_1.ListItemButton key={item.text} onClick={function () { return navigate(item.path); }} selected={location.pathname === item.path} disabled={item.disabled} sx={{
                padding: '8px 16px',
                margin: '2px 8px',
                borderRadius: '8px',
                color: function (theme) { return theme.palette.text.primary; },
                '&.Mui-selected': {
                    backgroundColor: function (theme) { return theme.palette.primary.main; },
                    color: function (theme) { return theme.palette.primary.contrastText; },
                    '&:hover': {
                        backgroundColor: function (theme) { return theme.palette.primary.dark; },
                    },
                    '& .MuiListItemIcon-root': {
                        color: function (theme) { return theme.palette.primary.contrastText; },
                    },
                },
                '&:hover': {
                    backgroundColor: function (theme) { return theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)'; },
                    color: function (theme) { return theme.palette.text.primary; },
                    '& .MuiListItemIcon-root': {
                        color: function (theme) { return theme.palette.text.primary; },
                    },
                },
                '&.Mui-disabled': {
                    opacity: 0.5,
                    cursor: 'not-allowed',
                },
            }}>
                <material_1.ListItemIcon sx={{
                color: function (theme) { return theme.palette.text.secondary; },
                minWidth: '32px',
                '& .MuiSvgIcon-root': {
                    fontSize: '20px',
                },
            }}>
                  {item.icon}
                </material_1.ListItemIcon>
                <material_1.ListItemText primary={item.text} sx={{
                '& .MuiListItemText-primary': {
                    fontSize: '13px',
                    fontWeight: 500,
                },
                marginLeft: '-8px',
            }}/>
              </material_1.ListItemButton>); })}
          </material_1.List>

          {location.pathname === '/' && (<material_1.Box sx={{
                borderTop: function (theme) { return "1px solid ".concat(theme.palette.divider); },
                padding: '8px',
            }}>
              <material_1.ListItemButton onClick={handleUserMenuClick} sx={{
                borderRadius: '4px',
                padding: '6px 12px',
                '&:hover': {
                    backgroundColor: function (theme) { return theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)'; },
                },
            }}>
                <material_1.Avatar sx={{
                width: 24,
                height: 24,
                backgroundColor: function (theme) { return theme.palette.primary.main; },
                fontSize: '13px',
                marginRight: '12px',
            }} src={(currentUser === null || currentUser === void 0 ? void 0 : currentUser.avatar) || undefined}>
                  {!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.avatar) && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.name[0])}
                </material_1.Avatar>
                <material_1.ListItemText primary={currentUser === null || currentUser === void 0 ? void 0 : currentUser.name} sx={{
                '& .MuiListItemText-primary': {
                    fontSize: '13px',
                    color: function (theme) { return theme.palette.text.primary; },
                },
            }}/>
              </material_1.ListItemButton>
              <material_1.Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={function () { return setAnchorEl(null); }} PaperProps={{
                elevation: 3,
                sx: {
                    minWidth: '200px',
                    mt: 1,
                    '& .MuiList-root': {
                        py: 0.5,
                    },
                    overflow: 'hidden',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1.5,
                    },
                },
            }} transformOrigin={{ horizontal: 'left', vertical: 'top' }} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
                {users.map(function (user) { return (<material_1.MenuItem key={user.id} onClick={function () { return handleUserChange(user); }} selected={user.id === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id)} sx={{
                    minHeight: '48px',
                    px: 2,
                    py: 1,
                    borderRadius: 0.5,
                    mx: 0.5,
                    '&:hover': {
                        backgroundColor: function (theme) { return theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.04)'; },
                    },
                    '&.Mui-selected': {
                        backgroundColor: function (theme) { return theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.12)'
                            : 'rgba(25, 118, 210, 0.08)'; },
                        '&:hover': {
                            backgroundColor: function (theme) { return theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.16)'
                                : 'rgba(25, 118, 210, 0.12)'; },
                        },
                    },
                }}>
                    <material_1.Avatar src={user.avatar || undefined} sx={{
                    bgcolor: function (theme) { return theme.palette.primary.main; },
                    fontSize: '0.875rem',
                }}>
                      {!user.avatar && user.name[0]}
                    </material_1.Avatar>
                    <material_1.Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <material_1.Typography variant="body2" sx={{
                    fontWeight: function (theme) { return user.id === (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) ? 600 : 400; },
                }}>
                        {user.name}
                      </material_1.Typography>
                      <material_1.Typography variant="caption" sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                }}>
                        Steam ID: {user.id}
                      </material_1.Typography>
                    </material_1.Box>
                  </material_1.MenuItem>); })}
              </material_1.Menu>
            </material_1.Box>)}
        </material_1.Drawer>

        <material_1.Box component="main" sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: function (theme) { return theme.palette.background.default; },
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
        }}>
          {showTopBar && (<material_1.Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
            }}>
              <SearchBox>
                <SearchIconWrapper>
                  <icons_material_1.Search />
                </SearchIconWrapper>
                <StyledInputBase placeholder={t.library.searchPlaceholder} value={searchTerm} onChange={handleSearchChange}/>
              </SearchBox>
            </material_1.Box>)}

          <react_router_dom_1.Routes>
            <react_router_dom_1.Route path="/" element={<Library_1.default searchTerm={searchTerm} games={games} setGames={setGames}/>}/>
            <react_router_dom_1.Route path="/settings" element={<Settings_1.default />}/>
            <react_router_dom_1.Route path="/screenshots/:gameId" element={<ScreenshotManagerRoute_1.default games={games}/>}/>
          </react_router_dom_1.Routes>
        </material_1.Box>
      </material_1.Box>
    </ErrorBoundary>);
};
exports.default = App;
