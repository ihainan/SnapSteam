"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var ScreenshotManager_1 = require("./ScreenshotManager");
var ScreenshotManagerRoute = function (_a) {
    var games = _a.games;
    var gameId = (0, react_router_dom_1.useParams)().gameId;
    var game = games.find(function (g) { return g.id === parseInt(gameId || '0'); });
    return (<ScreenshotManager_1.default gameId={parseInt(gameId || '0')} gameName={(game === null || game === void 0 ? void 0 : game.name) || 'Unknown Game'}/>);
};
exports.default = ScreenshotManagerRoute;
