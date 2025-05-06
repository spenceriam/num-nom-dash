import { GameLevel, GameType } from "./types";
import { gameRules } from "./rules";
import { generateMaze, generateEasyMaze } from "./utils/mazeGeneration";

// Define standard game levels with progressive difficulty
export const levels: GameLevel[] = [
  // Level 1: Even Numbers - Simple introduction
  {
    id: 1,
    rule: gameRules.even,
    maze: generateMaze(1, gameRules.even, false),
    glitchSpeed: 1.0,
  },
  
  // Level 2: Odd Numbers
  {
    id: 2,
    rule: gameRules.odd,
    maze: generateMaze(2, gameRules.odd, false),
    glitchSpeed: 1.2,
  },
  
  // Level 3: Prime Numbers
  {
    id: 3,
    rule: gameRules.prime,
    maze: generateMaze(3, gameRules.prime, false),
    glitchSpeed: 1.4,
  },
  
  // Level 4: Additions that equal 10
  {
    id: 4,
    rule: gameRules.additionsOf,
    maze: generateMaze(4, gameRules.additionsOf, true),
    glitchSpeed: 1.6,
    targetNumber: 10,
  },
  
  // Level 5: Factors of 12
  {
    id: 5,
    rule: gameRules.factorsOf,
    maze: generateMaze(5, gameRules.factorsOf, true),
    glitchSpeed: 1.8, 
    targetNumber: 12,
  },
  
  // Level 6: Multiplications that equal 12
  {
    id: 6,
    rule: gameRules.multiplesOf,
    maze: generateMaze(6, gameRules.multiplesOf, true),
    glitchSpeed: 2.0,
    targetNumber: 12,
  },
  
  // Level 7: Subtractions that equal 5
  {
    id: 7,
    rule: gameRules.subtractionsOf,
    maze: generateMaze(7, gameRules.subtractionsOf, true),
    glitchSpeed: 2.2,
    targetNumber: 5,
  },
  
  // Level 8: Even Numbers (advanced)
  {
    id: 8,
    rule: gameRules.even,
    maze: generateMaze(8, gameRules.even, true),
    glitchSpeed: 2.4,
  },
  
  // Level 9: Additions that equal 15
  {
    id: 9,
    rule: gameRules.additionsOf,
    maze: generateMaze(9, gameRules.additionsOf, true),
    glitchSpeed: 2.6,
    targetNumber: 15,
  },
  
  // Level 10: Factors of 24
  {
    id: 10,
    rule: gameRules.factorsOf,
    maze: generateMaze(10, gameRules.factorsOf, true),
    glitchSpeed: 2.8,
    targetNumber: 24,
  }
];

// Generate a challenge level on demand with random game type
export function generateChallengeLevel(levelNumber: number): GameLevel {
  // Determine which game type to use based on level number
  const gameTypes: GameType[] = [
    'even', 'odd', 'prime', 'additionsOf', 'multiplesOf', 'factorsOf', 'subtractionsOf'
  ];
  
  // Rotate through game types based on level number
  const gameType = gameTypes[levelNumber % gameTypes.length];
  const rule = gameRules[gameType];
  
  // Generate a target number for rules that need it
  let targetNumber: number | undefined;
  if (rule.generateTarget) {
    targetNumber = rule.generateTarget();
  }
  
  // Increase difficulty with level number
  const difficulty = Math.min(Math.floor(levelNumber / 5) + 1, 10);
  
  return {
    id: levelNumber,
    rule: rule,
    maze: generateMaze(difficulty, rule, difficulty > 2), // Use expressions after level 10
    glitchSpeed: 1.0 + (Math.min(levelNumber, 20) * 0.1), // Speed increases with level
    targetNumber: targetNumber
  };
}

// Get any level by number, whether standard or challenge
export function getLevelByNumber(levelNumber: number, challengeMode: boolean = false): GameLevel {
  if (challengeMode) {
    return generateChallengeLevel(levelNumber);
  } else {
    // For standard mode, use predefined levels or cycle through with increasing difficulty
    if (levelNumber <= levels.length) {
      return levels[levelNumber - 1];
    } else {
      // For levels beyond the predefined ones, generate dynamically with increasing difficulty
      const baseLevel = levels[levels.length - 1];
      const gameType = baseLevel.rule.type;
      const rule = gameRules[gameType];
      
      return {
        id: levelNumber,
        rule: rule,
        maze: generateMaze(Math.min(levelNumber, 15), rule, true),
        glitchSpeed: Math.min(1.0 + (levelNumber * 0.2), 4.0), // Cap speed at 4x
        targetNumber: baseLevel.targetNumber
      };
    }
  }
}