import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

// Kazalec se prilagodi izbrani temi. Samo za naprave z miško.
const CustomCursor: React.FC = () => {
  const { theme } = useTheme();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      setIsHovering(!!target?.closest?.('a, button, input, textarea, select, [role="button"], .cursor-pointer'));
    };
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  const pixel = theme === 'arcade' || theme === 'terminal';
  const color = theme === 'minimal' ? '#ffffff' : theme === 'editorial' ? '#ffffff' : 'var(--accent-color)';
  const blend = theme === 'minimal' || theme === 'editorial' ? 'mix-blend-difference' : '';

  return (
    <>
      <motion.div
        className={`keep-round fixed top-0 left-0 pointer-events-none z-[100] ${blend} ${pixel ? 'w-3 h-3' : 'w-4 h-4 rounded-full'}`}
        style={{ translateX: cursorX, translateY: cursorY, x: pixel ? -6 : -8, y: pixel ? -6 : -8, background: color, borderRadius: pixel ? 0 : '9999px' }}
        animate={{ scale: isHovering ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className={`keep-round fixed top-0 left-0 w-12 h-12 border pointer-events-none z-[99] ${blend}`}
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          x: -24,
          y: -24,
          borderColor: color,
          borderRadius: pixel ? 0 : '9999px',
          boxShadow: pixel ? `0 0 12px var(--glow)` : undefined,
        }}
        animate={{ scale: isHovering ? 1.8 : 1, opacity: isHovering ? 0.5 : 1, rotate: theme === 'arcade' && isHovering ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
};

export default CustomCursor;
