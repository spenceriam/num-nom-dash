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
  
  // Positions near the player to prioritize rule-matching numbers
  const priorityPositions = [
    { x: playerStart.x - 1, y: playerStart.y - 1 },
    { x: playerStart.x, y: playerStart.y - 1 },
    { x: playerStart.x + 1, y: playerStart.y - 1 },
    { x: playerStart.x - 1, y: playerStart.y },
    { x: playerStart.x + 1, y: playerStart.y },
    { x: playerStart.x - 1, y: playerStart.y + 1 },
    { x: playerStart.x, y: playerStart.y + 1 },
    { x: playerStart.x + 1, y: playerStart.y + 1 }
  ];

  // Ensure at least some rule-matching numbers are near the player
  const rulePriorityPositions = priorityPositions.filter(pos => 
    pos.x >= 0 && pos.x < gridSize && pos.y >= 0 && pos.y < gridSize
  );

  let ruleMatchingNumbersAdded = 0;
  for (const pos of rulePriorityPositions) {
    if (ruleMatchingNumbersAdded >= 3) break;
    if (!isPositionEqual(pos, glitchPos)) {
      let value, tries = 0;
      do {
        value = Math.floor(Math.random() * 50) * 2 + 2; // Even numbers
        tries++;
        if (tries > 30) break;
      } while (!rule(value) || 
        numbers.some(n => n.value === value && isPositionEqual(n.position, pos))
      );
      
      if (rule(value)) {
        numbers.push({ position: pos, value });
        ruleMatchingNumbersAdded++;
      }
    }
  }

  // Fill the rest of the grid
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
      
      let value, tries = 0;
      do {
        value = Math.floor(Math.random() * 99) + 1;
        tries++;
        if (tries > 30) break;
      } while (
        numbers.some(n => n.value === value && 
          (Math.abs(n.position.x - position.x) <= 1 && 
           Math.abs(n.position.y - position.y) <= 1))
      );
      
      numbers.push({ position, value });
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
