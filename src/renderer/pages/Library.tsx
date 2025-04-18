import React from 'react';
import { Box, Grid, Card, CardMedia, Typography, styled } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const GameCard = styled(Card)(() => ({
  backgroundColor: 'transparent',
  color: '#ffffff',
  transition: 'transform 0.15s',
  position: 'relative',
  borderRadius: '2px',
  overflow: 'hidden',
  '&:hover': {
    transform: 'scale(1.02)',
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
  padding: '20px 8px 6px',
  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.2,
}));

const FavoriteButton = styled(Box)(() => ({
  position: 'absolute',
  top: 6,
  right: 6,
  color: '#ffffff',
  opacity: 0.7,
  '&:hover': {
    opacity: 1,
  },
}));

const SectionTitle = styled(Typography)(() => ({
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 500,
  marginBottom: '8px',
  paddingBottom: '4px',
  paddingLeft: '8px',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
}));

const GridContainer = styled(Grid)(() => ({
  marginLeft: '0',
  width: '100%',
  padding: '0 8px',
}));

const ContentWrapper = styled(Box)(() => ({
  marginLeft: '-8px',
  width: 'calc(100% + 8px)',
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
    <ContentWrapper>
      <Box sx={{ mb: 2 }}>
        <SectionTitle>Favorites</SectionTitle>
        <GridContainer container spacing={1}>
          {favorites.map((game) => (
            <Grid item xs={12} sm={4} md={3} lg={2} xl={1.7} key={game.id}>
              <GameCard>
                <CardMedia
                  component="img"
                  height="120"
                  image={game.coverUrl}
                  alt={game.name}
                />
                <GameTitle>{game.name}</GameTitle>
                {game.favorite && (
                  <FavoriteButton>
                    <FavoriteIcon sx={{ fontSize: 18 }} />
                  </FavoriteButton>
                )}
              </GameCard>
            </Grid>
          ))}
        </GridContainer>
      </Box>

      <Box>
        <SectionTitle>All Games</SectionTitle>
        <GridContainer container spacing={1}>
          {allGames.map((game) => (
            <Grid item xs={12} sm={4} md={3} lg={2} xl={1.7} key={game.id}>
              <GameCard>
                <CardMedia
                  component="img"
                  height="120"
                  image={game.coverUrl}
                  alt={game.name}
                />
                <GameTitle>{game.name}</GameTitle>
                {game.favorite && (
                  <FavoriteButton>
                    <FavoriteIcon sx={{ fontSize: 18 }} />
                  </FavoriteButton>
                )}
              </GameCard>
            </Grid>
          ))}
        </GridContainer>
      </Box>
    </ContentWrapper>
  );
};

export default Library; 