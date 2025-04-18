import React from 'react';
import { Box, Card, CardMedia, Typography, styled } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales';

const GameCard = styled(Card)(() => ({
  backgroundColor: '#ffffff',
  color: '#2c3e50',
  transition: 'all 0.2s ease',
  position: 'relative',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    '& .MuiCardMedia-root': {
      filter: 'brightness(1.05)',
    },
  },
}));

const GameTitle = styled(Typography)(() => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '24px 12px 8px',
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.3,
  color: '#ffffff',
}));

interface FavoriteButtonProps {
  favorite: boolean;
}

const FavoriteButton = styled(Box)<FavoriteButtonProps>(({ favorite }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backdropFilter: 'blur(8px)',
  backgroundColor: favorite ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.1)',
  border: `1px solid ${favorite ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.3)'}`,
  color: favorite ? '#ef4444' : '#ffffff',
  opacity: 0.9,
  transition: 'all 0.2s ease',
  '&:hover': {
    opacity: 1,
    backgroundColor: favorite ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.2)',
    border: `1px solid ${favorite ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.5)'}`,
    transform: 'scale(1.05)',
  },
}));

const SectionTitle = styled(Typography)(() => ({
  color: '#2c3e50',
  fontSize: '16px',
  fontWeight: 600,
  marginBottom: '12px',
  paddingBottom: '4px',
  paddingLeft: '8px',
  borderBottom: '1px solid #e0e0e0',
}));

const Section = styled(Box)(() => ({
  marginBottom: '20px',
  '&:last-child': {
    marginBottom: 0,
  },
}));

const GamesGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '12px',
  padding: '0 8px',
}));

const EmptyFavorites = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px',
  color: '#64748b',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  '& .MuiSvgIcon-root': {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
}));

const EmptyText = styled(Typography)(() => ({
  fontSize: '14px',
  textAlign: 'center',
  lineHeight: 1.5,
  color: '#64748b',
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
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [games, setGames] = React.useState(mockGames);
  
  const t = translations[language];
  
  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const favorites = filteredGames.filter(game => game.favorite);
  const nonFavorites = filteredGames.filter(game => !game.favorite);

  const handleGameClick = (gameId: number, gameName: string) => {
    navigate(`/screenshots/${gameId}`);
  };

  const handleFavoriteClick = (event: React.MouseEvent, gameId: number) => {
    event.stopPropagation(); // 阻止事件冒泡到卡片
    setGames(prevGames =>
      prevGames.map(game =>
        game.id === gameId
          ? { ...game, favorite: !game.favorite }
          : game
      )
    );
  };

  const renderGameCard = (game: typeof mockGames[0]) => (
    <GameCard key={game.id} onClick={() => handleGameClick(game.id, game.name)}>
      <CardMedia
        component="img"
        height="120"
        image={game.coverUrl}
        alt={game.name}
      />
      <GameTitle>{game.name}</GameTitle>
      <FavoriteButton 
        favorite={game.favorite}
        onClick={(e) => handleFavoriteClick(e, game.id)}
      >
        <FavoriteIcon sx={{ fontSize: 18 }} />
      </FavoriteButton>
    </GameCard>
  );

  return (
    <Box>
      <Section>
        <SectionTitle>{t.library.favorites}</SectionTitle>
        {favorites.length > 0 ? (
          <GamesGrid>
            {favorites.map(renderGameCard)}
          </GamesGrid>
        ) : (
          <EmptyFavorites>
            <FavoriteIcon />
            <EmptyText>
              {t.library.emptyFavorites}
            </EmptyText>
          </EmptyFavorites>
        )}
      </Section>

      <Section>
        <SectionTitle>{t.library.allGames}</SectionTitle>
        <GamesGrid>
          {nonFavorites.map(renderGameCard)}
        </GamesGrid>
      </Section>
    </Box>
  );
};

export default Library; 