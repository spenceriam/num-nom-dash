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

// Check if a position has a neighbor with the same value
function hasDuplicateNeighbor(position: Position, value: number, numbers: { position: Position; value: number }[], gridSize: number) {
  const neighbors = getNeighbors(position, gridSize);
  return neighbors.some(neighborPos => 
    numbers.some(num => 
      isPositionEqual(num.position, neighborPos) && num.value === value
    )
  );
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
  
  // Player starts in a corner
  const playerStart = { x: 0, y: 0 };

  // Add one glitch in the opposite corner
  const glitchPos = { x: gridSize - 1, y: gridSize - 1 };
  const glitches = [glitchPos];
  const numbers: { position: Position; value: number }[] = [];
  
  // Get all available positions
  const allPositions: Position[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const pos = { x, y };
      if (!isPositionEqual(pos, playerStart) && !isPositionEqual(pos, glitchPos)) {
        allPositions.push(pos);
      }
    }
  }

  // Shuffle available positions
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
  }

  // Add rule-matching numbers (minimum 5)
  const minRuleMatchingCount = 5;
  let ruleMatchingAdded = 0;

  while (ruleMatchingAdded < minRuleMatchingCount && allPositions.length > 0) {
    const position = allPositions.pop()!;
    
    const createValue = () => {
      if (rule === rules.evenNumbers.isMatch) {
        return Math.floor(Math.random() * 50) * 2;
      } else {
        let val, attempts = 0;
        do {
          val = Math.floor(Math.random() * 99) + 1;
          attempts++;
          if (attempts > 30) break;
        } while (!rule(val));
        return val;
      }
    };
    
    const value = createValue();
    numbers.push({ position, value });
    ruleMatchingAdded++;
  }

  // Fill remaining positions with non-matching numbers
  while (allPositions.length > 0) {
    const position = allPositions.pop()!;
    let value, tries = 0;
    do {
      value = Math.floor(Math.random() * 99) + 1;
      tries++;
      if (tries > 30) break;
    } while (
      rule(value) || 
      hasDuplicateNeighbor(position, value, numbers, gridSize)
    );
    
    numbers.push({ position, value });
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
