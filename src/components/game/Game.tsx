import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { GameBoard } from "./GameBoard";
import { Direction, GameStatus, Position, GameRule } from "./types";
import { levels } from "./levels";
import { isPositionEqual } from "./utils";
import { usePlayerMovement } from "./usePlayerMovement";

type GameProps = {
  onGameOver: (score: number) => void;
  level: number;
};

const INITIAL_LIVES = 3;

const Game = ({ onGameOver, level }: GameProps) => {
  const isMobile = useIsMobile();
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    score: 0,
    lives: INITIAL_LIVES,
    level,
    playerPosition: { x: 0, y: 0 },
    glitchPositions: [],
    remainingNumbers: [],
    walls: []
  });
  const [currentRule, setCurrentRule] = useState<GameRule | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  const {
    handleTouchStart,
    handleTouchEnd,
    movePlayerByClick,
  } = usePlayerMovement({
    gameStatus,
    setGameStatus,
    currentRule,
    onGameOver,
  });

  useEffect(() => {
    const gameLevel = levels.find(l => l.id === level);
    if (!gameLevel) return;
    
    setCurrentRule(gameLevel.rule);
    setGameStatus({
      score: 0,
      lives: INITIAL_LIVES,
      level,
      playerPosition: gameLevel.maze.playerStart,
      glitchPositions: gameLevel.maze.glitches,
      remainingNumbers: gameLevel.maze.numbers,
      walls: gameLevel.maze.walls
    });
    
    toast.success(`Level ${level}: ${gameLevel.rule.name}`, {
      description: gameLevel.rule.description,
    });
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [level]);

  return (
    <div 
      className="game-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="text-purple-900 font-semibold">Level: {level}</div>
        <div className="text-purple-900 font-semibold">Lives: {gameStatus.lives}</div>
        <div className="text-purple-900 font-semibold">Score: {gameStatus.score}</div>
      </div>
      
      <div className="rule-display bg-purple-100 p-2 rounded-md mb-4 text-center">
        <span className="text-purple-800 font-medium">Rule: </span>
        <span className="text-purple-900 font-bold">{currentRule?.name}</span>
      </div>
      
      <GameBoard 
        playerPosition={gameStatus.playerPosition}
        glitchPositions={gameStatus.glitchPositions}
        walls={gameStatus.walls}
        numbers={gameStatus.remainingNumbers}
        onCellClick={movePlayerByClick}
      />
      
      {isMobile && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Swipe or tap adjacent square to move Num Nom
        </div>
      )}
      {!isMobile && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Click an adjacent square or use arrow keys to move Num Nom
        </div>
      )}
    </div>
  );
};

export default Game;
