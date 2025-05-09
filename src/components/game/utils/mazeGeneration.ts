
import { Position } from "../types";
import { isPositionEqual, getRandomPosition } from "./positions";
import {
  generateExpressionEqualsTo,
  generateNonMatchingExpression,
  generateExpressionForRule
} from "./expressions";
import { getRandomNumber } from "./mathHelpers";

/**
 * Generates a random maze with basic configuration
 */
export function generateRandomMaze(width: number, height: number) {
  const gridSize = Math.min(width, height);
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

/**
 * Generates a maze with appropriate difficulty and game rule
 */
export function generateEasyMaze(
  width: number,
  height: number,
  rule: (expression: string) => boolean,
  useExpressions: boolean = false
) {
  // Get the current level from the game status to determine difficulty
  const currentLevel = window.location.search.includes('challenge') ?
    parseInt(localStorage.getItem('challengeLevel') || '1', 10) :
    parseInt(new URLSearchParams(window.location.search).get('level') || '1', 10);

  // Determine grid size based on level
  const gridSize = currentLevel <= 3 ? 6 : // Small grid for early levels
                  currentLevel <= 6 ? 7 : // Medium grid for mid levels
                  currentLevel <= 10 ? 8 : // Larger grid for later levels
                  9; // Largest grid for advanced levels

  // Initialize walls array
  const walls: Position[] = [];

  // Add walls for higher levels
  if (currentLevel > 3) {
    const wallCount = Math.min(
      Math.floor(currentLevel / 2), // Increase walls with level
      Math.floor(gridSize * gridSize * 0.15) // Cap at 15% of grid
    );

    addWalls(walls, wallCount, gridSize);
  }

  // Randomly place player
  const playerStart = getRandomPosition(gridSize, walls);

  // Determine number of glitches based on level
  const glitchCount = currentLevel <= 3 ? 1 : // 1 glitch for early levels
                     currentLevel <= 8 ? 2 : // 2 glitches for mid levels
                     3; // 3 glitches for advanced levels

  // Place glitches
  const glitches: Position[] = [];
  for (let i = 0; i < glitchCount; i++) {
    const avoidPositions = [playerStart, ...glitches, ...walls];
    const glitchPos = getRandomPosition(gridSize, avoidPositions);
    glitches.push(glitchPos);
  }

  // Initialize the numbers array
  const numbers: { position: Position; value: string }[] = [];

  // Create a list of all grid positions except player and wall positions
  // Include glitch positions so they can have numbers too
  const allPositions: Position[] = [];
  const glitchPositions: Position[] = [];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const pos = { x, y };
      if (!isPositionEqual(pos, playerStart) && !walls.some(w => isPositionEqual(w, pos))) {
        // Check if this is a glitch position
        if (glitches.some(g => isPositionEqual(g, pos))) {
          glitchPositions.push(pos);
        } else {
          allPositions.push(pos);
        }
      }
    }
  }

  // Shuffle positions
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
  }

  // Determine target number for rules that need it
  let target: number | null = null;
  const ruleStr = rule.toString();

  // Extract target from rule if it exists
  if (ruleStr.includes("10")) target = 10;
  else if (ruleStr.includes("12")) target = 12;
  else if (ruleStr.includes("15")) target = 15;
  else if (ruleStr.includes("16")) target = 16;
  else if (ruleStr.includes("20")) target = 20;
  else if (ruleStr.includes("24")) target = 24;
  else if (ruleStr.includes("5")) target = 5;
  else if (ruleStr.includes("8")) target = 8;
  else if (ruleStr.includes("9")) target = 9;

  // Add rule-matching numbers/expressions
  // Scale matching count with grid size and level
  const minRuleMatchingCount = Math.max(
    5, // Minimum of 5 matching items
    Math.floor(allPositions.length * 0.3) // Or 30% of available positions
  );

  let ruleMatchingAdded = 0;
  const remainingPositions = [...allPositions];

  while (ruleMatchingAdded < minRuleMatchingCount && remainingPositions.length > 0) {
    const position = remainingPositions.pop()!;
    let value: string;

    if (useExpressions) {
      if (target) {
        // Generate expression based on rule type
        if (ruleStr.includes("addition")) {
          value = generateExpressionEqualsTo(target, 'addition');
        } else if (ruleStr.includes("subtraction")) {
          value = generateExpressionEqualsTo(target, 'subtraction');
        } else if (ruleStr.includes("multiple")) {
          value = generateExpressionEqualsTo(target, 'multiplication');
        } else if (ruleStr.includes("factor")) {
          // For factors, we need a number that is a factor of the target
          const factors = [];
          for (let i = 1; i <= target; i++) {
            if (target % i === 0) factors.push(i);
          }
          value = factors[Math.floor(Math.random() * factors.length)].toString();
        } else {
          value = generateExpressionEqualsTo(target);
        }
      } else {
        // Fallback for rules without a target
        value = generateExpressionEqualsTo(10);
      }
    } else {
      // Simple number generation for basic rules
      if (ruleStr.includes("evens")) {
        value = (getRandomNumber(1, 10) * 2).toString();
      } else if (ruleStr.includes("odds")) {
        value = (getRandomNumber(0, 9) * 2 + 1).toString();
      } else if (ruleStr.includes("prime")) {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
        value = primes[Math.floor(Math.random() * primes.length)].toString();
      } else if (ruleStr.includes("factor") && target) {
        const factors = [];
        for (let i = 1; i <= target; i++) {
          if (target % i === 0) factors.push(i);
        }
        value = factors[Math.floor(Math.random() * factors.length)].toString();
      } else {
        value = getRandomNumber(1, 20).toString();
      }
    }

    numbers.push({ position, value });
    ruleMatchingAdded++;
  }

  // Now add numbers to glitch positions (randomly matching or non-matching)
  for (const position of glitchPositions) {
    let value: string;
    // 50% chance of being a matching number
    const shouldMatch = Math.random() < 0.5;

    if (shouldMatch) {
      // Generate a matching value using the same logic as above
      if (useExpressions) {
        if (target) {
          if (ruleStr.includes("addition")) {
            value = generateExpressionEqualsTo(target, 'addition');
          } else if (ruleStr.includes("subtraction")) {
            value = generateExpressionEqualsTo(target, 'subtraction');
          } else if (ruleStr.includes("multiple")) {
            value = generateExpressionEqualsTo(target, 'multiplication');
          } else if (ruleStr.includes("factor")) {
            const factors = [];
            for (let i = 1; i <= target; i++) {
              if (target % i === 0) factors.push(i);
            }
            value = factors[Math.floor(Math.random() * factors.length)].toString();
          } else {
            value = generateExpressionEqualsTo(target);
          }
        } else {
          value = generateExpressionEqualsTo(10);
        }
      } else {
        if (ruleStr.includes("evens")) {
          value = (getRandomNumber(1, 10) * 2).toString();
        } else if (ruleStr.includes("odds")) {
          value = (getRandomNumber(0, 9) * 2 + 1).toString();
        } else if (ruleStr.includes("prime")) {
          const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
          value = primes[Math.floor(Math.random() * primes.length)].toString();
        } else if (ruleStr.includes("factor") && target) {
          const factors = [];
          for (let i = 1; i <= target; i++) {
            if (target % i === 0) factors.push(i);
          }
          value = factors[Math.floor(Math.random() * factors.length)].toString();
        } else {
          value = getRandomNumber(1, 20).toString();
        }
      }
    } else {
      // Generate a non-matching value
      if (useExpressions) {
        if (target) {
          if (ruleStr.includes("addition")) {
            value = generateNonMatchingExpression(target, 'addition');
          } else if (ruleStr.includes("subtraction")) {
            value = generateNonMatchingExpression(target, 'subtraction');
          } else if (ruleStr.includes("multiple")) {
            value = generateNonMatchingExpression(target, 'multiplication');
          } else {
            value = generateNonMatchingExpression(target);
          }
        } else {
          value = generateNonMatchingExpression(10);
        }
      } else {
        if (ruleStr.includes("evens")) {
          value = (getRandomNumber(0, 9) * 2 + 1).toString(); // Odd numbers
        } else if (ruleStr.includes("odds")) {
          value = (getRandomNumber(1, 10) * 2).toString(); // Even numbers
        } else if (ruleStr.includes("prime")) {
          let num;
          const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
          do {
            num = getRandomNumber(4, 30);
          } while (primes.includes(num));
          value = num.toString();
        } else if (ruleStr.includes("factor") && target) {
          let num;
          do {
            num = getRandomNumber(2, target * 2);
          } while (target % num === 0);
          value = num.toString();
        } else {
          value = getRandomNumber(1, 20).toString();
        }
      }
    }

    numbers.push({ position, value });
  }

  // Fill remaining positions with non-matching values
  while (remainingPositions.length > 0) {
    const position = remainingPositions.pop()!;
    let value: string;

    if (useExpressions) {
      if (target) {
        // Generate non-matching expression based on rule type
        if (ruleStr.includes("addition")) {
          value = generateNonMatchingExpression(target, 'addition');
        } else if (ruleStr.includes("subtraction")) {
          value = generateNonMatchingExpression(target, 'subtraction');
        } else if (ruleStr.includes("multiple")) {
          value = generateNonMatchingExpression(target, 'multiplication');
        } else {
          value = generateNonMatchingExpression(target);
        }
      } else {
        value = generateNonMatchingExpression(10);
      }
    } else {
      // Simple non-matching number generation
      if (ruleStr.includes("evens")) {
        value = (getRandomNumber(0, 9) * 2 + 1).toString(); // Odd numbers
      } else if (ruleStr.includes("odds")) {
        value = (getRandomNumber(1, 10) * 2).toString(); // Even numbers
      } else if (ruleStr.includes("prime")) {
        // Generate a non-prime number
        let num;
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
        do {
          num = getRandomNumber(4, 30);
        } while (primes.includes(num));
        value = num.toString();
      } else if (ruleStr.includes("factor") && target) {
        // Generate a non-factor
        let num;
        do {
          num = getRandomNumber(2, target * 2);
        } while (target % num === 0);
        value = num.toString();
      } else {
        value = getRandomNumber(1, 20).toString();
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
}

/**
 * Adds wall obstacles to the maze
 * @param walls Array to add wall positions to
 * @param count Number of walls to add
 * @param gridSize Size of the grid
 */
function addWalls(walls: Position[], count: number, gridSize: number) {
  // Add individual walls
  for (let i = 0; i < count; i++) {
    // Avoid placing walls at the edges to prevent blocking
    const x = getRandomNumber(1, gridSize - 2);
    const y = getRandomNumber(1, gridSize - 2);
    const wallPos = { x, y };

    // Check if this position already has a wall
    if (!walls.some(w => isPositionEqual(w, wallPos))) {
      walls.push(wallPos);
    }
  }

  // For higher counts, add some wall patterns
  if (count > 3) {
    // Add a small L-shaped wall
    const startX = getRandomNumber(1, gridSize - 3);
    const startY = getRandomNumber(1, gridSize - 3);

    const lWall1 = { x: startX, y: startY };
    const lWall2 = { x: startX + 1, y: startY };
    const lWall3 = { x: startX, y: startY + 1 };

    // Only add if none of these positions already have walls
    if (!walls.some(w =>
      isPositionEqual(w, lWall1) ||
      isPositionEqual(w, lWall2) ||
      isPositionEqual(w, lWall3)
    )) {
      walls.push(lWall1, lWall2, lWall3);
    }
  }
}
