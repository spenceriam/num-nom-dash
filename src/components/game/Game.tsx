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
import { useNavigate } from "react-router-dom";

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
  const [showGlitches, setShowGlitches] = useState(false);
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
  const navigate = useNavigate();

  const handleLevelComplete = () => {
    if (level >= levels.length) {
      onGameOver(gameStatus.score);
    } else {
      setLevel(prev => prev + 1);
      setShowLevelComplete(false);
    }
  };
  
  const handleNewGame = () => {
    navigate("/");
  };

  const {
    handleTouchStart,
    handleTouchEnd,
    movePlayerByClick,
    startGlitchMovement,
    stopGlitchMovement,
  } = usePlayerMovement({
    gameStatus,
    setGameStatus,
    currentRule,
    onGameOver,
    onLevelComplete: () => {
      stopGlitchMovement();
      setShowLevelComplete(true);
    },
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
    
    setShowGlitches(false);
    
    // Calculate glitch delay based on level (starts at 10s, reduces by 0.5s per level)
    const glitchDelay = Math.max(10000 - ((level - 1) * 500), 5000);
    
    const glitchTimer = setTimeout(() => {
      setShowGlitches(true);
      toast.error("Glitches have appeared!");
    }, glitchDelay);
    
    toast.success(`Level ${level}: ${gameLevel.rule.name}`, {
      description: gameLevel.rule.description,
    });

    return () => clearTimeout(glitchTimer);
  }, [level]);

  const remainingMatchingCount = currentRule ? 
    gameStatus.remainingNumbers.filter(n => currentRule.isMatch(n.value)).length : 0;

  return (
    <div className="game-container relative bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-[#014F86]/20">
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
        glitchPositions={showGlitches ? gameStatus.glitchPositions : []}
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
        onStartNext={startGlitchMovement}
      />
    </div>
  );
};

export default Game;
