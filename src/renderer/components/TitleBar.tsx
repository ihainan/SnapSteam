import React from 'react';
import { Box, styled } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';

const TitleBarContainer = styled(Box)(({ theme }) => ({
  WebkitAppRegion: 'drag',
  height: '38px',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
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
});

const TitleBar: React.FC = () => {
  const { themeMode } = useTheme();

  return (
    <TitleBarContainer>
      <AppTitle>SnapSteam</AppTitle>
    </TitleBarContainer>
  );
};

export default TitleBar; 