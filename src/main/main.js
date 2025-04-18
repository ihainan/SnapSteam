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
var electron_1 = require("electron");
var path_1 = require("path");
var fs_1 = require("fs");
var url_1 = require("url");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
// 创建配置存储实例
var store;
function initializeStore() {
    return __awaiter(this, void 0, void 0, function () {
        var Store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('electron-store'); })];
                case 1:
                    Store = (_a.sent()).default;
                    store = new Store({
                        defaults: {
                            themeMode: 'system',
                            language: 'en',
                            steamPath: process.platform === 'darwin'
                                ? '~/Library/Application Support/Steam'
                                : process.platform === 'win32'
                                    ? 'C:\\Program Files (x86)\\Steam'
                                    : '~/.local/share/Steam'
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function createWindow() {
    var mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        icon: path_1.default.join(__dirname, '../../logo.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });
    mainWindow.loadFile(path_1.default.join(__dirname, '../index.html'));
    // 开发环境下打开开发者工具
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}
// 处理打开文件夹对话框的请求
electron_1.ipcMain.handle('open-directory-dialog', function () { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, electron_1.dialog.showOpenDialog({
                    properties: ['openDirectory'],
                    title: '选择 Steam 安装路径',
                    buttonLabel: '选择'
                })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); });
// 获取配置值
electron_1.ipcMain.on('get-store-value', function (event, key) {
    event.returnValue = store.get(key);
});
// 设置配置值
electron_1.ipcMain.on('set-store-value', function (event, _a) {
    var key = _a.key, value = _a.value;
    store.set(key, value);
});
// 验证 Steam 安装路径
electron_1.ipcMain.handle('validate-steam-path', function (_, steamPath) { return __awaiter(void 0, void 0, void 0, function () {
    var platform, isDataDir, isAppDir, requiredFiles, files;
    return __generator(this, function (_a) {
        try {
            // 检查路径是否存在
            if (!fs_1.default.existsSync(steamPath)) {
                return [2 /*return*/, false];
            }
            platform = process.platform;
            if (platform === 'darwin') {
                isDataDir = fs_1.default.existsSync(path_1.default.join(steamPath, 'steamapps')) &&
                    fs_1.default.existsSync(path_1.default.join(steamPath, 'userdata'));
                isAppDir = steamPath.endsWith('Steam.app') &&
                    fs_1.default.existsSync(path_1.default.join(steamPath, 'Contents', 'MacOS', 'steam'));
                return [2 /*return*/, isDataDir || isAppDir];
            }
            else {
                requiredFiles = {
                    win32: ['steam.exe', 'steamapps'],
                    linux: ['steam', 'steamapps']
                };
                files = requiredFiles[platform];
                if (!files)
                    return [2 /*return*/, false];
                // 检查所有必需的文件/文件夹是否存在
                return [2 /*return*/, files.every(function (file) {
                        var fullPath = path_1.default.join(steamPath, file);
                        return fs_1.default.existsSync(fullPath);
                    })];
            }
        }
        catch (error) {
            console.error('Error validating Steam path:', error);
            return [2 /*return*/, false];
        }
        return [2 /*return*/];
    });
}); });
electron_1.app.whenReady().then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, initializeStore()];
            case 1:
                _a.sent();
                createWindow();
                electron_1.app.on('activate', function () {
                    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
                        createWindow();
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
