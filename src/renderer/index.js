"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var client_1 = require("react-dom/client");
var react_router_dom_1 = require("react-router-dom");
var ThemeContext_1 = require("./contexts/ThemeContext");
var LanguageContext_1 = require("./contexts/LanguageContext");
var App_1 = require("./App");
var container = document.getElementById('root');
var root = (0, client_1.createRoot)(container);
root.render(<react_router_dom_1.HashRouter>
    <ThemeContext_1.ThemeProvider>
      <LanguageContext_1.LanguageProvider>
        <App_1.default />
      </LanguageContext_1.LanguageProvider>
    </ThemeContext_1.ThemeProvider>
  </react_router_dom_1.HashRouter>);
