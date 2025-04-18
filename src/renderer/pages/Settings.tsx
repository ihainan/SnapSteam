import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, styled, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Alert } from '@mui/material';
import { Folder } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales';
import { ipcRenderer } from 'electron';

const defaultSteamPath = process.platform === 'darwin' 
  ? '~/Library/Application Support/Steam'
  : process.platform === 'win32'
  ? 'C:\\Program Files (x86)\\Steam\\userdata'
  : '~/.local/share/Steam/userdata';

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
  const { language, setLanguage } = useLanguage();
  const [steamPath, setSteamPath] = useState(defaultSteamPath);
  const [pathError, setPathError] = useState<string | null>(null);
  const [isPathValid, setIsPathValid] = useState<boolean | null>(null);

  // 从主进程加载保存的配置
  useEffect(() => {
    const loadSettings = async () => {
      const savedTheme = await ipcRenderer.invoke('get-store-value', 'themeMode');
      const savedLanguage = await ipcRenderer.invoke('get-store-value', 'language');
      const savedSteamPath = await ipcRenderer.invoke('get-store-value', 'steamPath');
      
      if (savedTheme) setThemeMode(savedTheme);
      if (savedLanguage) setLanguage(savedLanguage);
      if (savedSteamPath) {
        setSteamPath(savedSteamPath);
        const isValid = await ipcRenderer.invoke('validate-steam-path', savedSteamPath);
        setIsPathValid(isValid);
      }
    };
    
    loadSettings();
  }, [setThemeMode, setLanguage]);

  const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSteamPath(event.target.value);
    setPathError(null);
  };

  const handleThemeChange = (event: SelectChangeEvent) => {
    const newTheme = event.target.value as 'light' | 'dark' | 'system';
    setThemeMode(newTheme);
    ipcRenderer.send('set-store-value', { key: 'themeMode', value: newTheme });
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    const newLanguage = event.target.value as 'zh' | 'en';
    setLanguage(newLanguage);
    ipcRenderer.send('set-store-value', { key: 'language', value: newLanguage });
  };

  const handleBrowse = async () => {
    try {
      const result = await ipcRenderer.invoke('open-directory-dialog');
      if (!result.canceled && result.filePaths.length > 0) {
        const selectedPath = result.filePaths[0];
        const isValid = await ipcRenderer.invoke('validate-steam-path', selectedPath);
        
        if (isValid) {
          setSteamPath(selectedPath);
          setPathError(null);
          ipcRenderer.send('set-store-value', { key: 'steamPath', value: selectedPath });
        } else {
          setPathError(t.settings.pathError);
        }
      }
    } catch (error) {
      console.error('Error opening directory dialog:', error);
      setPathError(t.settings.dialogError);
    }
  };

  const t = translations[language];

  return (
    <Box>
      <SectionTitle>{t.settings.title}</SectionTitle>
      <Box sx={{ mb: 4 }}>
        <SubTitle>{t.settings.steamPath}</SubTitle>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <StyledTextField
            fullWidth
            value={steamPath}
            onChange={handlePathChange}
            error={!!pathError}
            helperText={pathError || t.settings.pathHelper}
          />
          <StyledButton
            variant="contained"
            startIcon={<Folder />}
            onClick={handleBrowse}
          >
            {t.settings.browse}
          </StyledButton>
        </Box>
        {!isPathValid && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t.settings.pathWarning}
          </Alert>
        )}
      </Box>

      <Box sx={{ maxWidth: 800 }}>
        <SubTitle>
          {t.settings.appearance}
        </SubTitle>
        
        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
          <InputLabel>{t.settings.theme}</InputLabel>
          <Select
            value={themeMode}
            label={t.settings.theme}
            onChange={handleThemeChange}
          >
            <MenuItem value="system">{t.settings.themeOptions.system}</MenuItem>
            <MenuItem value="light">{t.settings.themeOptions.light}</MenuItem>
            <MenuItem value="dark">{t.settings.themeOptions.dark}</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
          <InputLabel>{t.settings.language}</InputLabel>
          <Select
            value={language}
            label={t.settings.language}
            onChange={handleLanguageChange}
          >
            <MenuItem value="zh">{t.settings.languageOptions.zh}</MenuItem>
            <MenuItem value="en">{t.settings.languageOptions.en}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Settings; 