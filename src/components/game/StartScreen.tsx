
import { Button } from "@/components/ui/button";

type StartScreenProps = {
  onStart: () => void;
  levelName?: string;
};

const StartScreen = ({ onStart, levelName = "Game" }: StartScreenProps) => {
  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-purple-800">Welcome to Num Dash!</h2>
        <p className="text-purple-600">
          {levelName !== "Challenge" 
            ? `You're about to play: ${levelName}`
            : "Challenge Mode: Play through all levels with increasing difficulty!"}
        </p>
      </div>
      
      <div className="space-y-3 text-sm text-purple-700 w-full max-w-md">
        <div className="bg-purple-100 p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-purple-800 mb-2">How to Play:</h3>
          <ul className="list-disc pl-5 space-y-1 text-purple-700">
            <li>Swipe or use arrow keys to move Num Nom</li>
            <li>Collect numbers that match the rule shown</li>
            <li>Avoid the Glitches or you'll lose a life</li>
            <li>Collect all matching numbers to advance</li>
          </ul>
        </div>
      </div>
      
      <Button
        onClick={onStart}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-6 rounded-full text-lg font-medium hover:opacity-90 transition-opacity shadow-lg"
      >
        Start {levelName}
      </Button>
    </div>
  );
};

export default StartScreen;
