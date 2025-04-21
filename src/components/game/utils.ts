import { Position } from "./types";

export const isPositionEqual = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

// Generates a 6x6 grid with no walls or glitches, numbers fill all cells except player position
export const generateRandomMaze = (width: number, height: number) => {
  const gridSize = 6;
  const walls: Position[] = [];
  const glitches: Position[] = [];

  // Place player at bottom-right corner by default for now
  const playerStart = { x: 5, y: 5 };

  // Fill all cells (except player position) with numbers
  const numbers: { position: Position; value: number }[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const position = { x, y };
      if (!isPositionEqual(position, playerStart)) {
        numbers.push({
          position,
          value: Math.floor(Math.random() * 99) + 1
        });
      }
    }
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

// Generate a 6x6 maze where the player's starting position is surrounded by numbers matching a rule
export const generateEasyMaze = (
  width: number,
  height: number,
  rule: (num: number) => boolean
) => {
  const gridSize = 6;
  const walls: Position[] = [];
  const glitches: Position[] = [];

  // Player always starts near the center (to maximize adjacent moves)
  const playerStart = { x: 2, y: 2 };
  const numbers: { position: Position; value: number }[] = [];
  const adjacentOffsets = [
    { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 },
    { dx: -1, dy: 0 }, /*player*/      { dx: 1, dy: 0 },
    { dx: -1, dy: 1 },  { dx: 0, dy: 1 }, { dx: 1, dy: 1 },
  ];

  // Place required numbers that match the rule in all adjacent cells
  for (const { dx, dy } of adjacentOffsets) {
    const x = playerStart.x + dx;
    const y = playerStart.y + dy;
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      let value;
      // Ensure we don't generate out-of-bounds numbers
      do {
        value = Math.floor(Math.random() * 50) * 2 + 2; // even from 2 to 100
      } while (!rule(value));
      numbers.push({ position: { x, y }, value });
    }
  }

  // Fill rest of the grid randomly
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const position = { x, y };
      if (isPositionEqual(position, playerStart) || numbers.some(n => isPositionEqual(n.position, position))) {
        continue;
      }
      numbers.push({
        position,
        value: Math.floor(Math.random() * 99) + 1
      });
    }
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
