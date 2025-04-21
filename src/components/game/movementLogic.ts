
import { isPositionEqual } from "./utils";
import { GameStatus, Position, GameRule } from "./types";
import { toast } from "sonner";

type MovementLogicParams = {
  prev: GameStatus;
  newPos: Position;
  currentRule: GameRule | null;
  onGameOver: (score: number) => void;
};

export function movementLogic({
  prev,
  newPos,
  currentRule,
  onGameOver,
}: MovementLogicParams): GameStatus {
  if (prev.walls.some((wall) => isPositionEqual(wall, newPos))) {
    return prev;
  }

  let updatedNumbers = [...prev.remainingNumbers];
  let score = prev.score;
  let lives = prev.lives;
  let playerPosition = newPos; // Assume successful move unless wrong number or glitch

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
      // Wrong number: lose a life, reset position to start, and remove the number
      lives -= 1;
      toast.error("Wrong number! Lost a life and reset.");

      updatedNumbers.splice(collectedNumberIndex, 1);

      playerPosition = prev.playerStart || { x: 0, y: 0 };

      if (lives <= 0) {
        onGameOver(score);
        return prev;
      }
      return {
        ...prev,
        lives,
        playerPosition,
        remainingNumbers: updatedNumbers,
      };
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
    lives = prev.lives - 1;
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
    playerPosition,
    score,
    lives,
    remainingNumbers: updatedNumbers,
  };
}
