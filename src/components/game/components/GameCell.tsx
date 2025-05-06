import React from "react";
import { Position, Rule, Expression } from "../types";
import { isPositionEqual } from "../utils";
import { evaluateExpression } from "../utils/expressions";

type GameCellProps = {
  position: Position;
  playerPosition: Position;
  glitchPositions: Position[];
  walls: Position[];
  numbers: { position: Position; value: string; expression?: Expression }[];
  currentRule: Rule | null;
  onCellClick?: (position: Position) => void;
};

export const GameCell = ({ 
  position,
  playerPosition,
  glitchPositions,
  walls,
  numbers,
  currentRule,
  onCellClick,
}: GameCellProps) => {
  const isPlayer = isPositionEqual(position, playerPosition);
  const isWall = walls.some(wall => isPositionEqual(wall, position));
  const isGlitch = glitchPositions.some(glitch => isPositionEqual(glitch, position));
  const number = numbers.find(num => isPositionEqual(num.position, position));

  // Check if the cell matches the current rule
  const isMatchingRule = () => {
    if (!number || !currentRule) return false;
    
    // If we have an expression object, use its value
    if (number.expression) {
      return currentRule.validate(number.expression.value);
    }
    
    // Otherwise, evaluate the value string
    try {
      const value = evaluateExpression(number.value);
      return currentRule.validate(value);
    } catch (e) {
      return false;
    }
  };

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
    <div className="w-full h-full bg-[#219EBC] rounded-full flex items-center justify-center">
      <img 
        src="/lovable-uploads/ce72a35c-6820-4164-ba07-21851bf30984.png" 
        alt="NumNom" 
        className="w-full h-full object-contain scale-150" 
        style={{
          imageRendering: 'pixelated'
        }}
      />
    </div>
  );

  let cellClass = "w-12 h-12 border border-[#014F86]/20 flex items-center justify-center rounded transition-all";
  
  if (isPlayer) {
    cellClass += " bg-[#219EBC] text-white";
  } else if (isWall) {
    cellClass += " bg-[#013A63]";
  } else if (isGlitch) {
    cellClass += " bg-[#8ECAE6]/20";
  } else if (number) {
    const matchesRule = isMatchingRule();
    cellClass += matchesRule 
      ? " bg-[#8ECAE6]/30 hover:bg-[#8ECAE6]/50" 
      : " bg-[#FB8500]/20 hover:bg-[#FB8500]/40";
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
      {number && !isPlayer && !isGlitch && (
        <span className="font-mono text-[#012A4A] font-bold text-lg">
          {number.value}
        </span>
      )}
    </div>
  );
};