import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/helpers';
import Card from '../ui/Card';

const History = () => {
  const { userData } = useAppContext();
  const [openEntry, setOpenEntry] = useState(null);

  const { categoryMap, sortedDates } = React.useMemo(() => {
    const catMap = new Map(
      (userData?.settings?.categories || []).map((cat) => [cat.id, cat])
    );
    const dates = Object.keys(userData?.log || {})
      .filter((date) => date !== getTodayDateString())
      .sort((a, b) => new Date(b) - new Date(a));
    return { categoryMap: catMap, sortedDates: dates };
  }, [userData]);

  return (
    <Card
      title="The Logbook"
      description="A record of your past victories. Click any day to see the details."
    >
      <div className="flex flex-col">
        {sortedDates.map((date) => {
          const dailyData = userData.log[date];
          const dailyTotal = Object.values(dailyData).reduce(
            (sum, count) => sum + count,
            0
          );
          if (dailyTotal === 0) return null;
          const isOpen = openEntry === date;

          return (
            <div
              key={date}
              className="border-b border-input-bg last:border-b-0 py-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer group"
                onClick={() => setOpenEntry(isOpen ? null : date)}
              >
                <span className="font-medium group-hover:text-accent transition-colors">
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-secondary-text">{dailyTotal} units</span>
              </div>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-96 mt-4' : 'max-h-0'
                }`}
              >
                <div className="pl-4 border-l-2 border-border-default flex flex-col gap-2">
                  {Object.entries(dailyData).map(([catId, count]) => {
                    const category = categoryMap.get(catId);
                    return category ? (
                      <div
                        key={catId}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span>
                          {category.label}: <strong>{count}</strong> units
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default History;
