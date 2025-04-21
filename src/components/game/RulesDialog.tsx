
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const RulesDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Rules</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How to Play Num Nom Dash</DialogTitle>
          <DialogDescription>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <span>Meet Num Nom, your number-collecting hero!</span>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Swipe or use arrow keys to move Num Nom</li>
                <li>Collect numbers that match the rule shown</li>
                <li>Avoid the Glitches or you'll lose a life</li>
                <li>Collect all matching numbers to advance</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
