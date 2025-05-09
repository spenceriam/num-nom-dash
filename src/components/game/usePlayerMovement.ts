import { useCallback, useRef, useEffect } from "react";
import { Position, GameStatus, GameRule } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { getChaseMove, processMovement } from "./movementLogic";
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
      const newGlitchPositions = [];
      const newGlitchDirections = [...(prev.glitchDirections || [])];

      prev.glitchPositions.forEach((glitch, index) => {
        const nextGlitchPos = getChaseMove(
          glitch,
          prev.playerPosition,
          prev.walls,
          prev.remainingNumbers.length
        );

        // Update direction based on movement
        if (nextGlitchPos.x < glitch.x) {
          newGlitchDirections[index] = "left";
        } else if (nextGlitchPos.x > glitch.x) {
          newGlitchDirections[index] = "right";
        }

        newGlitchPositions.push(nextGlitchPos);
      });

      return {
        ...prev,
        glitchPositions: newGlitchPositions,
        glitchDirections: newGlitchDirections
      };
    });
  }, [setGameStatus]);

  const stopGlitchMovement = useCallback(() => {
    if (glitchIntervalRef.current) {
      clearInterval(glitchIntervalRef.current);
      glitchIntervalRef.current = undefined;
    }
  }, []);

  const startGlitchMovement = useCallback(() => {
    stopGlitchMovement();
    glitchIntervalRef.current = window.setInterval(moveGlitches, 1560);
  }, [moveGlitches, stopGlitchMovement]);

  // We'll let the Game component control when to start glitch movement
  // This will be triggered after the delay when glitches become visible
  useEffect(() => {
    return () => stopGlitchMovement();
  }, [stopGlitchMovement]);

  const wrappedLevelComplete = useCallback(() => {
    stopGlitchMovement();
    onLevelComplete?.();
  }, [onLevelComplete, stopGlitchMovement]);

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

        // Update player direction based on horizontal movement
        let playerDirection = prev.playerDirection;
        if (nextPos.x < prev.playerPosition.x) {
          playerDirection = "left";
        } else if (nextPos.x > prev.playerPosition.x) {
          playerDirection = "right";
        }

        let newState = {
          ...prev,
          playerPosition: nextPos,
          playerDirection: playerDirection
        };

        if (isPositionEqual(nextPos, target)) {
          newState = processMovement({
            prev: {
              ...prev,
              playerDirection: playerDirection
            },
            newPos: nextPos,
            currentRule,
            onGameOver,
            onLevelComplete
          });
          stopMovement();
        }

        if (prev.glitchPositions.some(g => isPositionEqual(g, nextPos))) {
          newState = processMovement({
            prev: {
              ...prev,
              playerDirection: playerDirection
            },
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
      wrappedLevelComplete();
    }
  }, [gameStatus.remainingNumbers, currentRule, wrappedLevelComplete]);

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
        processMovement({
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
    startGlitchMovement,
    stopGlitchMovement,
  };
};
