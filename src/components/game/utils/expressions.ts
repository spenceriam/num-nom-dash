import { Position, Expression, GameType } from "../types";
import { isPositionEqual, getNeighbors } from "./positions";

// Helper to generate expressions that equal to a target value
export function generateExpressionForValue(target: number, type: GameType): string {
  switch (type) {
    case 'additionsOf':
      return generateAdditionExpression(target);
    case 'subtractionsOf':
      return generateSubtractionExpression(target);
    case 'multiplesOf':
      return generateMultiplicationExpression(target);
    case 'factorsOf':
      return generateDivisionExpression(target);
    default:
      return target.toString();
  }
}

export function generateAdditionExpression(target: number): string {
  const addend1 = Math.floor(Math.random() * Math.min(target, 20));
  const addend2 = target - addend1;
  return `${addend1}+${addend2}`;
}

export function generateSubtractionExpression(target: number): string {
  const subtrahend = Math.floor(Math.random() * 10) + 1;
  const minuend = target + subtrahend;
  return `${minuend}-${subtrahend}`;
}

export function generateMultiplicationExpression(target: number): string {
  const factors = getFactors(target);
  if (factors.length > 0) {
    const factorPair = factors[Math.floor(Math.random() * factors.length)];
    return `${factorPair[0]}×${factorPair[1]}`;
  }
  return `${target}×1`;
}

export function generateDivisionExpression(target: number): string {
  const multiplier = Math.floor(Math.random() * 5) + 1;
  const dividend = target * multiplier;
  return `${dividend}÷${multiplier}`;
}

// Helper to get factors of a number for multiplication
export function getFactors(n: number): number[][] {
  const factors: number[][] = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      factors.push([i, n / i]);
    }
  }
  return factors;
}

// Evaluates an expression string and returns the numerical result
export function evaluateExpression(expression: string): number {
  // Handle different operator symbols used in display vs. evaluation
  expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
  
  try {
    // Using Function instead of eval for slightly better security
    // Still not completely secure, but used as intended in this controlled environment
    return Function('"use strict";return (' + expression + ')')();
  } catch (error) {
    console.error("Error evaluating expression:", expression, error);
    return NaN;
  }
}

// Converts a display expression to an Expression object with calculated value
export function createExpression(display: string): Expression {
  const value = evaluateExpression(display);
  
  let operation: 'addition' | 'subtraction' | 'multiplication' | 'division' | undefined;
  let operands: number[] | undefined;
  
  // Determine operation type and extract operands
  if (display.includes('+')) {
    operation = 'addition';
    operands = display.split('+').map(Number);
  } else if (display.includes('-')) {
    operation = 'subtraction';
    operands = display.split('-').map(Number);
  } else if (display.includes('×') || display.includes('*')) {
    operation = 'multiplication';
    operands = display.replace('×', '*').split('*').map(Number);
  } else if (display.includes('÷') || display.includes('/')) {
    operation = 'division';
    operands = display.replace('÷', '/').split('/').map(Number);
  }
  
  return {
    display,
    value,
    operation,
    operands
  };
}

// Helper to check if an expression exists in a neighboring cell
export function hasDuplicateNeighbor(
  position: Position, 
  display: string, 
  expressions: { position: Position; value: string; expression?: Expression }[], 
  gridSize: number
): boolean {
  const neighbors = getNeighbors(position, gridSize);
  return neighbors.some(neighborPos => 
    expressions.some(exp => 
      isPositionEqual(exp.position, neighborPos) && exp.value === display
    )
  );
}

// Helper to generate expressions for a grid based on game level
export function generateExpressionsByLevel(
  level: number, 
  type: GameType, 
  target: number | undefined,
  matchRule: boolean
): Expression {
  // Difficulty factors based on level
  const maxOperand = level <= 3 ? 9 : level <= 6 ? 20 : 50;
  
  // If we don't want to match the rule, generate invalid expression
  if (!matchRule && target !== undefined) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const nonMatchingTarget = target + (Math.random() > 0.5 ? offset : -offset);
    return createExpression(generateExpressionForValue(nonMatchingTarget, type));
  }
  
  // Generate expression based on game type
  let display: string;
  
  switch (type) {
    case 'even':
      const evenValue = Math.floor(Math.random() * (maxOperand / 2)) * 2 + 2;
      display = evenValue.toString();
      break;
      
    case 'odd':
      const oddValue = Math.floor(Math.random() * (maxOperand / 2)) * 2 + 1;
      display = oddValue.toString();
      break;
      
    case 'prime':
      // Limited set of primes for simplicity
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
      const availablePrimes = primes.filter(p => p <= maxOperand);
      display = availablePrimes[Math.floor(Math.random() * availablePrimes.length)].toString();
      break;
      
    case 'additionsOf':
    case 'subtractionsOf':
    case 'multiplesOf':
    case 'factorsOf':
      if (target !== undefined) {
        display = generateExpressionForValue(target, type);
      } else {
        display = "1"; // Fallback
      }
      break;
      
    default:
      display = "1";
  }
  
  return createExpression(display);
}