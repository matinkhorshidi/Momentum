import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedNumber = ({ value }) => {
  // --- THE FIX: Initialize the spring at 0 ---
  // This ensures it always starts from 0 and animates to the target `value`.
  const springValue = useSpring(0, {
    mass: 0.8,
    stiffness: 100,
    damping: 15,
  });

  const roundedValue = useTransform(springValue, (latest) => {
    return Math.round(latest);
  });

  useEffect(() => {
    // This effect now correctly tells the spring (starting at 0)
    // to animate to the new `value` when the component loads or the value changes.
    springValue.set(value);
  }, [springValue, value]);

  return <motion.span>{roundedValue}</motion.span>;
};

export default AnimatedNumber;
