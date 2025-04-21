
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Game from "@/components/game/Game";
import StartScreen from "@/components/game/StartScreen";
import GameOverScreen from "@/components/game/GameOverScreen";
import { RulesDialog } from "@/components/game/RulesDialog";
import { Sparkles } from "lucide-react";
import { GameStatus } from "@/components/game/types";

// Game states
type GameState = "start" | "playing" | "gameOver";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to restore game state from session storage
    const savedState = sessionStorage.getItem("gameState");
    return savedState ? JSON.parse(savedState) : "start";
  });
  const [score, setScore] = useState(() => {
    const savedScore = sessionStorage.getItem("gameScore");
    return savedScore ? parseInt(savedScore, 10) : 0;
  });
  const [level, setLevel] = useState(() => {
    const savedLevel = sessionStorage.getItem("gameLevel");
    return savedLevel ? parseInt(savedLevel, 10) : 1;
  });
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    score: 0,
    lives: 3,
    level: 1,
    playerPosition: { x: 0, y: 0 },
    playerStart: { x: 0, y: 0 },
    glitchPositions: [],
    remainingNumbers: [],
    walls: []
  });

  // Save game state to session storage when it changes
  useEffect(() => {
    sessionStorage.setItem("gameState", JSON.stringify(gameState));
    sessionStorage.setItem("gameScore", score.toString());
    sessionStorage.setItem("gameLevel", level.toString());
  }, [gameState, score, level]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setLevel(1);
    setGameStatus(prev => ({
      ...prev,
      score: 0,
      lives: 3,
      level: 1
    }));
  };

  const endGame = (finalScore: number) => {
    setScore(finalScore);
    setGameState("gameOver");
  };

  const restartGame = () => {
    startGame();
  };

  const updateGameStatus = (newStatus: Partial<GameStatus>) => {
    setGameStatus(prev => ({ ...prev, ...newStatus }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-2 border-purple-200 mb-4">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <RulesDialog />
            </div>
            <h1 className="text-2xl font-bold text-center flex-1">Num Nom Dash</h1>
            <Link to="/high-scores">
              <Button variant="secondary" size="sm">
                High Scores
              </Button>
            </Link>
          </div>
          
          <div className="p-4">
            {gameState === "playing" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-purple-900 font-semibold">Level: {level}</div>
                  <div className="text-purple-900 font-semibold flex items-center gap-1">
                    {Array.from({ length: gameStatus.lives }).map((_, i) => (
                      <Sparkles 
                        key={i}
                        className="w-5 h-5 text-green-700" 
                        strokeWidth={2.5}
                      />
                    ))}
                  </div>
                  <div className="text-purple-900 font-semibold">Score: {score}</div>
                </div>
                <Game 
                  onGameOver={endGame} 
                  level={level}
                  onUpdateGameStatus={updateGameStatus}
                />
              </div>
            )}
            {gameState === "start" && <StartScreen onStart={startGame} />}
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
