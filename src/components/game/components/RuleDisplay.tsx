import { Rule, Expression } from "../types";
import { evaluateExpression } from "../utils/expressions";

type RuleDisplayProps = {
  currentRule: Rule | null;
  remainingNumbers: { value: string; expression?: Expression }[];
  targetNumber?: number;
};

export const RuleDisplay = ({ currentRule, remainingNumbers, targetNumber }: RuleDisplayProps) => {
  // Count remaining valid numbers based on the rule
  const remainingMatchingCount = currentRule ? 
    remainingNumbers.filter(n => {
      // If an expression object is available, use its computed value
      if (n.expression) {
        return currentRule.validate(n.expression.value, targetNumber);
      }
      
      // Otherwise, evaluate the string and check
      try {
        const value = evaluateExpression(n.value);
        return currentRule.validate(value, targetNumber);
      } catch (e) {
        return false;
      }
    }).length : 0;

  // Format rule description with target number if applicable
  let description = currentRule?.description || "";
  if (targetNumber !== undefined && description.includes('[target]')) {
    description = description.replace('[target]', targetNumber.toString());
  }

  return (
    <div className="rule-display bg-[#89C2D9]/20 p-2 rounded-md mb-4 text-center">
      <span className="text-[#013A63] font-medium">Rule: </span>
      <span className="text-[#012A4A] font-bold">{currentRule?.name}</span>
      <div className="text-sm text-[#014F86] mt-1">
        {description}
      </div>
      <div className="text-xs text-[#014F86] mt-1">
        Remaining valid numbers: {remainingMatchingCount}
      </div>
    </div>
  );
};