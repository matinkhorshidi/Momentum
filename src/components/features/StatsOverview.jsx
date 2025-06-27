import React, { useRef, useMemo } from 'react';
import { Download, Upload, Flame } from 'lucide-react';
import { useUser } from '../../context/UserProvider';
import { calculateOverallStreak } from '../../utils/helpers';
import Card from '../ui/Card';
import AnimatedNumber from '../ui/AnimatedNumber';

const StatsOverview = () => {
  const { userData } = useUser();
  const importInputRef = useRef(null);

  const { totalsMap, grandTotal, streak } = useMemo(() => {
    const totals = {};
    let total = 0;
    if (userData?.log) {
      for (const dailyData of Object.values(userData.log)) {
        for (const [catId, count] of Object.entries(dailyData)) {
          totals[catId] = (totals[catId] || 0) + count;
          total += count;
        }
      }
    }
    const currentStreak = calculateOverallStreak(userData?.log);
    return { totalsMap: totals, grandTotal: total, streak: currentStreak };
  }, [userData?.log]);

  const handleExport = () => {
    /* ... */
  };
  const handleImport = (event) => {
    /* ... */
  };

  return (
    <Card title="Your Grand Tally" className="text-center">
      <div className="pb-6 mb-6 border-b border-border-default">
        <div className="text-6xl font-bold leading-none text-accent">
          <AnimatedNumber value={grandTotal} />
        </div>
        <p className="text-sm text-secondary-text mt-1">
          Total units of awesomeness
        </p>

        {streak > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 font-bold px-3 py-1 rounded-full text-sm">
            <Flame size={14} />
            <span>
              <AnimatedNumber value={streak} /> Day Streak
            </span>
          </div>
        )}
      </div>

      {/* --- NEW: Redesigned Minimalist List Layout --- */}
      <div className="space-y-3 text-left mb-8">
        {(userData?.settings?.categories || []).map((cat) => (
          <div
            key={cat.id}
            className="flex justify-between items-center text-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              ></div>
              <span className="text-primary-text">{cat.label}</span>
            </div>
            <span className="font-bold text-lg text-primary-text">
              <AnimatedNumber value={totalsMap[cat.id] || 0} />
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-8 border-t border-input-bg pt-6">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 text-sm border border-input-border text-secondary-text rounded-md hover:bg-input-bg hover:text-white transition-colors"
        >
          <Download size={14} /> Export
        </button>
        <button
          onClick={() => importInputRef.current.click()}
          className="flex items-center gap-2 px-5 py-2.5 text-sm border border-input-border text-secondary-text rounded-md hover:bg-input-bg hover:text-white transition-colors"
        >
          <Upload size={14} /> Import
        </button>
        <input
          type="file"
          ref={importInputRef}
          onChange={handleImport}
          accept=".json"
          className="hidden"
        />
      </div>
    </Card>
  );
};

export default StatsOverview;
