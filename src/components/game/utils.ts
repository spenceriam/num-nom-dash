
import { Position } from "./types";

export const isPositionEqual = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

export const generateRandomMaze = (width: number, height: number) => {
  // Create more consistent maze with proper placement
  const gridSize = 6; // Use 6x6 grid size
  
  // Predefined walls (similar to the image)
  const walls: Position[] = [
    {x: 0, y: 0}, // top-left corner
    {x: 1, y: 3}, // middle-left area
    {x: 4, y: 2}, // middle-right area
    {x: 4, y: 4}, // bottom-right area
  ];
  
  // Generate numbers for ALL remaining cells
  const numbers: { position: Position; value: number }[] = [];
  
  // Fill every non-wall cell with a number
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const position = {x, y};
      
      // Skip if this position is a wall
      if (walls.some(wall => isPositionEqual(wall, position))) {
        continue;
      }
      
      // Add a number between 1-99
      numbers.push({
        position,
        value: Math.floor(Math.random() * 99) + 1
      });
    }
  }
  
  // Add glitches (3 glitches)
  const glitches: Position[] = [];
  
  // Attempt to place glitches at specific positions similar to the image
  const targetGlitchPositions = [
    {x: 4, y: 0}, // top-right area
    {x: 2, y: 4}, // bottom-left area  
    {x: 2, y: 5}, // bottom-left corner
  ];
  
  for (const pos of targetGlitchPositions) {
    // Remove any number at this position
    const numberIndex = numbers.findIndex(num => 
      isPositionEqual(num.position, pos)
    );
    
    if (numberIndex !== -1) {
      numbers.splice(numberIndex, 1);
    }
    
    glitches.push(pos);
  }
  
  // Set player start position in the bottom-right, similar to the image
  const playerStart = {x: 3, y: 5};
  
  // Remove any number at the player position
  const playerNumberIndex = numbers.findIndex(num => 
    isPositionEqual(num.position, playerStart)
  );
  
  if (playerNumberIndex !== -1) {
    numbers.splice(playerNumberIndex, 1);
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
