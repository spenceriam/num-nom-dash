
import { Position } from "../types";
import { isPositionEqual } from "../utils";

// Get the best move for a glitch to chase the player with reduced speed
export function getChaseMove(
  glitch: Position,
  playerPos: Position,
  walls: Position[],
  gridSize: number = 6
): Position {
  // 70% chance to stay in place (reduces effective speed)
  if (Math.random() < 0.7) {
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
