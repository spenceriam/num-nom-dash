
import { Position } from "./types";
import { isPositionEqual } from "./utils";

type GameBoardProps = {
  playerPosition: Position;
  glitchPositions: Position[];
  walls: Position[];
  numbers: { position: Position; value: number }[];
  onCellClick?: (position: Position) => void;
};

const isAdjacent = (player: Position, cell: Position) => {
  const dx = Math.abs(player.x - cell.x);
  const dy = Math.abs(player.y - cell.y);
  return dx + dy === 1;
};

export const GameBoard = ({ playerPosition, glitchPositions, walls, numbers, onCellClick }: GameBoardProps) => {
  const boardSize = 6; // 6x6 grid
  const cells = [];
  
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const position = { x, y };
      const isWall = walls.some(wall => isPositionEqual(wall, position));
      const isPlayer = isPositionEqual(playerPosition, position);
      const isGlitch = glitchPositions.some(glitch => isPositionEqual(glitch, position));
      const number = numbers.find(n => isPositionEqual(n.position, position));
      
      let cellContent;
      let cellClass = "flex items-center justify-center bg-white border border-purple-200";
      let isClickable = false;

      if (isWall) {
        cellClass = "bg-gray-800";
        cellContent = null;
      } else if (isPlayer) {
        cellClass += " bg-green-500";
        cellContent = (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-4/5 h-4/5 rounded-full bg-green-700 flex items-center justify-center text-white font-bold shadow-md">
              N
            </div>
          </div>
        );
      } else if (isGlitch) {
        cellClass += " bg-red-100";
        cellContent = (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-4/5 h-4/5 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
              G
            </div>
          </div>
        );
      } else if (number) {
        cellContent = (
          <span className="text-purple-900 font-bold text-lg">{number.value}</span>
        );
      } else {
        // Empty cell - light background so it's clear it's empty
        cellClass += " bg-purple-50";
      }

      // Can only click to move into adjacent cells (if not a wall/glitch)
      if (
        onCellClick &&
        !isWall &&
        !isPlayer &&
        !isGlitch &&
        isAdjacent(playerPosition, position)
      ) {
        isClickable = true;
        cellClass += " cursor-pointer hover:ring-2 hover:ring-green-400";
      }

      cells.push(
        <div 
          key={`${x}-${y}`}
          className={cellClass}
          style={{ width: '100%', paddingBottom: '100%', position: 'relative' }}
          onClick={isClickable ? () => onCellClick(position) : undefined}
          tabIndex={isClickable ? 0 : -1}
          aria-label={isClickable ? "Move here" : undefined}
          role="button"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {cellContent}
          </div>
        </div>
      );
    }
  }
  
  return (
    <div 
      className="grid grid-cols-6 gap-1 bg-purple-100 p-1 rounded-lg shadow-inner"
      style={{ aspectRatio: '1/1' }}
    >
      {cells}
    </div>
  );
};
