
import { Position, GameRule } from "./types";
import { isPositionEqual } from "./utils";

type GameBoardProps = {
  playerPosition: Position;
  glitchPositions: Position[];
  walls: Position[];
  numbers: { position: Position; value: number }[];
  onCellClick?: (position: Position) => void;
  currentRule: GameRule | null;
};

const isAdjacent = (player: Position, cell: Position) => {
  const dx = Math.abs(player.x - cell.x);
  const dy = Math.abs(player.y - cell.y);
  // Chebyshev distance - allows diagonal (1 square away in any direction)
  return (dx <= 1 && dy <= 1) && !(dx === 0 && dy === 0);
};

export const GameBoard = ({ 
  playerPosition, 
  glitchPositions, 
  walls, 
  numbers, 
  onCellClick, 
  currentRule 
}: GameBoardProps) => {
  const boardSize = 6; // 6x6 grid
  const rows = [];
  
  for (let y = 0; y < boardSize; y++) {
    const cells = [];
    for (let x = 0; x < boardSize; x++) {
      const position = { x, y };
      const isWall = walls.some(wall => isPositionEqual(wall, position));
      const isPlayer = isPositionEqual(playerPosition, position);
      const isGlitch = glitchPositions.some(glitch => isPositionEqual(glitch, position));
      const number = numbers.find(n => isPositionEqual(n.position, position));
      
      let cellContent;
      let cellClass = "w-full h-full flex items-center justify-center bg-white border border-purple-200";
      let isClickable = false;

      if (isWall) {
        cellClass = "w-full h-full bg-gray-800";
        cellContent = null;
      } else if (isPlayer) {
        cellClass += " bg-green-500";
        cellContent = (
          <div className="w-4/5 h-4/5 rounded-full bg-green-700 flex items-center justify-center text-white font-bold shadow-md">
            N
          </div>
        );
      } else if (isGlitch) {
        cellClass += " bg-red-100";
        cellContent = (
          <div className="w-4/5 h-4/5 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
            G
          </div>
        );
      } else if (number) {
        // Highlight valid numbers that match the current rule
        const isValid = currentRule && currentRule.isMatch(number.value);
        cellClass += isValid ? " bg-green-50" : "";
        cellContent = (
          <span className={`${isValid ? "text-green-700" : "text-purple-900"} font-bold text-lg`}>
            {number.value}
          </span>
        );
      } else {
        // Empty cell - light background so it's clear it's empty
        cellClass += " bg-purple-50";
      }

      // Check if this cell is adjacent to the player position
      if (onCellClick && !isWall && !isPlayer && !isGlitch) {
        if (isAdjacent(playerPosition, position)) {
          isClickable = true;
          cellClass += " cursor-pointer hover:bg-green-100 hover:ring-2 hover:ring-green-400 transition-all";
        }
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
    <div className="w-full bg-purple-100 p-1 rounded-lg shadow-inner" style={{ aspectRatio: '1/1' }}>
      {rows}
    </div>
  );
};
