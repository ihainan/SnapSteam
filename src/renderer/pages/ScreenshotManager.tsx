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
  color: '#333333',
  fontSize: '24px',
  fontWeight: 500,
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid #e0e0e0',
}));

const ScreenshotCard = styled(Card)(() => ({
  position: 'relative',
  borderRadius: '4px',
  overflow: 'hidden',
  transition: 'transform 0.15s',
  aspectRatio: '16/9',
  '&:hover': {
    transform: 'scale(1.02)',
    cursor: 'pointer',
  },
}));

const ScreenshotImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}));

const UploadButton = styled(Button)(() => ({
  backgroundColor: '#4285f4',
  color: '#ffffff',
  padding: '8px 16px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#3367d6',
  },
}));

interface ScreenshotManagerProps {
  gameId: number;
  gameName: string;
}

const ScreenshotManager: React.FC<ScreenshotManagerProps> = ({ gameId, gameName }) => {
  const [screenshots, setScreenshots] = useState(mockScreenshots);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleScreenshotClick = (url: string) => {
    // 使用系统图片浏览器打开
    window.open(url, '_blank');
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // 模拟上传进度
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    // 模拟添加新截图
    const newScreenshots = Array.from(files).map((file, index) => ({
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
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="screenshot-upload"
            multiple
            type="file"
            onChange={handleUpload}
          />
          <label htmlFor="screenshot-upload">
            <UploadButton
              variant="contained"
              startIcon={<AddIcon />}
              disabled={isUploading}
            >
              添加截图
            </UploadButton>
          </label>
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
    </Box>
  );
};

export default ScreenshotManager; 