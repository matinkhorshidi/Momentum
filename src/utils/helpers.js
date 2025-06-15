export const getTodayDateString = () => new Date().toISOString().slice(0, 10);

export const getTextColorForBg = (hexColor) => {
  if (!hexColor || hexColor.length < 7) return '#FFFFFF';
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
};
