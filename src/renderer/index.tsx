import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <Router>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Router>
); 