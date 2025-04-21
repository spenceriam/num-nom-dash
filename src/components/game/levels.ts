
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

// Create levels
export const levels: GameLevel[] = [
  {
    id: 1,
    rule: rules.evens,
    maze: generateEasyMaze(6, 6, rules.evens.isMatch),
    glitchSpeed: 1,
  },
  {
    id: 2,
    rule: rules.odds,
    maze: generateRandomMaze(8, 8),
    glitchSpeed: 1.2,
  },
  {
    id: 3,
    rule: rules.factorOf9,
    maze: generateRandomMaze(8, 8),
    glitchSpeed: 1.4,
  },
  {
    id: 4,
    rule: rules.equalsTo10,
    maze: generateRandomMaze(10, 10),
    glitchSpeed: 1.6,
  },
  {
    id: 5,
    rule: rules.equalsTo15,
    maze: generateRandomMaze(10, 10),
    glitchSpeed: 1.8,
  },
  {
    id: 6,
    rule: rules.multiplyTo12,
    maze: generateRandomMaze(10, 10),
    glitchSpeed: 2,
  }
];

