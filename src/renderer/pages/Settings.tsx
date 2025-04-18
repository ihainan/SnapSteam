import React, { useState } from 'react';
import { Box, TextField, Typography, Button, styled } from '@mui/material';
import { Folder } from '@mui/icons-material';

const defaultSteamPath = process.platform === 'darwin' 
  ? '~/Library/Application Support/Steam'
  : process.platform === 'win32'
  ? 'C:\\Program Files (x86)\\Steam'
  : '~/.local/share/Steam';

const SectionTitle = styled(Typography)(() => ({
  color: '#333333',
  fontSize: '24px',
  fontWeight: 500,
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid #e0e0e0',
}));

const SubTitle = styled(Typography)(() => ({
  color: '#666666',
  fontSize: '14px',
  marginBottom: '12px',
}));

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    color: '#333333',
    backgroundColor: '#f5f5f5',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#4285f4',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4285f4',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    '&.Mui-focused': {
      color: '#4285f4',
    },
  },
}));

const StyledButton = styled(Button)(() => ({
  backgroundColor: '#4285f4',
  color: '#ffffff',
  padding: '6px 16px',
  height: '40px',
  minWidth: '100px',
  whiteSpace: 'nowrap',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#3367d6',
  },
  '& .MuiButton-startIcon': {
    marginRight: '4px',
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
      <SectionTitle>设置</SectionTitle>

      <Box sx={{ maxWidth: 800 }}>
        <SubTitle>
          Steam 安装路径
        </SubTitle>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <StyledTextField
            fullWidth
            size="small"
            placeholder="Steam 安装路径"
            value={steamPath}
            onChange={handlePathChange}
          />
          <StyledButton
            variant="contained"
            onClick={handleBrowse}
            startIcon={<Folder />}
          >
            浏览
          </StyledButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings; 