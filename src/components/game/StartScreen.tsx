
import { Button } from "@/components/ui/button";

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="text-center space-y-3">
        <h2 className="text-xl font-semibold text-purple-800">Welcome to Num Dash!</h2>
        <p className="text-gray-600">
          Help Num Nom navigate the maze, collect numbers that match the rule, and avoid the Glitches!
        </p>
      </div>
      
      <div className="space-y-3 text-sm text-gray-700">
        <div className="bg-purple-100 p-3 rounded-lg">
          <h3 className="font-medium text-purple-700 mb-1">How to Play:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Swipe or use arrow keys to move Num Nom</li>
            <li>Collect numbers that match the rule shown</li>
            <li>Avoid the Glitches or you'll lose a life</li>
            <li>Collect all matching numbers to advance</li>
          </ul>
        </div>
      </div>
      
      <Button
        onClick={onStart}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-6 rounded-full text-lg font-medium hover:opacity-90 transition-opacity"
      >
        Start Game
      </Button>
    </div>
  );
};

export default StartScreen;
