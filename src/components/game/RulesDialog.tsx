import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Bug, Sparkles } from "lucide-react";

export const RulesDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="bg-white/90">
          <BookOpen className="mr-1" />
          Rules
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>How to Play Num Nom Dash</DialogTitle>
          <DialogDescription>
            Guide Num Nom through the maze and collect numbers following the level's rule!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex-1">
              <h4 className="font-semibold mb-2 text-purple-800 flex items-center gap-2">
                <Sparkles className="text-purple-600" size={20} /> Num Nom (You)
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Use arrow keys or swipe to move Num Nom around the maze</li>
                <li>Each level has a specific rule for which numbers you need to collect</li>
                <li>You have 3 lives per level - don't consume the wrong answers</li>
                <li>Collect all valid numbers to advance to the next level</li>
              </ul>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2 text-purple-800 flex items-center gap-2">
                <Bug className="text-red-500" size={20} /> Glitches
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Glitches will cost you a life if you touch them</li>
                <li>When only one valid number remains, glitches will chase you!</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-purple-800">How to Win:</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Complete each level by collecting all numbers that match the rule</li>
              <li>Plan your moves carefully to avoid wrong numbers</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
