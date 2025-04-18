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
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material';

const DropZone = styled(Box)(({ isDragActive }: { isDragActive?: boolean }) => ({
  border: `2px dashed ${isDragActive ? '#3b82f6' : '#e0e0e0'}`,
  borderRadius: '12px',
  padding: '40px 20px',
  textAlign: 'center',
  backgroundColor: isDragActive ? 'rgba(59, 130, 246, 0.08)' : '#f8f9fa',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderColor: '#3b82f6',
  },
}));

const PreviewGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '16px',
  marginTop: '20px',
});

const PreviewCard = styled(Box)({
  position: 'relative',
  aspectRatio: '16/9',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  '&:hover .delete-button': {
    opacity: 1,
  },
});

const PreviewImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'all 0.2s ease',
});

const DeleteButton = styled(IconButton)({
  position: 'absolute',
  top: '4px',
  right: '4px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#ffffff',
  padding: '4px',
  opacity: 0,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '20px',
  },
});

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ open, onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

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
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle sx={{ 
        padding: '0 0 16px 0',
        color: '#2c3e50',
        fontSize: '20px',
        fontWeight: 600,
      }}>
        添加截图
      </DialogTitle>
      <DialogContent sx={{ padding: '0' }}>
        <input
          accept="image/*"
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
              拖拽图片到这里
            </Typography>
            <Typography variant="body2" color="text.secondary">
              或者点击选择图片
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
            color: '#64748b',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)',
            },
          }}
        >
          取消
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={selectedFiles.length === 0}
          sx={{
            backgroundColor: '#3b82f6',
            '&:hover': {
              backgroundColor: '#2563eb',
            },
            '&.Mui-disabled': {
              backgroundColor: '#e0e0e0',
              color: '#9e9e9e',
            },
          }}
        >
          导入截图
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog; 