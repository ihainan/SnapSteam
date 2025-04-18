import React from 'react';
import { Box, Card, CardMedia, Typography, styled } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const GameCard = styled(Card)(() => ({
  backgroundColor: 'transparent',
  color: '#333333',
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
  color: '#ffffff',
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
  color: '#333333',
  fontSize: '16px',
  fontWeight: 500,
  marginBottom: '8px',
  paddingBottom: '4px',
  paddingLeft: '8px',
  borderBottom: '1px solid #e0e0e0',
}));

const Section = styled(Box)(() => ({
  marginBottom: '16px',
  '&:last-child': {
    marginBottom: 0,
  },
}));

const GamesGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '8px',
  padding: '0 8px',
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

interface LibraryProps {
  searchTerm: string;
}

const Library: React.FC<LibraryProps> = ({ searchTerm }) => {
  const filteredGames = mockGames.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const favorites = filteredGames.filter(game => game.favorite);

  const renderGameCard = (game: typeof mockGames[0]) => (
    <GameCard key={game.id}>
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
  );

  return (
    <Box>
      <Section>
        <SectionTitle>收藏夹</SectionTitle>
        <GamesGrid>
          {favorites.map(renderGameCard)}
        </GamesGrid>
      </Section>

      <Section>
        <SectionTitle>所有游戏</SectionTitle>
        <GamesGrid>
          {filteredGames.map(renderGameCard)}
        </GamesGrid>
      </Section>
    </Box>
  );
};

export default Library; 