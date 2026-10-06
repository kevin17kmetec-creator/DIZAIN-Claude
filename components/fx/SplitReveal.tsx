import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

// Besede se ob vstopu v vidno polje dvignejo iz maske
const SplitReveal: React.FC<Props> = ({ text, className = '', delay = 0, as = 'span' }) => {
  const reduce = useReducedMotion();
  const Tag = as as React.ElementType;
  return (
    <Tag className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

export default SplitReveal;
