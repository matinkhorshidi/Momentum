import React from 'react';
import { motion } from 'framer-motion';

// Add a `size` prop with a default value of 40
const MomentumLogo = ({ className = '', size = 40 }) => {
  const svgVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };
  const circleVariants = {
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

  return (
    <motion.svg
      // Use the size prop for width and height
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      variants={svgVariants}
      initial="hidden"
      animate="visible"
      aria-labelledby="momentum-logo-title"
    >
      <title id="momentum-logo-title">Momentum Logo</title>
      <motion.circle
        cx="15"
        cy="85"
        r="8"
        fill="currentColor"
        variants={circleVariants}
      />
      <motion.circle
        cx="30"
        cy="15"
        r="8"
        fill="currentColor"
        variants={circleVariants}
      />
      <motion.circle
        cx="50"
        cy="45"
        r="8"
        fill="currentColor"
        variants={circleVariants}
      />
      <motion.circle
        cx="70"
        cy="15"
        r="8"
        fill="currentColor"
        variants={circleVariants}
      />
      <motion.circle
        cx="85"
        cy="85"
        r="8"
        fill="currentColor"
        variants={circleVariants}
      />
      <motion.path
        d="M 15 85 L 30 15"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        variants={pathVariants}
      />
      <motion.path
        d="M 30 15 L 50 45"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        variants={pathVariants}
      />
      <motion.path
        d="M 50 45 L 70 15"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        variants={pathVariants}
      />
      <motion.path
        d="M 70 15 L 85 85"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        variants={pathVariants}
      />
    </motion.svg>
  );
};

export default MomentumLogo;
