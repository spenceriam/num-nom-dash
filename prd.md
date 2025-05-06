# Num Nom Dash - Concise PRD

## Overview
Num Nom Dash is a grid-based mathematical puzzle game where players collect numbers matching specific rules while avoiding enemies.

## Core Mechanics
- Player controls "Num Nom" character on a grid (4x4 to 6x6)
- Each level has a mathematical rule (e.g., "Collect even numbers")
- Player must collect all valid numbers/expressions
- "Glitches" enemies move around and must be avoided
- Three lives per level (lose on Glitch collision or collecting wrong number)
- Progressive difficulty across levels

## Game Types
- **Even Numbers**: Collect all even numbers on the screen
- **Odd Numbers**: Collect all odd numbers on the screen
- **Prime Numbers**: Collect all prime numbers on the screen
- **Additions Of**: Collect expressions that add up to a target number (e.g., for target 10: 5+5, 2+8, 9+1, 11-1, 18-8)
- **Multiples Of**: Collect expressions that multiply to a target number (e.g., for target 12: 3×4, 2×6, 1×12)
- **Factors Of**: Collect expressions that divide evenly into a target number (e.g., for target 8: 8÷1, 8÷2, 8÷4, 8÷8)
- **Subtractions Of**: Collect expressions that subtract to a target number (e.g., for target 5: 10-5, 13-8, 6-1)

## Game Modes
- Standard Mode: Progress through levels in a chosen game type
- Challenge Mode: Rotate through game types with increasing difficulty

## Technical Implementation

### Data Structures
```typescript
// Core structures
interface Cell {
  position: { x: number, y: number };
  content: number | Expression;
  isWall: boolean;
  isCollected: boolean;
}

interface GameBoard {
  cells: Cell[][];
  size: { rows: number, columns: number };
}

interface Expression {
  display: string;  // e.g., "2+3"
  value: number;    // e.g., 5
  operation?: 'addition' | 'subtraction' | 'multiplication' | 'division'; // For operation-based game types
  operands?: number[]; // The numbers used in the expression
}

interface Character {
  position: { x: number, y: number };
  isMoving: boolean;
}

interface Glitch extends Character {
  direction: Direction;
  targeting: boolean;
}

interface GameState {
  level: number;
  lives: number;
  score: number;
  currentRule: Rule;
  targetNumber?: number; // For operation-based game types
  player: Character;
  glitches: Glitch[];
  remainingValidCells: number;
  gameType: GameType;
  isGameOver: boolean;
  isLevelComplete: boolean;
}

type GameType = 'even' | 'odd' | 'prime' | 'additionsOf' | 'multiplesOf' | 'factorsOf' | 'subtractionsOf';

interface Rule {
  type: GameType;
  validate: (value: number, target?: number) => boolean;
  description: string;
  generateTarget?: () => number; // For dynamic target games (additions, multiples, etc.)
  generateExpressions?: (target: number, count: number) => Expression[]; // For creating expressions
}
```

### Key Algorithms
```typescript
// Rule validation
const gameRules: Record<GameType, Rule> = {
  even: {
    type: 'even',
    validate: (value: number) => value % 2 === 0,
    description: 'Collect all even numbers'
  },
  odd: {
    type: 'odd',
    validate: (value: number) => value % 2 !== 0,
    description: 'Collect all odd numbers'
  },
  prime: {
    type: 'prime',
    validate: (value: number) => isPrimeNumber(value),
    description: 'Collect all prime numbers'
  },
  additionsOf: {
    type: 'additionsOf',
    validate: (value: number, target: number) => value === target,
    description: 'Collect all expressions that add up to [target]',
    generateTarget: () => Math.floor(Math.random() * 20) + 5, // Random target 5-25
    generateExpressions: (target: number, count: number) => {
      // Generate expressions that add up to target (including subtraction)
      // Example: for target 10, create "5+5", "12-2", "8+2", etc.
    }
  },
  multiplesOf: {
    type: 'multiplesOf',
    validate: (value: number, target: number) => value === target,
    description: 'Collect all expressions that multiply to [target]',
    generateTarget: () => Math.floor(Math.random() * 11) + 2, // Random target 2-12
    generateExpressions: (target: number, count: number) => {
      // Generate expressions that multiply to target
      // Example: for target 12, create "3×4", "2×6", "1×12", etc.
    }
  },
  factorsOf: {
    type: 'factorsOf',
    validate: (value: number, target: number) => target % value === 0,
    description: 'Collect all factors of [target]',
    generateTarget: () => {
      // Generate a number with multiple factors (e.g., 12, 24, 36)
      const options = [12, 16, 18, 20, 24, 30, 36, 42, 48];
      return options[Math.floor(Math.random() * options.length)];
    },
    generateExpressions: (target: number, count: number) => {
      // Generate expressions that are factors of target
      // Example: for target 12, create "12÷1", "12÷2", "12÷3", "12÷4", "12÷6", "12÷12"
    }
  },
  subtractionsOf: {
    type: 'subtractionsOf',
    validate: (value: number, target: number) => value === target,
    description: 'Collect all expressions that subtract to [target]',
    generateTarget: () => Math.floor(Math.random() * 10) + 1, // Random target 1-10
    generateExpressions: (target: number, count: number) => {
      // Generate expressions that subtract to target
      // Example: for target 5, create "10-5", "13-8", "15-10", etc.
    }
  }
};

// Glitch AI - Simplified
function moveGlitch(glitch: Glitch, player: Character, board: GameBoard, level: number): void {
  // Early levels: Random movement
  if (level <= 2) {
    glitch.direction = getRandomDirection();
  } 
  // Mid levels: Basic pathfinding
  else if (level <= 5) {
    glitch.direction = getDirectionTowardsPlayer(glitch, player);
  }
  // Advanced levels: Smart pathfinding
  else {
    glitch.direction = findPathToPlayer(glitch, player, board);
  }
  
  // Update position based on direction if valid move
  const newPosition = calculateNewPosition(glitch.position, glitch.direction);
  if (isValidMove(newPosition, board)) {
    glitch.position = newPosition;
  }
}
```

## UI & Screens
- Home Screen: Game title, game type selection
- Game Screen: Grid, rule display, score, lives, level
- Level Complete: Congratulations, next level button
- Game Over: Final score, name entry, play again

## Controls
- Desktop: Arrow keys
- Mobile: Swipe gestures
- Optional: Click/tap destination

## Technical Stack
- Framework: React with TypeScript
- State Management: React hooks
- Styling: Tailwind CSS
- Persistence: Local storage for high scores

## Component Structure
```
src/
├── components/
│   ├── GameBoard.tsx       # Grid component
│   ├── Character.tsx       # Player component
│   ├── Glitch.tsx          # Enemy component
│   ├── Cell.tsx            # Grid cell
│   ├── Expression.tsx      # Math expression
│   └── UI/                 # Score, lives, dialogs
├── hooks/
│   ├── useGameLogic.ts     # Core game logic
│   ├── useGlitchAI.ts      # Enemy movement
│   └── useRuleValidator.ts # Math validation
├── utils/                  # Helper functions
└── App.tsx                 # Main component
```

## Asset Requirements
- Character sprites: 32x32px, 4 directions
- Enemy sprites: 32x32px, 4 directions
- Cell backgrounds: 48x48px (regular, wall, collected)
- Sound effects: Movement, collection, collision, game events

## Priority Features
### MVP (Must Have)
- Grid-based movement
- Multiple game types (Even, Odd, Prime, etc.)
- Progressive difficulty
- Glitch enemies with movement AI
- Lives system
- Score tracking
- High scores

### Secondary (Should Have)
- Challenge mode
- Visual feedback for correct/incorrect
- Mobile responsiveness
- Game type high scores
- Game state persistence

## Game Loop Logic
```typescript
// Core game loop
function gameLoop() {
  // 1. Handle player input (arrow keys/swipe)
  // 2. Update player position if valid move
  // 3. Check for number collection
  //    - If valid per rule: Score points, mark cell collected
  //    - If invalid: Lose life, visual feedback
  // 4. Update Glitch positions
  // 5. Check for Glitch collision (lose life if collision)
  // 6. Check for level completion (all valid numbers collected)
  // 7. Check for game over (lives === 0)
  // 8. Render updated game state
  
  // Request next animation frame if game continues
  if (!gameState.isGameOver && !gameState.isLevelComplete) {
    requestAnimationFrame(gameLoop);
  }
}
```

## Level Generation
```typescript
function generateLevel(level: number, gameType: GameType): GameBoard {
  // 1. Create grid based on level size
  const size = 4 + Math.min(Math.floor(level / 3), 2); // 4x4 to 6x6
  const board = createEmptyBoard(size, size);
  
  // 2. Generate target number for applicable game types
  let target = null;
  if (gameRules[gameType].generateTarget) {
    target = gameRules[gameType].generateTarget();
  }
  
  // 3. Generate appropriate numbers/expressions based on game type
  const validCount = Math.ceil(size * size * 0.3); // ~30% valid cells
  
  if (gameRules[gameType].generateExpressions && target !== null) {
    // For operation-based game types (additions, multiples, etc.)
    const expressions = gameRules[gameType].generateExpressions(target, validCount);
    populateCellsWithExpressions(board, expressions, target, gameRules[gameType]);
  } else {
    // For simple number-based game types (even, odd, prime)
    populateValidCells(board, validCount, gameRules[gameType]);
    populateInvalidCells(board, gameRules[gameType]);
  }
  
  // 4. Add walls (higher levels = more walls)
  addWalls(board, Math.floor(level / 3));
  
  // 5. Place player (top-left corner)
  const player = { position: { x: 0, y: 0 }, isMoving: false };
  
  // 6. Place Glitches (far from player)
  const glitchCount = 1 + Math.min(Math.floor(level / 4), 2); // 1-3 Glitches
  const glitches = placeGlitches(board, glitchCount, player);
  
  return { board, player, glitches, target };
}
```

## Progression System
- **Levels 1-3**: 
  - 4x4 grid
  - Single digit numbers or simple expressions
  - 1 Glitch with random movement
  - For operation games: simple operands (single digits)

- **Levels 4-6**: 
  - 5x5 grid
  - More complex expressions
  - 1-2 Glitches with basic pursuit
  - For operation games: mix of single and double digit operands
  - Some wall obstacles

- **Levels 7+**: 
  - 6x6 grid
  - Complex expressions (multiple operations when applicable)
  - 2 Glitches with smarter pursuit
  - For operation games: larger numbers, more challenging operations
  - Moderate wall layouts creating partial mazes
