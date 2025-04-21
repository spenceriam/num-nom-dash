
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";

type LevelCompleteDialogProps = {
  show: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  level: number;
  maxLevel: number;
};

export const LevelCompleteDialog = ({ 
  show, 
  onOpenChange, 
  onComplete, 
  level, 
  maxLevel 
}: LevelCompleteDialogProps) => {
  return (
    <AlertDialog open={show} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Level Complete!</AlertDialogTitle>
          <AlertDialogDescription>
            {level >= maxLevel 
              ? "Congratulations! You've completed all levels!"
              : `Get ready for Level ${level + 1}!`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onComplete}>
            {level >= maxLevel ? "See Final Score" : "Start Next Level"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

