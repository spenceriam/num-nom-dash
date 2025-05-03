
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGameState } from "./hooks/useGameState";
import { useGameInitialization } from "./hooks/useGameInitialization";
import { usePlayerMovement } from "./usePlayerMovement";
import { GameContainer } from "./components/GameContainer";
import { LevelCompleteDialog } from "./components/LevelCompleteDialog";
import { Position, GameStatus } from "./types";
import { levels, gameTypes, generateLevel } from "./levels";

type GameProps = {
  onGameOver: (score: number) => void;
  level?: number;
  gameTypeId?: string;
  onUpdateGameStatus?: (status: Partial<GameStatus>) => void;
  challengeMode?: boolean;
};

const Game = ({ 
  onGameOver, 
  level: initialLevel = 1, 
  gameTypeId: initialGameType, 
  onUpdateGameStatus, 
  challengeMode = false 
}: GameProps) => {
  const navigate = useNavigate();
  const {
    level,
    setLevel,
    showLevelComplete,
    setShowLevelComplete,
    showGlitches,
    setShowGlitches,
    gameStatus,
    setGameStatus,
    currentRule,
    setCurrentRule,
    gameTypeId,
    setGameTypeId,
    challengeLevelLimit
  } = useGameState({
    initialLevel,
    initialGameType,
    onUpdateGameStatus,
    challengeMode
  });

  const { getGameLevel, challengeLevelRef } = useGameInitialization({
    level,
    gameTypeId,
    challengeMode,
    setCurrentRule,
    setGameStatus,
    onUpdateGameStatus,
    gameStatus
  });

  const {
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

  const handleLevelComplete = () => {
    if (challengeMode) {
      challengeLevelRef.current += 1;
      
      if (challengeLevelRef.current > challengeLevelLimit) {
        onGameOver(gameStatus.score);
      } else {
        setLevel(challengeLevelRef.current);
        setShowLevelComplete(false);
      }
    } else {
      // Progress to the next level within the same game type
      setLevel(prev => prev + 1);
      setShowLevelComplete(false);
    }
  };
  
  const handleNewGame = () => {
    navigate("/");
  };

  const handleCellClick = (position: Position) => {
    movePlayerByClick(position);
  };

  return (
    <>
      <GameContainer
        gameStatus={gameStatus}
        currentRule={currentRule}
        level={challengeMode ? challengeLevelRef.current : level}
        gameTypeId={gameTypeId}
        onCellClick={handleCellClick}
        onNewGame={handleNewGame}
        showGlitches={showGlitches}
      />

      <LevelCompleteDialog 
        show={showLevelComplete}
        onOpenChange={setShowLevelComplete}
        onComplete={handleLevelComplete}
        level={challengeMode ? challengeLevelRef.current : level}
        gameTypeId={gameTypeId}
        maxLevel={challengeMode ? challengeLevelLimit : 50}
        onStartNext={startGlitchMovement}
      />
    </>
  );
};

export default Game;
