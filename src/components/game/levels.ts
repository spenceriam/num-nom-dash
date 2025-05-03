import { GameLevel, GameType } from "./types";
import { generateRandomMaze, generateEasyMaze } from "./utils";

// Define game rules and organize them by game types
export const gameTypes: GameType[] = [
  {
    id: "evens",
    name: "Even Numbers",
    description: "Collect all expressions that equal even numbers",
    color: "bg-emerald-500",
    rule: {
      name: "Even Numbers",
      description: "Collect all expressions that equal even numbers",
      isMatch: (expression: string) => {
        try {
          return eval(expression) % 2 === 0;
        } catch {
          return false;
        }
      }
    }
  },
  {
    id: "odds",
    name: "Odd Numbers",
    description: "Collect all expressions that equal odd numbers",
    color: "bg-amber-500",
    rule: {
      name: "Odd Numbers",
      description: "Collect all expressions that equal odd numbers",
      isMatch: (expression: string) => {
        try {
          return eval(expression) % 2 === 1;
        } catch {
          return false;
        }
      }
    }
  },
  {
    id: "primes",
    name: "Prime Numbers",
    description: "Collect all expressions that equal prime numbers (2,3,5,7)",
    color: "bg-indigo-500",
    rule: {
      name: "Prime Numbers",
      description: "Collect all expressions that equal prime numbers (2,3,5,7)",
      isMatch: (expression: string) => {
        try {
          const primes = [2, 3, 5, 7];
          return primes.includes(eval(expression));
        } catch {
          return false;
        }
      }
    }
  },
  {
    id: "equals10",
    name: "Equals to 10",
    description: "Collect all expressions that equal 10",
    color: "bg-sky-500",
    rule: {
      name: "Equals to 10",
      description: "Collect all expressions that equal 10",
      isMatch: (expression: string) => {
        try {
          return eval(expression) === 10;
        } catch {
          return false;
        }
      }
    }
  },
  {
    id: "factors9",
    name: "Factors of 9",
    description: "Collect all expressions that are factors of 9 (single digits)",
    color: "bg-violet-500",
    rule: {
      name: "Factors of 9",
      description: "Collect all expressions that are factors of 9 (single digits)",
      isMatch: (expression: string) => {
        try {
          const result = eval(expression);
          return result > 0 && result < 10 && 9 % result === 0;
        } catch {
          return false;
        }
      }
    }
  },
  {
    id: "multiplyTo12",
    name: "Multiply to 12",
    description: "Collect expressions that multiply single digits to get 12",
    color: "bg-rose-500",
    rule: {
      name: "Multiply to 12",
      description: "Collect expressions that multiply single digits to get 12",
      isMatch: (expression: string) => {
        try {
          if (!expression.includes('*')) return false;
          const [a, b] = expression.split('*').map(Number);
          return a < 10 && b < 10 && eval(expression) === 12;
        } catch {
          return false;
        }
      }
    }
  }
];

// Function to generate a level for a specific game type and difficulty
export function generateLevel(gameTypeId: string, levelNumber: number): GameLevel {
  const gameType = gameTypes.find(gt => gt.id === gameTypeId);
  if (!gameType) throw new Error(`Game type ${gameTypeId} not found`);

  // Difficulty increases with level
  const baseSize = 6;
  const size = Math.min(baseSize + Math.floor(levelNumber / 3), 10);
  const numGlitches = Math.min(1 + Math.floor(levelNumber / 2), 3);
  const useExpressions = levelNumber > 2;
  const glitchSpeed = 1 + (levelNumber * 0.2);
  const useWalls = levelNumber > 4;
  
  // Generate maze with appropriate difficulty
  const maze = generateEasyMaze(
    size,
    size,
    gameType.rule.isMatch,
    useExpressions,
    numGlitches,
    useWalls
  );
  
  return {
    id: levelNumber,
    rule: gameType.rule,
    maze,
    glitchSpeed
  };
}

// Keep the original levels for backward compatibility and challenge mode
export const levels: GameLevel[] = [
  {
    id: 1,
    rule: gameTypes[0].rule, // Even numbers
    maze: generateEasyMaze(6, 6, gameTypes[0].rule.isMatch, false),
    glitchSpeed: 1,
  },
  {
    id: 2,
    rule: gameTypes[1].rule, // Odd numbers
    maze: generateEasyMaze(8, 8, gameTypes[1].rule.isMatch, false),
    glitchSpeed: 1.2,
  },
  {
    id: 3,
    rule: gameTypes[2].rule, // Prime numbers
    maze: generateEasyMaze(8, 8, gameTypes[2].rule.isMatch, true),
    glitchSpeed: 1.4,
  },
  {
    id: 4,
    rule: gameTypes[3].rule, // Equals to 10
    maze: generateEasyMaze(8, 8, gameTypes[3].rule.isMatch, true),
    glitchSpeed: 1.6,
  },
  {
    id: 5,
    rule: gameTypes[4].rule, // Factors of 9
    maze: generateEasyMaze(10, 10, gameTypes[4].rule.isMatch, true),
    glitchSpeed: 1.8,
  },
  {
    id: 6,
    rule: gameTypes[5].rule, // Multiply to 12
    maze: generateEasyMaze(10, 10, gameTypes[5].rule.isMatch, true),
    glitchSpeed: 2,
  }
];
