import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, CalendarPlus } from 'lucide-react';
import { useUser } from '../../context/UserProvider';
import { getTodaysRoutines } from '../../utils/routineManager';
import Card from '../ui/Card';
import Confetti from 'react-confetti';

const TodaysRoutinesCard = ({ categoryManagerRef, celebrationTrigger }) => {
  const { userData } = useUser();
  const [isCelebrating, setIsCelebrating] = useState(false);

  // This useEffect listens for the trigger from the Dashboard
  useEffect(() => {
    if (celebrationTrigger) {
      setIsCelebrating(true);
      // Prevent horizontal scrollbar during the animation
      document.body.style.overflowX = 'hidden';

      const timer = setTimeout(() => {
        setIsCelebrating(false);
        // Restore scrollbar
        document.body.style.overflowX = 'auto';
      }, 4000);

      // Cleanup function
      return () => {
        clearTimeout(timer);
        document.body.style.overflowX = 'auto';
      };
    }
  }, [celebrationTrigger]);

  const todaysRoutines = useMemo(() => {
    return getTodaysRoutines(userData?.settings?.categories, userData?.log);
  }, [userData]);

  const handleCreateRoutineClick = () => {
    /* ... (this function remains the same) ... */
  };

  return (
    // The ref is removed from here as we'll make confetti full-screen
    <Card
      title="Today's Routines"
      description="Your daily checklist for success. Complete these pre-set habits to build powerful, consistent momentum."
      className="relative"
    >
      {/* The Confetti component is now configured for a full-screen effect */}
      {isCelebrating && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 100 }}
          numberOfPieces={400}
          recycle={false}
          gravity={0.1}
        />
      )}

      {todaysRoutines.length === 0 ? (
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
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {todaysRoutines.map((routine) => (
              <motion.div
                key={routine.id}
                layout
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
