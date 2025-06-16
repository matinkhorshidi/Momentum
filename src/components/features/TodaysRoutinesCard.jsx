import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getTodaysRoutines } from '../../utils/routineManager';
import Card from '../ui/Card';

const TodaysRoutinesCard = () => {
  const { userData } = useAppContext();

  const todaysRoutines = useMemo(() => {
    return getTodaysRoutines(userData?.settings?.categories, userData?.log);
  }, [userData]);

  if (todaysRoutines.length === 0) {
    return null; // Don't show the card if there are no routines for today
  }

  return (
    <Card title="Today's Routines">
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {todaysRoutines.map((routine) => (
            <motion.div
              layout
              key={routine.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                routine.status === 'completed'
                  ? 'bg-green-500/10'
                  : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full`}
                  style={{ backgroundColor: routine.color }}
                ></div>
                <span
                  className={`text-sm ${
                    routine.status === 'completed'
                      ? 'line-through text-secondary-text'
                      : 'text-primary-text'
                  }`}
                >
                  {routine.label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                {routine.streak > 0 && (
                  <span
                    className={`flex items-center gap-1 font-bold ${
                      routine.status === 'completed'
                        ? 'text-green-400'
                        : 'text-amber-400'
                    }`}
                  >
                    <Star size={12} fill="currentColor" /> {routine.streak}
                  </span>
                )}
                <motion.div
                  layout
                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    routine.status === 'completed'
                      ? 'bg-green-400 border-green-400'
                      : 'border-secondary-text'
                  }`}
                >
                  {routine.status === 'completed' && (
                    <Check size={12} className="text-black" />
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default TodaysRoutinesCard;
