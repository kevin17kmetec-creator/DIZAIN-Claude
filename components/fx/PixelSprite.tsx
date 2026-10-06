import React from 'react';

// Piksel umetnost: vsak znak v mreži je en kvadratek. "." je prazno.
export const SPRITES = {
  invader: ['..x.....x..', '...x...x...', '..xxxxxxx..', '.xx.xxx.xx.', 'xxxxxxxxxxx', 'x.xxxxxxx.x', 'x.x.....x.x', '...xx.xx...'],
  heart: ['.xx.xx.', 'xxxxxxx', 'xxxxxxx', '.xxxxx.', '..xxx..', '...x...'],
  hero: ['..xxxx..', '.xxxxxx.', '.x.xx.x.', '.xxxxxx.', '..x..x..', '.xx..xx.', 'xx....xx'],
  coin: ['..xxxx..', '.xxooxx.', 'xxxooxxx', 'xxxooxxx', 'xxxooxxx', '.xxooxx.', '..xxxx..'],
  star: ['...x...', '...x...', '..xxx..', 'xxxxxxx', '.xxxxx.', '.xx.xx.', 'xx...xx'],
  ghost: ['..xxxx..', '.xxxxxx.', 'xxoxxoxx', 'xxxxxxxx', 'xxxxxxxx', 'xxxxxxxx', 'x.xx.xx.'],
  trophy: ['xxxxxxxxx', 'xooxxxoox', 'xooxxxoox', '.xxxxxxx.', '..xxxxx..', '...xxx...', '...xxx...', '..xxxxx..'],
} as const;

interface Props {
  sprite: keyof typeof SPRITES;
  size?: number; // velikost enega piksla
  color?: string;
  accent?: string;
  className?: string;
  title?: string;
}

const PixelSprite: React.FC<Props> = ({ sprite, size = 4, color = 'currentColor', accent = '#fff', className, title }) => {
  const rows = SPRITES[sprite];
  const w = rows[0].length;
  return (
    <svg
      width={w * size}
      height={rows.length * size}
      viewBox={`0 0 ${w} ${rows.length}`}
      shapeRendering="crispEdges"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {rows.flatMap((row, y) =>
        row.split('').map((ch, x) =>
          ch === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={ch === 'o' ? accent : color} />
        )
      )}
    </svg>
  );
};

export default PixelSprite;
