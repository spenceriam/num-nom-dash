import { Position } from "../types";
import { isPositionEqual, getNeighbors } from "./positions";
import { getFactorPairs, getRandomNumber } from "./mathHelpers";

/**
 * Generates an expression that equals the target value
 * @param target The target value the expression should equal
 * @param operationType Optional specific operation type to use
 * @returns A string expression that evaluates to the target
 */
export function generateExpressionEqualsTo(
  target: number,
  operationType?: 'addition' | 'subtraction' | 'multiplication' | 'division'
): string {
  // Get the current level from the game status to determine difficulty
  const currentLevel = window.location.search.includes('challenge') ?
    parseInt(localStorage.getItem('challengeLevel') || '1', 10) :
    parseInt(new URLSearchParams(window.location.search).get('level') || '1', 10);

  // Adjust max number based on level difficulty
  const maxNumber = currentLevel <= 3 ? 9 : // Single digits for first 3 levels
                    currentLevel <= 6 ? 20 : // Lower two-digit numbers (10-20)
                    currentLevel <= 10 ? 50 : // Medium two-digit numbers (up to 50)
                    99; // Larger two-digit numbers for higher levels

  // If no specific operation type is provided, choose one based on level
  if (!operationType) {
    const operations = ['+', '-', '*', '/'];
    const operationIndex = currentLevel <= 3 ?
      Math.floor(Math.random() * 2) : // Only + and - for early levels
      Math.floor(Math.random() * operations.length); // All operations for later levels

    switch (operations[operationIndex]) {
      case '+': operationType = 'addition'; break;
      case '-': operationType = 'subtraction'; break;
      case '*': operationType = 'multiplication'; break;
      case '/': operationType = 'division'; break;
      default: operationType = 'addition';
    }
  }

  switch (operationType) {
    case 'addition':
      return generateAddition(target, maxNumber);
    case 'subtraction':
      return generateSubtraction(target, maxNumber);
    case 'multiplication':
      return generateMultiplication(target, maxNumber);
    case 'division':
      return generateDivision(target, maxNumber);
    default:
      return `${target}`;
  }
}

/**
 * Generates an addition expression that equals the target
 */
function generateAddition(target: number, maxNumber: number): string {
  const addend1 = getRandomNumber(0, Math.min(target, maxNumber));
  const addend2 = target - addend1;
  return `${addend1}+${addend2}`;
}

/**
 * Generates a subtraction expression that equals the target
 */
function generateSubtraction(target: number, maxNumber: number): string {
  // For subtraction, we need minuend > target
  const maxSubtrahend = Math.min(20, maxNumber); // Limit subtrahend size for readability
  const subtrahend = getRandomNumber(1, maxSubtrahend);
  const minuend = target + subtrahend;
  return `${minuend}-${subtrahend}`;
}

/**
 * Generates a multiplication expression that equals the target
 */
function generateMultiplication(target: number, maxNumber: number): string {
  const factorPairs = getFactorPairs(target).filter(([a, b]) =>
    a <= maxNumber && b <= maxNumber
  );

  if (factorPairs.length === 0) {
    return `${target}*1`; // Fallback if no suitable factors
  }

  const [factor1, factor2] = factorPairs[Math.floor(Math.random() * factorPairs.length)];
  return `${factor1}*${factor2}`;
}

/**
 * Generates a division expression that equals the target
 */
function generateDivision(target: number, maxNumber: number): string {
  // For division, we need dividend = target * divisor
  const maxDivisor = Math.min(10, maxNumber); // Limit divisor size for readability
  const divisor = getRandomNumber(1, maxDivisor);
  const dividend = target * divisor;
  return `${dividend}/${divisor}`;
}

/**
 * Generates an expression that does NOT equal the target value
 * @param target The target value the expression should NOT equal
 * @param operationType Optional specific operation type to use
 * @returns A string expression that does NOT evaluate to the target
 */
export function generateNonMatchingExpression(
  target: number,
  operationType?: 'addition' | 'subtraction' | 'multiplication' | 'division'
): string {
  // Generate a value close to but not equal to the target
  const offset = getRandomNumber(1, 5) * (Math.random() > 0.5 ? 1 : -1);
  const nonMatchingTarget = Math.max(1, target + offset); // Ensure positive

  return generateExpressionEqualsTo(nonMatchingTarget, operationType);
}

/**
 * Generates an expression specifically for a given rule type
 * @param ruleType The type of rule to generate an expression for
 * @param target The target value for the rule
 * @returns A string expression that matches the rule
 */
export function generateExpressionForRule(
  ruleType: string,
  target: number
): string {
  if (ruleType.includes('addition')) {
    return generateExpressionEqualsTo(target, 'addition');
  } else if (ruleType.includes('subtraction')) {
    return generateExpressionEqualsTo(target, 'subtraction');
  } else if (ruleType.includes('multiple')) {
    return generateExpressionEqualsTo(target, 'multiplication');
  } else if (ruleType.includes('factor')) {
    // For factors, we need to generate a number that is a factor of the target
    const factors = getFactorPairs(target).flat();
    const factor = factors[Math.floor(Math.random() * factors.length)];
    return factor.toString();
  } else {
    // Default to a simple expression
    return generateExpressionEqualsTo(target);
  }
}

/**
 * Checks if a position has a duplicate neighbor with the same value
 */
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
