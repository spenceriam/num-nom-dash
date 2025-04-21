
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveScore } from "./highScores";
import { toast } from "sonner";

type GameOverScreenProps = {
  score: number;
  onRestart: () => void;
};

const GameOverScreen = ({ score, onRestart }: GameOverScreenProps) => {
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmitScore = async () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    const success = await saveScore(playerName, score, 1);
    if (success) {
      toast.success("Score saved!");
      setSubmitted(true);
    } else {
      toast.error("Failed to save score");
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-purple-800">Game Over!</h2>
        <p className="text-gray-600">Num Nom ran out of lives.</p>
      </div>
      
      <div className="bg-purple-100 rounded-lg py-4 px-8">
        <p className="text-xl font-medium text-purple-900">Final Score: <span className="text-2xl font-bold">{score}</span></p>
      </div>
      
      {!submitted ? (
        <div className="w-full space-y-4">
          <h3 className="text-center text-purple-800 font-medium">Save Your Score</h3>
          <div className="flex space-x-2">
            <Input
              placeholder="Your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSubmitScore}>
              Submit
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-green-600 font-medium">Score submitted successfully!</p>
      )}
      
      <Button
        onClick={onRestart}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-2 rounded-full hover:opacity-90 transition-opacity"
      >
        Play Again
      </Button>
    </div>
  );
};

export default GameOverScreen;
