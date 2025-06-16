/**
 * Prepares user log data for use in the Recharts BarChart.
 * @param {object} log - The user's log object from Supabase.
 * @param {Array} categories - The user's categories array.
 * @param {number} days - The number of past days to process (e.g., 7 or 30).
 * @returns {Array} - An array of objects formatted for the chart.
 */
export const prepareChartData = (log = {}, categories = [], days = 7) => {
  const chartData = [];
  const today = new Date();

  // Create a map of category IDs to their labels and colors for quick lookup
  const categoryMap = new Map(
    categories.map((c) => [c.id, { label: c.label, color: c.color }])
  );

  // Generate data for the last N days, including today
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dateString = date.toISOString().slice(0, 10);
    const dayLog = log[dateString] || {};

    // Format the date for the chart's X-axis (e.g., "Jun 16")
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const dataPoint = {
      date: formattedDate,
    };

    // Initialize all possible categories with 0 for this day
    categories.forEach((cat) => {
      dataPoint[cat.id] = 0;
    });

    // Fill in the actual counts from the log
    Object.entries(dayLog).forEach(([catId, count]) => {
      if (categoryMap.has(catId)) {
        dataPoint[catId] = count;
      }
    });

    chartData.push(dataPoint);
  }

  return chartData;
};
