
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { gameTypes } from "../levels";

type LevelCompleteDialogProps = {
  show: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  level: number;
  gameTypeId?: string;
  maxLevel: number;
  onStartNext?: () => void;
};

export const LevelCompleteDialog = ({ 
  show, 
  onOpenChange, 
  onComplete, 
  level, 
  gameTypeId,
  maxLevel,
  onStartNext
}: LevelCompleteDialogProps) => {
  const gameType = gameTypeId ? gameTypes.find(gt => gt.id === gameTypeId) : null;
  
  const handleComplete = () => {
    onComplete();
    if (level < maxLevel && onStartNext) {
      onStartNext();
    }
  };

  return (
    <AlertDialog open={show} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Level Complete!</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            {level >= maxLevel 
              ? "Congratulations! You've reached the maximum level!"
              : (
                <>
                  <p>Get ready for Level {level + 1}!</p>
                  {gameType && (
                    <p className={`font-semibold ${gameType.color} bg-opacity-20 text-gray-800 px-2 py-1 rounded`}>
                      Game Type: {gameType.name}
                    </p>
                  )}
                  <p>The challenge gets harder as you progress!</p>
                </>
              )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleComplete}>
            {level >= maxLevel ? "See Final Score" : "Start Next Level"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
