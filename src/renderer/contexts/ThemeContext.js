"use strict";
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
exports.ThemeProvider = exports.useTheme = void 0;
var react_1 = require("react");
var material_1 = require("@mui/material");
var electron_1 = require("electron");
var ThemeContext = (0, react_1.createContext)(undefined);
var useTheme = function () {
    var context = (0, react_1.useContext)(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
exports.useTheme = useTheme;
var lightTheme = (0, material_1.createTheme)({
    palette: {
        mode: 'light',
        primary: {
            main: '#3b82f6',
        },
        background: {
            default: '#f8f9fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#2c3e50',
            secondary: '#64748b',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                },
            },
        },
    },
});
var darkTheme = (0, material_1.createTheme)({
    palette: {
        mode: 'dark',
        primary: {
            main: '#60a5fa',
        },
        background: {
            default: '#1a1b1e',
            paper: '#2c2e33',
        },
        text: {
            primary: '#e2e8f0',
            secondary: '#94a3b8',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#2c2e33',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                },
            },
        },
    },
});
var ThemeProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)('system'), themeMode = _b[0], setThemeModeState = _b[1];
    var _c = (0, react_1.useState)('light'), resolvedTheme = _c[0], setResolvedTheme = _c[1];
    // 从主进程加载保存的主题配置
    (0, react_1.useEffect)(function () {
        var loadTheme = function () { return __awaiter(void 0, void 0, void 0, function () {
            var savedTheme;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-store-value', 'themeMode')];
                    case 1:
                        savedTheme = _a.sent();
                        if (savedTheme) {
                            setThemeModeState(savedTheme);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        loadTheme();
    }, []);
    (0, react_1.useEffect)(function () {
        if (themeMode === 'system') {
            var mediaQuery_1 = window.matchMedia('(prefers-color-scheme: dark)');
            var handleChange_1 = function (e) {
                setResolvedTheme(e.matches ? 'dark' : 'light');
            };
            setResolvedTheme(mediaQuery_1.matches ? 'dark' : 'light');
            mediaQuery_1.addEventListener('change', handleChange_1);
            return function () { return mediaQuery_1.removeEventListener('change', handleChange_1); };
        }
        else {
            setResolvedTheme(themeMode);
        }
    }, [themeMode]);
    // 同步 CSS 变量
    (0, react_1.useEffect)(function () {
        document.documentElement.setAttribute('data-theme', resolvedTheme);
    }, [resolvedTheme]);
    var theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;
    var setThemeMode = function (newTheme) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke('set-store-value', { key: 'themeMode', value: newTheme })];
                case 1:
                    _a.sent();
                    setThemeModeState(newTheme);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Failed to set theme:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<ThemeContext.Provider value={{ themeMode: themeMode, setThemeMode: setThemeMode }}>
      <material_1.ThemeProvider theme={theme}>
        {children}
      </material_1.ThemeProvider>
    </ThemeContext.Provider>);
};
exports.ThemeProvider = ThemeProvider;
