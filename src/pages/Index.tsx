
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
    level: 1, // Ensure we start with level 1
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#012A4A] via-[#013A63] to-[#014F86] animate-gradient bg-[length:200%_200%]">
      <div className="w-full max-w-md p-4">
        {gameState === "playing" && (
          <Game 
            onGameOver={endGame} 
            level={1} // Explicitly set to level 1
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
