
import React from "react";
import { Position, GameRule } from "./types";
import { GameCell } from "./components/GameCell";

type GameBoardProps = {
  playerPosition: Position;
  glitchPositions: Position[];
  walls: Position[];
  numbers: { position: Position; value: string }[];
  onCellClick?: (position: Position) => void;
  currentRule: GameRule | null;
};

export const GameBoard = ({ 
  playerPosition, 
  glitchPositions, 
  walls, 
  numbers, 
  onCellClick, 
  currentRule 
}: GameBoardProps) => {
  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 6; x++) {
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
      <div className="grid grid-cols-6 gap-1 p-2 bg-[#8ECAE6]/10 rounded-lg">
        {renderGrid()}
      </div>
    </div>
  );
};

export default GameBoard;

