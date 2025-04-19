import React from 'react';
import { Box, IconButton, styled } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';
import { Close, Remove, Fullscreen, FullscreenExit } from '@mui/icons-material';
import { ipcRenderer } from 'electron';

const TitleBarContainer = styled(Box)(({ theme }) => ({
  WebkitAppRegion: 'drag',
  height: '32px',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  padding: process.platform === 'darwin' ? '0 16px' : '0 12px',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const AppTitle = styled('div')({
  fontSize: '13px',
  fontWeight: 500,
  marginLeft: '8px',
  color: 'inherit',
  flex: 1,
});

const WindowControls = styled(Box)({
  WebkitAppRegion: 'no-drag',
  display: 'flex',
  alignItems: 'center',
});

const WindowButton = styled(IconButton)(({ theme }) => ({
  padding: 6,
  borderRadius: 0,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 18,
  },
}));

const CloseButton = styled(WindowButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#e81123',
    color: 'white',
  },
}));

const TitleBar: React.FC = () => {
  const { themeMode } = useTheme();
  const [isMaximized, setIsMaximized] = React.useState(false);

  React.useEffect(() => {
    const updateMaximizedState = async () => {
      const maximized = await ipcRenderer.invoke('is-maximized');
      setIsMaximized(maximized);
    };

    updateMaximizedState();
    ipcRenderer.on('window-state-changed', updateMaximizedState);

    return () => {
      ipcRenderer.removeAllListeners('window-state-changed');
    };
  }, []);

  const handleMinimize = () => {
    ipcRenderer.send('window-control', 'minimize');
  };

  const handleMaximize = () => {
    ipcRenderer.send('window-control', 'maximize');
  };

  const handleClose = () => {
    ipcRenderer.send('window-control', 'close');
  };

  return (
    <TitleBarContainer>
      <AppTitle>SnapSteam</AppTitle>
      {process.platform === 'win32' && (
        <WindowControls>
          <WindowButton onClick={handleMinimize} size="small">
            <Remove />
          </WindowButton>
          <WindowButton onClick={handleMaximize} size="small">
            {isMaximized ? <FullscreenExit /> : <Fullscreen />}
          </WindowButton>
          <CloseButton onClick={handleClose} size="small">
            <Close />
          </CloseButton>
        </WindowControls>
      )}
    </TitleBarContainer>
  );
};

export default TitleBar; 