import { Rule, GameType, Expression } from './types';
import { generateExpressionForValue } from './utils/expressions';

// Helper function to check if number is prime
export const isPrimeNumber = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
};

// Implementation of game rules as defined in PRD
export const gameRules: Record<GameType, Rule> = {
  even: {
    type: 'even',
    name: 'Even Numbers',
    description: 'Collect all even numbers',
    validate: (value: number) => value % 2 === 0,
    generateExpressions: (target: number, count: number): Expression[] => {
      const expressions: Expression[] = [];
      
      for (let i = 0; i < count; i++) {
        // Generate random even numbers between 2 and 20
        const value = Math.floor(Math.random() * 10) * 2 + 2;
        expressions.push({
          display: value.toString(),
          value: value
        });
      }
      
      return expressions;
    }
  },
  
  odd: {
    type: 'odd',
    name: 'Odd Numbers',
    description: 'Collect all odd numbers',
    validate: (value: number) => value % 2 !== 0,
    generateExpressions: (target: number, count: number): Expression[] => {
      const expressions: Expression[] = [];
      
      for (let i = 0; i < count; i++) {
        // Generate random odd numbers between 1 and 19
        const value = Math.floor(Math.random() * 10) * 2 + 1;
        expressions.push({
          display: value.toString(),
          value: value
        });
      }
      
      return expressions;
    }
  },
  
  prime: {
    type: 'prime',
    name: 'Prime Numbers',
    description: 'Collect all prime numbers',
    validate: (value: number) => isPrimeNumber(value),
    generateExpressions: (target: number, count: number): Expression[] => {
      const expressions: Expression[] = [];
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
      
      for (let i = 0; i < count; i++) {
        const prime = primes[Math.floor(Math.random() * primes.length)];
        expressions.push({
          display: prime.toString(),
          value: prime
        });
      }
      
      return expressions;
    }
  },
  
  additionsOf: {
    type: 'additionsOf',
    name: 'Additions Of',
    description: 'Collect all expressions that add up to [target]',
    validate: (value: number, target: number = 10) => value === target,
    generateTarget: () => Math.floor(Math.random() * 16) + 5, // Random target 5-20
    generateExpressions: (target: number, count: number): Expression[] => {
      const expressions: Expression[] = [];
      
      for (let i = 0; i < count; i++) {
        // Generate either addition or subtraction expressions
        const isAddition = Math.random() > 0.4;
        
        if (isAddition) {
          // Addition: a + b = target
          const a = Math.floor(Math.random() * target);
          const b = target - a;
          expressions.push({
            display: `${a}+${b}`,
            value: target,
            operation: 'addition',
            operands: [a, b]
          });
        } else {
          // Subtraction: c - d = target
          const d = Math.floor(Math.random() * 10) + 1;
          const c = target + d;
          expressions.push({
            display: `${c}-${d}`,
            value: target,
            operation: 'subtraction',
            operands: [c, d]
          });
        }
      }
      
      return expressions;
    }
  },
  
  multiplesOf: {
    type: 'multiplesOf',
    name: 'Multiples Of',
    description: 'Collect all expressions that multiply to [target]',
    validate: (value: number, target: number = 12) => value === target,
    generateTarget: () => Math.floor(Math.random() * 11) + 2, // Random target 2-12
    generateExpressions: (target: number, count: number): Expression[] => {
      const expressions: Expression[] = [];
      
      // Find all factor pairs for the target
      const factorPairs: number[][] = [];
      for (let i = 1; i <= Math.sqrt(target); i++) {
        if (target % i === 0) {
          factorPairs.push([i, target / i]);
        }
      }
      
      // Generate multiplication expressions using the factor pairs
      for (let i = 0; i < Math.min(count, factorPairs.length); i++) {
        const pair = factorPairs[i % factorPairs.length];
        expressions.push({
          display: `${pair[0]}×${pair[1]}`,
          value: target,
          operation: 'multiplication',
          operands: [pair[0], pair[1]]
        });
      }
      
      // If we need more expressions than we have factor pairs, repeat with different presentation
      for (let i = factorPairs.length; i < count; i++) {
        const pair = factorPairs[i % factorPairs.length];
        // Alternate by switching order of factors
        expressions.push({
          display: `${pair[1]}×${pair[0]}`,
          value: target,
          operation: 'multiplication',
          operands: [pair[1], pair[0]]
        });
      }
      
      return expressions;
    }
  },
  
  factorsOf: {
    type: 'factorsOf',
    name: 'Factors Of',
    description: 'Collect all factors of [target]',
    validate: (value: number, target: number = 24) => target % value === 0,
    generateTarget: () => {
      // Generate a number with multiple factors
      const options = [12, 16, 18, 20, 24, 30, 36, 42, 48];
      return options[Math.floor(Math.random() * options.length)];
    },
    generateExpressions: (target: number, count: number): Expression[] => {
      const expressions: Expression[] = [];
      
      // Find all factors of the target
      const factors: number[] = [];
      for (let i = 1; i <= target; i++) {
        if (target % i === 0) {
          factors.push(i);
        }
      }
      
      // Generate division expressions for each factor
      for (let i = 0; i < Math.min(count, factors.length); i++) {
        const factor = factors[i % factors.length];
        expressions.push({
          display: `${target}÷${target / factor}`,
          value: factor,
          operation: 'division',
          operands: [target, target / factor]
        });
      }
      
      // If we need more expressions than factors, create alternate presentations
      for (let i = factors.length; i < count; i++) {
        const factor = factors[i % factors.length];
        expressions.push({
          display: factor.toString(),
          value: factor
        });
      }
      
      return expressions;
    }
  },
  
  subtractionsOf: {
    type: 'subtractionsOf',
    name: 'Subtractions Of',
    description: 'Collect all expressions that subtract to [target]',
    validate: (value: number, target: number = 5) => value === target,
    generateTarget: () => Math.floor(Math.random() * 10) + 1, // Random target 1-10
    generateExpressions: (target: number, count: number): Expression[] => {
      const expressions: Expression[] = [];
      
      for (let i = 0; i < count; i++) {
        // Generate subtraction expression: a - b = target
        const b = Math.floor(Math.random() * 10) + 1;
        const a = target + b;
        
        expressions.push({
          display: `${a}-${b}`,
          value: target,
          operation: 'subtraction',
          operands: [a, b]
        });
      }
      
      return expressions;
    }
  }
};

// Helper function to generate invalid expressions for a rule
export const generateInvalidExpressions = (
  ruleType: GameType, 
  targetNumber: number | undefined, 
  count: number
): Expression[] => {
  const expressions: Expression[] = [];
  const rule = gameRules[ruleType];
  
  for (let i = 0; i < count; i++) {
    let value: number;
    let display: string;
    let invalid = false;
    
    while (!invalid) {
      // Generate a random value that doesn't validate against the rule
      if (ruleType === 'even') {
        value = Math.floor(Math.random() * 10) * 2 + 1; // Odd numbers
        display = value.toString();
      } else if (ruleType === 'odd') {
        value = Math.floor(Math.random() * 10 + 1) * 2; // Even numbers
        display = value.toString();
      } else if (ruleType === 'prime') {
        const nonPrimes = [1, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];
        value = nonPrimes[Math.floor(Math.random() * nonPrimes.length)];
        display = value.toString();
      } else if (targetNumber !== undefined) {
        // For target-based rules, generate close-but-incorrect values
        const offset = Math.floor(Math.random() * 5) + 1;
        value = targetNumber + (Math.random() > 0.5 ? offset : -offset);
        
        if (value <= 0) value = 1; // Avoid non-positive values
        
        // Create an appropriate display format
        if (ruleType === 'additionsOf' || ruleType === 'subtractionsOf') {
          display = generateExpressionForValue(value, ruleType);
        } else if (ruleType === 'multiplesOf') {
          // Simple number that's not the target
          display = value.toString();
        } else if (ruleType === 'factorsOf' && targetNumber % value !== 0) {
          display = value.toString();
        } else {
          display = value.toString();
        }
      } else {
        // Fallback for any other case
        value = Math.floor(Math.random() * 20) + 1;
        display = value.toString();
      }
      
      // Check if the expression is invalid for the rule
      invalid = targetNumber !== undefined
        ? !rule.validate(value, targetNumber)
        : !rule.validate(value);
    }
    
    expressions.push({
      display,
      value
    });
  }
  
  return expressions;
};