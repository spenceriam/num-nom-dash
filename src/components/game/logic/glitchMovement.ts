
import { Position } from "../types";
import { isPositionEqual } from "../utils";
import { getRandomNumber } from "../utils/mathHelpers";

/**
 * Direction vectors for movement
 */
const DIRECTIONS = [
  { x: 1, y: 0 },  // right
  { x: -1, y: 0 }, // left
  { x: 0, y: 1 },  // down
  { x: 0, y: -1 }  // up
];

/**
 * Gets a random valid move for the glitch
 */
function getRandomMove(
  glitch: Position,
  walls: Position[],
  gridSize: number = 6
): Position {
  // Clone and shuffle directions randomly
  const directions = [...DIRECTIONS];
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

/**
 * Gets the best move for a glitch to chase the player using basic pathfinding
 */
function getBasicChaseMove(
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

/**
 * Gets the best move for a glitch to chase the player using advanced pathfinding
 * Uses a simplified breadth-first search to find the shortest path
 */
function getSmartChaseMove(
  glitch: Position,
  playerPos: Position,
  walls: Position[],
  gridSize: number = 6
): Position {
  // If player and glitch are in the same position, stay put
  if (isPositionEqual(glitch, playerPos)) return glitch;

  // Use breadth-first search to find the shortest path
  const queue: { pos: Position; path: Position[] }[] = [{ pos: glitch, path: [] }];
  const visited: boolean[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(false));
  visited[glitch.y][glitch.x] = true;

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;

    // Check all four directions
    for (const dir of DIRECTIONS) {
      const newPos = { x: pos.x + dir.x, y: pos.y + dir.y };

      // Check if the new position is valid
      if (
        newPos.x >= 0 && newPos.x < gridSize &&
        newPos.y >= 0 && newPos.y < gridSize &&
        !visited[newPos.y][newPos.x] &&
        !walls.some(w => isPositionEqual(w, newPos))
      ) {
        // Create a new path by appending the new position
        const newPath = [...path, newPos];

        // If we've reached the player, return the first step in the path
        if (isPositionEqual(newPos, playerPos)) {
          return newPath.length > 0 ? newPath[0] : glitch;
        }

        // Mark as visited and add to queue
        visited[newPos.y][newPos.x] = true;
        queue.push({ pos: newPos, path: newPath });
      }
    }
  }

  // If no path found, fall back to basic chase
  return getBasicChaseMove(glitch, playerPos, walls, gridSize);
}

/**
 * Main function to determine glitch movement based on difficulty level
 */
export function getChaseMove(
  glitch: Position,
  playerPos: Position,
  walls: Position[],
  remainingNumbersCount: number,
  gridSize: number = 6
): Position {
  // Get the current level from the game status to determine difficulty
  const currentLevel = window.location.search.includes('challenge') ?
    parseInt(localStorage.getItem('challengeLevel') || '1', 10) :
    parseInt(new URLSearchParams(window.location.search).get('level') || '1', 10);

  // Determine if glitch should chase based on remaining numbers and level
  const shouldChase = remainingNumbersCount <= Math.max(1, 4 - Math.floor(currentLevel / 3));

  if (!shouldChase) {
    // Random movement with chance to stay in place based on level
    const stayChance = Math.max(0.1, 0.6 - (currentLevel * 0.03)); // Decreases with level
    if (Math.random() < stayChance) {
      return glitch;
    }
    return getRandomMove(glitch, walls, gridSize);
  }

  // Determine AI behavior based on level
  if (currentLevel <= 3) {
    // Early levels: Mostly random movement with occasional basic chase
    if (Math.random() < 0.7) {
      return getRandomMove(glitch, walls, gridSize);
    } else {
      // Reduced chance to stay in place
      if (Math.random() < 0.3) return glitch;
      return getBasicChaseMove(glitch, playerPos, walls, gridSize);
    }
  }
  else if (currentLevel <= 7) {
    // Mid levels: Basic pathfinding with occasional pauses
    if (Math.random() < 0.2) return glitch; // 20% chance to stay in place
    return getBasicChaseMove(glitch, playerPos, walls, gridSize);
  }
  else {
    // Advanced levels: Smart pathfinding with fewer pauses
    if (Math.random() < 0.1) return glitch; // 10% chance to stay in place

    // Use smart chase 70% of the time, basic chase 30% of the time
    if (Math.random() < 0.7) {
      return getSmartChaseMove(glitch, playerPos, walls, gridSize);
    } else {
      return getBasicChaseMove(glitch, playerPos, walls, gridSize);
    }
  }
}
