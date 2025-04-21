
// This file will integrate with Supabase once connected
// For now, we'll use local storage as a fallback

export const saveScore = async (playerName: string, score: number, level: number) => {
  try {
    // This will be replaced with Supabase code
    const scores = getLocalScores();
    scores.push({ playerName, score, level, date: new Date().toISOString() });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem('numDashHighScores', JSON.stringify(scores.slice(0, 10)));
    return true;
  } catch (error) {
    console.error("Error saving score:", error);
    return false;
  }
};

export const getHighScores = async () => {
  try {
    // This will be replaced with Supabase code
    return getLocalScores();
  } catch (error) {
    console.error("Error getting high scores:", error);
    return [];
  }
};

// Helper function to get scores from localStorage
const getLocalScores = () => {
  const scores = localStorage.getItem('numDashHighScores');
  return scores ? JSON.parse(scores) : [];
};
