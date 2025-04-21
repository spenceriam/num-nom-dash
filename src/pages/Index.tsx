
import { useState } from "react";
import Game from "@/components/game/Game";
import GameOverScreen from "@/components/game/GameOverScreen";
import { GameStatus } from "@/components/game/types";

type GameState = "playing" | "gameOver";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("playing");
  const [score, setScore] = useState(0);
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

  const endGame = (finalScore: number) => {
    setScore(finalScore);
    setGameState("gameOver");
  };

  const restartGame = () => {
    setGameState("playing");
    setScore(0);
  };

  const updateGameStatus = (newStatus: Partial<GameStatus>) => {
    setGameStatus(prev => ({ ...prev, ...newStatus }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        {gameState === "playing" && (
          <Game 
            onGameOver={endGame} 
            level={1}
            onUpdateGameStatus={updateGameStatus}
          />
        )}
        {gameState === "gameOver" && (
          <GameOverScreen score={score} onRestart={restartGame} />
        )}
      </div>
    </div>
  );
};

export default Index;
