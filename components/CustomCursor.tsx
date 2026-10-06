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

  // Brutalist ima polni kvadrat, arcade piksel z neonskim obročem, ostali klasično piko z obročem
  if (theme === 'brutal') {
    return (
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] border-2 border-black"
        style={{ translateX: cursorX, translateY: cursorY, x: -14, y: -14, width: 28, height: 28, background: '#ffe500', borderRadius: 0 }}
        animate={{ scale: isHovering ? 1.9 : 1, rotate: isHovering ? 45 : 0 }}
        transition={{ duration: 0.15 }}
      />
    );
  }

  const pixel = theme === 'arcade';
  const color = theme === 'arcade' ? 'var(--accent-color)' : '#ffffff';
  const blend = theme === 'arcade' ? '' : 'mix-blend-difference';

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[100] ${blend}`}
        style={{ translateX: cursorX, translateY: cursorY, x: pixel ? -6 : -8, y: pixel ? -6 : -8, width: pixel ? 12 : 16, height: pixel ? 12 : 16, background: color, borderRadius: pixel ? 0 : 9999 }}
        animate={{ scale: isHovering ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className={`fixed top-0 left-0 border pointer-events-none z-[99] ${blend}`}
        style={{
          translateX: cursorXSpring, translateY: cursorYSpring, x: -24, y: -24, width: 48, height: 48, borderColor: color,
          borderRadius: pixel ? 0 : 9999, boxShadow: pixel ? '0 0 12px var(--glow)' : undefined,
        }}
        animate={{ scale: isHovering ? 1.8 : 1, opacity: isHovering ? 0.5 : 1, rotate: pixel && isHovering ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
};

export default CustomCursor;
