
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
  isMatch: (num: number) => boolean;
};

export type Cell = {
  type: CellType;
  value?: number;
  position: Position;
};

export type MazeConfig = {
  width: number;
  height: number;
  walls: Position[];
  numbers: { position: Position; value: number }[];
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
  glitchPositions: Position[];
  remainingNumbers: { position: Position; value: number }[];
  walls: Position[];
};
