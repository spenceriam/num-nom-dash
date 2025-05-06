import { useNavigate } from "react-router-dom";
import { useGameState } from "./hooks/useGameState";
import { useGameInitialization } from "./hooks/useGameInitialization";
import { usePlayerMovement } from "./usePlayerMovement";
import { GameContainer } from "./components/GameContainer";
import { LevelCompleteDialog } from "./components/LevelCompleteDialog";
import { Position, GameStatus } from "./types";
import { getLevelByNumber } from "./levels";

type GameProps = {
  onGameOver: (score: number) => void;
  level: number;
  onUpdateGameStatus?: (status: Partial<GameStatus>) => void;
  challengeMode?: boolean;
};

const Game = ({ onGameOver, level: initialLevel, onUpdateGameStatus, challengeMode = false }: GameProps) => {
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
    challengeLevelLimit,
    targetNumber,
    setTargetNumber
  } = useGameState({
    initialLevel,
    onUpdateGameStatus,
    challengeMode
  });

  const { getGameLevel, challengeLevelRef } = useGameInitialization({
    level,
    challengeMode,
    setCurrentRule,
    setGameStatus,
    onUpdateGameStatus,
    gameStatus,
    setTargetNumber
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
    targetNumber,
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
    } else if (level >= getLevelByNumber(level).id) {
      onGameOver(gameStatus.score);
    } else {
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
        onCellClick={handleCellClick}
        onNewGame={handleNewGame}
        showGlitches={showGlitches}
        targetNumber={targetNumber}
      />

      <LevelCompleteDialog 
        show={showLevelComplete}
        onOpenChange={setShowLevelComplete}
        onComplete={handleLevelComplete}
        level={challengeMode ? challengeLevelRef.current : level}
        maxLevel={challengeMode ? challengeLevelLimit : getLevelByNumber(level).id}
        onStartNext={startGlitchMovement}
      />
    </>
  );
};

export default Game;