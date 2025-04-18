import React, { useState } from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';
import { Folder } from '@mui/icons-material';

const defaultSteamPath = process.platform === 'darwin' 
  ? '~/Library/Application Support/Steam'
  : process.platform === 'win32'
  ? 'C:\\Program Files (x86)\\Steam'
  : '~/.local/share/Steam';

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
      <Typography variant="h4" sx={{ mb: 4, color: '#ffffff' }}>
        Settings
      </Typography>

      <Box sx={{ maxWidth: 600 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#ffffff' }}>
          Steam Installation
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            label="Steam Path"
            variant="outlined"
            value={steamPath}
            onChange={handlePathChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': {
                  borderColor: '#66c0f4',
                },
                '&:hover fieldset': {
                  borderColor: '#66c0f4',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#66c0f4',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#ffffff',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleBrowse}
            startIcon={<Folder />}
            sx={{
              backgroundColor: '#66c0f4',
              '&:hover': {
                backgroundColor: '#66c0f4',
                opacity: 0.8,
              },
            }}
          >
            Browse
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings; 