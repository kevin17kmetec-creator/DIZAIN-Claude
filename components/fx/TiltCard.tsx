import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

// 3D nagib kartice glede na kazalec
const TiltCard: React.FC<{ children: React.ReactNode; max?: number; className?: string }> = ({ children, max = 8, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useSpring(useMotionValue(0.5), { stiffness: 200, damping: 20 });
  const py = useSpring(useMotionValue(0.5), { stiffness: 200, damping: 20 });
  const rotateY = useTransform(px, [0, 1], [-max, max]);
  const rotateX = useTransform(py, [0, 1], [max, -max]);

  const move = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = ref.current!.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const leave = () => { px.set(0.5); py.set(0.5); };

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        {children}
      </motion.div>
    </div>
  );
};

export default TiltCard;
