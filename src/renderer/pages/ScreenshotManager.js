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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var UploadDialog_1 = require("../components/UploadDialog");
var LanguageContext_1 = require("../contexts/LanguageContext");
var locales_1 = require("../locales");
var electron_1 = require("electron");
var path_1 = require("path");
var os_1 = require("os");
var fs_1 = require("fs");
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
var ScreenshotCard = (0, material_1.styled)(material_1.Card)(function (_a) {
    var theme = _a.theme;
    return ({
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        aspectRatio: '16/9',
        boxShadow: theme.palette.mode === 'dark' ? '0 1px 3px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.palette.mode === 'dark' ? '0 4px 6px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
        },
    });
});
var ScreenshotImage = (0, material_1.styled)('img')(function () { return ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'all 0.2s ease',
}); });
var UploadButton = (0, material_1.styled)(material_1.Button)(function (_a) {
    var theme = _a.theme;
    return ({
        backgroundColor: theme.palette.primary.main,
        color: '#ffffff',
        padding: '8px 16px',
        textTransform: 'none',
        borderRadius: '8px',
        boxShadow: theme.palette.mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        fontSize: '13px',
        fontWeight: 500,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            boxShadow: theme.palette.mode === 'dark' ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
        },
        '&:active': {
            transform: 'translateY(0)',
            boxShadow: theme.palette.mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.1)',
        },
        '&.Mui-disabled': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#e0e0e0',
            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#9e9e9e',
            boxShadow: 'none',
        },
        '& .MuiButton-startIcon': {
            marginRight: '6px',
            '& .MuiSvgIcon-root': {
                fontSize: '18px',
            },
        },
    });
});
var EmptyStateContainer = (0, material_1.styled)(material_1.Paper)(function (_a) {
    var theme = _a.theme;
    return ({
        padding: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: '24px',
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.02)',
        border: "2px dashed ".concat(theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)'),
        minHeight: '400px',
        margin: theme.spacing(4),
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.03)',
            borderColor: theme.palette.primary.main,
        }
    });
});
var EmptyStateIcon = (0, material_1.styled)(icons_material_1.PhotoLibrary)(function (_a) {
    var theme = _a.theme;
    return ({
        fontSize: '96px',
        marginBottom: theme.spacing(3),
        color: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease',
        '${EmptyStateContainer}:hover &': {
            color: theme.palette.primary.main,
            transform: 'scale(1.1)',
        }
    });
});
var ScreenshotManager = function (_a) {
    var gameId = _a.gameId, gameName = _a.gameName;
    var language = (0, LanguageContext_1.useLanguage)().language;
    var _b = (0, react_1.useState)([]), screenshots = _b[0], setScreenshots = _b[1];
    var _c = (0, react_1.useState)(false), isUploading = _c[0], setIsUploading = _c[1];
    var _d = (0, react_1.useState)(0), uploadProgress = _d[0], setUploadProgress = _d[1];
    var _e = (0, react_1.useState)(false), isUploadDialogOpen = _e[0], setIsUploadDialogOpen = _e[1];
    var _f = (0, react_1.useState)(true), loading = _f[0], setLoading = _f[1];
    var _g = (0, react_1.useState)(null), error = _g[0], setError = _g[1];
    var _h = (0, react_1.useState)(false), showRestartAlert = _h[0], setShowRestartAlert = _h[1];
    var t = locales_1.translations[language];
    (0, react_1.useEffect)(function () {
        var loadScreenshots = function () { return __awaiter(void 0, void 0, void 0, function () {
            var userId, gameScreenshots, sortedScreenshots, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        setLoading(true);
                        setError(null);
                        return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-store-value', 'currentUserId')];
                    case 1:
                        userId = _a.sent();
                        console.log('Loading screenshots for game:', gameId, 'user:', userId);
                        return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-game-screenshots', gameId, userId)];
                    case 2:
                        gameScreenshots = _a.sent();
                        console.log('Loaded screenshots:', gameScreenshots);
                        if (gameScreenshots.length === 0) {
                            setError('未找到游戏截图');
                        }
                        sortedScreenshots = __spreadArray([], gameScreenshots, true).sort(function (a, b) {
                            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                        });
                        setScreenshots(sortedScreenshots);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error loading screenshots:', error_1);
                        setError('加载截图时出错');
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadScreenshots();
    }, [gameId]);
    var handleScreenshotClick = function (url) {
        window.open(url, '_blank');
    };
    var handleUpload = function (files) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, tempFiles, importedScreenshots, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (files.length === 0)
                        return [2 /*return*/];
                    setIsUploading(true);
                    setUploadProgress(0);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-store-value', 'currentUserId')];
                case 2:
                    userId = _a.sent();
                    return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(void 0, void 0, void 0, function () {
                            var arrayBuffer, buffer, tempPath;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, file.arrayBuffer()];
                                    case 1:
                                        arrayBuffer = _a.sent();
                                        buffer = Buffer.from(arrayBuffer);
                                        tempPath = path_1.default.join(os_1.default.tmpdir(), file.name);
                                        fs_1.default.writeFileSync(tempPath, buffer);
                                        return [2 /*return*/, tempPath];
                                }
                            });
                        }); }))];
                case 3:
                    tempFiles = _a.sent();
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke('import-screenshots', {
                            gameId: gameId,
                            userId: userId,
                            files: tempFiles
                        })];
                case 4:
                    importedScreenshots = _a.sent();
                    // 清理临时文件
                    tempFiles.forEach(function (tempPath) {
                        try {
                            fs_1.default.unlinkSync(tempPath);
                        }
                        catch (error) {
                            console.error('Error deleting temp file:', error);
                        }
                    });
                    // 更新截图列表
                    setScreenshots(__spreadArray(__spreadArray([], importedScreenshots, true), screenshots, true));
                    setError(null);
                    // 显示重启提示
                    setShowRestartAlert(true);
                    return [3 /*break*/, 7];
                case 5:
                    error_2 = _a.sent();
                    console.error('Error importing screenshots:', error_2);
                    setError('导入截图时出错');
                    return [3 /*break*/, 7];
                case 6:
                    setIsUploading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (<material_1.Box>
      <material_1.Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <SectionTitle>{gameName} - {t.screenshotManager.title}</SectionTitle>
        {!error && (<material_1.Box>
            <UploadButton variant="contained" startIcon={<icons_material_1.Add />} onClick={function () { return setIsUploadDialogOpen(true); }} disabled={isUploading}>
              {t.screenshotManager.addScreenshot}
            </UploadButton>
          </material_1.Box>)}
      </material_1.Box>

      {isUploading && (<material_1.Box sx={{ mb: 3 }}>
          <material_1.LinearProgress variant="determinate" value={uploadProgress}/>
          <material_1.Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t.screenshotManager.uploading} {uploadProgress}%
          </material_1.Typography>
        </material_1.Box>)}

      {loading && (<material_1.Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <material_1.LinearProgress sx={{ width: '100%' }}/>
        </material_1.Box>)}

      {error && (<EmptyStateContainer>
          <EmptyStateIcon />
          <material_1.Typography variant="h5" color="text.secondary" sx={{
                mb: 4,
                fontWeight: 500,
                letterSpacing: '0.5px',
                opacity: 0.8
            }}>
            {error}
          </material_1.Typography>
          <UploadButton variant="contained" size="large" startIcon={<icons_material_1.Add />} onClick={function () { return setIsUploadDialogOpen(true); }} disabled={isUploading} sx={{
                px: 4,
                py: 1.5,
                fontSize: '16px'
            }}>
            {t.screenshotManager.addScreenshot}
          </UploadButton>
        </EmptyStateContainer>)}

      {!loading && !error && (<material_1.Grid container spacing={2}>
          {screenshots.map(function (screenshot) { return (<material_1.Grid item xs={12} sm={6} md={4} lg={3} key={screenshot.id}>
              <ScreenshotCard onClick={function () { return handleScreenshotClick(screenshot.url); }}>
                <ScreenshotImage src={screenshot.url} alt={"Screenshot ".concat(screenshot.id)}/>
              </ScreenshotCard>
            </material_1.Grid>); })}
        </material_1.Grid>)}

      <material_1.Snackbar open={showRestartAlert} autoHideDuration={6000} onClose={function () { return setShowRestartAlert(false); }} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <material_1.Alert onClose={function () { return setShowRestartAlert(false); }} severity="info" variant="filled" sx={{
            backgroundColor: function (theme) { return theme.palette.mode === 'dark'
                ? 'rgba(96, 165, 250, 0.9)'
                : 'rgba(59, 130, 246, 0.9)'; },
            color: '#ffffff',
            borderRadius: '8px',
            boxShadow: function (theme) { return theme.palette.mode === 'dark'
                ? '0 4px 6px rgba(0,0,0,0.2)'
                : '0 4px 6px rgba(0,0,0,0.1)'; },
        }}>
          {t.screenshotManager.restartSteam}
        </material_1.Alert>
      </material_1.Snackbar>

      <UploadDialog_1.default open={isUploadDialogOpen} onClose={function () { return setIsUploadDialogOpen(false); }} onUpload={handleUpload}/>
    </material_1.Box>);
};
exports.default = ScreenshotManager;
