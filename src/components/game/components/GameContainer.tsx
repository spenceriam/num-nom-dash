import { GameStatus, Rule } from "../types";
import { GameBoard } from "../GameBoard";
import { GameHeader } from "./GameHeader";
import { RuleDisplay } from "./RuleDisplay";
import { GameFooter } from "./GameFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Position } from "../types";

type GameContainerProps = {
  gameStatus: GameStatus;
  currentRule: Rule | null;
  level: number;
  onCellClick: (position: Position) => void;
  onNewGame: () => void;
  showGlitches: boolean;
  targetNumber?: number;
};

export const GameContainer = ({
  gameStatus,
  currentRule,
  level,
  onCellClick,
  onNewGame,
  showGlitches,
  targetNumber
}: GameContainerProps) => {
  const isMobile = useIsMobile();

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
        targetNumber={targetNumber}
      />
      
      <GameBoard 
        playerPosition={gameStatus.playerPosition}
        glitchPositions={showGlitches ? gameStatus.glitchPositions : []}
        walls={gameStatus.walls}
        numbers={gameStatus.remainingNumbers}
        onCellClick={onCellClick}
        currentRule={currentRule}
      />

      <GameFooter 
        onNewGame={onNewGame}
        isMobile={isMobile}
      />
    </div>
  );
};