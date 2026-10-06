import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMedia } from '../../hooks/useMedia';

interface Props {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
  trackClassName?: string;
  progressClassName?: string;
  stickyClassName?: string; // npr. zgornji odmik zaradi fiksne navigacije
}

// Navpično drsenje poganja vodoravno premikanje (scrollytelling).
// Na ozkih zaslonih se vsebina preprosto razporedi navpično.
const HScroll: React.FC<Props> = ({ children, header, className = '', trackClassName = '', progressClassName = 'bg-[var(--text-main)]', stickyClassName = '' }) => {
  const wide = useMedia('(min-width: 900px)');
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    if (!wide) return;
    const measure = () => {
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [wide, children]);

  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (!wide) {
    return (
      <div className={className}>
        {header}
        <div className={`flex flex-col gap-6 px-6 pb-12 ${trackClassName.includes('stack') ? '' : ''}`}>{children}</div>
      </div>
    );
  }

  return (
    <div ref={outer} className={className} style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className={`sticky top-0 h-screen overflow-hidden flex flex-col justify-center ${stickyClassName}`}>
        {header}
        <motion.div ref={track} style={{ x }} className={`flex items-stretch gap-8 px-[8vw] w-max ${trackClassName}`}>
          {children}
        </motion.div>
        <div className="absolute bottom-8 left-[8vw] right-[8vw] h-[3px] bg-[var(--border-color)]">
          <motion.div style={{ scaleX: bar }} className={`h-full origin-left ${progressClassName}`} />
        </div>
      </div>
    </div>
  );
};

export default HScroll;
