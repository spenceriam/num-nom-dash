
import { Position } from "./types";

export const isPositionEqual = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

export const generateRandomMaze = (width: number, height: number) => {
  // Create more consistent maze with proper placement
  const gridSize = 6; // Use 6x6 grid size
  const walls: Position[] = [];
  
  // Add some walls (approximately 15% of the board)
  const wallCount = Math.floor(gridSize * gridSize * 0.15);
  for (let i = 0; i < wallCount; i++) {
    walls.push({
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    });
  }
  
  // Generate numbers (approximately 50% of the remaining cells)
  const numbers: { position: Position; value: number }[] = [];
  const cellCount = Math.floor((gridSize * gridSize - walls.length) * 0.5);
  
  // Make sure we generate at least 10 numbers
  const minNumberCount = Math.min(10, gridSize * gridSize - walls.length - 4); // -4 to leave room for player and glitches
  const targetNumberCount = Math.max(cellCount, minNumberCount);
  
  for (let i = 0; i < targetNumberCount; i++) {
    let position: Position;
    let attempts = 0;
    do {
      position = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
      attempts++;
      // Prevent infinite loop if board is too full
      if (attempts > 50) break;
    } while (
      walls.some(wall => isPositionEqual(wall, position)) ||
      numbers.some(num => isPositionEqual(num.position, position))
    );
    
    // Skip if we couldn't find a valid position after many attempts
    if (attempts > 50) continue;
    
    numbers.push({
      position,
      value: Math.floor(Math.random() * 100) + 1 // Random number 1-100
    });
  }
  
  // Add glitches (2-3 glitches)
  const glitches: Position[] = [];
  const glitchCount = Math.floor(Math.random() * 2) + 2; // 2-3 glitches
  
  for (let i = 0; i < glitchCount; i++) {
    let position: Position;
    let attempts = 0;
    do {
      position = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
      attempts++;
      if (attempts > 50) break;
    } while (
      walls.some(wall => isPositionEqual(wall, position)) ||
      numbers.some(num => isPositionEqual(num.position, position)) ||
      glitches.some(glitch => isPositionEqual(glitch, position))
    );
    
    // Skip if we couldn't find a valid position
    if (attempts > 50) continue;
    
    glitches.push(position);
  }
  
  // Set player start position (preferably in a corner or edge)
  const possibleStartPositions = [
    {x: 0, y: 0}, {x: 0, y: gridSize-1}, 
    {x: gridSize-1, y: 0}, {x: gridSize-1, y: gridSize-1}
  ];
  
  let playerStart: Position | null = null;
  
  // Try corner positions first
  for (const pos of possibleStartPositions) {
    if (
      !walls.some(wall => isPositionEqual(wall, pos)) &&
      !numbers.some(num => isPositionEqual(num.position, pos)) &&
      !glitches.some(glitch => isPositionEqual(glitch, pos))
    ) {
      playerStart = pos;
      break;
    }
  }
  
  // If no corner works, try any valid position
  if (!playerStart) {
    let attempts = 0;
    do {
      const pos = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
      
      if (
        !walls.some(wall => isPositionEqual(wall, pos)) &&
        !numbers.some(num => isPositionEqual(num.position, pos)) &&
        !glitches.some(glitch => isPositionEqual(glitch, pos))
      ) {
        playerStart = pos;
        break;
      }
      attempts++;
    } while (attempts < 50);
  }
  
  // Final fallback - clear a random cell if we still don't have a player position
  if (!playerStart) {
    playerStart = { x: 0, y: 0 };
    
    // Remove any conflicting entities at this position
    const wallIndex = walls.findIndex(wall => isPositionEqual(wall, playerStart));
    if (wallIndex !== -1) walls.splice(wallIndex, 1);
    
    const numberIndex = numbers.findIndex(num => isPositionEqual(num.position, playerStart));
    if (numberIndex !== -1) numbers.splice(numberIndex, 1);
    
    const glitchIndex = glitches.findIndex(glitch => isPositionEqual(glitch, playerStart));
    if (glitchIndex !== -1) glitches.splice(glitchIndex, 1);
  }
  
  return {
    width: gridSize,
    height: gridSize,
    walls,
    numbers,
    glitches,
    playerStart
  };
};
