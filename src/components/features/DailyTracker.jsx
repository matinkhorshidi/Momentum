import React from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getTodayDateString, getTextColorForBg } from '../../utils/helpers';
import Card from '../ui/Card';

const DailyTracker = () => {
  const { userData, saveData } = useAppContext();

  const addUnit = (catId) => {
    const todayStr = getTodayDateString();
    const newLog = JSON.parse(JSON.stringify(userData.log || {}));
    if (!newLog[todayStr]) newLog[todayStr] = {};
    newLog[todayStr][catId] = (newLog[todayStr][catId] || 0) + 1;
    saveData({ ...userData, log: newLog });
  };

  const removeUnit = (catId) => {
    const todayStr = getTodayDateString();
    const newLog = JSON.parse(JSON.stringify(userData.log));
    if (newLog[todayStr] && newLog[todayStr][catId]) {
      newLog[todayStr][catId]--;
      if (newLog[todayStr][catId] <= 0) delete newLog[todayStr][catId];
      saveData({ ...userData, log: newLog });
    }
  };

  const todayLogEntries = React.useMemo(() => {
    const todayStr = getTodayDateString();
    const entries = [];
    if (userData?.log && userData.log[todayStr]) {
      const categoryMap = new Map(
        (userData.settings?.categories || []).map((cat) => [cat.id, cat])
      );
      Object.entries(userData.log[todayStr]).forEach(([catId, count]) => {
        const categoryInfo = categoryMap.get(catId);
        if (categoryInfo) {
          for (let i = 0; i < count; i++) {
            entries.push({ key: `${catId}-${i}`, ...categoryInfo });
          }
        }
      });
    }
    return entries;
  }, [userData?.log, userData?.settings?.categories]);

  return (
    <Card
      title="Alright, what's the mission for today?"
      description="Add a block of pure, uninterrupted focus."
    >
      <div className="flex flex-wrap gap-3 mb-6">
        {(userData?.settings?.categories || []).map((cat) => (
          <button
            key={cat.id}
            onClick={() => addUnit(cat.id)}
            style={{
              backgroundColor: cat.color,
              color: getTextColorForBg(cat.color),
            }}
            className="border-none px-5 py-3 rounded-md text-sm font-medium cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-sm"
          >
            + {cat.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 min-h-[40px] mt-6">
        {todayLogEntries.map((entry) => (
          <div
            key={entry.key}
            onClick={() => removeUnit(entry.id)}
            title={`Click to remove one unit of "${entry.label}"`}
            style={{ backgroundColor: entry.color }}
            className="group relative w-[38px] h-[38px] rounded-md cursor-pointer transition-transform hover:scale-110 inline-flex justify-center items-center font-bold shadow-lg animate-pop-in"
          >
            <span
              className="text-lg transition-opacity group-hover:opacity-0"
              style={{ color: getTextColorForBg(entry.color) }}
            >
              {entry.label.charAt(0).toUpperCase()}
            </span>
            <X
              size={28}
              className="absolute text-error opacity-0 transition-opacity group-hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DailyTracker;
