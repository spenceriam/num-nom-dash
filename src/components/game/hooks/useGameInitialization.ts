
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { GameStatus, GameRule } from "../types";
import { levels, gameTypes, generateLevel } from "../levels";

type UseGameInitializationProps = {
  level: number;
  gameTypeId?: string;
  challengeMode?: boolean;
  setCurrentRule: (rule: GameRule) => void;
  setGameStatus: (status: GameStatus | ((prev: GameStatus) => GameStatus)) => void;
  onUpdateGameStatus?: (status: Partial<GameStatus>) => void;
  gameStatus: GameStatus;
};

export const useGameInitialization = ({
  level,
  gameTypeId,
  challengeMode,
  setCurrentRule,
  setGameStatus,
  onUpdateGameStatus,
  gameStatus,
}: UseGameInitializationProps) => {
  const gameInitializedRef = useRef(false);
  const challengeLevelRef = useRef(1);
  const gameLoopRef = useRef<number | null>(null);

  const getGameLevel = () => {
    if (challengeMode) {
      const levelIndex = (challengeLevelRef.current - 1) % levels.length;
      const baseLevel = levels[levelIndex];
      const cycleCount = Math.floor((challengeLevelRef.current - 1) / levels.length);
      const difficultyMultiplier = 1 + (cycleCount * 0.2);
      
      return {
        ...baseLevel,
        id: challengeLevelRef.current,
        glitchSpeed: baseLevel.glitchSpeed * difficultyMultiplier
      };
    } else if (gameTypeId) {
      // Generate a level for the specific game type with appropriate difficulty
      return generateLevel(gameTypeId, level);
    } else {
      // Fallback to the old levels system
      return levels.find(l => l.id === level) || levels[0];
    }
  };

  useEffect(() => {
    if (gameInitializedRef.current) return;
    
    const gameLevel = getGameLevel();
    if (!gameLevel) return;
    
    setCurrentRule(gameLevel.rule);
    const initialGameStatus = {
      score: gameStatus.score,
      lives: 3,
      level,
      playerPosition: gameLevel.maze.playerStart,
      playerStart: gameLevel.maze.playerStart,
      glitchPositions: gameLevel.maze.glitches,
      remainingNumbers: gameLevel.maze.numbers,
      walls: gameLevel.maze.walls,
      gameTypeId
    };
    
    setGameStatus(initialGameStatus);
    onUpdateGameStatus?.(initialGameStatus);

    // Get the game type name for the toast
    let gameName = gameLevel.rule.name;
    if (gameTypeId) {
      const gameType = gameTypes.find(gt => gt.id === gameTypeId);
      if (gameType) {
        gameName = gameType.name;
      }
    }
    
    toast.success(`Level ${level}: ${gameName}`, {
      description: `${gameLevel.rule.description} ${challengeMode ? "(Challenge Mode)" : ""}`,
    });
    
    gameInitializedRef.current = true;
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [level, gameTypeId]);

  return {
    getGameLevel,
    challengeLevelRef,
    gameLoopRef
  };
};
