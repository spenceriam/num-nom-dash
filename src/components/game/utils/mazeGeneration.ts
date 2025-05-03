
import { Position } from "../types";
import { isPositionEqual, getRandomPosition } from "./positions";
import { generateExpressionEqualsTo, generateNonMatchingExpression } from "./expressions";

export function generateRandomMaze(width: number, height: number) {
  const gridSize = 6;
  const walls: Position[] = [];
  
  // Place player at random position
  const playerStart = getRandomPosition(gridSize);

  // Add one glitch in a random position that's not the player start
  const glitchPos = getRandomPosition(gridSize, [playerStart]);
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
          value: Math.floor(Math.random() * 20 + 1).toString()
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
}

export function generateEasyMaze(
  width: number, 
  height: number,
  rule: (expression: string) => boolean,
  useExpressions: boolean = false,
  numGlitches: number = 1,
  useWalls: boolean = false
) {
  const gridSize = width;
  const walls: Position[] = [];
  
  // Add walls if requested
  if (useWalls) {
    // Add some random walls
    const numWalls = Math.floor(gridSize * gridSize * 0.15); // about 15% of cells
    for (let i = 0; i < numWalls; i++) {
      const wallPos = getRandomPosition(gridSize);
      // Don't put walls at the edges to ensure playability
      if (wallPos.x > 0 && wallPos.x < gridSize - 1 && wallPos.y > 0 && wallPos.y < gridSize - 1) {
        walls.push(wallPos);
      }
    }
  }
  
  // Randomly place player avoiding walls
  let playerStart;
  do {
    playerStart = getRandomPosition(gridSize);
  } while (walls.some(wall => isPositionEqual(wall, playerStart)));
  
  // Randomly place glitches in different positions, avoiding walls and player
  const glitches: Position[] = [];
  for (let i = 0; i < numGlitches; i++) {
    let glitchPos;
    do {
      glitchPos = getRandomPosition(gridSize, [playerStart, ...glitches, ...walls]);
    } while (!glitchPos);
    glitches.push(glitchPos);
  }
  
  // Initialize the numbers array
  const numbers: { position: Position; value: string }[] = [];
  
  // Create a list of all grid positions except player, glitches, and walls
  const allPositions: Position[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const pos = { x, y };
      if (!isPositionEqual(pos, playerStart) && 
          !glitches.some(g => isPositionEqual(g, pos)) &&
          !walls.some(w => isPositionEqual(w, pos))) {
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
  const minRuleMatchingCount = Math.max(3, Math.min(5, Math.floor(allPositions.length * 0.3)));
  let ruleMatchingAdded = 0;

  // Clone all positions array for tracking
  const remainingPositions = [...allPositions];

  while (ruleMatchingAdded < minRuleMatchingCount && remainingPositions.length > 0) {
    const position = remainingPositions.pop()!;
    let value: string;

    if (useExpressions) {
      if (rule.toString().includes("equalsTo10")) {
        value = generateExpressionEqualsTo(10);
      } else if (rule.toString().includes("equals 10")) {
        value = generateExpressionEqualsTo(10);
      } else if (rule.toString().includes("multiplyTo12")) {
        value = `${Math.floor(Math.random() * 4) + 1}*${12 / (Math.floor(Math.random() * 4) + 1)}`;
      } else {
        // Generate an expression that will likely match the rule
        const baseNum = Math.floor(Math.random() * 10) + 1;
        if (rule.toString().includes("evens")) {
          value = `${baseNum}*2`;
        } else if (rule.toString().includes("odds")) {
          value = `${baseNum}*2-1`;
        } else if (rule.toString().includes("prime")) {
          const primes = [2, 3, 5, 7];
          value = primes[Math.floor(Math.random() * primes.length)].toString();
        } else {
          value = generateExpressionEqualsTo(baseNum);
        }
      }
    } else {
      if (rule.toString().includes("evens")) {
        value = (Math.floor(Math.random() * 10 + 1) * 2).toString();
      } else if (rule.toString().includes("odds")) {
        value = (Math.floor(Math.random() * 10) * 2 + 1).toString();
      } else if (rule.toString().includes("factorOf9")) {
        const factors = [1, 3, 9];
        value = factors[Math.floor(Math.random() * factors.length)].toString();
      } else if (rule.toString().includes("prime")) {
        const primes = [2, 3, 5, 7];
        value = primes[Math.floor(Math.random() * primes.length)].toString();
      } else {
        value = Math.floor(Math.random() * 20 + 1).toString();
      }
    }
    
    // Double check the value actually matches
    if (rule(value)) {
      numbers.push({ position, value });
      ruleMatchingAdded++;
    } else {
      // If it doesn't match, put it back and try again
      remainingPositions.push(position);
    }
  }

  // Fill remaining positions with non-matching values
  while (remainingPositions.length > 0) {
    const position = remainingPositions.pop()!;
    let value: string;
    let attempts = 0;
    
    // Try to generate a non-matching value with max attempts
    do {
      attempts++;
      if (useExpressions) {
        value = generateNonMatchingExpression(10);
      } else {
        if (rule.toString().includes("evens")) {
          value = (Math.floor(Math.random() * 10) * 2 + 1).toString();
        } else if (rule.toString().includes("odds")) {
          value = (Math.floor(Math.random() * 10 + 1) * 2).toString();
        } else if (rule.toString().includes("factorOf9")) {
          let num;
          do {
            num = Math.floor(Math.random() * 8 + 2);
          } while (9 % num === 0);
          value = num.toString();
        } else if (rule.toString().includes("prime")) {
          let num;
          const primes = [2, 3, 5, 7];
          do {
            num = Math.floor(Math.random() * 19 + 1);
          } while (primes.includes(num));
          value = num.toString();
        } else {
          value = Math.floor(Math.random() * 20 + 1).toString();
        }
      }
    } while (rule(value) && attempts < 5); // Try a few times to get a non-matching value
    
    // Add even if it matches after max attempts to prevent infinite loops
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
}
