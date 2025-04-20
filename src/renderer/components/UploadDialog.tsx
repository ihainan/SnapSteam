import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  styled,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales';

interface DropZoneProps {
  isDragActive?: boolean;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
}

const DropZone = styled(Box)<DropZoneProps>(({ isDragActive, theme }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: '12px',
  padding: '40px 20px',
  textAlign: 'center',
  backgroundColor: isDragActive 
    ? theme.palette.mode === 'dark'
      ? 'rgba(96, 165, 250, 0.08)'
      : 'rgba(59, 130, 246, 0.08)'
    : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : '#f8f9fa',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(96, 165, 250, 0.08)'
      : 'rgba(59, 130, 246, 0.08)',
    borderColor: theme.palette.primary.main,
  },
}));

const PreviewGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '16px',
  marginTop: '20px',
});

const PreviewCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  aspectRatio: '16/9',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark' ? '0 1px 3px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
  '&:hover .delete-button': {
    opacity: 1,
  },
}));

const PreviewImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'all 0.2s ease',
});

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '4px',
  right: '4px',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.5)',
  color: '#ffffff',
  padding: '4px',
  opacity: 0,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '20px',
  },
}));

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ open, onClose, onUpload }) => {
  const { language } = useLanguage();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const t = translations[language];

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleDelete = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    onUpload(selectedFiles);
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: '16px',
          boxShadow: theme => theme.palette.mode === 'dark' 
            ? '0 4px 6px rgba(0,0,0,0.2)' 
            : '0 4px 6px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle sx={{ 
        padding: '0 0 16px 0',
        color: theme => theme.palette.text.primary,
        fontSize: '20px',
        fontWeight: 600,
      }}>
        {t.screenshotManager.addScreenshot}
      </DialogTitle>
      <DialogContent sx={{ padding: '0' }}>
        <input
          accept="image/jpeg,image/png,image/bmp,image/gif"
          style={{ display: 'none' }}
          id="upload-images"
          multiple
          type="file"
          onChange={handleFileSelect}
        />
        <label htmlFor="upload-images">
          <DropZone
            isDragActive={isDragActive}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: '#4285f4', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {t.screenshotManager.dragAndDrop}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t.screenshotManager.orClick}
            </Typography>
          </DropZone>
        </label>

        {selectedFiles.length > 0 && (
          <PreviewGrid>
            {selectedFiles.map((file, index) => (
              <PreviewCard key={index}>
                <PreviewImage
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                />
                <DeleteButton
                  className="delete-button"
                  onClick={() => handleDelete(index)}
                >
                  <DeleteIcon />
                </DeleteButton>
              </PreviewCard>
            ))}
          </PreviewGrid>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px 0 0 0' }}>
        <Button 
          onClick={onClose}
          sx={{
            color: theme => theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {t.screenshotManager.cancel}
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={selectedFiles.length === 0}
          sx={{
            backgroundColor: theme => theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme => theme.palette.primary.dark,
            },
            '&.Mui-disabled': {
              backgroundColor: theme => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.12)'
                : '#e0e0e0',
              color: theme => theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.3)'
                : '#9e9e9e',
            },
          }}
        >
          {t.screenshotManager.import}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog; 