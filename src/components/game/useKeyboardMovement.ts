
import { useEffect } from "react";
import { Direction, GameStatus, GameRule, Position } from "./types";
import { movementLogic } from "./movementLogic";

type UseKeyboardMovementProps = {
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
  gameStatus: GameStatus;
  currentRule: GameRule | null;
  onGameOver: (score: number) => void;
  onLevelComplete?: () => void;
};

export function useKeyboardMovement({
  setGameStatus,
  gameStatus,
  currentRule,
  onGameOver,
  onLevelComplete,
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

      if (direction) {
        setGameStatus((prev) => {
          let newPos = { ...prev.playerPosition };
          switch (direction) {
            case "up":
              newPos.y = Math.max(0, newPos.y - 1);
              break;
            case "down":
              newPos.y = Math.min(5, newPos.y + 1);
              break;
            case "left":
              newPos.x = Math.max(0, newPos.x - 1);
              break;
            case "right":
              newPos.x = Math.min(5, newPos.x + 1);
              break;
          }
          return movementLogic({ 
            prev, 
            newPos, 
            currentRule, 
            onGameOver,
            onLevelComplete 
          });
        });
        e.preventDefault();
      } else if (diagonal) {
        setGameStatus((prev) => {
          const { playerPosition } = prev;
          const newPos = {
            x: Math.max(0, Math.min(5, playerPosition.x + diagonal!.dx)),
            y: Math.max(0, Math.min(5, playerPosition.y + diagonal!.dy)),
          };
          return movementLogic({ 
            prev, 
            newPos, 
            currentRule, 
            onGameOver,
            onLevelComplete 
          });
        });
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [gameStatus, currentRule, onGameOver, setGameStatus, onLevelComplete]);
}
