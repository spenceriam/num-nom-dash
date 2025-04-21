import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { GameBoard } from "./GameBoard";
import { Direction, GameStatus, Position, GameRule } from "./types";
import { levels } from "./levels";
import { isPositionEqual } from "./utils";

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
  const touchStartRef = useRef<Position | null>(null);
  
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
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let direction: Direction | null = null;
      
      switch (e.key) {
        case "ArrowUp":
          direction = "up";
          break;
        case "ArrowDown":
          direction = "down";
          break;
        case "ArrowLeft":
          direction = "left";
          break;
        case "ArrowRight":
          direction = "right";
          break;
      }
      
      if (direction) {
        movePlayer(direction);
        e.preventDefault();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStatus]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || !touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const endPos = { x: touch.clientX, y: touch.clientY };
    const startPos = touchStartRef.current;
    
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 50) {
        movePlayer("right");
      } else if (dx < -50) {
        movePlayer("left");
      }
    } else {
      if (dy > 50) {
        movePlayer("down");
      } else if (dy < -50) {
        movePlayer("up");
      }
    }
    
    touchStartRef.current = null;
  };

  const movePlayerByClick = (pos: Position) => {
    setGameStatus(prev => {
      const { playerPosition, walls, glitchPositions } = prev;
      const dx = Math.abs(playerPosition.x - pos.x);
      const dy = Math.abs(playerPosition.y - pos.y);
      const isAdjacent = dx + dy === 1;
      const isWall = walls.some(wall => isPositionEqual(wall, pos));
      const isGlitch = glitchPositions.some(glitch => isPositionEqual(glitch, pos));
      if (!isAdjacent || isWall || isGlitch) return prev;
      return moveLogic(prev, pos);
    });
  };

  const movePlayer = (direction: Direction) => {
    setGameStatus(prev => {
      let newPos = { ...prev.playerPosition };
      switch (direction) {
        case "up":
          newPos.y = Math.max(0, newPos.y - 1);
          break;
        case "down":
          newPos.y = Math.min(9, newPos.y + 1);
          break;
        case "left":
          newPos.x = Math.max(0, newPos.x - 1);
          break;
        case "right":
          newPos.x = Math.min(9, newPos.x + 1);
          break;
      }
      return moveLogic(prev, newPos);
    });
  };

  const moveLogic = (prev: GameStatus, newPos: Position): GameStatus => {
    if (prev.walls.some(wall => isPositionEqual(wall, newPos))) {
      return prev;
    }

    let updatedNumbers = [...prev.remainingNumbers];
    let score = prev.score;

    const collectedNumberIndex = updatedNumbers.findIndex(num => 
      isPositionEqual(num.position, newPos)
    );

    if (collectedNumberIndex !== -1) {
      const collectedNumber = updatedNumbers[collectedNumberIndex];

      if (currentRule?.isMatch(collectedNumber.value)) {
        score += 10;
        updatedNumbers.splice(collectedNumberIndex, 1);
        toast.success(`+10 points!`);
      } else {
        toast.error("Wrong number!");
      }
    }

    const remainingCorrectNumbers = updatedNumbers.filter(num => 
      currentRule?.isMatch(num.value)
    );

    if (remainingCorrectNumbers.length === 0 && updatedNumbers.length !== prev.remainingNumbers.length) {
      toast.success("Level complete!");
    }

    if (prev.glitchPositions.some(glitch => isPositionEqual(glitch, newPos))) {
      const lives = prev.lives - 1;

      if (lives <= 0) {
        onGameOver(score);
        return prev;
      } else {
        toast.error(`Lost a life! ${lives} remaining`);
        return {
          ...prev,
          lives,
          playerPosition: prev.playerPosition
        };
      }
    }

    return {
      ...prev,
      playerPosition: newPos,
      score,
      remainingNumbers: updatedNumbers
    };
  };

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
