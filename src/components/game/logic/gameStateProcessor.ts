import { GameStatus, Position, Rule } from "../types";
import { isPositionEqual } from "../utils";
import { getChaseMove } from "./glitchMovement";
import { toast } from "sonner";
import { evaluateExpression } from "../utils/expressions";

type ProcessMovementParams = {
  prev: GameStatus;
  newPos: Position;
  currentRule: Rule | null;
  onGameOver: (score: number) => void;
  onLevelComplete?: () => void;
  targetNumber?: number;
};

export function processMovement({
  prev,
  newPos,
  currentRule,
  onGameOver,
  onLevelComplete,
  targetNumber,
}: ProcessMovementParams): GameStatus {
  // Don't allow moving through walls
  if (prev.walls.some((wall) => isPositionEqual(wall, newPos))) {
    return prev;
  }

  let updatedNumbers = [...prev.remainingNumbers];
  let score = prev.score;
  let lives = prev.lives;
  let playerPosition = newPos;

  // Check if player collects a number
  const collectedNumberIndex = updatedNumbers.findIndex((num) =>
    isPositionEqual(num.position, newPos)
  );

  if (collectedNumberIndex !== -1) {
    const collectedNumber = updatedNumbers[collectedNumberIndex];
    let isValidNumber = false;

    if (currentRule) {
      // If expression object is available, use it
      if (collectedNumber.expression) {
        isValidNumber = currentRule.validate(collectedNumber.expression.value, targetNumber);
      } else {
        // Otherwise evaluate the string
        try {
          const value = evaluateExpression(collectedNumber.value);
          isValidNumber = currentRule.validate(value, targetNumber);
        } catch (e) {
          isValidNumber = false;
        }
      }
    }

    if (isValidNumber) {
      score += 10;
      updatedNumbers.splice(collectedNumberIndex, 1);
      toast.success(`+10 points!`);
    } else {
      lives -= 1;
      
      // Format rule description with target number if applicable
      let ruleDesc = currentRule?.description || 'No rule';
      if (targetNumber !== undefined && ruleDesc.includes('[target]')) {
        ruleDesc = ruleDesc.replace('[target]', targetNumber.toString());
      }
      
      toast.error(`Wrong number! Rule: ${ruleDesc}`);
      updatedNumbers.splice(collectedNumberIndex, 1);
      
      if (lives <= 0) {
        onGameOver(score);
        return prev;
      }
    }
  }

  // Check if there are any matching numbers left to determine if glitches should chase
  const remainingCorrectNumbers = currentRule ? updatedNumbers.filter((num) => {
    // If expression object is available, use it
    if (num.expression) {
      return currentRule.validate(num.expression.value, targetNumber);
    }
    
    // Otherwise evaluate the string
    try {
      const value = evaluateExpression(num.value);
      return currentRule.validate(value, targetNumber);
    } catch (e) {
      return false;
    }
  }) : [];
  
  const shouldChase = remainingCorrectNumbers.length <= 1;

  // Move all glitches and let them consume numbers
  let updatedGlitchPositions = prev.glitchPositions.map(glitch => {
    const newGlitchPos = getChaseMove(
      glitch, 
      playerPosition, 
      prev.walls,
      shouldChase ? 1 : updatedNumbers.length
    );

    // Increased random chance (now 80%) to attempt consuming a number
    if (Math.random() < 0.8) {
      const numberAtNewPos = updatedNumbers.findIndex(num => 
        isPositionEqual(num.position, newGlitchPos)
      );
      
      if (numberAtNewPos !== -1) {
        const consumedNumber = updatedNumbers[numberAtNewPos];
        let isValidNumber = false;
        
        if (currentRule) {
          // If expression object is available, use it
          if (consumedNumber.expression) {
            isValidNumber = currentRule.validate(consumedNumber.expression.value, targetNumber);
          } else {
            // Otherwise evaluate the string
            try {
              const value = evaluateExpression(consumedNumber.value);
              isValidNumber = currentRule.validate(value, targetNumber);
            } catch (e) {
              isValidNumber = false;
            }
          }
        }
        
        updatedNumbers.splice(numberAtNewPos, 1);
        if (isValidNumber) {
          toast.error("A glitch consumed a matching number!");
        }
      }
    }
    
    return newGlitchPos;
  });

  // Check if there are any matching numbers left after glitch movement
  const remainingCorrectNumbersAfterGlitch = currentRule ? updatedNumbers.filter((num) => {
    // If expression object is available, use it
    if (num.expression) {
      return currentRule.validate(num.expression.value, targetNumber);
    }
    
    // Otherwise evaluate the string
    try {
      const value = evaluateExpression(num.value);
      return currentRule.validate(value, targetNumber);
    } catch (e) {
      return false;
    }
  }) : [];

  if (remainingCorrectNumbersAfterGlitch.length === 0 && updatedNumbers.length > 0 && currentRule) {
    onLevelComplete?.();
  }

  // Only deduct a life if there's 1 or fewer matching numbers remaining
  if (updatedGlitchPositions.some((g) => isPositionEqual(g, newPos))) {
    // Check if there are 1 or fewer matching numbers
    if (remainingCorrectNumbers.length <= 1) {
      lives = prev.lives - 1;
      if (lives <= 0) {
        onGameOver(score);
        return prev;
      } else {
        toast.error(`Hit by a glitch! 1 life lost - ${lives} remaining`);
        return {
          ...prev,
          lives,
          playerPosition: prev.playerStart || { x: 0, y: 0 },
          glitchPositions: updatedGlitchPositions
        };
      }
    }
  }

  return {
    ...prev,
    playerPosition,
    score,
    lives,
    remainingNumbers: updatedNumbers,
    glitchPositions: updatedGlitchPositions
  };
}