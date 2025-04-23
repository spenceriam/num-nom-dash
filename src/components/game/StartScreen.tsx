
import { Button } from "@/components/ui/button";

type StartScreenProps = {
  onStart: () => void;
  levelName?: string;
};

const StartScreen = ({ onStart, levelName = "Game" }: StartScreenProps) => {
  return (
    <div className="min-h-screen bg-[#1A1F2C] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#6E59A5]/20 backdrop-blur-md rounded-2xl p-6 space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-[#9b87f5]">Welcome to Num Dash!</h2>
          <p className="text-[#D6BCFA]">
            {levelName !== "Challenge" 
              ? `You're about to play: ${levelName}`
              : "Challenge Mode: Play through all levels with increasing difficulty!"}
          </p>
        </div>
        
        <div className="bg-[#9b87f5]/10 p-4 rounded-lg">
          <h3 className="font-semibold text-[#9b87f5] mb-2">How to Play:</h3>
          <ul className="space-y-1 text-[#D6BCFA]">
            <li>• Swipe or use arrow keys to move Num Nom</li>
            <li>• Collect numbers that match the rule shown</li>
            <li>• Avoid the Glitches or you'll lose a life</li>
            <li>• Collect all matching numbers to advance</li>
          </ul>
        </div>
        
        <Button
          onClick={onStart}
          className="w-full bg-[#9b87f5] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#7E69AB] transition-colors"
        >
          Start {levelName}
        </Button>
      </div>
    </div>
  );
};

export default StartScreen;
