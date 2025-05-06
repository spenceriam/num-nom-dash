import { useRef, useCallback } from "react";
import { Position, GameStatus, Rule } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { processMovement } from "./movementLogic";

type UseTouchMovementProps = {
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
  gameStatus: GameStatus;
  currentRule: Rule | null;
  onGameOver: (score: number) => void;
  onLevelComplete?: () => void;
  targetNumber?: number;
};

export function useTouchMovement({
  setGameStatus,
  gameStatus,
  currentRule,
  onGameOver,
  onLevelComplete,
  targetNumber,
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

    // Get grid size based on current game state
    const gridSize = Math.max(
      4, // Minimum grid size
      Math.max(
        ...gameStatus.remainingNumbers.map(n => Math.max(n.position.x, n.position.y)),
        ...gameStatus.walls.map(w => Math.max(w.x, w.y)),
        ...gameStatus.glitchPositions.map(g => Math.max(g.x, g.y))
      ) + 1
    );

    setGameStatus((prev) => {
      let newPos = { ...prev.playerPosition };
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 50) {
          newPos.x = Math.min(gridSize - 1, newPos.x + 1);
        } else if (dx < -50) {
          newPos.x = Math.max(0, newPos.x - 1);
        }
      } else {
        if (dy > 50) {
          newPos.y = Math.min(gridSize - 1, newPos.y + 1);
        } else if (dy < -50) {
          newPos.y = Math.max(0, newPos.y - 1);
        }
      }
      return processMovement({
        prev,
        newPos,
        currentRule,
        onGameOver,
        onLevelComplete,
        targetNumber
      });
    });

    touchStartRef.current = null;
  }, [isMobile, currentRule, onGameOver, setGameStatus, onLevelComplete, gameStatus, targetNumber]);

  return {
    handleTouchStart,
    handleTouchEnd,
  };
}