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
 * --- CORRECTED AND SIMPLIFIED ---
 * Determines the status of today's routines based on logs and streaks.
 * This function now ONLY reads the data and does not modify it.
 */
export const getTodaysRoutines = (categories = [], log = {}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysLog = log[todayStr] || {};

  const scheduledRoutines = categories.filter((cat) =>
    isScheduledForToday(cat.routine)
  );

  return scheduledRoutines.map((cat) => {
    const isCompleted = todaysLog[cat.id] > 0;

    // Simply read the streak count from the data.
    // If last completion was not today, it's not today's streak yet.
    let displayStreak =
      cat.streak?.lastCompleted === todayStr
        ? cat.streak?.count || 0
        : cat.streak?.count || 0;

    // A special case: if a streak was from yesterday, show it as pending to be continued
    if (
      !isCompleted &&
      cat.streak?.lastCompleted === getYesterdayDateString()
    ) {
      displayStreak = cat.streak?.count || 0;
    } else if (!isCompleted) {
      // If not completed today and not from yesterday, don't show a misleading streak number
      const lastCompletedDate = new Date(
        cat.streak?.lastCompleted + 'T00:00:00'
      );
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastCompletedDate < yesterday) {
        displayStreak = 0;
      }
    }

    return {
      id: cat.id,
      label: cat.label,
      color: cat.color,
      status: isCompleted ? 'completed' : 'pending',
      streak: displayStreak,
    };
  });
};

/**
 * --- CORRECTED AND MORE ROBUST ---
 * This function now correctly handles all cases for updating a streak.
 * @param {object} category - The category object being updated.
 * @returns {object} - The new streak object to be saved.
 */
export const updateStreak = (category) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterdayStr = getYesterdayDateString();

  const lastCompleted = category.streak?.lastCompleted;
  const currentCount = category.streak?.count || 0;

  // If already completed today, do nothing.
  if (lastCompleted === todayStr) {
    return category.streak;
  }

  // If last completed yesterday, it's a continuation. Increment the streak.
  if (lastCompleted === yesterdayStr) {
    return { count: currentCount + 1, lastCompleted: todayStr };
  }

  // Otherwise, it's a new or broken streak. Reset to 1.
  return { count: 1, lastCompleted: todayStr };
};
