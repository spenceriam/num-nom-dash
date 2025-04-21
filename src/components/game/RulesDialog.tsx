
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export function RulesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <BookOpen className="mr-1" />
          Rules
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>How to Play Num Dash</DialogTitle>
          <DialogDescription>
            Guide Num Nom through the maze and collect numbers following the level's rule!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-purple-800">Basic Rules:</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Use arrow keys or swipe to move Num Nom around the maze</li>
              <li>Each level has a specific rule for which numbers you need to collect</li>
              <li>You have 3 lives per level - don't consume the wrong answers</li>
              <li>Collect all valid numbers to advance to the next level</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-purple-800">How to Win:</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Complete each level by collecting all numbers that match the rule</li>
              <li>Plan your moves carefully to avoid wrong numbers</li>
              <li>Complete levels quickly for a better score - time counts!</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-purple-800">Watch Out For:</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Glitches will cost you a life if you touch them</li>
              <li>When only one valid number remains, glitches will chase you!</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
