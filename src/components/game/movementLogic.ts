
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

// Get all valid moves for the glitch (no walls, not on player's new position)
function getGlitchMove(
  glitch: Position, 
  walls: Position[], 
  playerPos: Position,
  gridSize: number = 6
): Position {
  // Possible moves: up, down, left, right (no diagonals for glitch)
  const possibleMoves = [
    { x: glitch.x, y: Math.max(0, glitch.y - 1) }, // up
    { x: glitch.x, y: Math.min(gridSize - 1, glitch.y + 1) }, // down
    { x: Math.max(0, glitch.x - 1), y: glitch.y }, // left
    { x: Math.min(gridSize - 1, glitch.x + 1), y: glitch.y }, // right
  ];
  
  // Filter out walls and player positions
  const validMoves = possibleMoves.filter(
    pos => !walls.some(w => isPositionEqual(w, pos)) && 
           !isPositionEqual(pos, playerPos)
  );
  
  // If no valid moves, stay in place
  if (validMoves.length === 0) {
    return glitch;
  }
  
  // Choose a random valid move
  return validMoves[Math.floor(Math.random() * validMoves.length)];
}

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
  
  // Move all glitches after player moves
  let updatedGlitchPositions = prev.glitchPositions.map(glitch => 
    getGlitchMove(glitch, prev.walls, playerPosition)
  );

  // Check if any glitch is on a number and remove that number
  updatedGlitchPositions.forEach(glitch => {
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
        glitchPositions: updatedGlitchPositions
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
  if (updatedGlitchPositions.some((g) => isPositionEqual(g, newPos))) {
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
