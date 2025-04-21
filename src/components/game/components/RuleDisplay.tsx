
import { GameRule } from "../types";

type RuleDisplayProps = {
  currentRule: GameRule | null;
  remainingNumbers: { value: number }[];
};

export const RuleDisplay = ({ currentRule, remainingNumbers }: RuleDisplayProps) => {
  const remainingMatchingCount = currentRule ? 
    remainingNumbers.filter(n => currentRule.isMatch(n.value)).length : 0;

  return (
    <div className="rule-display bg-purple-100 p-2 rounded-md mb-4 text-center">
      <span className="text-purple-800 font-medium">Rule: </span>
      <span className="text-purple-900 font-bold">{currentRule?.name}</span>
      <div className="text-xs text-purple-700 mt-1">
        Remaining valid numbers: {remainingMatchingCount}
      </div>
    </div>
  );
};

