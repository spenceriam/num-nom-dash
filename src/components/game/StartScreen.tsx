
import { Button } from "@/components/ui/button";
import { gameTypes } from "./levels";

type StartScreenProps = {
  onStart: () => void;
  levelName?: string;
  gameTypeId?: string;
  challengeMode?: boolean;
};

const StartScreen = ({ onStart, levelName = "Game", gameTypeId, challengeMode = false }: StartScreenProps) => {
  const gameType = gameTypeId ? gameTypes.find(gt => gt.id === gameTypeId) : null;
  const headerColor = gameType?.color || "bg-[#014F86]";
  
  return (
    <div className="min-h-screen bg-[#012A4A] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#013A63]/30 backdrop-blur-md rounded-2xl p-6 space-y-6 border border-[#014F86]/20">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-[#89C2D9]">Welcome to Num Dash!</h2>
          
          {gameType ? (
            <div className="space-y-2">
              <p className={`${gameType.color} bg-opacity-30 text-white px-3 py-1 rounded-lg inline-block`}>
                {gameType.name}
              </p>
              <p className="text-[#A9D6E5]">
                {gameType.description}
              </p>
            </div>
          ) : challengeMode ? (
            <p className="text-[#A9D6E5]">
              Challenge Mode: Play through all types with increasing difficulty!
            </p>
          ) : (
            <p className="text-[#A9D6E5]">
              You're about to play: {levelName}
            </p>
          )}
        </div>
        
        <div className="bg-[#2A6F97]/10 p-4 rounded-lg">
          <h3 className="font-semibold text-[#61A5C2] mb-2">How to Play:</h3>
          <ul className="space-y-1 text-[#A9D6E5]">
            <li>• Swipe or use arrow keys to move Num Nom</li>
            <li>• Collect numbers that match the rule shown</li>
            <li>• Avoid the Glitches or you'll lose a life</li>
            <li>• Collect all matching numbers to advance</li>
            {!challengeMode && <li>• Levels get progressively harder</li>}
          </ul>
        </div>
        
        <Button
          onClick={onStart}
          className={`w-full ${headerColor} text-white px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-opacity`}
        >
          Start {gameType?.name || levelName}
        </Button>
      </div>
    </div>
  );
};

export default StartScreen;
