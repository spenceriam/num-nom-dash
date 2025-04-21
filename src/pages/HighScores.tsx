
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg border-2 border-[#014F86]/20">
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-[#012A4A]">High Scores</h1>
            <p className="text-[#01497C]">
              See who's mastered Num Nom Dash!
            </p>
          </div>

          <div className="bg-[#89C2D9]/20 p-4 rounded-lg">
            {loading ? (
              <div className="text-center py-8 text-[#013A63]">Loading scores...</div>
            ) : scores.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-[#012A4A]">Rank</th>
                    <th className="p-2 text-left text-[#012A4A]">Name</th>
                    <th className="p-2 text-right text-[#012A4A]">Score</th>
                    <th className="p-2 text-right text-[#012A4A]">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[#89C2D9]/10"}>
                      <td className="p-2 font-medium text-[#014F86]">{index + 1}</td>
                      <td className="p-2 text-[#014F86]">{score.playerName}</td>
                      <td className="p-2 text-right font-bold text-[#013A63]">{score.score}</td>
                      <td className="p-2 text-right text-[#014F86]">{score.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-[#01497C]">
                No high scores yet. Be the first to play!
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Link to="/" className="w-full">
              <Button className="w-full bg-gradient-to-r from-[#012A4A] to-[#014F86] text-white text-lg py-6 hover:opacity-90 transition-opacity">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HighScores;
