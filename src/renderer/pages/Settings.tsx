import React, { useState } from 'react';
import { Box, TextField, Typography, Button, styled } from '@mui/material';
import { Folder } from '@mui/icons-material';

const defaultSteamPath = process.platform === 'darwin' 
  ? '~/Library/Application Support/Steam'
  : process.platform === 'win32'
  ? 'C:\\Program Files (x86)\\Steam'
  : '~/.local/share/Steam';

const SectionTitle = styled(Typography)(() => ({
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 500,
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
}));

const SubTitle = styled(Typography)(() => ({
  color: '#959da6',
  fontSize: '14px',
  marginBottom: '12px',
}));

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    backgroundColor: '#2a475e',
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.1)',
    },
    '&:hover fieldset': {
      borderColor: '#66c0f4',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#66c0f4',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#959da6',
    '&.Mui-focused': {
      color: '#66c0f4',
    },
  },
}));

const StyledButton = styled(Button)(() => ({
  backgroundColor: '#2a475e',
  color: '#ffffff',
  padding: '6px 16px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#66c0f4',
  },
}));

const Settings: React.FC = () => {
  const [steamPath, setSteamPath] = useState(defaultSteamPath);

  const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSteamPath(event.target.value);
  };

  const handleBrowse = () => {
    // TODO: 实现文件夹选择功能
    console.log('Browse for Steam folder');
  };

  return (
    <Box>
      <SectionTitle>Settings</SectionTitle>

      <Box sx={{ maxWidth: 800 }}>
        <SubTitle>
          Steam Installation
        </SubTitle>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <StyledTextField
            fullWidth
            size="small"
            placeholder="Steam installation path"
            value={steamPath}
            onChange={handlePathChange}
          />
          <StyledButton
            variant="contained"
            onClick={handleBrowse}
            startIcon={<Folder />}
          >
            Browse
          </StyledButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings; 