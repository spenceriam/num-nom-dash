
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

// Generates a 6x6 grid with string-based expressions
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

  // Fill all cells (except player position and glitch) with expressions
  const numbers: { position: Position; value: string }[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const position = { x, y };
      if (!isPositionEqual(position, playerStart) && !isPositionEqual(position, glitchPos)) {
        // Generate various expressions like 5+5, 12-2, 2*5, 10/2
        const possibleExpressions = [
          `${Math.floor(Math.random() * 10)}+${Math.floor(Math.random() * 10)}`,
          `${Math.floor(Math.random() * 20)}-${Math.floor(Math.random() * 10)}`,
          `${Math.floor(Math.random() * 5)}*${Math.floor(Math.random() * 5)}`,
          `${Math.floor(Math.random() * 10) * (Math.floor(Math.random() * 5) + 1)}/${Math.floor(Math.random() * 5) + 1}`
        ];
        
        numbers.push({
          position,
          value: possibleExpressions[Math.floor(Math.random() * possibleExpressions.length)]
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

// Generate a 6x6 maze with expressions that match a specific rule
export const generateEasyMaze = (
  width: number,
  height: number,
  rule: (expression: string) => boolean
) => {
  const gridSize = 6;
  const walls: Position[] = [];
  
  // Player starts in a corner
  const playerStart = { x: 0, y: 0 };

  // Add one glitch in the opposite corner
  const glitchPos = { x: gridSize - 1, y: gridSize - 1 };
  const glitches = [glitchPos];
  const numbers: { position: Position; value: string }[] = [];
  
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

  // Add rule-matching expressions (minimum 5)
  const minRuleMatchingCount = 5;
  let ruleMatchingAdded = 0;
  const targetValue = 5; // Use 5 as default target for demo

  while (ruleMatchingAdded < minRuleMatchingCount && allPositions.length > 0) {
    const position = allPositions.pop()!;
    
    // Generate expressions based on the current rule
    let expression = "";
    if (rule.toString().includes("equalsTo5")) {
      expression = generateExpressionEqualsTo(5);
    } else if (rule.toString().includes("equalsTo10")) {
      expression = generateExpressionEqualsTo(10);
    } else if (rule.toString().includes("equalsTo15")) {
      expression = generateExpressionEqualsTo(15);
    } else if (rule.toString().includes("equalsTo20")) {
      expression = generateExpressionEqualsTo(20);
    } else if (rule.toString().includes("multiplyTo12")) {
      expression = `${Math.floor(Math.random() * 4) + 1}*${12 / (Math.floor(Math.random() * 4) + 1)}`;
    } else if (rule.toString().includes("divideToWhole")) {
      const divisor = Math.floor(Math.random() * 5) + 1;
      const dividend = divisor * (Math.floor(Math.random() * 10) + 1);
      expression = `${dividend}/${divisor}`;
    } else {
      // Fallback
      expression = generateExpressionEqualsTo(targetValue);
    }
    
    numbers.push({ position, value: expression });
    ruleMatchingAdded++;
  }

  // Fill remaining positions with non-matching expressions
  while (allPositions.length > 0) {
    const position = allPositions.pop()!;
    let expression = "";
    let tries = 0;
    
    do {
      if (rule.toString().includes("equalsTo5")) {
        expression = generateNonMatchingExpression(5);
      } else if (rule.toString().includes("equalsTo10")) {
        expression = generateNonMatchingExpression(10);
      } else if (rule.toString().includes("equalsTo15")) {
        expression = generateNonMatchingExpression(15);
      } else if (rule.toString().includes("equalsTo20")) {
        expression = generateNonMatchingExpression(20);
      } else if (rule.toString().includes("multiplyTo12")) {
        // Generate expression that doesn't multiply to 12
        const nonTwelveProduct = 12 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
        expression = `${Math.floor(Math.random() * 4) + 1}*${nonTwelveProduct / (Math.floor(Math.random() * 4) + 1)}`;
      } else if (rule.toString().includes("divideToWhole")) {
        // Generate expression that doesn't divide evenly
        const divisor = Math.floor(Math.random() * 5) + 2;
        const dividend = divisor * (Math.floor(Math.random() * 10) + 1) + 1;
        expression = `${dividend}/${divisor}`;
      } else {
        // Fallback
        expression = generateNonMatchingExpression(targetValue);
      }
      
      tries++;
      if (tries > 30) break;
    } while (
      rule(expression) || 
      hasDuplicateNeighbor(position, expression, numbers, gridSize)
    );
    
    numbers.push({ position, value: expression });
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
