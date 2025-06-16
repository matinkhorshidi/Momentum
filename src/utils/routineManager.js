/**
 * Helper to get yesterday's date string in YYYY-MM-DD format
 */
const getYesterdayDateString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().slice(0, 10);
};

/**
 * Checks if a routine is scheduled for today.
 * @param {object} routine - The routine object { type, days }
 * @returns {boolean}
 */
const isScheduledForToday = (routine) => {
  if (!routine) return false;
  const todayIndex = new Date().getDay(); // 0 for Sunday, 1 for Monday, etc.
  if (routine.type === 'daily') return true;
  if (routine.type === 'weekly') {
    return routine.days.includes(todayIndex);
  }
  return false;
};

/**
 * Determines the status of today's routines based on logs and streaks.
 * @param {Array} categories - The user's full categories array.
 * @param {object} log - The user's full log object.
 * @returns {Array} - An array of today's routines with their status.
 */
export const getTodaysRoutines = (categories = [], log = {}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterdayStr = getYesterdayDateString();
  const todaysLog = log[todayStr] || {};

  const scheduledRoutines = categories.filter((cat) =>
    isScheduledForToday(cat.routine)
  );

  return scheduledRoutines.map((cat) => {
    const isCompleted = todaysLog[cat.id] > 0;
    let streakCount = cat.streak?.count || 0;

    // Check if the streak was broken
    if (
      streakCount > 0 &&
      cat.streak?.lastCompleted !== todayStr &&
      cat.streak?.lastCompleted !== yesterdayStr
    ) {
      streakCount = 0; // Reset streak if they missed a day
    }

    return {
      id: cat.id,
      label: cat.label,
      color: cat.color,
      status: isCompleted ? 'completed' : 'pending',
      streak: streakCount,
    };
  });
};

/**
 * This function should be called when a routine is completed.
 * It returns the updated streak object to be saved.
 * @param {object} category - The category object being updated.
 * @returns {object} - The new streak object.
 */
export const updateStreak = (category) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterdayStr = getYesterdayDateString();
  const lastCompleted = category.streak?.lastCompleted;
  let currentCount = category.streak?.count || 0;

  if (lastCompleted === todayStr) {
    return category.streak; // Already completed today, no change
  }

  if (lastCompleted === yesterdayStr) {
    currentCount++; // Maintained the streak
  } else {
    currentCount = 1; // New streak or broken streak
  }

  return {
    count: currentCount,
    lastCompleted: todayStr,
  };
};
