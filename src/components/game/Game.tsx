import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { GameBoard } from "./GameBoard";
import { GameStatus, GameRule } from "./types";
import { levels } from "./levels";
import { usePlayerMovement } from "./usePlayerMovement";
import { GameHeader } from "./components/GameHeader";
import { RuleDisplay } from "./components/RuleDisplay";
import { GameFooter } from "./components/GameFooter";
import { LevelCompleteDialog } from "./components/LevelCompleteDialog";

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
      <GameHeader 
        level={level} 
        lives={gameStatus.lives} 
        score={gameStatus.score} 
      />
      
      <RuleDisplay 
        currentRule={currentRule} 
        remainingNumbers={gameStatus.remainingNumbers} 
      />
      
      <GameBoard 
        playerPosition={gameStatus.playerPosition}
        glitchPositions={gameStatus.glitchPositions}
        walls={gameStatus.walls}
        numbers={gameStatus.remainingNumbers}
        onCellClick={movePlayerByClick}
        currentRule={currentRule}
      />

      <GameFooter 
        onNewGame={handleNewGame}
        isMobile={isMobile}
      />

      <LevelCompleteDialog 
        show={showLevelComplete}
        onOpenChange={setShowLevelComplete}
        onComplete={handleLevelComplete}
        level={level}
        maxLevel={levels.length}
      />
    </div>
  );
};

export default Game;
