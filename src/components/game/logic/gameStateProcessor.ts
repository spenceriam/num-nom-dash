
import { GameStatus, Position, GameRule } from "../types";
import { isPositionEqual } from "../utils";
import { getChaseMove } from "./glitchMovement";
import { toast } from "sonner";

type ProcessMovementParams = {
  prev: GameStatus;
  newPos: Position;
  currentRule: GameRule | null;
  onGameOver: (score: number) => void;
  onLevelComplete?: () => void;
};

export function processMovement({
  prev,
  newPos,
  currentRule,
  onGameOver,
  onLevelComplete,
}: ProcessMovementParams): GameStatus {
  // Don't allow moving through walls
  if (prev.walls.some((wall) => isPositionEqual(wall, newPos))) {
    return prev;
  }

  let updatedNumbers = [...prev.remainingNumbers];
  let score = prev.score;
  let lives = prev.lives;
  let playerPosition = newPos;

  // Check if player collects a number
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
      // Removed the line that sent player back to start
      
      if (lives <= 0) {
        onGameOver(score);
        return prev;
      }
    }
  }

  // Check if there are any matching numbers left to determine if glitches should chase
  const remainingCorrectNumbers = updatedNumbers.filter((num) =>
    currentRule?.isMatch(num.value)
  );
  
  const shouldChase = remainingCorrectNumbers.length <= 1;

  // Move all glitches and let them consume numbers
  let updatedGlitchPositions = prev.glitchPositions.map(glitch => {
    const newGlitchPos = getChaseMove(
      glitch, 
      playerPosition, 
      prev.walls,
      shouldChase ? 1 : updatedNumbers.length
    );

    // Increased random chance (now 80%) to attempt consuming a number
    if (Math.random() < 0.8) {
      const numberAtNewPos = updatedNumbers.findIndex(num => 
        isPositionEqual(num.position, newGlitchPos)
      );
      
      if (numberAtNewPos !== -1) {
        const consumedNumber = updatedNumbers[numberAtNewPos];
        updatedNumbers.splice(numberAtNewPos, 1);
        if (currentRule?.isMatch(consumedNumber.value)) {
          toast.error("A glitch consumed a matching number!");
        }
      }
    }
    
    return newGlitchPos;
  });

  // Check if there are any matching numbers left after glitch movement
  const remainingCorrectNumbersAfterGlitch = updatedNumbers.filter((num) =>
    currentRule?.isMatch(num.value)
  );

  if (remainingCorrectNumbersAfterGlitch.length === 0 && updatedNumbers.length > 0 && currentRule) {
    onLevelComplete?.();
  }

  // Handle glitch collision
  if (updatedGlitchPositions.some((g) => isPositionEqual(g, newPos))) {
    lives = prev.lives - 1;
    if (lives <= 0) {
      onGameOver(score);
      return prev;
    } else {
      toast.error(`Hit by a glitch! 1 life lost - ${lives} remaining`);
      return {
        ...prev,
        lives,
        playerPosition: prev.playerStart || { x: 0, y: 0 },
        glitchPositions: updatedGlitchPositions
      };
    }
  }

  return {
    ...prev,
    playerPosition,
    score,
    lives,
    remainingNumbers: updatedNumbers,
    glitchPositions: updatedGlitchPositions
  };
}
