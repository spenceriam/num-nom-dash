
import { Sparkles } from "lucide-react";

type GameHeaderProps = {
  level: number;
  lives: number;
  score: number;
};

export const GameHeader = ({ level, lives, score }: GameHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="text-purple-900 font-semibold">Level: {level}</div>
      <div className="text-purple-900 font-semibold flex items-center gap-1">
        {Array.from({ length: lives }).map((_, i) => (
          <Sparkles 
            key={i}
            className="w-5 h-5 text-green-700" 
            strokeWidth={2.5}
          />
        ))}
      </div>
      <div className="text-purple-900 font-semibold">Score: {score}</div>
    </div>
  );
};

