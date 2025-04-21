
import { Position } from "./types";

export const isPositionEqual = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

// Helper: Get all neighbors for a position (including diagonals)
const neighborOffsets = [
  { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 },
  { dx: -1, dy: 0 },                    { dx: 1, dy: 0 },
  { dx: -1, dy: 1 },  { dx: 0, dy: 1 }, { dx: 1, dy: 1 },
];

function getNeighbors(pos: Position, gridSize: number) {
  return neighborOffsets
    .map(({ dx, dy }) => ({ x: pos.x + dx, y: pos.y + dy }))
    .filter(p => p.x >= 0 && p.x < gridSize && p.y >= 0 && p.y < gridSize);
}

// Ensures rule-matching numbers are always accessible by placing them in corners or edges
function getAccessiblePositions(gridSize: number, excludePositions: Position[]) {
  // Corner and edge positions are considered "accessible"
  const accessiblePositions: Position[] = [];
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      // Corner or edge positions
      if (x === 0 || y === 0 || x === gridSize-1 || y === gridSize-1) {
        const position = { x, y };
        if (!excludePositions.some(p => isPositionEqual(p, position))) {
          accessiblePositions.push(position);
        }
      }
    }
  }
  
  return accessiblePositions;
}

// Generates a 6x6 grid with no walls, a player, and one glitch
export const generateRandomMaze = (width: number, height: number) => {
  const gridSize = 6;
  const walls: Position[] = [];
  
  // Place player at bottom-right corner by default for now
  const playerStart = { x: 5, y: 5 };

  // Add one glitch in a random position that's not the player start
  let glitchPos: Position;
  do {
    glitchPos = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  } while (isPositionEqual(glitchPos, playerStart));

  const glitches = [glitchPos];

  // Fill all cells (except player position and glitch) with numbers
  const numbers: { position: Position; value: number }[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const position = { x, y };
      if (!isPositionEqual(position, playerStart) && !isPositionEqual(position, glitchPos)) {
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
// and rule-matching numbers are placed in accessible positions
export const generateEasyMaze = (
  width: number,
  height: number,
  rule: (num: number) => boolean
) => {
  const gridSize = 6;
  const walls: Position[] = [];
  
  // Player starts near the center
  const playerStart = { x: 2, y: 2 };

  // Add one glitch in a random position that's not near the player
  let glitchPos: Position;
  do {
    glitchPos = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  } while (
    Math.abs(glitchPos.x - playerStart.x) <= 1 && 
    Math.abs(glitchPos.y - playerStart.y) <= 1
  );

  const glitches = [glitchPos];
  const numbers: { position: Position; value: number }[] = [];
  const adjacentOffsets = [
    { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 },
    { dx: -1, dy: 0 }, /*player*/      { dx: 1, dy: 0 },
    { dx: -1, dy: 1 },  { dx: 0, dy: 1 }, { dx: 1, dy: 1 },
  ];

  // Helper function to check if a value is duplicate with any neighbor
  function isDuplicateAdj(position: Position, value: number) {
    return getNeighbors(position, gridSize).some(neigh => {
      const n = numbers.find(x => isPositionEqual(x.position, neigh));
      return n && n.value === value;
    });
  }

  // Place required numbers that match the rule in all adjacent cells
  for (const { dx, dy } of adjacentOffsets) {
    const x = playerStart.x + dx;
    const y = playerStart.y + dy;
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      if (!isPositionEqual({ x, y }, glitchPos)) {
        let value, tries = 0, maxTries = 30;
        do {
          value = Math.floor(Math.random() * 50) * 2 + 2;
          tries++;
          if (tries > maxTries) break;
        } while ((!rule(value) || isDuplicateAdj({ x, y }, value)));
        numbers.push({ position: { x, y }, value });
      }
    }
  }

  // Get accessible positions (corners and edges) for remaining rule-matching numbers
  const excludePositions = [playerStart, glitchPos, ...numbers.map(n => n.position)];
  const accessiblePositions = getAccessiblePositions(gridSize, excludePositions);
  
  // Ensure we have some rule-matching numbers in accessible positions
  const numMatchingToAdd = Math.min(3, accessiblePositions.length);
  for (let i = 0; i < numMatchingToAdd; i++) {
    if (accessiblePositions.length === 0) break;
    
    // Take a random accessible position
    const posIndex = Math.floor(Math.random() * accessiblePositions.length);
    const position = accessiblePositions[posIndex];
    accessiblePositions.splice(posIndex, 1);
    
    // Add a number matching the rule
    let value, tries = 0, maxTries = 30;
    do {
      value = rule === rules.evenNumbers.isMatch 
        ? Math.floor(Math.random() * 50) * 2 + 2 // Even number
        : Math.floor(Math.random() * 50) * 2 + 1; // Odd number (default)
      tries++;
      if (tries > maxTries) break;
    } while (!rule(value) || isDuplicateAdj(position, value));
    
    numbers.push({ position, value });
  }

  // Fill rest of the grid randomly
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const position = { x, y };
      if (
        isPositionEqual(position, playerStart) ||
        isPositionEqual(position, glitchPos) ||
        numbers.some(n => isPositionEqual(n.position, position))
      ) {
        continue;
      }
      let value, tries = 0, maxTries = 30;
      do {
        value = Math.floor(Math.random() * 99) + 1;
        tries++;
        if (tries > maxTries) break;
      } while (isDuplicateAdj(position, value));
      numbers.push({
        position,
        value
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

// Reference to rules for maze generation
const rules = {
  evenNumbers: {
    name: "Even Numbers",
    description: "Collect all even numbers",
    isMatch: (num: number) => num % 2 === 0
  }
};
