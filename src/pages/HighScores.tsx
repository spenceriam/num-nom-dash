
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHighScores } from "@/components/game/highScores";
import { Link } from "react-router-dom";

type HighScore = {
  playerName: string;
  score: number;
  level: number;
  date: string;
};

const HighScores = () => {
  const [scores, setScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadScores = async () => {
      const highScores = await getHighScores();
      setScores(highScores);
      setLoading(false);
    };
    
    loadScores();
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#D6BCFA] to-[#E5DEFF] p-4">
      <Card className="w-full max-w-md shadow-lg border-2 border-[#7E69AB]">
        <CardHeader className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] text-white">
          <CardTitle className="text-center">Num Dash - High Scores</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8 text-[#1A1F2C]">Loading scores...</div>
          ) : scores.length > 0 ? (
            <div className="space-y-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#F1F0FB]">
                    <th className="p-2 text-left text-[#1A1F2C]">Rank</th>
                    <th className="p-2 text-left text-[#1A1F2C]">Name</th>
                    <th className="p-2 text-right text-[#1A1F2C]">Score</th>
                    <th className="p-2 text-right text-[#1A1F2C]">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#E5DEFF]/50"}>
                      <td className="p-2 font-medium text-[#1A1F2C]">{index + 1}</td>
                      <td className="p-2 text-[#1A1F2C]">{score.playerName}</td>
                      <td className="p-2 text-right font-bold text-[#6E59A5]">{score.score}</td>
                      <td className="p-2 text-right text-[#1A1F2C]">{score.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-[#8E9196]">
              No high scores yet. Be the first to play!
            </div>
          )}
          
          <div className="mt-6 flex justify-center">
            <Link to="/">
              <Button 
                className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] text-white hover:opacity-90 transition-opacity"
              >
                Back to Game
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HighScores;
