import { GameLevel } from "./types";
import { generateRandomMaze, generateEasyMaze } from "./utils";
import { isPrime } from "./utils/mathHelpers";

// Define game rules
const rules = {
  // Basic number type rules
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
  primes: {
    name: "Prime Numbers",
    description: "Collect all expressions that equal prime numbers",
    isMatch: (expression: string) => {
      try {
        const result = eval(expression);
        return isPrime(result);
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

  // Addition-based rules
  additionsOf10: {
    name: "Additions of 10",
    description: "Collect all expressions that add up to 10",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 10 && (expression.includes('+') || expression.includes('-'));
      } catch {
        return false;
      }
    },
    target: 10
  },
  additionsOf15: {
    name: "Additions of 15",
    description: "Collect all expressions that add up to 15",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 15 && (expression.includes('+') || expression.includes('-'));
      } catch {
        return false;
      }
    },
    target: 15
  },
  additionsOf20: {
    name: "Additions of 20",
    description: "Collect all expressions that add up to 20",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 20 && (expression.includes('+') || expression.includes('-'));
      } catch {
        return false;
      }
    },
    target: 20
  },

  // Multiplication-based rules
  multiplesOf12: {
    name: "Multiples of 12",
    description: "Collect expressions that multiply to get 12",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 12 && expression.includes('*');
      } catch {
        return false;
      }
    },
    target: 12
  },
  multiplesOf16: {
    name: "Multiples of 16",
    description: "Collect expressions that multiply to get 16",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 16 && expression.includes('*');
      } catch {
        return false;
      }
    },
    target: 16
  },
  multiplesOf24: {
    name: "Multiples of 24",
    description: "Collect expressions that multiply to get 24",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 24 && expression.includes('*');
      } catch {
        return false;
      }
    },
    target: 24
  },

  // Factor-based rules
  factorsOf12: {
    name: "Factors of 12",
    description: "Collect all expressions that are factors of 12",
    isMatch: (expression: string) => {
      try {
        const result = eval(expression);
        return result > 0 && 12 % result === 0;
      } catch {
        return false;
      }
    },
    target: 12
  },
  factorsOf16: {
    name: "Factors of 16",
    description: "Collect all expressions that are factors of 16",
    isMatch: (expression: string) => {
      try {
        const result = eval(expression);
        return result > 0 && 16 % result === 0;
      } catch {
        return false;
      }
    },
    target: 16
  },
  factorsOf24: {
    name: "Factors of 24",
    description: "Collect all expressions that are factors of 24",
    isMatch: (expression: string) => {
      try {
        const result = eval(expression);
        return result > 0 && 24 % result === 0;
      } catch {
        return false;
      }
    },
    target: 24
  },

  // Subtraction-based rules
  subtractionsOf5: {
    name: "Subtractions of 5",
    description: "Collect expressions that subtract to get 5",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 5 && expression.includes('-');
      } catch {
        return false;
      }
    },
    target: 5
  },
  subtractionsOf8: {
    name: "Subtractions of 8",
    description: "Collect expressions that subtract to get 8",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 8 && expression.includes('-');
      } catch {
        return false;
      }
    },
    target: 8
  },
  subtractionsOf10: {
    name: "Subtractions of 10",
    description: "Collect expressions that subtract to get 10",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 10 && expression.includes('-');
      } catch {
        return false;
      }
    },
    target: 10
  },

  // Legacy rules for backward compatibility
  equalsTo10: {
    name: "Equals to 10",
    description: "Collect all expressions that equal 10",
    isMatch: (expression: string) => {
      try {
        return eval(expression) === 10;
      } catch {
        return false;
      }
    },
    target: 10
  },
  multiplyTo12: {
    name: "Multiplies of 12",
    description: "Collect expressions that multiply single digits to get 12",
    isMatch: (expression: string) => {
      try {
        if (!expression.includes('*')) return false;
        const [a, b] = expression.split('*').map(Number);
        return a < 10 && b < 10 && eval(expression) === 12;
      } catch {
        return false;
      }
    },
    target: 12
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
    },
    target: 9
  }
};

// Create levels with progressive difficulty
export const levels: GameLevel[] = [
  // Basic number types (Levels 1-3)
  {
    id: 1,
    rule: rules.evens,
    maze: generateEasyMaze(6, 6, rules.evens.isMatch, false),
    glitchSpeed: 1,
  },
  {
    id: 2,
    rule: rules.odds,
    maze: generateEasyMaze(6, 6, rules.odds.isMatch, false),
    glitchSpeed: 1.2,
  },
  {
    id: 3,
    rule: rules.singleDigitPrimes,
    maze: generateEasyMaze(6, 6, rules.singleDigitPrimes.isMatch, false),
    glitchSpeed: 1.3,
  },

  // Addition-based levels (Levels 4-6)
  {
    id: 4,
    rule: rules.additionsOf10,
    maze: generateEasyMaze(7, 7, rules.additionsOf10.isMatch, true),
    glitchSpeed: 1.4,
  },
  {
    id: 5,
    rule: rules.additionsOf15,
    maze: generateEasyMaze(7, 7, rules.additionsOf15.isMatch, true),
    glitchSpeed: 1.5,
  },
  {
    id: 6,
    rule: rules.additionsOf20,
    maze: generateEasyMaze(7, 7, rules.additionsOf20.isMatch, true),
    glitchSpeed: 1.6,
  },

  // Multiplication-based levels (Levels 7-9)
  {
    id: 7,
    rule: rules.multiplesOf12,
    maze: generateEasyMaze(8, 8, rules.multiplesOf12.isMatch, true),
    glitchSpeed: 1.7,
  },
  {
    id: 8,
    rule: rules.multiplesOf16,
    maze: generateEasyMaze(8, 8, rules.multiplesOf16.isMatch, true),
    glitchSpeed: 1.8,
  },
  {
    id: 9,
    rule: rules.multiplesOf24,
    maze: generateEasyMaze(8, 8, rules.multiplesOf24.isMatch, true),
    glitchSpeed: 1.9,
  },

  // Factor-based levels (Levels 10-12)
  {
    id: 10,
    rule: rules.factorsOf12,
    maze: generateEasyMaze(8, 8, rules.factorsOf12.isMatch, true),
    glitchSpeed: 2.0,
  },
  {
    id: 11,
    rule: rules.factorsOf16,
    maze: generateEasyMaze(8, 8, rules.factorsOf16.isMatch, true),
    glitchSpeed: 2.1,
  },
  {
    id: 12,
    rule: rules.factorsOf24,
    maze: generateEasyMaze(8, 8, rules.factorsOf24.isMatch, true),
    glitchSpeed: 2.2,
  },

  // Subtraction-based levels (Levels 13-15)
  {
    id: 13,
    rule: rules.subtractionsOf5,
    maze: generateEasyMaze(9, 9, rules.subtractionsOf5.isMatch, true),
    glitchSpeed: 2.3,
  },
  {
    id: 14,
    rule: rules.subtractionsOf8,
    maze: generateEasyMaze(9, 9, rules.subtractionsOf8.isMatch, true),
    glitchSpeed: 2.4,
  },
  {
    id: 15,
    rule: rules.subtractionsOf10,
    maze: generateEasyMaze(9, 9, rules.subtractionsOf10.isMatch, true),
    glitchSpeed: 2.5,
  }
];
