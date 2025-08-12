import React from 'react';
import { motion } from 'framer-motion';

const MomentumLogo = ({
  className = '',
  size = 40,
  isAnimated = false,
  onAnimationEnd,
}) => {
  const svgVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    bounce: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
        delay: 1.8,
      },
    },
  };

  const pathVariants = {
    hidden: { pathLength: 0, strokeDashoffset: 100 },
    visible: {
      pathLength: 1,
      strokeDashoffset: 0,
      transition: {
        duration: 1.5,
        ease: 'easeInOut',
      },
    },
  };

  const shapeVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 20,
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
      onAnimationComplete={onAnimationEnd}
    >
      <title id="momentum-logo-title">Momentum Logo</title>

      {/* انیمیشن مستطیل‌ها */}
      <motion.rect
        x="7"
        y="67"
        width="16"
        height="16"
        rx="4"
        fill="currentColor"
        variants={shapeVariants}
      />
      <motion.rect
        x="22"
        y="17"
        width="16"
        height="16"
        rx="4"
        fill="currentColor"
        variants={shapeVariants}
      />
      <motion.rect
        x="42"
        y="42"
        width="16"
        height="16"
        rx="4"
        fill="currentColor"
        variants={shapeVariants}
      />
      <motion.rect
        x="62"
        y="17"
        width="16"
        height="16"
        rx="4"
        fill="currentColor"
        variants={shapeVariants}
      />
      <motion.rect
        x="77"
        y="67"
        width="16"
        height="16"
        rx="4"
        fill="currentColor"
        variants={shapeVariants}
      />

      {/* مسیر پیوسته */}
      <motion.path
        d="M 15 75 L 30 26 L 50 50 L 70 26 L 85 75"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        fill="transparent"
        variants={pathVariants}
      />
    </motion.svg>
  );
};

export default MomentumLogo;
