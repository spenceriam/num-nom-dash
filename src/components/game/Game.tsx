
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
  
  // Initialize game
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
  
  // Handle keyboard controls
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
  
  // Handle touch controls
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
    
    // Determine swipe direction
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > 50) {
        movePlayer("right");
      } else if (dx < -50) {
        movePlayer("left");
      }
    } else {
      // Vertical swipe
      if (dy > 50) {
        movePlayer("down");
      } else if (dy < -50) {
        movePlayer("up");
      }
    }
    
    touchStartRef.current = null;
  };
  
  const movePlayer = (direction: Direction) => {
    setGameStatus(prev => {
      const newPos = { ...prev.playerPosition };
      
      // Calculate new position based on direction
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
      
      // Check for wall collision
      if (prev.walls.some(wall => isPositionEqual(wall, newPos))) {
        return prev; // Can't move into walls
      }
      
      // Check for number collection
      let updatedNumbers = [...prev.remainingNumbers];
      let score = prev.score;
      
      const collectedNumberIndex = updatedNumbers.findIndex(num => 
        isPositionEqual(num.position, newPos)
      );
      
      if (collectedNumberIndex !== -1) {
        const collectedNumber = updatedNumbers[collectedNumberIndex];
        
        if (currentRule?.isMatch(collectedNumber.value)) {
          // Correct number collected
          score += 10;
          updatedNumbers.splice(collectedNumberIndex, 1);
          toast.success(`+10 points!`);
        } else {
          // Wrong number collected
          toast.error("Wrong number!");
        }
      }
      
      // Check for completion
      const remainingCorrectNumbers = updatedNumbers.filter(num => 
        currentRule?.isMatch(num.value)
      );
      
      if (remainingCorrectNumbers.length === 0 && updatedNumbers.length !== prev.remainingNumbers.length) {
        toast.success("Level complete!");
        // In a real implementation, we would change levels here
      }
      
      // Check for glitch collision
      if (prev.glitchPositions.some(glitch => isPositionEqual(glitch, newPos))) {
        const lives = prev.lives - 1;
        
        if (lives <= 0) {
          // Game over
          onGameOver(score);
          return prev;
        } else {
          toast.error(`Lost a life! ${lives} remaining`);
          return {
            ...prev,
            lives,
            playerPosition: prev.playerPosition // Don't move into glitch
          };
        }
      }
      
      return {
        ...prev,
        playerPosition: newPos,
        score,
        remainingNumbers: updatedNumbers
      };
    });
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
      />
      
      {isMobile && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Swipe to move Num Nom
        </div>
      )}
    </div>
  );
};

export default Game;
