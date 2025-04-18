import React, { useState } from 'react';
import { Box, TextField, Typography, Button, styled, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Folder } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const defaultSteamPath = process.platform === 'darwin' 
  ? '~/Library/Application Support/Steam'
  : process.platform === 'win32'
  ? 'C:\\Program Files (x86)\\Steam'
  : '~/.local/share/Steam';

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '24px',
  fontWeight: 600,
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '14px',
  marginBottom: '12px',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#ffffff',
  padding: '6px 16px',
  height: '40px',
  minWidth: '100px',
  whiteSpace: 'nowrap',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '& .MuiButton-startIcon': {
    marginRight: '4px',
  },
}));

const Settings: React.FC = () => {
  const { themeMode, setThemeMode } = useTheme();
  const [steamPath, setSteamPath] = useState(defaultSteamPath);

  const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSteamPath(event.target.value);
  };

  const handleThemeChange = (event: SelectChangeEvent) => {
    setThemeMode(event.target.value as 'light' | 'dark' | 'system');
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
          外观
        </SubTitle>
        
        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
          <InputLabel>主题</InputLabel>
          <Select
            value={themeMode}
            label="主题"
            onChange={handleThemeChange}
          >
            <MenuItem value="system">跟随系统</MenuItem>
            <MenuItem value="light">亮色</MenuItem>
            <MenuItem value="dark">暗色</MenuItem>
          </Select>
        </FormControl>

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