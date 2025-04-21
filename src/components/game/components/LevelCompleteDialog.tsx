
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { levels } from "../levels";

type LevelCompleteDialogProps = {
  show: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  level: number;
  maxLevel: number;
  onStartNext?: () => void;
};

export const LevelCompleteDialog = ({ 
  show, 
  onOpenChange, 
  onComplete, 
  level, 
  maxLevel,
  onStartNext
}: LevelCompleteDialogProps) => {
  const nextLevel = levels.find(l => l.id === level + 1);
  
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
              ? "Congratulations! You've completed all levels!"
              : (
                <>
                  <p>Get ready for Level {level + 1}!</p>
                  <p className="text-[#1EAEDB] font-semibold">
                    Next rule: {nextLevel?.rule.name}
                  </p>
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
