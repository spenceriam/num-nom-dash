
import { useRef, useCallback } from "react";
import { Position, GameStatus, GameRule } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { movementLogic } from "./movementLogic";

type UseTouchMovementProps = {
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
  gameStatus: GameStatus;
  currentRule: GameRule | null;
  onGameOver: (score: number) => void;
};

export function useTouchMovement({
  setGameStatus,
  gameStatus,
  currentRule,
  onGameOver,
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
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 50) {
          newPos.x = Math.min(5, newPos.x + 1);
        } else if (dx < -50) {
          newPos.x = Math.max(0, newPos.x - 1);
        }
      } else {
        if (dy > 50) {
          newPos.y = Math.min(5, newPos.y + 1);
        } else if (dy < -50) {
          newPos.y = Math.max(0, newPos.y - 1);
        }
      }
      return movementLogic({
        prev,
        newPos,
        currentRule,
        onGameOver,
      });
    });

    touchStartRef.current = null;
  }, [isMobile, currentRule, onGameOver, setGameStatus]);

  return {
    handleTouchStart,
    handleTouchEnd,
  };
}
