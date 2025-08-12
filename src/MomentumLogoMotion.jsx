import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// نقاط مستطیل‌ها
const rects = [
  { x: 7, y: 67 }, // پایین چپ
  { x: 22, y: 17 }, // بالا چپ
  { x: 42, y: 42 }, // وسط
  { x: 62, y: 17 }, // بالا راست
  { x: 77, y: 67 }, // پایین راست
];
// مسیر یکپارچه که همه مستطیل‌ها را به هم وصل می‌کند:
const megaPath = 'M 15 75 L 30 25 L 50 50 L 70 25 L 85 75';

const rectDuration = 0.28;
const pathDuration = 1.5; // مدت کشیده شدن مسیر، نرم و طولانی
const pauseDuration = 0.8;
const fadeOutDuration = 0.4;

export default function MomentumLogo({ size = 120, onAnimationEnd }) {
  const [iteration, setIteration] = useState(0);

  // واریانت کلی svg
  const svgVariants = {
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: rectDuration,
      },
    },
  };

  // مستطیل‌ها به ترتیب و ساده
  const rectVariants = {
    hidden: { scale: 1, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * rectDuration,
        duration: rectDuration,
        ease: 'easeOut',
      },
    }),
  };

  // فقط یک path، نرم و پیوسته
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        // Opacity بدون ترنزیشن، بلافاصله جهش کند:
        opacity: { delay: rects.length * rectDuration, duration: 0 }, // هیچ انیمیشن، فقط یک لحظه تغییر کند!
        // pathLength با ترنزیشن و تاخیر:
        pathLength: {
          delay: rects.length * rectDuration,
          duration: pathDuration,
          ease: 'easeInOut',
        },
      },
    },
  };

  // Fade out برای کل svg بعد از پایان مسیر
  useEffect(() => {
    const total =
      rects.length * rectDuration +
      pathDuration +
      pauseDuration +
      fadeOutDuration;
    const timeout = setTimeout(() => {
      setIteration((v) => v + 1);
      onAnimationEnd();
    }, total * 1100);
    return () => clearTimeout(timeout);
  }, [iteration, onAnimationEnd]);

  // Fade out svg
  useEffect(() => {
    const total = rects.length * rectDuration + pathDuration + pauseDuration;
    const svg = document.getElementById('mom-logo-svg');
    if (svg) {
      svg.style.opacity = 1;
      setTimeout(() => {
        svg.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: fadeOutDuration * 1000,
          fill: 'forwards',
        });
      }, total * 1000);
    }
  }, [iteration]);

  return (
    <div
      style={{
        background: '#000',
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      key={iteration}
    >
      <motion.svg
        id="mom-logo-svg"
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{
          color: '#bb86fc',
          display: 'block',
        }}
        variants={svgVariants}
        initial="visible"
        animate="visible"
      >
        {/* مستطیل‌ها */}
        {rects.map((r, i) => (
          <motion.rect
            key={i}
            x={r.x}
            y={r.y}
            width="16"
            height="16"
            rx="4"
            fill="currentColor"
            custom={i}
            variants={rectVariants}
            initial="hidden"
            animate="visible"
          />
        ))}
        {/* مسیر پیوسته */}
        <motion.path
          d={megaPath}
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
      </motion.svg>
    </div>
  );
}
