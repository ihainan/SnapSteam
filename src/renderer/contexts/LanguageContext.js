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
exports.LanguageProvider = exports.useLanguage = void 0;
var react_1 = require("react");
var ipcRenderer = window.require('electron').ipcRenderer;
var LanguageContext = (0, react_1.createContext)(undefined);
var normalizeLanguage = function (lang) {
    return lang.startsWith('zh') ? 'zh' : 'en';
};
var useLanguage = function () {
    var context = (0, react_1.useContext)(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
exports.useLanguage = useLanguage;
var LanguageProvider = function (_a) {
    var children = _a.children;
    console.log('LanguageProvider mounted');
    var _b = (0, react_1.useState)('en'), language = _b[0], setLanguageState = _b[1];
    (0, react_1.useEffect)(function () {
        console.log('Loading language...');
        // 从主进程加载保存的语言配置
        var loadLanguage = function () { return __awaiter(void 0, void 0, void 0, function () {
            var savedLanguage, normalizedLanguage_1, systemLanguage, normalizedLanguage, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('Invoking get-store-value...');
                        return [4 /*yield*/, ipcRenderer.invoke('get-store-value', 'language')];
                    case 1:
                        savedLanguage = _a.sent();
                        console.log('Saved language:', savedLanguage);
                        if (savedLanguage) {
                            normalizedLanguage_1 = normalizeLanguage(savedLanguage);
                            console.log('Setting normalized language:', normalizedLanguage_1);
                            setLanguageState(normalizedLanguage_1);
                            return [2 /*return*/];
                        }
                        systemLanguage = navigator.language.toLowerCase();
                        console.log('System language:', systemLanguage);
                        normalizedLanguage = normalizeLanguage(systemLanguage);
                        console.log('Setting normalized language:', normalizedLanguage);
                        setLanguageState(normalizedLanguage);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Failed to load language:', error_1);
                        // 如果出错，使用默认语言
                        setLanguageState('en');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        loadLanguage();
    }, []);
    var setLanguage = function (newLanguage) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ipcRenderer.invoke('set-store-value', { key: 'language', value: newLanguage })];
                case 1:
                    _a.sent();
                    setLanguageState(newLanguage);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Failed to set language:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    console.log('Current language:', language);
    return (<LanguageContext.Provider value={{ language: language, setLanguage: setLanguage }}>
      {children}
    </LanguageContext.Provider>);
};
exports.LanguageProvider = LanguageProvider;
