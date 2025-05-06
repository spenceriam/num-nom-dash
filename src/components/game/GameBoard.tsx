import React from "react";
import { Position, Rule } from "./types";
import { GameCell } from "./components/GameCell";

type GameBoardProps = {
  playerPosition: Position;
  glitchPositions: Position[];
  walls: Position[];
  numbers: { position: Position; value: string }[];
  onCellClick?: (position: Position) => void;
  currentRule: Rule | null;
};

export const GameBoard = ({ 
  playerPosition, 
  glitchPositions, 
  walls, 
  numbers, 
  onCellClick, 
  currentRule 
}: GameBoardProps) => {
  // Determine grid size based on the highest x and y values
  const gridSize = Math.max(
    6, // Default minimum size
    ...numbers.map(n => Math.max(n.position.x, n.position.y)) + 1,
    ...walls.map(w => Math.max(w.x, w.y)) + 1,
    ...glitchPositions.map(g => Math.max(g.x, g.y)) + 1,
    playerPosition.x + 1,
    playerPosition.y + 1
  );

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const position = { x, y };
        cells.push(
          <GameCell
            key={`${x}-${y}`}
            position={position}
            playerPosition={playerPosition}
            glitchPositions={glitchPositions}
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

  return (
    <div className="game-board mb-4">
      <div className={`grid grid-cols-${gridSize} gap-1 p-2 bg-[#8ECAE6]/10 rounded-lg`}>
        {renderGrid()}
      </div>
    </div>
  );
};

export default GameBoard;