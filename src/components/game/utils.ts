
import { Position } from "./types";

export const isPositionEqual = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

export const generateRandomMaze = (width: number, height: number) => {
  // This is a placeholder for a more sophisticated maze generation algorithm
  // For now, we'll just create a simple maze with some walls and numbers
  
  const walls: Position[] = [];
  
  // Add some walls
  for (let i = 0; i < 10; i++) {
    walls.push({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    });
  }
  
  // Generate numbers
  const numbers: { position: Position; value: number }[] = [];
  for (let i = 0; i < 15; i++) {
    let position: Position;
    do {
      position = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
      };
    } while (
      walls.some(wall => isPositionEqual(wall, position)) ||
      numbers.some(num => isPositionEqual(num.position, position))
    );
    
    numbers.push({
      position,
      value: Math.floor(Math.random() * 100) + 1 // Random number 1-100
    });
  }
  
  // Add glitches
  const glitches: Position[] = [];
  for (let i = 0; i < 3; i++) {
    let position: Position;
    do {
      position = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
      };
    } while (
      walls.some(wall => isPositionEqual(wall, position)) ||
      numbers.some(num => isPositionEqual(num.position, position)) ||
      glitches.some(glitch => isPositionEqual(glitch, position))
    );
    
    glitches.push(position);
  }
  
  // Set player start position
  let playerStart: Position;
  do {
    playerStart = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };
  } while (
    walls.some(wall => isPositionEqual(wall, playerStart)) ||
    numbers.some(num => isPositionEqual(num.position, playerStart)) ||
    glitches.some(glitch => isPositionEqual(glitch, playerStart))
  );
  
  return {
    width,
    height,
    walls,
    numbers,
    glitches,
    playerStart
  };
};
