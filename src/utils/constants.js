export const COLOR_PALETTE = {
  Vibrant: [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
  ],
  Pastel: [
    '#fca5a5',
    '#fdba74',
    '#fde047',
    '#86efac',
    '#93c5fd',
    '#c4b5fd',
    '#f9a8d4',
  ],
};

// NEW: This defines the structure for a brand new user with no default categories.
export const EMPTY_USER_DATA = {
  settings: {
    focusDuration: 45,
    categories: [], // Categories start as an empty array
  },
  log: {},
};
