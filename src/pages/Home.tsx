
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RulesDialog } from "@/components/game/RulesDialog";
import { gameTypes } from "@/components/game/levels";
import { Trophy } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg border-2 border-[#014F86]/20">
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-[#012A4A]">Num Nom Dash</h1>
            <p className="text-[#01497C]">
              A fast-paced number collecting adventure where quick thinking meets mathematical challenges!
            </p>
          </div>

          <div className="bg-[#89C2D9]/20 p-4 rounded-lg">
            <h2 className="font-semibold text-[#013A63] mb-2">Choose a Game Type</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {gameTypes.map(gameType => (
                <Link key={gameType.id} to={`/play?gameType=${gameType.id}`}>
                  <Button className={`w-full ${gameType.color} hover:opacity-90 text-white`}>
                    Play {gameType.name}
                  </Button>
                </Link>
              ))}
            </div>
            
            <Link to="/play?mode=challenge" className="block mt-4">
              <Button className="w-full bg-gradient-to-r from-[#012A4A] to-[#014F86] text-white text-lg py-6 hover:opacity-90 transition-opacity">
                Play Challenge Mode
              </Button>
            </Link>
          </div>

          <div className="flex justify-between gap-2">
            <RulesDialog />
            <Link to="/high-scores">
              <Button variant="secondary" className="bg-[#89C2D9]/20 text-[#012A4A] hover:bg-[#89C2D9]/30 flex items-center gap-2">
                <Trophy size={16} />
                High Scores
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
