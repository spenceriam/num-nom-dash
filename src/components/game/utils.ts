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

// Ensures rule-matching expressions are always accessible by placing them in corners or edges
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
function hasDuplicateNeighbor(position: Position, value: string, expressions: { position: Position; value: string }[], gridSize: number) {
  const neighbors = getNeighbors(position, gridSize);
  return neighbors.some(neighborPos => 
    expressions.some(exp => 
      isPositionEqual(exp.position, neighborPos) && exp.value === value
    )
  );
}

// Helper to generate a random number within range
function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to generate expressions that equal to a target value
function generateExpressionEqualsTo(target: number): string {
  const operations = ['+', '-', '*', '/'];
  const operation = operations[Math.floor(Math.random() * 2)]; // Limit to + and - for simpler expressions
  
  switch (operation) {
    case '+':
      const addend1 = Math.floor(Math.random() * target);
      const addend2 = target - addend1;
      return `${addend1}+${addend2}`;
    case '-':
      const minuend = target + Math.floor(Math.random() * 10) + 1;
      const subtrahend = minuend - target;
      return `${minuend}-${subtrahend}`;
    case '*':
      const factors = getFactors(target);
      if (factors.length > 0) {
        const factorPair = factors[Math.floor(Math.random() * factors.length)];
        return `${factorPair[0]}*${factorPair[1]}`;
      }
      return `${target}*1`;
    case '/':
      const divisor = Math.floor(Math.random() * 5) + 1;
      const dividend = target * divisor;
      return `${dividend}/${divisor}`;
    default:
      return `${target}`;
  }
}

// Helper to get factors of a number for multiplication
function getFactors(n: number): number[][] {
  const factors: number[][] = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      factors.push([i, n / i]);
    }
  }
  return factors;
}

// Helper to generate a random expression that doesn't match the rule
function generateNonMatchingExpression(target: number): string {
  const randomValue = target + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
  return generateExpressionEqualsTo(randomValue);
}

// Helper function to get random position
function getRandomPosition(
  gridSize: number,
  excludePositions: Position[] = []
): Position {
  let position: Position;
  do {
    position = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  } while (excludePositions.some(pos => isPositionEqual(pos, position)));
  return position;
}

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

  // Fill all cells with expressions
  const numbers: { position: Position; value: string }[] = [];
  
  // Make sure all cells (except player and glitch) have numbers
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const position = { x, y };
      // Skip player position and glitch position
      if (!isPositionEqual(position, playerStart) && !isPositionEqual(position, glitchPos)) {
        numbers.push({
          position,
          value: generateRandomNumber(1, 20).toString()
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

export const generateEasyMaze = (
  width: number, 
  height: number,
  rule: (expression: string) => boolean,
  useExpressions: boolean = false
) => {
  const gridSize = 6;
  const walls: Position[] = [];
  
  // Randomly place player
  const playerStart = getRandomPosition(gridSize);
  
  // Randomly place glitch in a different position
  const glitchPos = getRandomPosition(gridSize, [playerStart]);
  const glitches = [glitchPos];
  
  // Create a list of all grid positions except player and glitch positions
  const allPositions: Position[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const pos = { x, y };
      if (!isPositionEqual(pos, playerStart) && !isPositionEqual(pos, glitchPos)) {
        allPositions.push(pos);
      }
    }
  }

  // Shuffle positions
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
  }

  // Add rule-matching numbers/expressions
  const minRuleMatchingCount = 5;
  let ruleMatchingAdded = 0;

  // Clone all positions array for tracking
  const remainingPositions = [...allPositions];

  while (ruleMatchingAdded < minRuleMatchingCount && remainingPositions.length > 0) {
    const position = remainingPositions.pop()!;
    let value: string;

    if (useExpressions) {
      if (rule.toString().includes("equalsTo10")) {
        value = generateExpressionEqualsTo(10);
      } else if (rule.toString().includes("equalsTo15")) {
        value = generateExpressionEqualsTo(15);
      } else if (rule.toString().includes("multiplyTo12")) {
        value = `${Math.floor(Math.random() * 4) + 1}*${12 / (Math.floor(Math.random() * 4) + 1)}`;
      } else {
        value = generateExpressionEqualsTo(10); // fallback
      }
    } else {
      // For levels 1-3, generate simple numbers
      if (rule.toString().includes("evens")) {
        value = (generateRandomNumber(1, 10) * 2).toString();
      } else if (rule.toString().includes("odds")) {
        value = (generateRandomNumber(0, 9) * 2 + 1).toString();
      } else if (rule.toString().includes("factorOf9")) {
        const factors = [1, 3, 9];
        value = factors[Math.floor(Math.random() * factors.length)].toString();
      } else {
        value = generateRandomNumber(1, 20).toString();
      }
    }
    
    numbers.push({ position, value });
    ruleMatchingAdded++;
  }

  // Fill remaining positions with non-matching values
  // This ensures all grid cells have a number
  while (remainingPositions.length > 0) {
    const position = remainingPositions.pop()!;
    let value: string;

    if (useExpressions) {
      value = generateNonMatchingExpression(10);
    } else {
      // For levels 1-3, generate simple non-matching numbers
      if (rule.toString().includes("evens")) {
        value = (generateRandomNumber(0, 9) * 2 + 1).toString();
      } else if (rule.toString().includes("odds")) {
        value = (generateRandomNumber(1, 10) * 2).toString();
      } else if (rule.toString().includes("factorOf9")) {
        let num;
        do {
          num = generateRandomNumber(2, 8);
        } while (9 % num === 0);
        value = num.toString();
      } else {
        value = generateRandomNumber(1, 20).toString();
      }
    }
    
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

// Reference to rules for maze generation (not used directly, just for pattern matching)
const rules = {
  evenNumbers: {
    name: "Even Numbers",
    description: "Collect all even numbers",
    isMatch: (num: string) => parseInt(num, 10) % 2 === 0
  }
};
