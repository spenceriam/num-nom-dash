
import { GameRule } from "../types";

type RuleDisplayProps = {
  currentRule: GameRule | null;
  remainingNumbers: { value: string }[];
};

export const RuleDisplay = ({ currentRule, remainingNumbers }: RuleDisplayProps) => {
  const remainingMatchingCount = currentRule ?
    remainingNumbers.filter(n => currentRule.isMatch(n.value)).length : 0;

  return (
    <div className="rule-display bg-[#89C2D9]/20 p-2 rounded-md mb-4 text-center">
      <span className="text-[#013A63] font-medium">Rule: </span>
      <span className="text-[#012A4A] font-bold">{currentRule?.name}</span>
      <div className="text-xs text-[#014F86] mt-1">
        Remaining answers: {remainingMatchingCount}
      </div>
    </div>
  );
};
