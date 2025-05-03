
import { GameStatus, GameRule } from "../types";
import { GameBoard } from "../GameBoard";
import { GameHeader } from "./GameHeader";
import { RuleDisplay } from "./RuleDisplay";
import { GameFooter } from "./GameFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Position } from "../types";
import { gameTypes } from "../levels";

type GameContainerProps = {
  gameStatus: GameStatus;
  currentRule: GameRule | null;
  level: number;
  gameTypeId?: string;
  onCellClick: (position: Position) => void;
  onNewGame: () => void;
  showGlitches: boolean;
};

export const GameContainer = ({
  gameStatus,
  currentRule,
  level,
  gameTypeId,
  onCellClick,
  onNewGame,
  showGlitches
}: GameContainerProps) => {
  const isMobile = useIsMobile();
  const gameType = gameTypeId ? gameTypes.find(gt => gt.id === gameTypeId) : null;
  const headerColor = gameType?.color || "bg-[#014F86]";

  return (
    <div className="game-container relative bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-[#014F86]/20">
      <GameHeader 
        level={level} 
        lives={gameStatus.lives} 
        score={gameStatus.score}
        gameTypeName={gameType?.name} 
        color={headerColor}
      />
      
      <RuleDisplay 
        currentRule={currentRule} 
        remainingNumbers={gameStatus.remainingNumbers} 
        color={headerColor}
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
