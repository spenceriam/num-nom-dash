
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Game from "@/components/game/Game";
import StartScreen from "@/components/game/StartScreen";
import GameOverScreen from "@/components/game/GameOverScreen";

// Game states
type GameState = "start" | "playing" | "gameOver";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("start");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setLevel(1);
  };

  const endGame = (finalScore: number) => {
    setScore(finalScore);
    setGameState("gameOver");
  };

  const restartGame = () => {
    startGame();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-2 border-purple-200 mb-4">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h1 className="text-2xl font-bold text-center flex-1">Num Dash</h1>
            <Link to="/high-scores">
              <Button variant="secondary" size="sm">
                High Scores
              </Button>
            </Link>
          </div>
          
          <div className="p-4">
            {gameState === "start" && <StartScreen onStart={startGame} />}
            {gameState === "playing" && <Game onGameOver={endGame} level={level} />}
            {gameState === "gameOver" && <GameOverScreen score={score} onRestart={restartGame} />}
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-gray-500 mt-2">
        <p>Use arrow keys or swipe to move. Collect numbers matching the rule!</p>
      </div>
    </div>
  );
};

export default Index;
