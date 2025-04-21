
import { useCallback } from "react";
import { Position, GameStatus, GameRule } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { movementLogic } from "./movementLogic";
import { useTouchMovement } from "./useTouchMovement";
import { useKeyboardMovement } from "./useKeyboardMovement";
import { isPositionEqual } from "./utils";

export type UsePlayerMovementProps = {
  gameStatus: GameStatus;
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
  currentRule: GameRule | null;
  onGameOver: (score: number) => void;
  onLevelComplete?: () => void;
};

export const usePlayerMovement = ({
  gameStatus,
  setGameStatus,
  currentRule,
  onGameOver,
  onLevelComplete,
}: UsePlayerMovementProps) => {
  const isMobile = useIsMobile();

  // Keyboard controls
  useKeyboardMovement({ setGameStatus, gameStatus, currentRule, onGameOver, onLevelComplete });

  // Touch controls
  const { handleTouchStart, handleTouchEnd } = useTouchMovement({
    setGameStatus,
    gameStatus,
    currentRule,
    onGameOver,
    onLevelComplete,
  });

  // Check if level is complete after each render
  const checkLevelCompletion = useCallback(() => {
    if (!currentRule) return;
    
    const remainingCorrectNumbers = gameStatus.remainingNumbers.filter(num => 
      currentRule.isMatch(num.value)
    );
    
    if (remainingCorrectNumbers.length === 0 && gameStatus.remainingNumbers.length > 0) {
      onLevelComplete?.();
    }
  }, [gameStatus.remainingNumbers, currentRule, onLevelComplete]);

  // Allow movement to any cell by clicking
  const movePlayerByClick = useCallback(
    (pos: Position) => {
      setGameStatus((prev) => {
        const { walls, glitchPositions } = prev;
        const isWall = walls.some((wall) => isPositionEqual(wall, pos));
        const isGlitch = glitchPositions.some((g) =>
          isPositionEqual(g, pos)
        );
        if (isWall || isGlitch) return prev;
        
        const newState = movementLogic({ 
          prev, 
          newPos: pos, 
          currentRule, 
          onGameOver,
          onLevelComplete
        });
        
        return newState;
      });
    },
    [setGameStatus, currentRule, onGameOver, onLevelComplete]
  );

  const handleMove = useCallback(
    (newPos: Position) => {
      setGameStatus((prev) =>
        movementLogic({ 
          prev, 
          newPos, 
          currentRule, 
          onGameOver, 
          onLevelComplete 
        })
      );
    },
    [setGameStatus, currentRule, onGameOver, onLevelComplete]
  );

  return {
    handleTouchStart,
    handleTouchEnd,
    movePlayerByClick,
    handleMove,
    checkLevelCompletion,
  };
};
