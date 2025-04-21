
import { Position } from "../types";
import { isPositionEqual } from "../utils";

// Get random direction for the glitch
function getRandomMove(
  glitch: Position,
  walls: Position[],
  gridSize: number = 6
): Position {
  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
  ];

  // Shuffle directions randomly
  for (let i = directions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [directions[i], directions[j]] = [directions[j], directions[i]];
  }

  // Try each direction until we find a valid move
  for (const dir of directions) {
    const newPos = {
      x: glitch.x + dir.x,
      y: glitch.y + dir.y
    };

    if (
      newPos.x >= 0 && newPos.x < gridSize &&
      newPos.y >= 0 && newPos.y < gridSize &&
      !walls.some(w => isPositionEqual(w, newPos))
    ) {
      return newPos;
    }
  }

  // If no valid moves found, stay in place
  return glitch;
}

// Get the best move for a glitch to chase the player
function getChasePlayerMove(
  glitch: Position,
  playerPos: Position,
  walls: Position[],
  gridSize: number = 6
): Position {
  // Reduced chance to stay in place from 70% to 30% (increases effective chase speed)
  if (Math.random() < 0.3) {
    return glitch;
  }

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

// Main function to determine glitch movement
export function getChaseMove(
  glitch: Position,
  playerPos: Position,
  walls: Position[],
  remainingNumbersCount: number,
  gridSize: number = 6
): Position {
  // Chase player when 1 or 0 numbers remain, otherwise move randomly
  if (remainingNumbersCount <= 1) {
    return getChasePlayerMove(glitch, playerPos, walls, gridSize);
  }

  // 50% chance to stay in place (reduces effective speed)
  if (Math.random() < 0.5) {
    return glitch;
  }

  return getRandomMove(glitch, walls, gridSize);
}
