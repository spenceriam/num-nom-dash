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
  const glitchIntervalRef = useRef<number>();
  const targetPositionRef = useRef<Position | null>(null);

  const getNextPosition = (current: Position, target: Position): Position => {
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    
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

  const stopMovement = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = undefined;
    }
    targetPositionRef.current = null;
  };

  const moveGlitches = useCallback(() => {
    setGameStatus(prev => {
      const newGlitchPositions = prev.glitchPositions.map(glitch => {
        const nextGlitchPos = movementLogic.getChaseMove(
          glitch, 
          prev.playerPosition, 
          prev.walls
        );
        return nextGlitchPos;
      });

      return {
        ...prev,
        glitchPositions: newGlitchPositions
      };
    });
  }, [setGameStatus]);

  useEffect(() => {
    glitchIntervalRef.current = window.setInterval(moveGlitches, 600);
    
    return () => {
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current);
      }
    };
  }, [moveGlitches]);

  const startMovement = (target: Position) => {
    if (moveIntervalRef.current) {
      stopMovement();
    }

    targetPositionRef.current = target;
    moveIntervalRef.current = window.setInterval(() => {
      setGameStatus(prev => {
        const nextPos = getNextPosition(prev.playerPosition, target);
        
        if (prev.walls.some(wall => isPositionEqual(wall, nextPos))) {
          stopMovement();
          return prev;
        }
        
        let newState = { ...prev, playerPosition: nextPos };
        
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
    }, 300);
  };

  useEffect(() => {
    return () => {
      stopMovement();
    };
  }, []);

  useKeyboardMovement({ setGameStatus, gameStatus, currentRule, onGameOver, onLevelComplete });

  const { handleTouchStart, handleTouchEnd } = useTouchMovement({
    setGameStatus,
    gameStatus,
    currentRule,
    onGameOver,
    onLevelComplete,
  });

  const checkLevelCompletion = useCallback(() => {
    if (!currentRule) return;
    
    const remainingCorrectNumbers = gameStatus.remainingNumbers.filter(num => 
      currentRule.isMatch(num.value)
    );
    
    if (remainingCorrectNumbers.length === 0 && gameStatus.remainingNumbers.length > 0) {
      onLevelComplete?.();
    }
  }, [gameStatus.remainingNumbers, currentRule, onLevelComplete]);

  const movePlayerByClick = useCallback(
    (pos: Position) => {
      const { walls, glitchPositions } = gameStatus;
      
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
