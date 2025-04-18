import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  LinearProgress,
  styled,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import UploadDialog from '../components/UploadDialog';

// 使用实际截图数据
const mockScreenshots = [
  {
    id: 1,
    url: './samples/image_01.png',
    timestamp: '2024-03-15T10:30:00',
  },
  {
    id: 2,
    url: './samples/image_02.png',
    timestamp: '2024-03-14T15:45:00',
  },
  {
    id: 3,
    url: './samples/image_03.png',
    timestamp: '2024-03-13T09:20:00',
  },
];

const SectionTitle = styled(Typography)(() => ({
  color: '#2c3e50',
  fontSize: '24px',
  fontWeight: 600,
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid #e0e0e0',
}));

const ScreenshotCard = styled(Card)(() => ({
  position: 'relative',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'all 0.2s ease',
  aspectRatio: '16/9',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  },
}));

const ScreenshotImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'all 0.2s ease',
}));

const UploadButton = styled(Button)(() => ({
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  padding: '8px 16px',
  textTransform: 'none',
  borderRadius: '8px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  fontSize: '13px',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#2563eb',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  '&.Mui-disabled': {
    backgroundColor: '#e0e0e0',
    color: '#9e9e9e',
    boxShadow: 'none',
  },
  '& .MuiButton-startIcon': {
    marginRight: '6px',
    '& .MuiSvgIcon-root': {
      fontSize: '18px',
    },
  },
})) as typeof Button;

interface ScreenshotManagerProps {
  gameId: number;
  gameName: string;
}

const ScreenshotManager: React.FC<ScreenshotManagerProps> = ({ gameId, gameName }) => {
  const [screenshots, setScreenshots] = useState(mockScreenshots);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleScreenshotClick = (url: string) => {
    // 使用系统图片浏览器打开
    window.open(url, '_blank');
  };

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // 模拟上传进度
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    // 模拟添加新截图
    const newScreenshots = files.map((file, index) => ({
      id: screenshots.length + index + 1,
      url: URL.createObjectURL(file),
      timestamp: new Date().toISOString(),
    }));

    setScreenshots([...newScreenshots, ...screenshots]);
    setIsUploading(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <SectionTitle>{gameName} - 截图</SectionTitle>
        <Box>
          <UploadButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsUploadDialogOpen(true)}
            disabled={isUploading}
          >
            添加截图
          </UploadButton>
        </Box>
      </Box>

      {isUploading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            上传中... {uploadProgress}%
          </Typography>
        </Box>
      )}

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

      <UploadDialog
        open={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleUpload}
      />
    </Box>
  );
};

export default ScreenshotManager; 