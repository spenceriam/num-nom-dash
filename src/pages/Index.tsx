
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Game from "@/components/game/Game";
import GameOverScreen from "@/components/game/GameOverScreen";
import StartScreen from "@/components/game/StartScreen";
import { GameStatus } from "@/components/game/types";
import { levels } from "@/components/game/levels";

type GameState = "starting" | "playing" | "gameOver";

const Index = () => {
  const [searchParams] = useSearchParams();
  const levelParam = searchParams.get('level');
  const mode = searchParams.get('mode');
  
  const [gameState, setGameState] = useState<GameState>("starting");
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
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

  useEffect(() => {
    if (levelParam) {
      setCurrentLevel(parseInt(levelParam, 10));
    }
  }, [levelParam]);

  const startGame = () => {
    setGameState("playing");
  };

  const endGame = (finalScore: number) => {
    setScore(finalScore);
    setGameState("gameOver");
  };

  const restartGame = () => {
    setGameState("starting");
    setScore(0);
  };

  const updateGameStatus = (newStatus: Partial<GameStatus>) => {
    setGameStatus(prev => ({ ...prev, ...newStatus }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#012A4A] via-[#013A63] to-[#014F86] animate-gradient bg-[length:200%_200%]">
      <div className="w-full max-w-md p-4">
        {gameState === "starting" && (
          <StartScreen onStart={startGame} levelName={levels[currentLevel - 1]?.rule.name || "Challenge"} />
        )}
        {gameState === "playing" && (
          <Game 
            onGameOver={endGame} 
            level={currentLevel}
            onUpdateGameStatus={updateGameStatus}
            challengeMode={mode === "challenge"}
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
