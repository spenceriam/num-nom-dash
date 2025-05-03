
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { saveScore } from "./highScores";
import { toast } from "sonner";
import { gameTypes } from "./levels";

type GameOverScreenProps = {
  score: number;
  onRestart: () => void;
  gameTypeId?: string;
};

const GameOverScreen = ({ score, onRestart, gameTypeId }: GameOverScreenProps) => {
  const [playerName, setPlayerName] = useState("");
  const [saved, setSaved] = useState(false);
  
  const gameType = gameTypeId ? gameTypes.find(gt => gt.id === gameTypeId) : null;
  const headerColor = gameType?.color || "bg-[#014F86]";
  
  const handleSaveScore = async () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    const success = await saveScore(playerName, score, 0, gameTypeId);
    if (success) {
      toast.success("Score saved successfully!");
      setSaved(true);
    } else {
      toast.error("Failed to save score");
    }
  };
  
  return (
    <div className="min-h-screen bg-[#012A4A] flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#013A63]/30 backdrop-blur-md rounded-2xl border border-[#014F86]/20">
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-[#89C2D9]">Game Over</h2>
            
            {gameType && (
              <div className={`${gameType.color} bg-opacity-30 text-white px-3 py-1 rounded-lg inline-block`}>
                {gameType.name}
              </div>
            )}
            
            <div className="text-5xl font-bold text-white mt-4">
              {score}
            </div>
            <p className="text-[#A9D6E5]">Your final score</p>
          </div>
          
          {!saved ? (
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="playerName" className="text-[#A9D6E5]">Enter your name:</label>
                <Input
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-white/20 border-[#014F86]/30 text-white"
                  placeholder="Your name"
                  maxLength={15}
                />
              </div>
              
              <Button 
                onClick={handleSaveScore} 
                className={`w-full ${headerColor} text-white`}
              >
                Save Score
              </Button>
            </div>
          ) : (
            <div className="text-center text-[#A9D6E5]">
              Score saved successfully!
            </div>
          )}
          
          <Button
            onClick={onRestart}
            className="w-full bg-[#2C7DA0] hover:bg-[#2A6F97] text-white"
          >
            Play Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameOverScreen;
