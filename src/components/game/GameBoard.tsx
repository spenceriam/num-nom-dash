
import React, { useMemo } from "react";
import { Position, GameRule, Direction } from "./types";
import { GameCell } from "./components/GameCell";

type GameBoardProps = {
  playerPosition: Position;
  playerDirection?: Direction;
  glitchPositions: Position[];
  glitchDirections?: Direction[];
  walls: Position[];
  numbers: { position: Position; value: string }[];
  onCellClick?: (position: Position) => void;
  currentRule: GameRule | null;
  gridSize?: number;
};

export const GameBoard = ({
  playerPosition,
  playerDirection = "right",
  glitchPositions,
  glitchDirections = [],
  walls,
  numbers,
  onCellClick,
  currentRule,
  gridSize
}: GameBoardProps) => {
  // Determine grid size based on level or use provided gridSize
  const effectiveGridSize = useMemo(() => {
    if (gridSize) return gridSize;

    // Get the current level from the URL or localStorage
    const currentLevel = window.location.search.includes('challenge') ?
      parseInt(localStorage.getItem('challengeLevel') || '1', 10) :
      parseInt(new URLSearchParams(window.location.search).get('level') || '1', 10);

    // Determine grid size based on level
    return currentLevel <= 3 ? 6 : // Small grid for early levels
           currentLevel <= 6 ? 7 : // Medium grid for mid levels
           currentLevel <= 10 ? 8 : // Larger grid for later levels
           9; // Largest grid for advanced levels
  }, [gridSize]);

  // Generate grid cells
  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < effectiveGridSize; y++) {
      for (let x = 0; x < effectiveGridSize; x++) {
        const position = { x, y };
        cells.push(
          <GameCell
            key={`${x}-${y}`}
            position={position}
            playerPosition={playerPosition}
            playerDirection={playerDirection}
            glitchPositions={glitchPositions}
            glitchDirections={glitchDirections}
            walls={walls}
            numbers={numbers}
            currentRule={currentRule}
            onCellClick={onCellClick}
          />
        );
      }
    }
    return cells;
  };

  // Dynamically set grid columns based on grid size
  const gridColsClass = `grid-cols-${effectiveGridSize}`;

  // Adjust cell size based on grid size for responsive layout
  const cellSizeClass = effectiveGridSize <= 6 ? "cell-size-lg" :
                       effectiveGridSize <= 8 ? "cell-size-md" :
                       "cell-size-sm";

  return (
    <div className="game-board mb-4">
      <div
        className={`grid ${gridColsClass} gap-1 p-2 bg-[#8ECAE6]/10 rounded-lg ${cellSizeClass}`}
        style={{
          gridTemplateColumns: `repeat(${effectiveGridSize}, minmax(0, 1fr))`,
          fontSize: effectiveGridSize <= 6 ? '1rem' :
                   effectiveGridSize <= 8 ? '0.9rem' :
                   '0.8rem'
        }}
      >
        {renderGrid()}
      </div>
    </div>
  );
};

export default GameBoard;

