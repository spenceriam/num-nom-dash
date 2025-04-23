
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
  const boardSize = 6;
  const rows = [];

  const renderGlitchIcon = () => (
    <img 
      src="/lovable-uploads/e1c8cb26-e716-48a2-8acc-4f9491e7f75d.png" 
      alt="Glitch" 
      className="w-4/5 h-4/5 object-contain"
      style={{
        imageRendering: 'pixelated',
        imageRendering: '-moz-crisp-edges',
        imageRendering: 'crisp-edges'
      }}
    />
  );

  for (let y = 0; y < boardSize; y++) {
    const cells = [];
    for (let x = 0; x < boardSize; x++) {
      const position = { x, y };
      const isWall = walls.some(wall => isPositionEqual(wall, position));
      const isPlayer = isPositionEqual(playerPosition, position);
      const isGlitch = glitchPositions.some(glitch => isPositionEqual(glitch, position));
      const number = numbers.find(n => isPositionEqual(n.position, position));
      
      let cellContent;
      let cellClass = "w-full h-full flex items-center justify-center bg-white/90 border border-[#014F86]/20";
      let isClickable = false;

      if (isWall) {
        cellClass = "w-full h-full bg-[#012A4A]";
        cellContent = null;
      } else if (isPlayer) {
        cellClass += " bg-green-500";
        cellContent = (
          <div className="w-4/5 h-4/5 rounded-full bg-green-700 flex items-center justify-center text-white font-bold shadow-md">
            <Sparkles className="w-2/3 h-2/3 text-white" strokeWidth={2.5} />
          </div>
        );
      } else if (isGlitch) {
        cellClass += " bg-red-100";
        cellContent = renderGlitchIcon();
      } else if (number) {
        cellContent = (
          <span className="text-[#012A4A] font-bold text-lg">
            {number.value}
          </span>
        );
      } else {
        cellClass += " bg-white/90";
      }

      if (onCellClick && !isWall && !isPlayer && !isGlitch) {
        isClickable = true;
        cellClass += " cursor-pointer hover:bg-[#89C2D9]/20 hover:ring-2 hover:ring-[#014F86] transition-all";
      }

      cells.push(
        <div 
          key={`${x}-${y}`}
          className="w-1/6 aspect-square relative"
          onClick={isClickable ? () => onCellClick(position) : undefined}
          tabIndex={isClickable ? 0 : -1}
          aria-label={isClickable ? `Move to ${number ? number.value : ''}` : undefined}
          role={isClickable ? "button" : undefined}
        >
          <div className={cellClass}>
            {cellContent}
          </div>
        </div>
      );
    }
    rows.push(
      <div key={`row-${y}`} className="flex w-full">
        {cells}
      </div>
    );
  }
  
  return (
    <div className="w-full bg-[#89C2D9]/10 backdrop-blur-sm p-1 rounded-lg shadow-inner" style={{ aspectRatio: '1/1' }}>
      {rows}
    </div>
  );
};

export default GameBoard;
