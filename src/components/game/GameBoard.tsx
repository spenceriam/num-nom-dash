
import React from "react";
import { Position, GameRule } from "./types";
import { isPositionEqual } from "./utils";
import { Sparkles } from "lucide-react";

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
  const renderGlitchIcon = () => (
    <img 
      src="/lovable-uploads/e1c8cb26-e716-48a2-8acc-4f9491e7f75d.png" 
      alt="Glitch" 
      className="w-full h-full object-contain scale-150" 
      style={{
        imageRendering: 'pixelated'
      }}
    />
  );

  const renderPlayerIcon = () => (
    <img 
      src="/lovable-uploads/ce72a35c-6820-4164-ba07-21851bf30984.png" 
      alt="NumNom" 
      className="w-full h-full object-contain scale-150" 
      style={{
        imageRendering: 'pixelated'
      }}
    />
  );

  // Determine the grid size based on positions
  const gridSize = 6; // Default size

  // Create grid cells for the board
  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const position = { x, y };
        const isPlayer = isPositionEqual(position, playerPosition);
        const isWall = walls.some(wall => isPositionEqual(wall, position));
        const isGlitch = glitchPositions.some(glitch => isPositionEqual(glitch, position));
        const number = numbers.find(num => isPositionEqual(num.position, position));
        
        let cellClass = "w-12 h-12 border border-[#014F86]/20 flex items-center justify-center rounded transition-all";
        
        if (isPlayer) {
          cellClass += " bg-[#219EBC] text-white";
        } else if (isWall) {
          cellClass += " bg-[#013A63]";
        } else if (isGlitch) {
          cellClass += " bg-[#8ECAE6]/20";
        } else if (number) {
          // Check if this number matches the rule
          const isMatching = currentRule?.isMatch(number.value);
          cellClass += isMatching 
            ? " bg-[#8ECAE6]/30 hover:bg-[#8ECAE6]/50" 
            : " bg-[#FB8500]/20 hover:bg-[#FB8500]/40";
        } else {
          cellClass += " bg-white/30 hover:bg-white/50";
        }

        cells.push(
          <div 
            key={`${x}-${y}`} 
            className={cellClass}
            onClick={() => onCellClick?.(position)}
          >
            {isPlayer && (
              <div className="w-8 h-8 rounded-full bg-[#FB8500] flex items-center justify-center">
                {renderPlayerIcon()}
              </div>
            )}
            {isGlitch && renderGlitchIcon()}
            {number && !isPlayer && !isGlitch && (
              <span className="font-mono text-[#012A4A] font-bold text-lg">
                {number.value}
              </span>
            )}
          </div>
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
