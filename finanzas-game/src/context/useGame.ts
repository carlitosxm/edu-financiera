// src/context/useGame.ts
import { useContext } from 'react';
import { GameContext } from './GameContext';

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame debe ser usado dentro de un GameProvider');
  }
  return context;
};