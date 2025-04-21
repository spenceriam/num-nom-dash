
import { Position } from "./types";
import { isPositionEqual } from "./utils";

type GameBoardProps = {
  playerPosition: Position;
  glitchPositions: Position[];
  walls: Position[];
  numbers: { position: Position; value: number }[];
};

export const GameBoard = ({ playerPosition, glitchPositions, walls, numbers }: GameBoardProps) => {
  const boardSize = 10; // 10x10 grid
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
      
      if (isWall) {
        cellClass = "bg-gray-800";
        cellContent = null;
      } else if (isPlayer) {
        cellClass += " bg-green-100";
        cellContent = (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-4/5 h-4/5 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
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
          <span className="text-purple-900 font-medium">{number.value}</span>
        );
      }
      
      cells.push(
        <div 
          key={`${x}-${y}`}
          className={cellClass}
          style={{ width: '100%', paddingBottom: '100%', position: 'relative' }}
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
      className="grid grid-cols-10 gap-1 bg-purple-100 p-1 rounded-lg shadow-inner"
      style={{ aspectRatio: '1/1' }}
    >
      {cells}
    </div>
  );
};
