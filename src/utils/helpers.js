export const getTodayDateString = () => new Date().toISOString().slice(0, 10);

export const getTextColorForBg = (hexColor) => {
  if (!hexColor || hexColor.length < 7) return '#FFFFFF';
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
};

/**
 * Calculates the user's overall consecutive daily streak.
 * @param {object} log - The user's full log object.
 * @returns {number} - The number of consecutive days with activity.
 */
export const calculateOverallStreak = (log = {}) => {
  if (Object.keys(log).length === 0) return 0;

  let streak = 0;
  const today = new Date();

  // Check if today has any logs
  const todayStr = today.toISOString().slice(0, 10);
  if (log[todayStr] && Object.keys(log[todayStr]).length > 0) {
    streak = 1;
  }

  // Check previous days
  for (let i = 1; i < 365; i++) {
    // Check up to a year back
    const prevDay = new Date(today);
    prevDay.setDate(today.getDate() - i);
    const prevDayStr = prevDay.toISOString().slice(0, 10);

    // If today had no streak, the streak is 0. If we find a gap, stop.
    if (
      (streak === 0 && i === 1) ||
      !log[prevDayStr] ||
      Object.keys(log[prevDayStr]).length === 0
    ) {
      // If today had logs but yesterday didn't, streak is 1. If today had no logs, it's 0.
      return streak;
    }

    // If today's streak depended on yesterday, increment
    if (streak > 0) {
      streak++;
    } else {
      // This logic path is for when today had no logs but previous days did
      const yesterdayStr = new Date(today);
      yesterdayStr.setDate(today.getDate() - 1);
      if (log[yesterdayStr.toISOString().slice(0, 10)]) {
        streak = 1; // Start counting from yesterday
      }
    }
  }

  return streak;
};
