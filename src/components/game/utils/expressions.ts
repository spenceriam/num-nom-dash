import { Position } from "../types";
import { isPositionEqual, getNeighbors } from "./positions";

// Helper to generate expressions that equal to a target value
export function generateExpressionEqualsTo(target: number): string {
  const operations = ['+', '-', '*', '/'];
  const operation = operations[Math.floor(Math.random() * 2)]; // Limit to + and -
  
  // Get the current level from the game status to determine difficulty
  const currentLevel = window.location.search.includes('challenge') ? 
    parseInt(localStorage.getItem('challengeLevel') || '1', 10) : 
    parseInt(new URLSearchParams(window.location.search).get('level') || '1', 10);
  
  const maxNumber = currentLevel <= 3 ? 9 : // Single digits for first 3 levels
                    currentLevel <= 6 ? 20 : // Lower two-digit numbers (10-20)
                    currentLevel <= 10 ? 50 : // Medium two-digit numbers (up to 50)
                    99; // Larger two-digit numbers for higher levels
  
  switch (operation) {
    case '+':
      const addend1 = Math.floor(Math.random() * Math.min(target, maxNumber));
      const addend2 = target - addend1;
      return `${addend1}+${addend2}`;
    case '-':
      const minuend = target + Math.floor(Math.random() * Math.min(10, maxNumber)) + 1;
      const subtrahend = minuend - target;
      return `${minuend}-${subtrahend}`;
    case '*':
      const factors = getFactors(target).filter(([a, b]) => a <= maxNumber && b <= maxNumber);
      if (factors.length > 0) {
        const factorPair = factors[Math.floor(Math.random() * factors.length)];
        return `${factorPair[0]}*${factorPair[1]}`;
      }
      return `${target}*1`;
    case '/':
      const divisor = Math.floor(Math.random() * Math.min(5, maxNumber)) + 1;
      const dividend = target * divisor;
      return `${dividend}/${divisor}`;
    default:
      return `${target}`;
  }
}

// Helper to get factors of a number for multiplication
function getFactors(n: number): number[][] {
  const factors: number[][] = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      factors.push([i, n / i]);
    }
  }
  return factors;
}

export function generateNonMatchingExpression(target: number): string {
  const randomValue = target + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
  return generateExpressionEqualsTo(randomValue);
}

export function hasDuplicateNeighbor(
  position: Position, 
  value: string, 
  expressions: { position: Position; value: string }[], 
  gridSize: number
) {
  const neighbors = getNeighbors(position, gridSize);
  return neighbors.some(neighborPos => 
    expressions.some(exp => 
      isPositionEqual(exp.position, neighborPos) && exp.value === value
    )
  );
}
