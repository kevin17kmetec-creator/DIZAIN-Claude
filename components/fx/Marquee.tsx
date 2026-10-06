import React from 'react';

interface Props {
  children: React.ReactNode;
  speed?: number; // sekunde za en krog
  reverse?: boolean;
  className?: string;
}

// Neskončni trak besedila. Dve kopiji skrbita za brezšiven krog.
const Marquee: React.FC<Props> = ({ children, speed = 30, reverse = false, className = '' }) => {
  const style = { ['--marquee-d' as string]: `${speed}s`, ['--marquee-dir' as string]: reverse ? 'reverse' : 'normal' } as React.CSSProperties;
  return (
    <div className={`marquee flex overflow-hidden select-none ${className}`} style={style}>
      <div className="marquee-group">{children}</div>
      <div className="marquee-group" aria-hidden="true">{children}</div>
    </div>
  );
};

export default Marquee;
