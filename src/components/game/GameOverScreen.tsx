
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { saveScore } from "./highScores";
import { toast } from "sonner";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

type GameOverScreenProps = {
  score: number;
  onRestart: () => void;
};

const GameOverScreen = ({ score, onRestart }: GameOverScreenProps) => {
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  
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
  
  const handleHome = () => {
    // Clear any game state in session storage
    sessionStorage.removeItem("gameState");
    sessionStorage.removeItem("gameScore");
    sessionStorage.removeItem("gameLevel");
    navigate("/");
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg border-2 border-[#014F86]/20">
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-[#012A4A]">Game Over!</h2>
            <p className="text-[#01497C]">Num Nom ran out of lives.</p>
          </div>
          
          <div className="bg-[#89C2D9]/20 rounded-lg py-4 px-8">
            <p className="text-xl font-medium text-[#012A4A]">Final Score: <span className="text-2xl font-bold">{score}</span></p>
          </div>
          
          {!submitted ? (
            <div className="w-full space-y-4">
              <h3 className="text-center text-[#013A63] font-medium">Save Your Score</h3>
              <div className="flex space-x-2">
                <Input
                  placeholder="Your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="flex-1 border-[#014F86]/20"
                />
                <Button 
                  onClick={handleSubmitScore}
                  className="bg-[#012A4A] text-white hover:opacity-90"
                >
                  Submit
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-green-600 font-medium text-center">Score submitted successfully!</p>
          )}
          
          <div className="flex justify-between gap-2">
            <Button
              onClick={onRestart}
              className="flex-1 bg-gradient-to-r from-[#012A4A] to-[#014F86] text-white hover:opacity-90 transition-opacity"
            >
              Play Again
            </Button>
            <Button
              onClick={handleHome}
              className="flex-1 bg-gradient-to-r from-[#012A4A] to-[#014F86] text-white hover:opacity-90 transition-opacity"
            >
              <Home className="mr-2" /> Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameOverScreen;
