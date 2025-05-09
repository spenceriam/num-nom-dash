/**
 * Math helper functions for game logic
 */

/**
 * Checks if a number is prime
 * @param num The number to check
 * @returns True if the number is prime, false otherwise
 */
export function isPrime(num: number): boolean {
  // Handle edge cases
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  // Check for divisibility using 6k +/- 1 optimization
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  
  return true;
}

/**
 * Gets all factors of a number
 * @param num The number to get factors for
 * @returns Array of all factors
 */
export function getFactors(num: number): number[] {
  const factors: number[] = [];
  
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) {
      factors.push(i);
    }
  }
  
  return factors;
}

/**
 * Gets all factor pairs of a number
 * @param num The number to get factor pairs for
 * @returns Array of factor pairs [a, b] where a * b = num
 */
export function getFactorPairs(num: number): number[][] {
  const pairs: number[][] = [];
  
  for (let i = 1; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      pairs.push([i, num / i]);
    }
  }
  
  return pairs;
}

/**
 * Generates a random number within a range
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Random number between min and max
 */
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random even number within a range
 * @param min Minimum value (will be adjusted to even)
 * @param max Maximum value (will be adjusted to even)
 * @returns Random even number between min and max
 */
export function getRandomEven(min: number, max: number): number {
  min = min % 2 === 0 ? min : min + 1;
  max = max % 2 === 0 ? max : max - 1;
  return min + 2 * Math.floor(Math.random() * ((max - min) / 2 + 1));
}

/**
 * Generates a random odd number within a range
 * @param min Minimum value (will be adjusted to odd)
 * @param max Maximum value (will be adjusted to odd)
 * @returns Random odd number between min and max
 */
export function getRandomOdd(min: number, max: number): number {
  min = min % 2 === 1 ? min : min + 1;
  max = max % 2 === 1 ? max : max - 1;
  return min + 2 * Math.floor(Math.random() * ((max - min) / 2 + 1));
}
