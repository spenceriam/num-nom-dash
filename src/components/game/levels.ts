
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
    description: "Collect all expressions that are factors of 9 (single digits)",
    isMatch: (expression: string) => {
      try {
        const result = eval(expression);
        return result > 0 && result < 10 && 9 % result === 0;
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
    name: "Single Digit Multiplication",
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
  },
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
  singleDigitPrimes: {
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
  },
};

// Create levels with correct progression - swapping levels 3 and 4
export const levels: GameLevel[] = [
  {
    id: 1, // Even Numbers (Level 1)
    rule: rules.evens,
    maze: generateEasyMaze(6, 6, rules.evens.isMatch, false),
    glitchSpeed: 1,
  },
  {
    id: 2, // Odd Numbers (Level 2)
    rule: rules.odds,
    maze: generateEasyMaze(8, 8, rules.odds.isMatch, false),
    glitchSpeed: 1.2,
  },
  {
    id: 3, // Prime Numbers (Level 3) - SWAPPED FROM LEVEL 4
    rule: rules.singleDigitPrimes,
    maze: generateEasyMaze(8, 8, rules.singleDigitPrimes.isMatch, true),
    glitchSpeed: 1.4,
  },
  {
    id: 4, // Equals 5 (Level 4) - SWAPPED FROM LEVEL 3
    rule: rules.equalsTo5,
    maze: generateEasyMaze(8, 8, rules.equalsTo5.isMatch, true),
    glitchSpeed: 1.6,
  },
  {
    id: 5, // Equals 10 (Level 5)
    rule: rules.equalsTo10,
    maze: generateEasyMaze(10, 10, rules.equalsTo10.isMatch, true),
    glitchSpeed: 1.8,
  },
  {
    id: 6, // Multiply to 12 (Level 6)
    rule: rules.multiplyTo12,
    maze: generateEasyMaze(10, 10, rules.multiplyTo12.isMatch, true),
    glitchSpeed: 2,
  },
  {
    id: 7, // Factors of 9 (Level 7)
    rule: rules.factorOf9,
    maze: generateEasyMaze(10, 10, rules.factorOf9.isMatch, true),
    glitchSpeed: 2.2,
  }
];
