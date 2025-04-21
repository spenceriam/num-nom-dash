
import { GameLevel } from "./types";
import { generateRandomMaze, generateEasyMaze } from "./utils";

// Define game rules
const rules = {
  evens: {
    name: "Even Numbers",
    description: "Collect all expressions that equal even numbers",
    isMatch: (expression: string) => {
      try {
        return eval(expression) % 2 === 0;
      } catch {
        return false;
      }
    }
  },
  odds: {
    name: "Odd Numbers",
    description: "Collect all expressions that equal odd numbers",
    isMatch: (expression: string) => {
      try {
        return eval(expression) % 2 === 1;
      } catch {
        return false;
      }
    }
  },
  factorOf9: {
    name: "Factors of 9",
    description: "Collect all expressions that are factors of 9",
    isMatch: (expression: string) => {
      try {
        const result = eval(expression);
        return result > 0 && 9 % result === 0;
      } catch {
        return false;
      }
    }
  },
  equalsTo10: {
    name: "Equals 10",
    description: "Collect all expressions that equal 10",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 10;
      } catch {
        return false;
      }
    }
  },
  equalsTo15: {
    name: "Equals 15",
    description: "Collect all expressions that equal 15",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 15;
      } catch {
        return false;
      }
    }
  },
  multiplyTo12: {
    name: "Multiply to 12",
    description: "Collect all expressions that multiply to 12",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 12 && expression.includes('*');
      } catch {
        return false;
      }
    }
  }
};

// Create levels with correct progression
export const levels: GameLevel[] = [
  {
    id: 1, // Even Numbers (Level 1) - Simple numbers
    rule: rules.evens,
    maze: generateEasyMaze(6, 6, rules.evens.isMatch, false),
    glitchSpeed: 1,
  },
  {
    id: 2, // Odd Numbers (Level 2) - Simple numbers
    rule: rules.odds,
    maze: generateEasyMaze(8, 8, rules.odds.isMatch, false),
    glitchSpeed: 1.2,
  },
  {
    id: 3, // Factors of 9 (Level 3) - Simple numbers
    rule: rules.factorOf9,
    maze: generateEasyMaze(8, 8, rules.factorOf9.isMatch, false),
    glitchSpeed: 1.4,
  },
  {
    id: 4, // Equals 10 (Level 4) - Expressions
    rule: rules.equalsTo10,
    maze: generateEasyMaze(10, 10, rules.equalsTo10.isMatch, true),
    glitchSpeed: 1.6,
  },
  {
    id: 5, // Equals 15 (Level 5) - Expressions
    rule: rules.equalsTo15,
    maze: generateEasyMaze(10, 10, rules.equalsTo15.isMatch, true),
    glitchSpeed: 1.8,
  },
  {
    id: 6, // Multiply to 12 (Level 6) - Expressions
    rule: rules.multiplyTo12,
    maze: generateEasyMaze(10, 10, rules.multiplyTo12.isMatch, true),
    glitchSpeed: 2,
  }
];
