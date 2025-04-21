
import { useCallback, useRef, useEffect } from "react";
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
  const moveIntervalRef = useRef<number>();
  const targetPositionRef = useRef<Position | null>(null);

  // Calculate next position in path to target
  const getNextPosition = (current: Position, target: Position): Position => {
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    
    // Move one step at a time, prioritizing the larger difference
    if (Math.abs(dx) > Math.abs(dy)) {
      return {
        x: current.x + Math.sign(dx),
        y: current.y
      };
    } else if (dy !== 0) {
      return {
        x: current.x,
        y: current.y + Math.sign(dy)
      };
    }
    return current;
  };

  // Stop movement when target is reached or path is blocked
  const stopMovement = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = undefined;
    }
    targetPositionRef.current = null;
  };

  // Start movement towards target
  const startMovement = (target: Position) => {
    if (moveIntervalRef.current) {
      stopMovement();
    }

    targetPositionRef.current = target;
    moveIntervalRef.current = window.setInterval(() => {
      setGameStatus(prev => {
        // Get next position in path to target
        const nextPos = getNextPosition(prev.playerPosition, target);
        
        // Check if path is blocked by a wall
        if (prev.walls.some(wall => isPositionEqual(wall, nextPos))) {
          stopMovement();
          return prev;
        }
        
        // During movement, only update position without collecting numbers
        let newState = { ...prev, playerPosition: nextPos };
        
        // If we've reached the final target, apply full movement logic (collect numbers, check game rules)
        if (isPositionEqual(nextPos, target)) {
          newState = movementLogic({
            prev,
            newPos: nextPos,
            currentRule,
            onGameOver,
            onLevelComplete
          });
          
          stopMovement();
        }
        
        // Check if we died due to hitting a glitch during movement
        if (prev.glitchPositions.some(g => isPositionEqual(g, nextPos))) {
          newState = movementLogic({
            prev,
            newPos: nextPos,
            currentRule,
            onGameOver,
            onLevelComplete
          });
          
          if (newState.lives < prev.lives) {
            stopMovement();
          }
        }
        
        return newState;
      });
    }, 300); // Slower movement - 300ms per step
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      stopMovement();
    };
  }, []);

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

  // Update movePlayerByClick to use path movement
  const movePlayerByClick = useCallback(
    (pos: Position) => {
      const { walls, glitchPositions } = gameStatus;
      
      // Don't allow clicking on walls or glitches
      if (walls.some(wall => isPositionEqual(wall, pos)) || 
          glitchPositions.some(g => isPositionEqual(g, pos))) {
        return;
      }
      
      startMovement(pos);
    },
    [gameStatus, currentRule, onGameOver, onLevelComplete]
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
