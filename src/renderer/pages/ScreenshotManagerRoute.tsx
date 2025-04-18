import React from 'react';
import { useParams } from 'react-router-dom';
import ScreenshotManager from './ScreenshotManager';

interface ScreenshotManagerRouteProps {
  games: any[];
}

const ScreenshotManagerRoute: React.FC<ScreenshotManagerRouteProps> = ({ games }) => {
  const { gameId } = useParams();
  const game = games.find(g => g.id === parseInt(gameId || '0'));
  
  return (
    <ScreenshotManager 
      gameId={parseInt(gameId || '0')} 
      gameName={game?.name || 'Unknown Game'} 
    />
  );
};

export default ScreenshotManagerRoute; 