import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ScreenshotManager from './ScreenshotManager';
import { ipcRenderer } from 'electron';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ScreenshotManagerRouteProps {
  games: any[];
}

interface Game {
  id: number;
  name: string;
  isNonSteam?: boolean;
}

const ScreenshotManagerRoute: React.FC<ScreenshotManagerRouteProps> = ({ games }) => {
  const { gameId } = useParams();
  const [gameInfo, setGameInfo] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGameInfo = async () => {
      const gameIdNum = parseInt(gameId || '0');
      
      // 首先尝试从传入的games数组中查找
      let game = games.find(g => g.id === gameIdNum);
      
      if (game) {
        setGameInfo(game);
        setLoading(false);
        return;
      }
      
      // 如果games数组中没有找到，则直接从IPC获取游戏信息
      try {
        const userId = await ipcRenderer.invoke('get-store-value', 'currentUserId');
        if (!userId) {
          setLoading(false);
          return;
        }
        
        // 尝试从Steam游戏中查找
        const steamGames = await ipcRenderer.invoke('get-user-games', userId);
        game = steamGames.find((g: Game) => g.id === gameIdNum);
        
        if (!game) {
          // 如果Steam游戏中没有，尝试从Non-Steam游戏中查找
          try {
            const nonSteamGames = await ipcRenderer.invoke('get-non-steam-games', userId);
            game = nonSteamGames.find((g: Game) => g.id === gameIdNum);
          } catch (error) {
            console.warn('Error loading non-steam games:', error);
          }
        }
        
        if (game) {
          setGameInfo(game);
        }
      } catch (error) {
        console.error('Error loading game info:', error);
      }
      
      setLoading(false);
    };

    loadGameInfo();
  }, [gameId, games]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        gap: 2
      }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading game info...
        </Typography>
      </Box>
    );
  }
  
  return (
    <ScreenshotManager 
      gameId={parseInt(gameId || '0')} 
      gameName={gameInfo?.name || 'Unknown Game'}
      isNonSteam={gameInfo?.isNonSteam || false}
    />
  );
};

export default ScreenshotManagerRoute; 