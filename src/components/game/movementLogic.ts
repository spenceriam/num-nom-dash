import { isPositionEqual } from "./utils";
import { GameStatus, Position, GameRule } from "./types";
import { toast } from "sonner";

type MovementLogicParams = {
  prev: GameStatus;
  newPos: Position;
  currentRule: GameRule | null;
  onGameOver: (score: number) => void;
  onLevelComplete?: () => void;
};

export function movementLogic({
  prev,
  newPos,
  currentRule,
  onGameOver,
  onLevelComplete,
}: MovementLogicParams): GameStatus {
  if (prev.walls.some((wall) => isPositionEqual(wall, newPos))) {
    return prev;
  }

  let updatedNumbers = [...prev.remainingNumbers];
  let score = prev.score;
  let lives = prev.lives;
  let playerPosition = newPos;

  // Check if any glitch is on a number and remove that number
  prev.glitchPositions.forEach(glitch => {
    const numberIndex = updatedNumbers.findIndex(num => 
      isPositionEqual(num.position, glitch)
    );
    if (numberIndex !== -1) {
      updatedNumbers.splice(numberIndex, 1);
      toast.error("A glitch consumed a number!");
    }
  });

  const collectedNumberIndex = updatedNumbers.findIndex((num) =>
    isPositionEqual(num.position, newPos)
  );

  if (collectedNumberIndex !== -1) {
    const collectedNumber = updatedNumbers[collectedNumberIndex];

    if (currentRule && currentRule.isMatch(collectedNumber.value)) {
      score += 10;
      updatedNumbers.splice(collectedNumberIndex, 1);
      toast.success(`+10 points!`);
    } else {
      lives -= 1;
      toast.error(`Wrong number! Rule: ${currentRule?.name || 'No rule'}`);

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

  // Check if there are any matching numbers left
  const remainingCorrectNumbers = updatedNumbers.filter((num) =>
    currentRule?.isMatch(num.value)
  );

  if (remainingCorrectNumbers.length === 0 && currentRule) {
    onLevelComplete?.();
  }

  // Handle glitch collision
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
        playerPosition: prev.playerStart || { x: 0, y: 0 },
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
