import { useState } from "react";
import { GameStatus, Rule, GameType } from "../types";
import { getLevelByNumber } from "../levels";

type UseGameStateProps = {
  initialLevel: number;
  onUpdateGameStatus?: (status: Partial<GameStatus>) => void;
  challengeMode?: boolean;
};

const INITIAL_LIVES = 3;
const MAX_CHALLENGE_LEVEL = 50;

export const useGameState = ({ 
  initialLevel, 
  onUpdateGameStatus, 
  challengeMode = false 
}: UseGameStateProps) => {
  const [level, setLevel] = useState(initialLevel);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showGlitches, setShowGlitches] = useState(false);
  const [targetNumber, setTargetNumber] = useState<number | undefined>(undefined);
  
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    score: 0,
    lives: INITIAL_LIVES,
    level,
    playerPosition: { x: 0, y: 0 },
    playerStart: { x: 0, y: 0 },
    glitchPositions: [],
    remainingNumbers: [],
    walls: [],
    currentRule: {} as Rule, // Will be set during initialization
    gameType: 'even' as GameType, // Default type
  });
  
  const [currentRule, setCurrentRule] = useState<Rule | null>(null);
  
  // Function to update the game status and notify parent component
  const updateGameStatus = (newStatus: Partial<GameStatus>) => {
    setGameStatus(prev => {
      const updated = { ...prev, ...newStatus };
      onUpdateGameStatus?.(updated);
      return updated;
    });
  };
  
  return {
    level,
    setLevel,
    showLevelComplete,
    setShowLevelComplete,
    showGlitches,
    setShowGlitches,
    gameStatus,
    setGameStatus: updateGameStatus,
    currentRule,
    setCurrentRule,
    challengeLevelLimit: MAX_CHALLENGE_LEVEL,
    targetNumber,
    setTargetNumber
  };
};