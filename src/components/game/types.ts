
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
  value?: string;
  position: Position;
};

export type MazeConfig = {
  width: number;
  height: number;
  walls: Position[];
  numbers: { position: Position; value: string }[];
  glitches: Position[];
  playerStart: Position;
};

export type GameLevel = {
  id: number;
  rule: GameRule;
  maze: MazeConfig;
  glitchSpeed: number;
};

// New types for game type-based structure
export type GameType = {
  id: string;
  name: string;
  description: string;
  rule: GameRule;
  color: string;
  icon?: string;
};

// Game state
export type GameStatus = {
  score: number;
  lives: number;
  level: number;
  playerPosition: Position;
  playerStart: Position;
  glitchPositions: Position[];
  remainingNumbers: { position: Position; value: string }[];
  walls: Position[];
  gameTypeId?: string;
};
