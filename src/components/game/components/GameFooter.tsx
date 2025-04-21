
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RulesDialog } from "../RulesDialog";

type GameFooterProps = {
  onNewGame: () => void;
  isMobile: boolean;
};

export const GameFooter = ({ onNewGame, isMobile }: GameFooterProps) => {
  return (
    <>
      <div className="mt-6 flex justify-between items-center">
        <div className="flex gap-2">
          <RulesDialog />
          <Link to="/high-scores">
            <Button variant="secondary" size="sm">High Scores</Button>
          </Link>
        </div>
        <Button 
          onClick={onNewGame}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          New Game
        </Button>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        {isMobile 
          ? "Swipe or tap adjacent square to move Num Nom"
          : "Click an adjacent square or use arrow keys to move Num Nom"
        }
      </div>
    </>
  );
};

