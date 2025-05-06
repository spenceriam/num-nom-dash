import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { GameStatus, Rule, GameType } from "../types";
import { getLevelByNumber } from "../levels";

type UseGameInitializationProps = {
  level: number;
  challengeMode?: boolean;
  setCurrentRule: (rule: Rule) => void;
  setGameStatus: (status: GameStatus | ((prev: GameStatus) => GameStatus)) => void;
  onUpdateGameStatus?: (status: Partial<GameStatus>) => void;
  gameStatus: GameStatus;
  setTargetNumber: (target: number | undefined) => void;
};

export const useGameInitialization = ({
  level,
  challengeMode,
  setCurrentRule,
  setGameStatus,
  onUpdateGameStatus,
  gameStatus,
  setTargetNumber,
}: UseGameInitializationProps) => {
  const gameInitializedRef = useRef(false);
  const challengeLevelRef = useRef(1);
  const gameLoopRef = useRef<number | null>(null);

  const getGameLevel = () => {
    if (challengeMode) {
      return getLevelByNumber(challengeLevelRef.current, true);
    } else {
      return getLevelByNumber(level);
    }
  };

  useEffect(() => {
    // Reset the initialization flag when level changes
    gameInitializedRef.current = false;
  }, [level]);

  useEffect(() => {
    if (gameInitializedRef.current) return;
    
    const gameLevel = getGameLevel();
    if (!gameLevel) return;
    
    // Set the current rule and target number (if applicable)
    setCurrentRule(gameLevel.rule);
    setTargetNumber(gameLevel.targetNumber);
    
    // Initialize game status with level data
    const initialGameStatus: GameStatus = {
      score: gameStatus.score,
      lives: 3,
      level: gameLevel.id,
      playerPosition: gameLevel.maze.playerStart,
      playerStart: gameLevel.maze.playerStart,
      glitchPositions: gameLevel.maze.glitches,
      remainingNumbers: gameLevel.maze.numbers,
      walls: gameLevel.maze.walls,
      currentRule: gameLevel.rule,
      gameType: gameLevel.rule.type as GameType,
      targetNumber: gameLevel.targetNumber
    };
    
    setGameStatus(initialGameStatus);
    onUpdateGameStatus?.(initialGameStatus);
    
    // Format rule description with target if needed
    let description = gameLevel.rule.description;
    if (gameLevel.targetNumber && description.includes('[target]')) {
      description = description.replace('[target]', gameLevel.targetNumber.toString());
    }
    
    // Show toast with level info
    toast.success(`Level ${gameLevel.id}: ${gameLevel.rule.name}`, {
      description: description,
    });
    
    gameInitializedRef.current = true;
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [level, challengeMode, setTargetNumber]);

  return {
    getGameLevel,
    challengeLevelRef,
    gameLoopRef
  };
};