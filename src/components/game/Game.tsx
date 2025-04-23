
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
  challengeMode?: boolean;
};

const INITIAL_LIVES = 3;
const MAX_CHALLENGE_LEVEL = 50;

const Game = ({ onGameOver, level: initialLevel, onUpdateGameStatus, challengeMode = false }: GameProps) => {
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
  const challengeLevelRef = useRef(1);
  const navigate = useNavigate();

  const getGameLevel = () => {
    if (challengeMode) {
      // For challenge mode, cycle through available levels and increase difficulty
      const levelIndex = (challengeLevelRef.current - 1) % levels.length;
      const baseLevel = levels[levelIndex];
      
      // Increase difficulty based on how many times we've cycled through all levels
      const cycleCount = Math.floor((challengeLevelRef.current - 1) / levels.length);
      const difficultyMultiplier = 1 + (cycleCount * 0.2); // 20% harder each cycle
      
      return {
        ...baseLevel,
        id: challengeLevelRef.current,
        glitchSpeed: baseLevel.glitchSpeed * difficultyMultiplier
      };
    } else {
      // Normal mode - just get the selected level
      return levels.find(l => l.id === level) || levels[0];
    }
  };

  const handleLevelComplete = () => {
    if (challengeMode) {
      challengeLevelRef.current += 1;
      
      if (challengeLevelRef.current > MAX_CHALLENGE_LEVEL) {
        onGameOver(gameStatus.score);
      } else {
        setLevel(challengeLevelRef.current);
        setShowLevelComplete(false);
      }
    } else if (level >= levels.length) {
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
    
    const gameLevel = getGameLevel();
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
    
    toast.success(`Level ${gameLevel.id}: ${gameLevel.rule.name}`, {
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
    
    const gameLevel = getGameLevel();
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
    
    toast.success(`Level ${gameLevel.id}: ${gameLevel.rule.name}`, {
      description: gameLevel.rule.description,
    });

    return () => clearTimeout(glitchTimer);
  }, [level]);

  const remainingMatchingCount = currentRule ? 
    gameStatus.remainingNumbers.filter(n => currentRule.isMatch(n.value)).length : 0;

  return (
    <div className="game-container relative bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-[#014F86]/20">
      <GameHeader 
        level={challengeMode ? challengeLevelRef.current : level} 
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
        level={challengeMode ? challengeLevelRef.current : level}
        maxLevel={challengeMode ? MAX_CHALLENGE_LEVEL : levels.length}
        onStartNext={startGlitchMovement}
      />
    </div>
  );
};

export default Game;
