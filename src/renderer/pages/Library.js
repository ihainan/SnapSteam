"use strict";
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
var Favorite_1 = require("@mui/icons-material/Favorite");
var Refresh_1 = require("@mui/icons-material/Refresh");
var react_router_dom_1 = require("react-router-dom");
var LanguageContext_1 = require("../contexts/LanguageContext");
var locales_1 = require("../locales");
var electron_1 = require("electron");
var GameCard = (0, material_1.styled)(material_1.Card)(function (_a) {
    var theme = _a.theme;
    return ({
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        transition: 'all 0.2s ease',
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 1px 3px rgba(0,0,0,0.2)'
            : '0 1px 3px rgba(0,0,0,0.1)',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.palette.mode === 'dark'
                ? '0 4px 6px rgba(0,0,0,0.3)'
                : '0 4px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            '& .MuiCardMedia-root': {
                filter: 'brightness(1.05)',
            },
        },
    });
});
var GameTitle = (0, material_1.styled)(material_1.Typography)(function () { return ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '24px 12px 8px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: 1.3,
    color: '#ffffff',
}); });
var FavoriteButton = (0, material_1.styled)(material_1.Box)(function (_a) {
    var favorite = _a.favorite;
    return ({
        position: 'absolute',
        top: 8,
        right: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backdropFilter: 'blur(8px)',
        backgroundColor: favorite === 'true' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        border: "1px solid ".concat(favorite === 'true' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.3)'),
        color: favorite === 'true' ? '#ef4444' : '#ffffff',
        opacity: 0.9,
        transition: 'all 0.2s ease',
        '&:hover': {
            opacity: 1,
            backgroundColor: favorite === 'true' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.2)',
            border: "1px solid ".concat(favorite === 'true' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.5)'),
            transform: 'scale(1.05)',
        },
    });
});
var SectionTitle = (0, material_1.styled)(material_1.Typography)(function (_a) {
    var theme = _a.theme;
    return ({
        color: theme.palette.text.primary,
        fontSize: '16px',
        fontWeight: 600,
        marginBottom: '12px',
        paddingBottom: '4px',
        paddingLeft: '8px',
        borderBottom: "1px solid ".concat(theme.palette.divider),
    });
});
var Section = (0, material_1.styled)(material_1.Box)(function () { return ({
    marginBottom: '20px',
    '&:last-child': {
        marginBottom: 0,
    },
}); });
var GamesGrid = (0, material_1.styled)(material_1.Box)(function () { return ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
    padding: '0 8px',
}); });
var EmptyFavorites = (0, material_1.styled)(material_1.Box)(function (_a) {
    var theme = _a.theme;
    return ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '8px',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 1px 3px rgba(0,0,0,0.2)'
            : '0 1px 3px rgba(0,0,0,0.1)',
        '& .MuiSvgIcon-root': {
            fontSize: 48,
            marginBottom: 16,
            opacity: 0.5,
        },
    });
});
var EmptyText = (0, material_1.styled)(material_1.Typography)(function (_a) {
    var theme = _a.theme;
    return ({
        fontSize: '14px',
        textAlign: 'center',
        lineHeight: 1.5,
        color: theme.palette.text.secondary,
        whiteSpace: 'pre-line',
    });
});
var RefreshButton = (0, material_1.styled)(material_1.Fab)(function (_a) {
    var theme = _a.theme;
    return ({
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            transform: 'translateY(-2px)',
            boxShadow: theme.palette.mode === 'dark'
                ? '0 6px 16px rgba(0, 0, 0, 0.4)'
                : '0 6px 16px rgba(0, 0, 0, 0.2)',
        },
        '&:active': {
            transform: 'translateY(0)',
            boxShadow: theme.palette.mode === 'dark'
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
        '& .MuiSvgIcon-root': {
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '&:hover .MuiSvgIcon-root': {
            transform: 'rotate(180deg)',
        },
    });
});
var Library = function (_a) {
    var searchTerm = _a.searchTerm, games = _a.games, setGames = _a.setGames;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var language = (0, LanguageContext_1.useLanguage)().language;
    var t = locales_1.translations[language];
    var filteredGames = games.filter(function (game) {
        return game.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    var favorites = filteredGames.filter(function (game) { return game.favorite; });
    var nonFavorites = filteredGames.filter(function (game) { return !game.favorite; });
    // 获取最近游玩的游戏（按 lastPlayed 时间倒序排序）
    var recentlyPlayed = __spreadArray([], filteredGames, true).filter(function (game) {
        if (!game.lastPlayed || game.lastPlayed <= 0)
            return false;
        // 计算三个月前的时间戳（以秒为单位）
        var threeMonthsAgo = Math.floor(Date.now() / 1000) - (90 * 24 * 60 * 60);
        return game.lastPlayed >= threeMonthsAgo;
    })
        .sort(function (a, b) { return (b.lastPlayed || 0) - (a.lastPlayed || 0); })
        .slice(0, 3);
    var handleGameClick = function (gameId, gameName) {
        navigate("/screenshots/".concat(gameId));
    };
    var handleFavoriteClick = function (event, gameId) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedGames, userId, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    event.stopPropagation(); // 阻止事件冒泡到卡片
                    updatedGames = games.map(function (game) {
                        return game.id === gameId
                            ? __assign(__assign({}, game), { favorite: !game.favorite }) : game;
                    });
                    setGames(updatedGames);
                    userId = (_a = games[0]) === null || _a === void 0 ? void 0 : _a.userId;
                    if (!userId) return [3 /*break*/, 4];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke('set-store-value', {
                            key: "userGames_".concat(userId),
                            value: updatedGames
                        })];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error('Error saving favorite status:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleRefreshGames = function () { return __awaiter(void 0, void 0, void 0, function () {
        var userId, userGames, savedGames_1, mergedGames;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    userId = (_a = games[0]) === null || _a === void 0 ? void 0 : _a.userId;
                    if (!userId) return [3 /*break*/, 3];
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-user-games', userId)];
                case 1:
                    userGames = _b.sent();
                    return [4 /*yield*/, electron_1.ipcRenderer.invoke('get-store-value', "userGames_".concat(userId))];
                case 2:
                    savedGames_1 = _b.sent();
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
                    _b.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var renderGameCard = function (game) { return (<GameCard key={game.id} onClick={function () { return handleGameClick(game.id, game.name); }}>
      <material_1.CardMedia component="img" height="120" image={game.coverUrl} alt={game.name}/>
      <GameTitle>{game.name}</GameTitle>
      <FavoriteButton favorite={game.favorite.toString()} onClick={function (e) { return handleFavoriteClick(e, game.id); }}>
        <Favorite_1.default sx={{ fontSize: 18 }}/>
      </FavoriteButton>
    </GameCard>); };
    return (<material_1.Box>
      {recentlyPlayed.length > 0 && (<Section>
          <SectionTitle>{t.library.recentlyPlayed}</SectionTitle>
          <GamesGrid>
            {recentlyPlayed.map(function (game) { return (<GameCard key={game.id} onClick={function () { return handleGameClick(game.id, game.name); }}>
                <material_1.CardMedia component="img" height="120" image={game.coverUrl} alt={game.name}/>
                <GameTitle>{game.name}</GameTitle>
              </GameCard>); })}
          </GamesGrid>
        </Section>)}

      <Section>
        <SectionTitle>{t.library.favorites}</SectionTitle>
        {favorites.length > 0 ? (<GamesGrid>
            {favorites.map(renderGameCard)}
          </GamesGrid>) : (<EmptyFavorites>
            <Favorite_1.default />
            <EmptyText>
              {t.library.emptyFavorites}
            </EmptyText>
          </EmptyFavorites>)}
      </Section>

      <Section>
        <SectionTitle>{t.library.allGames}</SectionTitle>
        <GamesGrid>
          {nonFavorites.map(renderGameCard)}
        </GamesGrid>
      </Section>

      <RefreshButton onClick={handleRefreshGames} title={t.library.refresh}>
        <Refresh_1.default />
      </RefreshButton>
    </material_1.Box>);
};
exports.default = Library;
