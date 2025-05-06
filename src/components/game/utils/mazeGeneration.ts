import { Position, MazeConfig, GameType, Rule, Expression } from "../types";
import { isPositionEqual, getRandomPosition } from "./positions";
import { 
  generateExpressionsByLevel, 
  createExpression, 
  evaluateExpression,
  hasDuplicateNeighbor
} from "./expressions";

// Generate a level-appropriate maze based on game type and level
export function generateMaze(
  level: number,
  rule: Rule,
  useExpressions: boolean = true
): MazeConfig {
  // Grid size increases with level
  const gridSize = 4 + Math.min(Math.floor(level / 3), 2); // 4x4 to 6x6
  
  // Generate target number for applicable game types
  let targetNumber: number | undefined;
  if (rule.generateTarget) {
    targetNumber = rule.generateTarget();
  }
  
  // Initialize maze components
  const walls: Position[] = [];
  const playerStart = getRandomPosition(gridSize);
  
  // Add walls based on level (higher levels have more walls)
  if (level > 3) {
    const wallCount = Math.min(Math.floor(level / 2), 5);
    for (let i = 0; i < wallCount; i++) {
      const wallPos = getRandomPosition(gridSize, [playerStart, ...walls]);
      walls.push(wallPos);
    }
  }
  
  // Add glitches (more glitches at higher levels)
  const glitchCount = Math.min(Math.floor(level / 3) + 1, 3); // 1-3 glitches
  const glitches: Position[] = [];
  
  for (let i = 0; i < glitchCount; i++) {
    const glitchPos = getRandomPosition(gridSize, [playerStart, ...walls, ...glitches]);
    glitches.push(glitchPos);
  }
  
  // Calculate number of valid cells to include (scales with level and grid size)
  const validCellRatio = 0.3 + (Math.min(level, 10) / 100); // Increases slightly with level
  const validCellCount = Math.max(
    5, 
    Math.floor((gridSize * gridSize - walls.length - glitches.length - 1) * validCellRatio)
  );
  
  // Generate valid and invalid expressions
  const numbers: { position: Position; value: string; expression?: Expression }[] = [];
  const usedPositions = [playerStart, ...walls, ...glitches];
  
  // Add valid cells that match the rule
  for (let i = 0; i < validCellCount; i++) {
    const position = getRandomPosition(gridSize, usedPositions);
    usedPositions.push(position);
    
    // Generate an expression that matches the rule
    let expression: Expression;
    if (useExpressions && rule.generateExpressions && targetNumber !== undefined) {
      // Use rule-specific expression generator for operation-based games
      const expressions = rule.generateExpressions(targetNumber, 1);
      expression = expressions[0];
    } else {
      // Generate level-appropriate expression
      expression = generateExpressionsByLevel(
        level, 
        rule.type as GameType, 
        targetNumber,
        true // Should match rule
      );
    }
    
    numbers.push({
      position,
      value: expression.display,
      expression: expression
    });
  }
  
  // Fill remaining cells with invalid expressions
  const remainingCellCount = gridSize * gridSize - usedPositions.length;
  
  for (let i = 0; i < remainingCellCount; i++) {
    const position = getRandomPosition(gridSize, usedPositions);
    usedPositions.push(position);
    
    // Try multiple times to generate a non-matching expression that's not too similar to existing ones
    let attempts = 0;
    let expression: Expression;
    let value: string;
    
    do {
      // Generate non-matching expression
      expression = generateExpressionsByLevel(
        level,
        rule.type as GameType,
        targetNumber,
        false // Should NOT match rule
      );
      value = expression.display;
      attempts++;
    } while (
      hasDuplicateNeighbor(position, value, numbers, gridSize) &&
      attempts < 5
    );
    
    numbers.push({
      position,
      value,
      expression
    });
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

// Legacy function for backward compatibility
export function generateRandomMaze(width: number, height: number): MazeConfig {
  const gridSize = width;
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

// Legacy function for backward compatibility
export function generateEasyMaze(
  width: number, 
  height: number,
  ruleValidator: (expression: string) => boolean,
  useExpressions: boolean = false
): MazeConfig {
  const gridSize = width;
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
      if (ruleValidator.toString().includes("equalsTo10")) {
        value = Math.random() > 0.5 
          ? `${Math.floor(Math.random() * 10)}+${10 - Math.floor(Math.random() * 10)}`
          : `${10 + Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 5)}`;
      } else if (ruleValidator.toString().includes("multiplyTo12")) {
        const factors = [1, 2, 3, 4, 6, 12];
        const a = factors[Math.floor(Math.random() * factors.length)];
        value = `${a}×${12 / a}`;
      } else {
        value = Math.floor(Math.random() * 20 + 1).toString();
      }
    } else {
      if (ruleValidator.toString().includes("evens")) {
        value = (Math.floor(Math.random() * 10 + 1) * 2).toString();
      } else if (ruleValidator.toString().includes("odds")) {
        value = (Math.floor(Math.random() * 10) * 2 + 1).toString();
      } else if (ruleValidator.toString().includes("factorOf9")) {
        const factors = [1, 3, 9];
        value = factors[Math.floor(Math.random() * factors.length)].toString();
      } else {
        value = Math.floor(Math.random() * 20 + 1).toString();
      }
    }
    
    // Validate using the provided rule function
    if (ruleValidator(value)) {
      numbers.push({ position, value });
      ruleMatchingAdded++;
    } else {
      // Put back in the list if not matching
      remainingPositions.unshift(position);
    }
  }

  // Fill remaining positions with non-matching values
  while (remainingPositions.length > 0) {
    const position = remainingPositions.pop()!;
    let value: string;
    let attempts = 0;
    let isValid = false;

    while (!isValid && attempts < 5) {
      if (useExpressions) {
        const target = Math.floor(Math.random() * 20) + 1;
        value = Math.random() > 0.5 
          ? `${Math.floor(Math.random() * 10)}+${target - Math.floor(Math.random() * 10)}`
          : `${target + Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 5)}`;
      } else {
        if (ruleValidator.toString().includes("evens")) {
          value = (Math.floor(Math.random() * 10) * 2 + 1).toString(); // Odd numbers
        } else if (ruleValidator.toString().includes("odds")) {
          value = (Math.floor(Math.random() * 10 + 1) * 2).toString(); // Even numbers
        } else if (ruleValidator.toString().includes("factorOf9")) {
          let num;
          do {
            num = Math.floor(Math.random() * 8 + 2);
          } while (9 % num === 0);
          value = num.toString();
        } else {
          value = Math.floor(Math.random() * 20 + 1).toString();
        }
      }
      
      // Check that it does NOT match the rule and is not a duplicate neighbor
      isValid = !ruleValidator(value) && !hasDuplicateNeighbor(position, value, numbers, gridSize);
      attempts++;
    }

    // Add the non-matching value (or whatever we ended up with)
    numbers.push({ position, value: value! });
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