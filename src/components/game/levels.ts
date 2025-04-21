
import { GameLevel } from "./types";
import { generateRandomMaze, generateEasyMaze } from "./utils";

// Define game rules
const rules = {
  equalsTo5: {
    name: "Equals 5",
    description: "Collect all expressions that equal 5",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 5;
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
  equalsTo20: {
    name: "Equals 20",
    description: "Collect all expressions that equal 20",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 20;
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
  },
  divideToWhole: {
    name: "Whole Division",
    description: "Collect all divisions that give whole numbers",
    isMatch: (expression: string) => {
      try {
        const result = eval(expression);
        return expression.includes('/') && Number.isInteger(result);
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
    rule: rules.equalsTo5,
    maze: generateEasyMaze(6, 6, rules.equalsTo5.isMatch),
    glitchSpeed: 1,
  },
  {
    id: 2,
    rule: rules.equalsTo10,
    maze: generateRandomMaze(10, 10),
    glitchSpeed: 1.2,
  },
  {
    id: 3,
    rule: rules.equalsTo15,
    maze: generateRandomMaze(10, 10),
    glitchSpeed: 1.4,
  },
  {
    id: 4,
    rule: rules.equalsTo20,
    maze: generateRandomMaze(10, 10),
    glitchSpeed: 1.6,
  },
  {
    id: 5,
    rule: rules.multiplyTo12,
    maze: generateRandomMaze(10, 10),
    glitchSpeed: 1.8,
  },
  {
    id: 6,
    rule: rules.divideToWhole,
    maze: generateRandomMaze(10, 10),
    glitchSpeed: 2,
  }
];
