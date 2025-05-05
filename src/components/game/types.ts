
// Game entities
export type Position = {
  x: number;
  y: number;
};

export type Direction = "up" | "down" | "left" | "right";

export type CellType = "empty" | "wall" | "number" | "player" | "glitch";

export type GameRule = {
  name: string;
  description: string;
  isMatch: (value: string) => boolean;
};

export type Cell = {
  type: CellType;
  value?: string; // Updated from number to string to support expressions
  position: Position;
};

export type MazeConfig = {
  width: number;
  height: number;
  walls: Position[];
  numbers: { position: Position; value: string }[]; // Updated from number to string
  glitches: Position[];
  playerStart: Position;
};

export type GameLevel = {
  id: number;
  rule: GameRule;
  maze: MazeConfig;
  glitchSpeed: number;
};

// Game state
export type GameStatus = {
  score: number;
  lives: number;
  level: number;
  playerPosition: Position;
  playerStart: Position; // Add this property to store the starting position
  glitchPositions: Position[];
  remainingNumbers: { position: Position; value: string }[]; // Updated from number to string
  walls: Position[];
};
