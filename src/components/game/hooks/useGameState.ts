
import { useState } from "react";
import { GameStatus, GameRule } from "../types";
import { levels, gameTypes } from "../levels";

type UseGameStateProps = {
  initialLevel: number;
  initialGameType?: string;
  onUpdateGameStatus?: (status: Partial<GameStatus>) => void;
  challengeMode?: boolean;
};

const INITIAL_LIVES = 3;
const MAX_CHALLENGE_LEVEL = 50;

export const useGameState = ({ 
  initialLevel, 
  initialGameType,
  onUpdateGameStatus, 
  challengeMode = false 
}: UseGameStateProps) => {
  const [level, setLevel] = useState(initialLevel);
  const [gameTypeId, setGameTypeId] = useState<string>(initialGameType || gameTypes[0].id);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showGlitches, setShowGlitches] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    score: 0,
    lives: INITIAL_LIVES,
    level,
    playerPosition: { x: 0, y: 0 },
    playerStart: { x: 0, y: 0 },
    glitchPositions: [],
    remainingNumbers: [],
    walls: [],
    gameTypeId
  });
  const [currentRule, setCurrentRule] = useState<GameRule | null>(null);
  
  return {
    level,
    setLevel,
    gameTypeId,
    setGameTypeId,
    showLevelComplete,
    setShowLevelComplete,
    showGlitches,
    setShowGlitches,
    gameStatus,
    setGameStatus,
    currentRule,
    setCurrentRule,
    challengeLevelLimit: MAX_CHALLENGE_LEVEL
  };
};
