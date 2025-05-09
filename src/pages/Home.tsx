
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RulesDialog } from "@/components/game/RulesDialog";

const Home = () => {
  // Game type categories with their corresponding level IDs
  const gameTypes = [
    { name: "Evens", levelId: 1 },
    { name: "Odds", levelId: 2 },
    { name: "Primes", levelId: 3 },
    { name: "Additions", levelId: 4 },
    { name: "Subtractions", levelId: 13 },
    { name: "Multiples", levelId: 7 },
    { name: "Factors", levelId: 10 }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg border-2 border-[#014F86]/20">
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center">
              <img src="/Num-Nom.png" alt="Num-Nom" className="h-12 mr-2" />
              <h1 className="text-4xl font-bold text-[#012A4A]">Num Nom Dash</h1>
            </div>
            <p className="text-[#01497C]">
              A fast-paced number collecting adventure where quick thinking meets mathematical challenges!
            </p>
          </div>

          <div className="bg-[#89C2D9]/20 p-4 rounded-lg">
            <h2 className="font-semibold text-[#013A63] mb-3 text-center">
              Select a Game to Play
            </h2>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {gameTypes.map(gameType => (
                <Link key={gameType.name} to={`/play?level=${gameType.levelId}`}>
                  <Button className="w-full bg-[#013A63] hover:bg-[#012A4A] text-white">
                    {gameType.name}
                  </Button>
                </Link>
              ))}
            </div>

            <Link to="/play?mode=challenge" className="block mt-4">
              <Button className="w-full bg-gradient-to-r from-[#012A4A] to-[#014F86] text-white py-3 hover:opacity-90 transition-opacity">
                Challenge Mode
              </Button>
            </Link>
          </div>

          <div className="flex justify-between gap-2">
            <RulesDialog />
            <Link to="/high-scores">
              <Button variant="secondary" className="bg-[#89C2D9]/20 text-[#012A4A] hover:bg-[#89C2D9]/30">
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
