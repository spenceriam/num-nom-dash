
import { Position } from "../types";
import { getRandomPosition } from "./positions";
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
  useExpressions: boolean = false
) {
  const gridSize = 6;
  const walls: Position[] = [];
  
  // Randomly place player
  const playerStart = getRandomPosition(gridSize);
  
  // Randomly place glitch in a different position
  const glitchPos = getRandomPosition(gridSize, [playerStart]);
  const glitches = [glitchPos];
  
  // Initialize the numbers array
  const numbers: { position: Position; value: string }[] = [];
  
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
      if (rule.toString().includes("evens")) {
        value = (Math.floor(Math.random() * 10 + 1) * 2).toString();
      } else if (rule.toString().includes("odds")) {
        value = (Math.floor(Math.random() * 10) * 2 + 1).toString();
      } else if (rule.toString().includes("factorOf9")) {
        const factors = [1, 3, 9];
        value = factors[Math.floor(Math.random() * factors.length)].toString();
      } else {
        value = Math.floor(Math.random() * 20 + 1).toString();
      }
    }
    
    numbers.push({ position, value });
    ruleMatchingAdded++;
  }

  // Fill remaining positions with non-matching values
  while (remainingPositions.length > 0) {
    const position = remainingPositions.pop()!;
    let value: string;

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
      } else {
        value = Math.floor(Math.random() * 20 + 1).toString();
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
