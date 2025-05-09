
import React from "react";
import { Position, GameRule, Direction } from "../types";
import { isPositionEqual } from "../utils";

type GameCellProps = {
  position: Position;
  playerPosition: Position;
  playerDirection?: Direction;
  glitchPositions: Position[];
  glitchDirections?: Direction[];
  walls: Position[];
  numbers: { position: Position; value: string }[];
  currentRule: GameRule | null;
  onCellClick?: (position: Position) => void;
};

export const GameCell = ({
  position,
  playerPosition,
  playerDirection = "right", // Default direction is right
  glitchPositions,
  glitchDirections = [],
  walls,
  numbers,
  currentRule,
  onCellClick,
}: GameCellProps) => {
  const isPlayer = isPositionEqual(position, playerPosition);
  const isWall = walls.some(wall => isPositionEqual(wall, position));
  const isGlitch = glitchPositions.some(glitch => isPositionEqual(glitch, position));
  const glitchIndex = glitchPositions.findIndex(glitch => isPositionEqual(glitch, position));
  const glitchDirection = glitchIndex !== -1 && glitchDirections[glitchIndex] ? glitchDirections[glitchIndex] : "right";
  const number = numbers.find(num => isPositionEqual(num.position, position));

  const renderGlitchIcon = () => {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/Glitch.png"
          alt="Glitch"
          className="w-3/4 h-3/4 object-contain"
          style={{
            imageRendering: 'pixelated',
            transform: glitchDirection === "left" ? 'scaleX(-1)' : 'none'
          }}
        />
      </div>
    );
  };

  const renderPlayerIcon = () => {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-[#219EBC] rounded-full w-full h-full flex items-center justify-center">
          <img
            src="/Num-Nom.png"
            alt="NumNom"
            className="w-3/4 h-3/4 object-contain"
            style={{
              imageRendering: 'pixelated',
              transform: playerDirection === "left" ? 'scaleX(-1)' : 'none'
            }}
          />
        </div>
      </div>
    );
  };

  // Determine cell size based on grid size
  const currentLevel = window.location.search.includes('challenge') ?
    parseInt(localStorage.getItem('challengeLevel') || '1', 10) :
    parseInt(new URLSearchParams(window.location.search).get('level') || '1', 10);

  const gridSize = currentLevel <= 3 ? 6 : // Small grid for early levels
                  currentLevel <= 6 ? 7 : // Medium grid for mid levels
                  currentLevel <= 10 ? 8 : // Larger grid for later levels
                  9; // Largest grid for advanced levels

  const cellSize = gridSize <= 6 ? "w-12 h-12" :
                  gridSize <= 8 ? "w-10 h-10" :
                  "w-9 h-9";

  let cellClass = `${cellSize} border border-[#014F86]/20 relative flex items-center justify-center rounded transition-all`;

  if (isPlayer) {
    cellClass += " bg-[#219EBC] text-white";
  } else if (isWall) {
    cellClass += " bg-[#013A63]";
  } else if (isGlitch) {
    cellClass += " bg-[#8ECAE6]/20";
  } else if (number) {
    // Use the same background color for all number cells
    cellClass += " bg-[#8ECAE6]/30 hover:bg-[#8ECAE6]/50";
  } else {
    cellClass += " bg-white/30 hover:bg-white/50";
  }

  return (
    <div
      className={cellClass}
      onClick={() => onCellClick?.(position)}
    >
      {isPlayer && renderPlayerIcon()}
      {isGlitch && renderGlitchIcon()}
      {number && !isPlayer && (
        <span className={`font-mono text-[#012A4A] font-bold ${
          gridSize <= 6 ? 'text-lg' :
          gridSize <= 8 ? 'text-base' :
          'text-sm'
        } ${isGlitch ? 'opacity-0' : ''}`}>
          {number.value}
        </span>
      )}
    </div>
  );
};

