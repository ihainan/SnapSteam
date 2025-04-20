import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, styled, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Link, Card, CardContent, IconButton, Divider } from '@mui/material';
import { Folder, Info, GitHub, Person, Code, Delete } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales';
import { ipcRenderer } from 'electron';
import { app } from 'electron';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

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

const AboutCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  marginTop: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const AboutContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  cursor: 'pointer',
}));

const AboutIcon = styled(Info)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
  fontSize: 32,
}));

const AboutText = styled(Box)({
  flex: 1,
});

const AboutDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: 500,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(2),
  },
}));

const AboutDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

const AboutDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
  },
}));

const Settings: React.FC = () => {
  const { themeMode, setThemeMode } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [steamPath, setSteamPath] = useState<string>('');
  const [pathError, setPathError] = useState<string | null>(null);
  const [isPathValid, setIsPathValid] = useState<boolean | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  const [showPathError, setShowPathError] = useState<boolean>(false);
  const [showPathWarning, setShowPathWarning] = useState<boolean>(false);
  const [isClearingCache, setIsClearingCache] = useState<boolean>(false);
  const [showClearCacheDialog, setShowClearCacheDialog] = useState(false);
  const navigate = useNavigate();

  // 从主进程加载保存的配置
  useEffect(() => {
    const loadSettings = async () => {
      const savedTheme = await ipcRenderer.invoke('get-store-value', 'themeMode');
      const savedLanguage = await ipcRenderer.invoke('get-store-value', 'language');
      const savedSteamPath = await ipcRenderer.invoke('get-store-value', 'steamPath');
      const version = await ipcRenderer.invoke('get-app-version');
      
      if (savedTheme) setThemeMode(savedTheme);
      if (savedLanguage) setLanguage(savedLanguage);
      if (savedSteamPath) {
        setSteamPath(savedSteamPath);
        const isValid = await ipcRenderer.invoke('validate-steam-path', savedSteamPath);
        setIsPathValid(isValid);
      }
      setAppVersion(version);
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

  const handleClearCache = async () => {
    try {
      setIsClearingCache(true);
      const success = await ipcRenderer.invoke('clear-cover-cache');
      if (success) {
        // 重新加载页面
        window.location.reload();
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    } finally {
      setIsClearingCache(false);
      setShowClearCacheDialog(false);
    }
  };

  const t = translations[language];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {t.settings.title}
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t.settings.appearance}
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
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

        <FormControl fullWidth>
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

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t.settings.steamPath}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            value={steamPath}
            onChange={handlePathChange}
            error={showPathError}
            helperText={showPathError ? t.settings.pathError : t.settings.pathHelper}
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleBrowse}
            sx={{ 
              minWidth: '100px',
              height: '40px',
              mt: '1px'
            }}
          >
            {t.settings.browse}
          </Button>
        </Box>
        
        {showPathWarning && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t.settings.pathWarning}
          </Alert>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t.settings.cache.title}
        </Typography>
        
        <Button
          variant="outlined"
          color="error"
          onClick={() => setShowClearCacheDialog(true)}
          disabled={isClearingCache}
          startIcon={isClearingCache ? <CircularProgress size={20} /> : <Delete />}
        >
          {isClearingCache ? t.settings.cache.clearing : t.settings.cache.clear}
        </Button>
      </Box>

      <AboutCard onClick={() => setAboutOpen(true)}>
        <AboutContent>
          <AboutIcon />
          <AboutText>
            <Typography variant="h6" component="div">
              {t.settings.about}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t.settings.aboutContent.version}: {appVersion}
            </Typography>
          </AboutText>
        </AboutContent>
      </AboutCard>

      <AboutDialog
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
      >
        <AboutDialogTitle>
          <Info />
          {t.settings.about}
        </AboutDialogTitle>
        <Divider />
        <AboutDialogContent>
          <InfoItem>
            <Code />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t.settings.aboutContent.version}
              </Typography>
              <Typography variant="body1">
                {appVersion}
              </Typography>
            </Box>
          </InfoItem>
          <InfoItem>
            <Person />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t.settings.aboutContent.author}
              </Typography>
              <Typography variant="body1">
                ihainan
              </Typography>
            </Box>
          </InfoItem>
          <InfoItem>
            <GitHub />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t.settings.aboutContent.github}
              </Typography>
              <Link 
                href="https://github.com/ihainan/SnapSteam" 
                target="_blank" 
                rel="noopener"
                underline="hover"
              >
                https://github.com/ihainan/SnapSteam
              </Link>
            </Box>
          </InfoItem>
        </AboutDialogContent>
        <DialogActions>
          <Button 
            onClick={() => setAboutOpen(false)}
            variant="contained"
            color="primary"
          >
            {t.settings.close}
          </Button>
        </DialogActions>
      </AboutDialog>

      <Dialog
        open={showClearCacheDialog}
        onClose={() => !isClearingCache && setShowClearCacheDialog(false)}
      >
        <DialogTitle>
          {t.settings.cache.confirm.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t.settings.cache.confirm.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowClearCacheDialog(false)}
            disabled={isClearingCache}
          >
            {t.settings.cache.confirm.cancel}
          </Button>
          <Button 
            onClick={handleClearCache}
            color="error"
            disabled={isClearingCache}
          >
            {t.settings.cache.confirm.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 