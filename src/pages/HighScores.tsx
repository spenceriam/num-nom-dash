
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getHighScores } from "@/components/game/highScores";
import { Link } from "react-router-dom";
import { gameTypes } from "@/components/game/levels";

type HighScore = {
  playerName: string;
  score: number;
  level: number;
  gameTypeId?: string;
  date: string;
};

const HighScores = () => {
  const [scores, setScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    const loadScores = async () => {
      const highScores = await getHighScores();
      setScores(highScores);
      setLoading(false);
    };
    
    loadScores();
  }, []);
  
  const filteredScores = activeTab === "all" 
    ? scores 
    : scores.filter(score => score.gameTypeId === activeTab);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#012A4A] via-[#013A63] to-[#014F86]">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg border-2 border-[#014F86]/20">
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-[#012A4A]">High Scores</h1>
            <p className="text-[#01497C]">
              See who's mastered Num Nom Dash!
            </p>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="challenge">Challenge</TabsTrigger>
              <TabsTrigger value="custom">By Type</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <HighScoreTable scores={scores} loading={loading} />
            </TabsContent>
            
            <TabsContent value="challenge" className="space-y-4">
              <HighScoreTable 
                scores={scores.filter(s => !s.gameTypeId)} 
                loading={loading} 
              />
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {gameTypes.map(type => (
                  <Button
                    key={type.id}
                    onClick={() => setActiveTab(type.id)}
                    className={`${type.color} text-white text-xs`}
                  >
                    {type.name}
                  </Button>
                ))}
              </div>
              
              <HighScoreTable 
                scores={filteredScores} 
                loading={loading} 
                gameTypeId={activeTab !== "all" && activeTab !== "challenge" ? activeTab : undefined}
              />
            </TabsContent>
          </Tabs>

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

type HighScoreTableProps = {
  scores: HighScore[];
  loading: boolean;
  gameTypeId?: string;
};

const HighScoreTable = ({ scores, loading, gameTypeId }: HighScoreTableProps) => {
  const gameType = gameTypeId ? gameTypes.find(gt => gt.id === gameTypeId) : null;
  
  return (
    <div className="bg-[#89C2D9]/20 p-4 rounded-lg">
      {gameType && (
        <div className={`mb-3 ${gameType.color} bg-opacity-20 p-2 rounded text-center font-medium`}>
          {gameType.name}
        </div>
      )}
      
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
              <tr key={index} className={index % 2 === 0 ? "bg-white/40" : "bg-[#89C2D9]/10"}>
                <td className="p-2 font-medium text-[#014F86]">{index + 1}</td>
                <td className="p-2 text-[#014F86]">{score.playerName}</td>
                <td className="p-2 text-right font-bold text-[#013A63]">{score.score}</td>
                <td className="p-2 text-right text-[#014F86]">{score.level || "-"}</td>
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
  );
};

export default HighScores;
