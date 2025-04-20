import React, { useState, useEffect } from 'react';
import { Box, Card, CardMedia, Typography, styled, Fab } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales';
import { ipcRenderer } from 'electron';

const GameCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  transition: 'all 0.2s ease',
  position: 'relative',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 1px 3px rgba(0,0,0,0.2)'
    : '0 1px 3px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 6px rgba(0,0,0,0.3)'
      : '0 4px 6px rgba(0,0,0,0.1)',
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
  favorite: string;
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
  backgroundColor: favorite === 'true' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.1)',
  border: `1px solid ${favorite === 'true' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.3)'}`,
  color: favorite === 'true' ? '#ef4444' : '#ffffff',
  opacity: 0.9,
  transition: 'all 0.2s ease',
  '&:hover': {
    opacity: 1,
    backgroundColor: favorite === 'true' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.2)',
    border: `1px solid ${favorite === 'true' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.5)'}`,
    transform: 'scale(1.05)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '16px',
  fontWeight: 600,
  marginBottom: '12px',
  paddingBottom: '4px',
  paddingLeft: '8px',
  borderBottom: `1px solid ${theme.palette.divider}`,
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

const EmptyFavorites = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 1px 3px rgba(0,0,0,0.2)'
    : '0 1px 3px rgba(0,0,0,0.1)',
  '& .MuiSvgIcon-root': {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
}));

const EmptyText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  textAlign: 'center',
  lineHeight: 1.5,
  color: theme.palette.text.secondary,
  whiteSpace: 'pre-line',
}));

const RefreshButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
    : '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 6px 16px rgba(0, 0, 0, 0.4)'
      : '0 6px 16px rgba(0, 0, 0, 0.2)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 2px 8px rgba(0, 0, 0, 0.3)'
      : '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  '& .MuiSvgIcon-root': {
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '&:hover .MuiSvgIcon-root': {
    transform: 'rotate(180deg)',
  },
}));

interface Game {
  id: number;
  name: string;
  coverUrl: string;
  favorite: boolean;
  userId: number;
  lastPlayed?: number;
  cachedCoverUrl?: string;
}

interface LibraryProps {
  searchTerm: string;
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
}

const Library: React.FC<LibraryProps> = ({ searchTerm, games, setGames }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const t = translations[language];
  
  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const favorites = filteredGames.filter(game => game.favorite);
  const nonFavorites = filteredGames.filter(game => !game.favorite);
  
  // 获取最近游玩的游戏（按 lastPlayed 时间倒序排序）
  const recentlyPlayed = [...filteredGames]
    .filter(game => {
      if (!game.lastPlayed || game.lastPlayed <= 0) return false;
      // 计算三个月前的时间戳（以秒为单位）
      const threeMonthsAgo = Math.floor(Date.now() / 1000) - (90 * 24 * 60 * 60);
      return game.lastPlayed >= threeMonthsAgo;
    })
    .sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0))
    .slice(0, 3);

  const handleGameClick = (gameId: number, gameName: string) => {
    navigate(`/screenshots/${gameId}`);
  };

  const handleFavoriteClick = async (event: React.MouseEvent, gameId: number) => {
    event.stopPropagation(); // 阻止事件冒泡到卡片
    
    // 更新本地状态
    const updatedGames = games.map(game =>
      game.id === gameId
        ? { ...game, favorite: !game.favorite }
        : game
    );
    
    setGames(updatedGames);
    
    // 立即保存到持久化存储
    const userId = games[0]?.userId; // 获取当前用户 ID
    if (userId) {
      try {
        await ipcRenderer.invoke('set-store-value', { 
          key: `userGames_${userId}`, 
          value: updatedGames 
        });
      } catch (error) {
        console.error('Error saving favorite status:', error);
      }
    }
  };

  const handleRefreshGames = async () => {
    const userId = games[0]?.userId;
    if (userId) {
      // 从 Steam 获取最新的游戏库数据
      const userGames = await ipcRenderer.invoke('get-user-games', userId);
      
      // 从持久化存储中获取收藏状态
      const savedGames = await ipcRenderer.invoke('get-store-value', `userGames_${userId}`);
      
      if (savedGames && Array.isArray(savedGames)) {
        // 合并 Steam 游戏数据和保存的收藏状态
        const mergedGames = userGames.map((game: Game) => {
          const savedGame = savedGames.find((g: Game) => g.id === game.id);
          return savedGame ? { ...game, favorite: savedGame.favorite } : game;
        });
        
        setGames(mergedGames);
      } else {
        setGames(userGames);
      }
    }
  };

  // 异步加载游戏封面
  const loadGameCover = async (game: Game) => {
    try {
      const cachedCoverUrl = await ipcRenderer.invoke('get-game-cover', game.id, game.coverUrl);
      setGames(prevGames => 
        prevGames.map(g => 
          g.id === game.id ? { ...g, cachedCoverUrl } : g
        )
      );
    } catch (error) {
      console.error('Error loading game cover:', error);
    }
  };

  // 加载所有游戏的封面
  useEffect(() => {
    games.forEach(game => {
      if (!game.cachedCoverUrl) {
        loadGameCover(game);
      }
    });
  }, [games]);

  const renderGameCard = (game: typeof games[0]) => (
    <GameCard key={game.id} onClick={() => handleGameClick(game.id, game.name)}>
      <CardMedia
        component="img"
        height="120"
        image={game.cachedCoverUrl || game.coverUrl}
        alt={game.name}
      />
      <GameTitle>{game.name}</GameTitle>
      <FavoriteButton
        favorite={game.favorite.toString()}
        onClick={(e) => handleFavoriteClick(e, game.id)}
      >
        <FavoriteIcon sx={{ fontSize: 18 }} />
      </FavoriteButton>
    </GameCard>
  );

  return (
    <Box>
      {recentlyPlayed.length > 0 && (
        <Section>
          <SectionTitle>{t.library.recentlyPlayed}</SectionTitle>
          <GamesGrid>
            {recentlyPlayed.map(game => (
              <GameCard key={game.id} onClick={() => handleGameClick(game.id, game.name)}>
                <CardMedia
                  component="img"
                  height="120"
                  image={game.cachedCoverUrl || game.coverUrl}
                  alt={game.name}
                />
                <GameTitle>{game.name}</GameTitle>
              </GameCard>
            ))}
          </GamesGrid>
        </Section>
      )}

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

      <RefreshButton
        onClick={handleRefreshGames}
        title={t.library.refresh}
      >
        <RefreshIcon />
      </RefreshButton>
    </Box>
  );
};

export default Library; 