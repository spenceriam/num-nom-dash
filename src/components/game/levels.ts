
import { GameLevel } from "./types";
import { generateRandomMaze } from "./utils";

// Define game rules
const rules = {
  evenNumbers: {
    name: "Even Numbers",
    description: "Collect all even numbers",
    isMatch: (num: number) => num % 2 === 0
  },
  oddNumbers: {
    name: "Odd Numbers",
    description: "Collect all odd numbers",
    isMatch: (num: number) => num % 2 !== 0
  },
  multiplesOf3: {
    name: "Multiples of 3",
    description: "Collect all numbers that are multiples of 3",
    isMatch: (num: number) => num % 3 === 0
  },
  greaterThan50: {
    name: "Greater than 50",
    description: "Collect all numbers greater than 50",
    isMatch: (num: number) => num > 50
  },
  lessThan50: {
    name: "Less than 50",
    description: "Collect all numbers less than 50",
    isMatch: (num: number) => num < 50
  },
  equalsTo42: {
    name: "Equal to 42",
    description: "Collect all numbers equal to 42",
    isMatch: (num: number) => num === 42
  }
};

// Create levels
export const levels: GameLevel[] = [
  {
    id: 1,
    rule: rules.evenNumbers,
    maze: generateRandomMaze(10, 10),
    glitchSpeed: 1
  },
  {
    id: 2,
    rule: rules.oddNumbers,
    maze: generateRandomMaze(10, 10),
    glitchSpeed: 1.2
  },
  {
    id: 3,
    rule: rules.multiplesOf3,
    maze: generateRandomMaze(10, 10),
    glitchSpeed: 1.4
  },
  {
    id: 4,
    rule: rules.greaterThan50,
    maze: generateRandomMaze(10, 10),
    glitchSpeed: 1.6
  },
  {
    id: 5,
    rule: rules.lessThan50,
    maze: generateRandomMaze(10, 10),
    glitchSpeed: 1.8
  },
  {
    id: 6,
    rule: rules.equalsTo42,
    maze: generateRandomMaze(10, 10),
    glitchSpeed: 2
  }
];
