import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/helpers';
import Card from '../ui/Card';

const History = () => {
  const { userData } = useAppContext();
  const [openEntry, setOpenEntry] = useState(null);

  // The 'categoryMap' variable is created here, after useMemo completes.
  const { categoryMap, sortedDates } = React.useMemo(() => {
    // Inside this function, we create and use a temporary variable `catMap`.
    const catMap = new Map(
      (userData?.settings?.categories || []).map((cat) => [cat.id, cat])
    );

    const dates = Object.keys(userData?.log || {})
      .filter((date) => date !== getTodayDateString())
      .sort((a, b) => new Date(b) - new Date(a));

    // The object returned here assigns the value of `catMap` to the `categoryMap` key.
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

          const dailyVisuals = [];
          Object.entries(dailyData).forEach(([catId, count]) => {
            // Here, outside the useMemo, we correctly use `categoryMap`.
            const category = categoryMap.get(catId);
            if (category) {
              for (let i = 0; i < count; i++) {
                dailyVisuals.push(category);
              }
            }
          });

          return (
            <div
              key={date}
              className="border-b border-input-bg last:border-b-0 py-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer group"
                onClick={() => setOpenEntry(isOpen ? null : date)}
              >
                <span className="font-medium group-hover:text-accent transition-colors text-sm">
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>

                <div
                  className="flex justify-end items-center gap-1.5"
                  title={`${dailyTotal} units`}
                >
                  {dailyVisuals.slice(0, 10).map((vis, index) => (
                    <div
                      key={index}
                      className="w-3.5 h-3.5 rounded-sm"
                      style={{ backgroundColor: vis.color }}
                      title={vis.label}
                    />
                  ))}
                  {dailyVisuals.length > 10 && (
                    <span className="text-xs text-secondary-text ml-1">
                      +{dailyVisuals.length - 10} more
                    </span>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default History;
