import React from 'react';
import { Box, Grid, Card, CardMedia, Typography, styled } from '@mui/material';

const GameCard = styled(Card)(() => ({
  backgroundColor: '#2a475e',
  color: '#ffffff',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
    cursor: 'pointer',
  },
}));

// 模拟游戏数据
const mockGames = [
  {
    id: 1,
    name: 'Half-Life 2',
    coverUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/220/header.jpg',
  },
  {
    id: 2,
    name: 'Stardew Valley',
    coverUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg',
  },
  {
    id: 3,
    name: 'Counter-Strike',
    coverUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
  },
  {
    id: 4,
    name: 'Skyrim',
    coverUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/489830/header.jpg',
  },
];

const Library: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#ffffff' }}>
        Game Library
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {mockGames.map((game) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
              <GameCard>
                <CardMedia
                  component="img"
                  height="140"
                  image={game.coverUrl}
                  alt={game.name}
                />
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6">{game.name}</Typography>
                </Box>
              </GameCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Library; 