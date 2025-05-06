import { useEffect } from "react";
import { Direction, GameStatus, Rule, Position } from "./types";
import { processMovement } from "./movementLogic";

type UseKeyboardMovementProps = {
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
  gameStatus: GameStatus;
  currentRule: Rule | null;
  onGameOver: (score: number) => void;
  onLevelComplete?: () => void;
  targetNumber?: number;
};

export function useKeyboardMovement({
  setGameStatus,
  gameStatus,
  currentRule,
  onGameOver,
  onLevelComplete,
  targetNumber,
}: UseKeyboardMovementProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let direction: Direction | null = null;
      let diagonal: {dx: number, dy: number} | null = null;

      switch (e.key) {
        case "ArrowUp":
          direction = "up";
          break;
        case "ArrowDown":
          direction = "down";
          break;
        case "ArrowLeft":
          direction = "left";
          break;
        case "ArrowRight":
          direction = "right";
          break;
        case "q":
        case "Q":
          diagonal = { dx: -1, dy: -1 };
          break;
        case "e":
        case "E":
          diagonal = { dx: 1, dy: -1 };
          break;
        case "z":
        case "Z":
          diagonal = { dx: -1, dy: 1 };
          break;
        case "c":
        case "C":
          diagonal = { dx: 1, dy: 1 };
          break;
      }

      // Get grid size based on current game state
      const gridSize = Math.max(
        4, // Minimum grid size
        Math.max(
          ...gameStatus.remainingNumbers.map(n => Math.max(n.position.x, n.position.y)),
          ...gameStatus.walls.map(w => Math.max(w.x, w.y)),
          ...gameStatus.glitchPositions.map(g => Math.max(g.x, g.y))
        ) + 1
      );

      if (direction) {
        setGameStatus((prev) => {
          let newPos = { ...prev.playerPosition };
          switch (direction) {
            case "up":
              newPos.y = Math.max(0, newPos.y - 1);
              break;
            case "down":
              newPos.y = Math.min(gridSize - 1, newPos.y + 1);
              break;
            case "left":
              newPos.x = Math.max(0, newPos.x - 1);
              break;
            case "right":
              newPos.x = Math.min(gridSize - 1, newPos.x + 1);
              break;
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
        e.preventDefault();
      } else if (diagonal) {
        setGameStatus((prev) => {
          const { playerPosition } = prev;
          const newPos = {
            x: Math.max(0, Math.min(gridSize - 1, playerPosition.x + diagonal!.dx)),
            y: Math.max(0, Math.min(gridSize - 1, playerPosition.y + diagonal!.dy)),
          };
          return processMovement({ 
            prev, 
            newPos, 
            currentRule, 
            onGameOver,
            onLevelComplete,
            targetNumber
          });
        });
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStatus, currentRule, onGameOver, setGameStatus, onLevelComplete, targetNumber]);
}