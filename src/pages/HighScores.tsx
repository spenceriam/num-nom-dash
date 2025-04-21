
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <CardTitle className="text-center">Num Dash - High Scores</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8">Loading scores...</div>
          ) : scores.length > 0 ? (
            <div className="space-y-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="p-2 text-left text-purple-900">Rank</th>
                    <th className="p-2 text-left text-purple-900">Name</th>
                    <th className="p-2 text-right text-purple-900">Score</th>
                    <th className="p-2 text-right text-purple-900">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-purple-50"}>
                      <td className="p-2 font-medium">{index + 1}</td>
                      <td className="p-2">{score.playerName}</td>
                      <td className="p-2 text-right font-bold">{score.score}</td>
                      <td className="p-2 text-right">{score.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No high scores yet. Be the first to play!
            </div>
          )}
          
          <div className="mt-6 flex justify-center">
            <Link to="/">
              <Button 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
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
