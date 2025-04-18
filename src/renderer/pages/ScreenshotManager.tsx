import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  LinearProgress,
  styled,
  Paper,
} from '@mui/material';
import { Add as AddIcon, PhotoLibrary as PhotoLibraryIcon } from '@mui/icons-material';
import UploadDialog from '../components/UploadDialog';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales';
import { ipcRenderer } from 'electron';
import path from 'path';
import os from 'os';
import fs from 'fs';

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '24px',
  fontWeight: 600,
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ScreenshotCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'all 0.2s ease',
  aspectRatio: '16/9',
  boxShadow: theme.palette.mode === 'dark' ? '0 1px 3px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark' ? '0 4px 6px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  },
}));

const ScreenshotImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'all 0.2s ease',
}));

const UploadButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#ffffff',
  padding: '8px 16px',
  textTransform: 'none',
  borderRadius: '8px',
  boxShadow: theme.palette.mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  fontSize: '13px',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.palette.mode === 'dark' ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.15)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: theme.palette.mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.1)',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#e0e0e0',
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#9e9e9e',
    boxShadow: 'none',
  },
  '& .MuiButton-startIcon': {
    marginRight: '6px',
    '& .MuiSvgIcon-root': {
      fontSize: '18px',
    },
  },
})) as typeof Button;

const EmptyStateContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  borderRadius: '24px',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.02)',
  border: `2px dashed ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'}`,
  minHeight: '400px',
  margin: theme.spacing(4),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.03)',
    borderColor: theme.palette.primary.main,
  }
}));

const EmptyStateIcon = styled(PhotoLibraryIcon)(({ theme }) => ({
  fontSize: '96px',
  marginBottom: theme.spacing(3),
  color: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  '${EmptyStateContainer}:hover &': {
    color: theme.palette.primary.main,
    transform: 'scale(1.1)',
  }
}));

interface ScreenshotManagerProps {
  gameId: number;
  gameName: string;
}

const ScreenshotManager: React.FC<ScreenshotManagerProps> = ({ gameId, gameName }) => {
  const { language } = useLanguage();
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];

  useEffect(() => {
    const loadScreenshots = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = await ipcRenderer.invoke('get-store-value', 'currentUserId');
        console.log('Loading screenshots for game:', gameId, 'user:', userId);
        
        const gameScreenshots = await ipcRenderer.invoke('get-game-screenshots', gameId, userId);
        console.log('Loaded screenshots:', gameScreenshots);
        
        if (gameScreenshots.length === 0) {
          setError('未找到游戏截图');
        }
        
        // 按时间倒序排序
        const sortedScreenshots = [...gameScreenshots].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setScreenshots(sortedScreenshots);
      } catch (error) {
        console.error('Error loading screenshots:', error);
        setError('加载截图时出错');
      } finally {
        setLoading(false);
      }
    };

    loadScreenshots();
  }, [gameId]);

  const handleScreenshotClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const userId = await ipcRenderer.invoke('get-store-value', 'currentUserId');
      
      // 将文件保存到临时目录
      const tempFiles = await Promise.all(files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const tempPath = path.join(os.tmpdir(), file.name);
        fs.writeFileSync(tempPath, buffer);
        return tempPath;
      }));

      // 调用主进程导入截图
      const importedScreenshots = await ipcRenderer.invoke('import-screenshots', {
        gameId,
        userId,
        files: tempFiles
      });

      // 清理临时文件
      tempFiles.forEach(tempPath => {
        try {
          fs.unlinkSync(tempPath);
        } catch (error) {
          console.error('Error deleting temp file:', error);
        }
      });

      // 更新截图列表
      setScreenshots([...importedScreenshots, ...screenshots]);
      setError(null);
    } catch (error) {
      console.error('Error importing screenshots:', error);
      setError('导入截图时出错');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <SectionTitle>{gameName} - {t.screenshotManager.title}</SectionTitle>
        {!error && (
          <Box>
            <UploadButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsUploadDialogOpen(true)}
              disabled={isUploading}
            >
              {t.screenshotManager.addScreenshot}
            </UploadButton>
          </Box>
        )}
      </Box>

      {isUploading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t.screenshotManager.uploading} {uploadProgress}%
          </Typography>
        </Box>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      )}

      {error && (
        <EmptyStateContainer>
          <EmptyStateIcon />
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              mb: 4,
              fontWeight: 500,
              letterSpacing: '0.5px',
              opacity: 0.8
            }}
          >
            {error}
          </Typography>
          <UploadButton
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setIsUploadDialogOpen(true)}
            disabled={isUploading}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '16px'
            }}
          >
            {t.screenshotManager.addScreenshot}
          </UploadButton>
        </EmptyStateContainer>
      )}

      {!loading && !error && (
        <Grid container spacing={2}>
          {screenshots.map((screenshot) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={screenshot.id}>
              <ScreenshotCard onClick={() => handleScreenshotClick(screenshot.url)}>
                <ScreenshotImage
                  src={screenshot.url}
                  alt={`Screenshot ${screenshot.id}`}
                />
              </ScreenshotCard>
            </Grid>
          ))}
        </Grid>
      )}

      <UploadDialog
        open={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleUpload}
      />
    </Box>
  );
};

export default ScreenshotManager; 