
import { Heart } from "lucide-react";

type GameHeaderProps = {
  level: number;
  lives: number;
  score: number;
  gameTypeName?: string;
  color?: string;
};

export const GameHeader = ({ level, lives, score, gameTypeName, color = "bg-[#014F86]" }: GameHeaderProps) => {
  return (
    <div className="game-header flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <span className={`${color} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
          Level {level}
        </span>
        {gameTypeName && (
          <span className="text-[#013A63] font-medium ml-2">
            {gameTypeName}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="lives flex items-center">
          {Array.from({ length: lives }).map((_, i) => (
            <Heart key={i} size={16} className="text-red-500 fill-red-500 mr-1" />
          ))}
        </div>
        <div className="score text-[#012A4A] font-bold">
          {score}
        </div>
      </div>
    </div>
  );
};
