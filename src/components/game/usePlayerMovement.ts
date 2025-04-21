
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { isPositionEqual } from "./utils";
import { Direction, Position, GameStatus, GameRule } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

export type UsePlayerMovementProps = {
  gameStatus: GameStatus;
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
  currentRule: GameRule | null;
  onGameOver: (score: number) => void;
};

export const usePlayerMovement = ({
  gameStatus,
  setGameStatus,
  currentRule,
  onGameOver,
}: UsePlayerMovementProps) => {
  const isMobile = useIsMobile();
  const touchStartRef = useRef<Position | null>(null);

  // MOVE LOGIC (pure, re-used for all methods)
  const moveLogic = useCallback(
    (prev: GameStatus, newPos: Position): GameStatus => {
      if (prev.walls.some((wall) => isPositionEqual(wall, newPos))) {
        return prev;
      }

      let updatedNumbers = [...prev.remainingNumbers];
      let score = prev.score;

      const collectedNumberIndex = updatedNumbers.findIndex((num) =>
        isPositionEqual(num.position, newPos)
      );

      if (collectedNumberIndex !== -1) {
        const collectedNumber = updatedNumbers[collectedNumberIndex];

        if (currentRule?.isMatch(collectedNumber.value)) {
          score += 10;
          updatedNumbers.splice(collectedNumberIndex, 1);
          toast.success(`+10 points!`);
        } else {
          toast.error("Wrong number!");
        }
      }

      const remainingCorrectNumbers = updatedNumbers.filter((num) =>
        currentRule?.isMatch(num.value)
      );

      if (
        remainingCorrectNumbers.length === 0 &&
        updatedNumbers.length !== prev.remainingNumbers.length
      ) {
        toast.success("Level complete!");
      }

      if (prev.glitchPositions.some((g) => isPositionEqual(g, newPos))) {
        const lives = prev.lives - 1;

        if (lives <= 0) {
          onGameOver(score);
          return prev;
        } else {
          toast.error(`Lost a life! ${lives} remaining`);
          return {
            ...prev,
            lives,
            playerPosition: prev.playerPosition,
          };
        }
      }

      return {
        ...prev,
        playerPosition: newPos,
        score,
        remainingNumbers: updatedNumbers,
      };
    },
    [currentRule, onGameOver]
  );

  // KEYBOARD support (arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let direction: Direction | null = null;

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
      }

      if (direction) {
        movePlayer(direction);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [gameStatus]);

  // SWIPE support (mobile)
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

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 50) {
        movePlayer("right");
      } else if (dx < -50) {
        movePlayer("left");
      }
    } else {
      if (dy > 50) {
        movePlayer("down");
      } else if (dy < -50) {
        movePlayer("up");
      }
    }

    touchStartRef.current = null;
  }, [isMobile]);

  // CLICK-TO-MOVE on adjacent spaces
  const movePlayerByClick = useCallback(
    (pos: Position) => {
      setGameStatus((prev) => {
        const { playerPosition, walls, glitchPositions } = prev;
        const dx = Math.abs(playerPosition.x - pos.x);
        const dy = Math.abs(playerPosition.y - pos.y);
        const isAdjacent = dx + dy === 1;
        const isWall = walls.some((wall) => isPositionEqual(wall, pos));
        const isGlitch = glitchPositions.some((g) =>
          isPositionEqual(g, pos)
        );
        if (!isAdjacent || isWall || isGlitch) return prev;
        return moveLogic(prev, pos);
      });
    },
    [moveLogic, setGameStatus]
  );

  // Programmatic player movement (arrow keys and swipe)
  const movePlayer = useCallback(
    (direction: Direction) => {
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
        return moveLogic(prev, newPos);
      });
    },
    [moveLogic, setGameStatus]
  );

  return {
    handleTouchStart,
    handleTouchEnd,
    movePlayerByClick,
  };
};
