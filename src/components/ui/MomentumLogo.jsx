import React from 'react';
import { motion } from 'framer-motion';

const MomentumLogo = ({
  className = '',
  size = 40,
  isAnimated = false,
  onAnimationComplete,
}) => {
  const svgVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
    bounce: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
        delay: 1.8,
      },
    },
  };
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: 'easeInOut',
      },
    },
  };
  // Renamed to shapeVariants for clarity, but works the same for rects
  const shapeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15,
      },
    },
  };
  const animationSequence = isAnimated ? ['visible', 'bounce'] : 'visible';

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      variants={svgVariants}
      initial={isAnimated ? 'hidden' : 'visible'}
      animate={animationSequence}
      aria-labelledby="momentum-logo-title"
      style={{ transformOrigin: '50% 50%' }}
      onAnimationComplete={onAnimationComplete}
    >
      <title id="momentum-logo-title">Momentum Logo</title>

      {/* Replaced circles with rects */}
      <motion.rect
        x="7" // cx(15) - r(8)
        y="67" // cy(75) - r(8)
        width="16"
        height="16"
        rx="4" // Corner radius
        fill="currentColor"
        variants={shapeVariants}
      />
      <motion.rect
        x="22" // cx(30) - r(8)
        y="17" // cy(25) - r(8)
        width="16"
        height="16"
        rx="4"
        fill="currentColor"
        variants={shapeVariants}
      />
      <motion.rect
        x="42" // cx(50) - r(8)
        y="42" // cy(50) - r(8)
        width="16"
        height="16"
        rx="4"
        fill="currentColor"
        variants={shapeVariants}
      />
      <motion.rect
        x="62" // cx(70) - r(8)
        y="17" // cy(25) - r(8)
        width="16"
        height="16"
        rx="4"
        fill="currentColor"
        variants={shapeVariants}
      />
      <motion.rect
        x="77" // cx(85) - r(8)
        y="67" // cy(75) - r(8)
        width="16"
        height="16"
        rx="4"
        fill="currentColor"
        variants={shapeVariants}
      />

      {/* Paths remain the same, connecting the center points */}
      <motion.path
        d="M 15 75 L 30 25"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        variants={pathVariants}
      />
      <motion.path
        d="M 30 25 L 50 50"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        variants={pathVariants}
      />
      <motion.path
        d="M 50 50 L 70 25"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        variants={pathVariants}
      />
      <motion.path
        d="M 70 25 L 85 75"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        variants={pathVariants}
      />
    </motion.svg>
  );
};

export default MomentumLogo;
