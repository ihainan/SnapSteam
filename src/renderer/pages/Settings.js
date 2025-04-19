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
var react_1 = require("react");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var ThemeContext_1 = require("../contexts/ThemeContext");
var LanguageContext_1 = require("../contexts/LanguageContext");
var locales_1 = require("../locales");
var electron_1 = require("electron");
var defaultSteamPath = process.platform === 'darwin'
    ? '~/Library/Application Support/Steam'
    : process.platform === 'win32'
        ? 'C:\\Program Files (x86)\\Steam\\userdata'
        : '~/.local/share/Steam/userdata';
var SectionTitle = (0, material_1.styled)(material_1.Typography)(function (_a) {
    var theme = _a.theme;
    return ({
        color: theme.palette.text.primary,
        fontSize: '24px',
        fontWeight: 600,
        marginBottom: '16px',
        paddingBottom: '8px',
        borderBottom: "1px solid ".concat(theme.palette.divider),
    });
});
var SubTitle = (0, material_1.styled)(material_1.Typography)(function (_a) {
    var theme = _a.theme;
    return ({
        color: theme.palette.text.secondary,
        fontSize: '14px',
        marginBottom: '12px',
    });
});
var StyledTextField = (0, material_1.styled)(material_1.TextField)(function (_a) {
    var theme = _a.theme;
    return ({
        '& .MuiOutlinedInput-root': {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            '& fieldset': {
                borderColor: theme.palette.divider,
            },
            '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
            },
        },
        '& .MuiInputLabel-root': {
            color: theme.palette.text.secondary,
            '&.Mui-focused': {
                color: theme.palette.primary.main,
            },
        },
    });
});
var StyledButton = (0, material_1.styled)(material_1.Button)(function (_a) {
    var theme = _a.theme;
    return ({
        backgroundColor: theme.palette.primary.main,
        color: '#ffffff',
        padding: '6px 16px',
        height: '40px',
        minWidth: '100px',
        whiteSpace: 'nowrap',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
        '& .MuiButton-startIcon': {
            marginRight: '4px',
        },
    });
});
var Settings = function () {
    var _a = (0, ThemeContext_1.useTheme)(), themeMode = _a.themeMode, setThemeMode = _a.setThemeMode;
    var _b = (0, LanguageContext_1.useLanguage)(), language = _b.language, setLanguage = _b.setLanguage;
    var _c = (0, react_1.useState)(defaultSteamPath), steamPath = _c[0], setSteamPath = _c[1];
    var _d = (0, react_1.useState)(null), pathError = _d[0], setPathError = _d[1];
    var _e = (0, react_1.useState)(null), isPathValid = _e[0], setIsPathValid = _e[1];
    // 从主进程加载保存的配置
    (0, react_1.useEffect)(function () {
        var loadSettings = function () { return __awaiter(void 0, void 0, void 0, function () {
            var savedTheme, savedLanguage, savedSteamPath, isValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-store-value', 'themeMode')];
                    case 1:
                        savedTheme = _a.sent();
                        return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-store-value', 'language')];
                    case 2:
                        savedLanguage = _a.sent();
                        return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-store-value', 'steamPath')];
                    case 3:
                        savedSteamPath = _a.sent();
                        if (savedTheme)
                            setThemeMode(savedTheme);
                        if (savedLanguage)
                            setLanguage(savedLanguage);
                        if (!savedSteamPath) return [3 /*break*/, 5];
                        setSteamPath(savedSteamPath);
                        return [4 /*yield*/, electron_1.ipcRenderer.invoke('validate-steam-path', savedSteamPath)];
                    case 4:
                        isValid = _a.sent();
                        setIsPathValid(isValid);
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadSettings();
    }, [setThemeMode, setLanguage]);
    var handlePathChange = function (event) {
        setSteamPath(event.target.value);
        setPathError(null);
    };
    var handleThemeChange = function (event) {
        var newTheme = event.target.value;
        setThemeMode(newTheme);
        electron_1.ipcRenderer.send('set-store-value', { key: 'themeMode', value: newTheme });
    };
    var handleLanguageChange = function (event) {
        var newLanguage = event.target.value;
        setLanguage(newLanguage);
        electron_1.ipcRenderer.send('set-store-value', { key: 'language', value: newLanguage });
    };
    var handleBrowse = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, selectedPath, isValid, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke('open-directory-dialog')];
                case 1:
                    result = _a.sent();
                    if (!(!result.canceled && result.filePaths.length > 0)) return [3 /*break*/, 3];
                    selectedPath = result.filePaths[0];
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke('validate-steam-path', selectedPath)];
                case 2:
                    isValid = _a.sent();
                    if (isValid) {
                        setSteamPath(selectedPath);
                        setPathError(null);
                        electron_1.ipcRenderer.send('set-store-value', { key: 'steamPath', value: selectedPath });
                    }
                    else {
                        setPathError(t.settings.pathError);
                    }
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error opening directory dialog:', error_1);
                    setPathError(t.settings.dialogError);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var t = locales_1.translations[language];
    return (<material_1.Box>
      <SectionTitle>{t.settings.title}</SectionTitle>
      <material_1.Box sx={{ mb: 4 }}>
        <SubTitle>{t.settings.steamPath}</SubTitle>
        <material_1.Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <StyledTextField fullWidth value={steamPath} onChange={handlePathChange} error={!!pathError} helperText={pathError || t.settings.pathHelper}/>
          <StyledButton variant="contained" startIcon={<icons_material_1.Folder />} onClick={handleBrowse}>
            {t.settings.browse}
          </StyledButton>
        </material_1.Box>
        {!isPathValid && (<material_1.Alert severity="warning" sx={{ mb: 2 }}>
            {t.settings.pathWarning}
          </material_1.Alert>)}
      </material_1.Box>

      <material_1.Box sx={{ maxWidth: 800 }}>
        <SubTitle>
          {t.settings.appearance}
        </SubTitle>
        
        <material_1.FormControl fullWidth size="small" sx={{ mb: 3 }}>
          <material_1.InputLabel>{t.settings.theme}</material_1.InputLabel>
          <material_1.Select value={themeMode} label={t.settings.theme} onChange={handleThemeChange}>
            <material_1.MenuItem value="system">{t.settings.themeOptions.system}</material_1.MenuItem>
            <material_1.MenuItem value="light">{t.settings.themeOptions.light}</material_1.MenuItem>
            <material_1.MenuItem value="dark">{t.settings.themeOptions.dark}</material_1.MenuItem>
          </material_1.Select>
        </material_1.FormControl>

        <material_1.FormControl fullWidth size="small" sx={{ mb: 3 }}>
          <material_1.InputLabel>{t.settings.language}</material_1.InputLabel>
          <material_1.Select value={language} label={t.settings.language} onChange={handleLanguageChange}>
            <material_1.MenuItem value="zh">{t.settings.languageOptions.zh}</material_1.MenuItem>
            <material_1.MenuItem value="en">{t.settings.languageOptions.en}</material_1.MenuItem>
          </material_1.Select>
        </material_1.FormControl>
      </material_1.Box>
    </material_1.Box>);
};
exports.default = Settings;
