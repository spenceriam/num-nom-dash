
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

// Get the best move for a glitch to chase the player
function getChaseMove(
  glitch: Position,
  playerPos: Position,
  walls: Position[],
  gridSize: number = 6
): Position {
  // Calculate differences
  const dx = playerPos.x - glitch.x;
  const dy = playerPos.y - glitch.y;
  
  // Prioritize moving in the direction of larger difference
  let possibleMoves: Position[] = [];
  
  if (Math.abs(dx) > Math.abs(dy)) {
    // Try horizontal movement first
    if (dx > 0) possibleMoves.push({ x: glitch.x + 1, y: glitch.y });
    else if (dx < 0) possibleMoves.push({ x: glitch.x - 1, y: glitch.y });
    
    // Then vertical
    if (dy > 0) possibleMoves.push({ x: glitch.x, y: glitch.y + 1 });
    else if (dy < 0) possibleMoves.push({ x: glitch.x, y: glitch.y - 1 });
  } else {
    // Try vertical movement first
    if (dy > 0) possibleMoves.push({ x: glitch.x, y: glitch.y + 1 });
    else if (dy < 0) possibleMoves.push({ x: glitch.x, y: glitch.y - 1 });
    
    // Then horizontal
    if (dx > 0) possibleMoves.push({ x: glitch.x + 1, y: glitch.y });
    else if (dx < 0) possibleMoves.push({ x: glitch.x - 1, y: glitch.y });
  }
  
  // Filter valid moves
  const validMoves = possibleMoves.filter(pos => 
    pos.x >= 0 && pos.x < gridSize &&
    pos.y >= 0 && pos.y < gridSize &&
    !walls.some(w => isPositionEqual(w, pos))
  );
  
  // If no valid moves, stay in place
  if (validMoves.length === 0) return glitch;
  
  // Return the first valid move (which is the preferred direction)
  return validMoves[0];
}

// Get random move for glitch (original behavior)
function getRandomGlitchMove(
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

  // Check how many valid numbers remain
  const remainingValidNumbers = currentRule ? 
    updatedNumbers.filter(num => currentRule.isMatch(num.value)) : 
    [];
  
  // If only one valid number remains, glitches will chase the player
  const shouldChase = remainingValidNumbers.length === 1;
  
  // Move all glitches
  let updatedGlitchPositions = prev.glitchPositions.map(glitch => 
    shouldChase ? 
      getChaseMove(glitch, playerPosition, prev.walls) :
      getRandomGlitchMove(glitch, prev.walls, playerPosition)
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
      const message = shouldChase ? 
        "The glitches caught you! 1 life lost" : 
        "Hit by a glitch! 1 life lost";
      toast.error(`${message} - ${lives} remaining`);
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
