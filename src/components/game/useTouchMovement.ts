
import { useRef, useCallback } from "react";
import { Position, GameStatus, GameRule } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { processMovement } from "./movementLogic";

type UseTouchMovementProps = {
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
  gameStatus: GameStatus;
  currentRule: GameRule | null;
  onGameOver: (score: number) => void;
  onLevelComplete?: () => void;
};

export function useTouchMovement({
  setGameStatus,
  gameStatus,
  currentRule,
  onGameOver,
  onLevelComplete,
}: UseTouchMovementProps) {
  const isMobile = useIsMobile();
  const touchStartRef = useRef<Position | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, [isMobile]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const endPos = { x: touch.clientX, y: touch.clientY };
    const startPos = touchStartRef.current;

    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;

    setGameStatus((prev) => {
      let newPos = { ...prev.playerPosition };
      let newDirection = prev.playerDirection;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 50) {
          newPos.x = Math.min(5, newPos.x + 1);
          newDirection = "right";
        } else if (dx < -50) {
          newPos.x = Math.max(0, newPos.x - 1);
          newDirection = "left";
        }
      } else {
        if (dy > 50) {
          newPos.y = Math.min(5, newPos.y + 1);
        } else if (dy < -50) {
          newPos.y = Math.max(0, newPos.y - 1);
        }
      }

      const newState = processMovement({
        prev,
        newPos,
        currentRule,
        onGameOver,
        onLevelComplete,
      });

      return {
        ...newState,
        playerDirection: newDirection
      };
    });

    touchStartRef.current = null;
  }, [isMobile, currentRule, onGameOver, setGameStatus, onLevelComplete]);

  return {
    handleTouchStart,
    handleTouchEnd,
  };
}
