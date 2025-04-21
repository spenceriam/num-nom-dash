
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { levels } from "../levels";

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
  const nextLevel = levels.find(l => l.id === level + 1);

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
          <AlertDialogAction onClick={onComplete}>
            {level >= maxLevel ? "See Final Score" : "Start Next Level"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
