import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { GameBoard } from "./GameBoard";
import { Direction, GameStatus, Position, GameRule } from "./types";
import { levels } from "./levels";
import { isPositionEqual } from "./utils";
import { usePlayerMovement } from "./usePlayerMovement";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RulesDialog } from "./RulesDialog";

type GameProps = {
  onGameOver: (score: number) => void;
  level: number;
  onUpdateGameStatus?: (status: Partial<GameStatus>) => void;
};

const INITIAL_LIVES = 3;

const Game = ({ onGameOver, level: initialLevel, onUpdateGameStatus }: GameProps) => {
  const isMobile = useIsMobile();
  const [level, setLevel] = useState(initialLevel);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    score: 0,
    lives: INITIAL_LIVES,
    level,
    playerPosition: { x: 0, y: 0 },
    playerStart: { x: 0, y: 0 },
    glitchPositions: [],
    remainingNumbers: [],
    walls: []
  });
  const [currentRule, setCurrentRule] = useState<GameRule | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const gameInitializedRef = useRef(false);

  const handleLevelComplete = () => {
    if (level >= levels.length) {
      onGameOver(gameStatus.score);
    } else {
      setLevel(prev => prev + 1);
      setShowLevelComplete(false);
    }
  };
  
  const handleNewGame = () => {
    gameInitializedRef.current = false;
    setLevel(1);
    onGameOver(gameStatus.score);
  };

  const {
    handleTouchStart,
    handleTouchEnd,
    movePlayerByClick,
  } = usePlayerMovement({
    gameStatus,
    setGameStatus,
    currentRule,
    onGameOver,
    onLevelComplete: () => setShowLevelComplete(true),
  });

  useEffect(() => {
    if (gameInitializedRef.current) return;
    
    const gameLevel = levels.find(l => l.id === level);
    if (!gameLevel) return;
    
    setCurrentRule(gameLevel.rule);
    const initialGameStatus = {
      score: gameStatus.score,
      lives: INITIAL_LIVES,
      level,
      playerPosition: gameLevel.maze.playerStart,
      playerStart: gameLevel.maze.playerStart,
      glitchPositions: gameLevel.maze.glitches,
      remainingNumbers: gameLevel.maze.numbers,
      walls: gameLevel.maze.walls
    };
    
    setGameStatus(initialGameStatus);
    onUpdateGameStatus?.(initialGameStatus);
    
    toast.success(`Level ${level}: ${gameLevel.rule.name}`, {
      description: gameLevel.rule.description,
    });
    
    gameInitializedRef.current = true;
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [level]);
  
  useEffect(() => {
    if (!gameInitializedRef.current) return;
    
    const gameLevel = levels.find(l => l.id === level);
    if (!gameLevel) return;
    
    setCurrentRule(gameLevel.rule);
    setGameStatus(prev => ({
      score: prev.score,
      lives: INITIAL_LIVES,
      level,
      playerPosition: gameLevel.maze.playerStart,
      playerStart: gameLevel.maze.playerStart,
      glitchPositions: gameLevel.maze.glitches,
      remainingNumbers: gameLevel.maze.numbers,
      walls: gameLevel.maze.walls
    }));
    
    toast.success(`Level ${level}: ${gameLevel.rule.name}`, {
      description: gameLevel.rule.description,
    });
  }, [level]);

  const remainingMatchingCount = currentRule ? 
    gameStatus.remainingNumbers.filter(n => currentRule.isMatch(n.value)).length : 0;

  return (
    <div className="game-container relative">
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
        <div className="text-purple-900 font-semibold">Score: {gameStatus.score}</div>
      </div>
      
      <div className="rule-display bg-purple-100 p-2 rounded-md mb-4 text-center">
        <span className="text-purple-800 font-medium">Rule: </span>
        <span className="text-purple-900 font-bold">{currentRule?.name}</span>
        <div className="text-xs text-purple-700 mt-1">
          Remaining valid numbers: {remainingMatchingCount}
        </div>
      </div>
      
      <GameBoard 
        playerPosition={gameStatus.playerPosition}
        glitchPositions={gameStatus.glitchPositions}
        walls={gameStatus.walls}
        numbers={gameStatus.remainingNumbers}
        onCellClick={movePlayerByClick}
        currentRule={currentRule}
      />

      <div className="mt-6 flex justify-between items-center">
        <div className="flex gap-2">
          <RulesDialog />
          <Link to="/high-scores">
            <Button variant="secondary" size="sm">High Scores</Button>
          </Link>
        </div>
        <Button 
          onClick={handleNewGame}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          New Game
        </Button>
      </div>
      
      {isMobile ? (
        <div className="mt-4 text-center text-sm text-gray-500">
          Swipe or tap adjacent square to move Num Nom
        </div>
      ) : (
        <div className="mt-4 text-center text-sm text-gray-500">
          Click an adjacent square or use arrow keys to move Num Nom
        </div>
      )}

      <AlertDialog open={showLevelComplete} onOpenChange={setShowLevelComplete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Level Complete!</AlertDialogTitle>
            <AlertDialogDescription>
              {level >= levels.length 
                ? "Congratulations! You've completed all levels!"
                : `Get ready for Level ${level + 1}!`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleLevelComplete}>
              {level >= levels.length ? "See Final Score" : "Start Next Level"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Game;
