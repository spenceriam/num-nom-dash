
import { useState } from "react";
import { GameStatus, GameRule } from "../types";
import { levels } from "../levels";

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
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    score: 0,
    lives: INITIAL_LIVES,
    level,
    playerPosition: { x: 0, y: 0 },
    playerStart: { x: 0, y: 0 },
    playerDirection: "right",
    glitchPositions: [],
    glitchDirections: [],
    remainingNumbers: [],
    walls: []
  });
  const [currentRule, setCurrentRule] = useState<GameRule | null>(null);

  return {
    level,
    setLevel,
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
