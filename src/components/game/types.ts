// Game entities and types based on PRD specifications

// Basic position and movement types
export type Position = {
  x: number;
  y: number;
};

export type Direction = "up" | "down" | "left" | "right";

export type CellType = "empty" | "wall" | "number" | "player" | "glitch";

// Expression types for mathematical operations
export interface Expression {
  display: string;  // e.g., "2+3", "4×3"
  value: number;    // e.g., 5, 12
  operation?: 'addition' | 'subtraction' | 'multiplication' | 'division'; // For operation-based game types
  operands?: number[]; // The numbers used in the expression
}

// Game types as defined in PRD
export type GameType = 'even' | 'odd' | 'prime' | 'additionsOf' | 'multiplesOf' | 'factorsOf' | 'subtractionsOf';

// Enhanced Rule interface with validate, description, and target generation
export interface Rule {
  type: GameType;
  name: string;
  description: string;
  validate: (value: number, target?: number) => boolean;
  generateTarget?: () => number; // For dynamic target games (additions, multiples, etc.)
  generateExpressions?: (target: number, count: number) => Expression[]; // For creating expressions
}

// Cell representation
export interface Cell {
  type: CellType;
  position: Position;
  content?: number | Expression;
  value?: string; // For backward compatibility
  isWall?: boolean;
  isCollected?: boolean;
}

// Game board structure
export interface GameBoard {
  cells: Cell[][];
  size: { rows: number, columns: number };
}

// Character types
export interface Character {
  position: Position;
  isMoving: boolean;
}

export interface Glitch extends Character {
  direction: Direction;
  targeting: boolean;
}

// Maze configuration
export type MazeConfig = {
  width: number;
  height: number;
  walls: Position[];
  numbers: { position: Position; value: string; expression?: Expression }[];
  glitches: Position[];
  playerStart: Position;
};

// Game level definition
export type GameLevel = {
  id: number;
  rule: Rule;
  maze: MazeConfig;
  glitchSpeed: number;
  targetNumber?: number; // For operation-based game types
};

// Game state tracking
export interface GameStatus {
  score: number;
  lives: number;
  level: number;
  playerPosition: Position;
  playerStart: Position;
  glitchPositions: Position[];
  remainingNumbers: { position: Position; value: string; expression?: Expression }[];
  walls: Position[];
  currentRule: Rule;
  targetNumber?: number; // For operation-based game types
  gameType: GameType;
  isGameOver?: boolean;
  isLevelComplete?: boolean;
  remainingValidCells?: number;
}