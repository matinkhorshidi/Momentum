import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, CalendarPlus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getTodaysRoutines } from '../../utils/routineManager';
import Card from '../ui/Card';

// Receive the ref as a prop
const TodaysRoutinesCard = ({ categoryManagerRef }) => {
  const { userData } = useAppContext();

  const todaysRoutines = useMemo(() => {
    return getTodaysRoutines(userData?.settings?.categories, userData?.log);
  }, [userData]);

  // The click handler for our new CTA button
  const handleCreateRoutineClick = () => {
    if (categoryManagerRef.current) {
      // Smoothly scroll to the "Your Focus Areas" section
      categoryManagerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // Bonus: Add a temporary highlight effect for better feedback
      categoryManagerRef.current.classList.add(
        'ring-2',
        'ring-accent',
        'transition-all',
        'duration-300',
        'rounded-xl'
      );
      setTimeout(() => {
        categoryManagerRef.current?.classList.remove('ring-2', 'ring-accent');
      }, 1500);
    }
  };

  return (
    <Card title="Today's Routines">
      {/* Conditionally render either the list or the new empty state */}
      {todaysRoutines.length === 0 ? (
        // --- NEW: Empty State UI ---
        <div className="text-center py-8 px-4">
          <div className="flex justify-center mb-4">
            <CalendarPlus size={40} className="text-secondary-text" />
          </div>
          <h3 className="font-bold text-primary-text mb-1">
            Build Lasting Habits
          </h3>
          <p className="text-sm text-secondary-text mb-6">
            Create daily or weekly routines to stay on track with your goals.
          </p>
          <button
            onClick={handleCreateRoutineClick}
            className="w-full bg-accent text-bg-color font-medium py-2 rounded-lg text-sm transition-colors hover:bg-button-hover"
          >
            Create a Routine
          </button>
        </div>
      ) : (
        // --- Existing UI for displaying routines ---
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
                    className="w-2 h-2 rounded-full"
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
                    <div title={`${routine.streak} Day Streak`}>
                      <span
                        className={`flex items-center gap-1 font-bold ${
                          routine.status === 'completed'
                            ? 'text-green-400'
                            : 'text-amber-400'
                        }`}
                      >
                        <Flame size={12} fill="currentColor" /> {routine.streak}
                      </span>
                    </div>
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
      )}
    </Card>
  );
};

export default TodaysRoutinesCard;
