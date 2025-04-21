
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RulesDialog } from "@/components/game/RulesDialog";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-2 border-purple-200">
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-purple-800">Num Nom Dash</h1>
            <p className="text-gray-600">
              A fast-paced number collecting adventure where quick thinking meets mathematical challenges!
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-100 p-4 rounded-lg">
              <h2 className="font-semibold text-purple-800 mb-2">About the Game</h2>
              <p className="text-gray-700 text-sm">
                Guide Num Nom through mazes while collecting numbers that match specific rules. 
                Watch out for Glitches that will try to stop you! Can you master all the levels?
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <Link to="/play">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-lg py-6">
                  Play Game
                </Button>
              </Link>
              
              <div className="flex justify-between gap-2">
                <RulesDialog />
                <Link to="/high-scores">
                  <Button variant="secondary">High Scores</Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
