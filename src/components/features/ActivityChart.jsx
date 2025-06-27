import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useUser } from '../../context/UserProvider';
import { prepareChartData } from '../../utils/chartHelpers';
import Card from '../ui/Card';

// A custom tooltip to match the app's theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface p-3 rounded-lg border border-border-default shadow-lg">
        <p className="text-sm font-bold text-primary-text">{label}</p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-secondary-text">{entry.name}:</span>
            <span className="text-primary-text font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ActivityChart = () => {
  const { userData } = useUser();
  const [timeframe, setTimeframe] = useState(7); // Default to 7 days

  const chartData = useMemo(() => {
    return prepareChartData(
      userData?.log,
      userData?.settings?.categories,
      timeframe
    );
  }, [userData, timeframe]);

  const categories = userData?.settings?.categories || [];

  const TimeframeToggle = (
    <div className="flex items-center bg-input-bg p-1 rounded-md">
      <button
        onClick={() => setTimeframe(7)}
        className={`px-3 py-1 text-xs rounded transition-colors ${
          timeframe === 7
            ? 'bg-accent text-bg-color'
            : 'text-secondary-text hover:text-primary-text'
        }`}
      >
        7 Days
      </button>
      <button
        onClick={() => setTimeframe(30)}
        className={`px-3 py-1 text-xs rounded transition-colors ${
          timeframe === 30
            ? 'bg-accent text-bg-color'
            : 'text-secondary-text hover:text-primary-text'
        }`}
      >
        30 Days
      </button>
    </div>
  );

  return (
    <Card title="Recent Activity" headerAction={TimeframeToggle}>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff1a"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: '#a0a0a0', fontSize: 12 }}
              axisLine={{ stroke: '#ffffff1a' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#a0a0a0', fontSize: 12 }}
              axisLine={{ stroke: '#ffffff1a' }}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: '#ffffff1a' }}
            />
            {/* Map over categories to create a stacked <Bar> for each */}
            {categories.map((cat) => (
              <Bar
                key={cat.id}
                dataKey={cat.id}
                stackId="a" // This key ensures the bars are stacked
                name={cat.label}
                fill={cat.color}
                radius={[4, 4, 0, 0]} // Rounded corners for the top of the stack
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ActivityChart;
