import React from 'react';
import { Box, Grid, Card, CardMedia, Typography, styled } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const GameCard = styled(Card)(() => ({
  backgroundColor: 'transparent',
  color: '#ffffff',
  transition: 'transform 0.2s',
  position: 'relative',
  borderRadius: '3px',
  overflow: 'hidden',
  '&:hover': {
    transform: 'scale(1.03)',
    cursor: 'pointer',
    '& .MuiCardMedia-root': {
      filter: 'brightness(1.1)',
    },
  },
}));

const GameTitle = styled(Typography)(() => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '30px 10px 8px',
  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
  fontSize: '14px',
  fontWeight: 500,
}));

const FavoriteButton = styled(Box)(() => ({
  position: 'absolute',
  top: 8,
  right: 8,
  color: '#ffffff',
  opacity: 0.7,
  '&:hover': {
    opacity: 1,
  },
}));

const SectionTitle = styled(Typography)(() => ({
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 500,
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
}));

// 模拟游戏数据
const mockGames = [
  {
    id: 1,
    name: 'Half-Life 2',
    coverUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/220/header.jpg',
    favorite: true,
  },
  {
    id: 2,
    name: 'Stardew Valley',
    coverUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg',
    favorite: true,
  },
  {
    id: 3,
    name: 'Counter-Strike',
    coverUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
    favorite: false,
  },
  {
    id: 4,
    name: 'The Elder Scrolls V: Skyrim',
    coverUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/489830/header.jpg',
    favorite: true,
  },
  {
    id: 5,
    name: 'Factorio',
    coverUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/427520/header.jpg',
    favorite: false,
  },
  {
    id: 6,
    name: 'Civilization VI',
    coverUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg',
    favorite: false,
  },
  {
    id: 7,
    name: 'Hades',
    coverUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg',
    favorite: true,
  },
  {
    id: 8,
    name: 'Terraria',
    coverUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg',
    favorite: false,
  },
];

const Library: React.FC = () => {
  const favorites = mockGames.filter(game => game.favorite);
  const allGames = mockGames;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <SectionTitle>Favorites</SectionTitle>
        <Grid container spacing={2}>
          {favorites.map((game) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
              <GameCard>
                <CardMedia
                  component="img"
                  height="150"
                  image={game.coverUrl}
                  alt={game.name}
                />
                <GameTitle>{game.name}</GameTitle>
                {game.favorite && (
                  <FavoriteButton>
                    <FavoriteIcon />
                  </FavoriteButton>
                )}
              </GameCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <SectionTitle>All Games</SectionTitle>
        <Grid container spacing={2}>
          {allGames.map((game) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
              <GameCard>
                <CardMedia
                  component="img"
                  height="150"
                  image={game.coverUrl}
                  alt={game.name}
                />
                <GameTitle>{game.name}</GameTitle>
                {game.favorite && (
                  <FavoriteButton>
                    <FavoriteIcon />
                  </FavoriteButton>
                )}
              </GameCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Library; 