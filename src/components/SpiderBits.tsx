import { useId } from 'react';

interface WebCornerProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SPOKE_ANGLES = [0, 12, 24, 36, 48, 60, 72, 84];

export function WebCorner({
  size = 150,
  color = 'currentColor',
  strokeWidth = 1.4,
  opacity = 0.5,
  className,
  style,
}: WebCornerProps) {
  const arcRadii = [size * 0.28, size * 0.52, size * 0.76, size];
  const spokes = SPOKE_ANGLES.map((deg) => {
    const rad = (deg * Math.PI) / 180;
    const r = size;
    const x = Math.cos(rad) * r;
    const y = Math.sin(rad) * r;
    return `M 0 0 L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  const arcs = arcRadii
    .map((r) => {
      const b = 0.5523 * r;
      const x = r.toFixed(1);
      const y = r.toFixed(1);
      const cb = b.toFixed(1);
      return `M 0 ${y} C ${cb} ${y}, ${x} ${cb}, ${x} 0`;
    })
    .join(' ');

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <g stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity={opacity}>
        <path d={arcs} />
        <path d={spokes} opacity={0.8} />
        <path d={`M 0 ${size * 0.87} A ${size * 0.87} ${size * 0.87} 0 0 1 ${size * 0.87} 0`} opacity={0.55} strokeWidth={strokeWidth * 0.7} />
      </g>
    </svg>
  );
}

export function SpiderEmblem({ size = 40 }: { size?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const legs = [
    '9.5 11l-4-4.6M11.5 10.5L9 4M14 10.5L16.5 4M16.6 11l4-4.6M9 13L3.4 15.6M16 13l6 2.6M9.8 15.2L4.6 19.6M15.2 15.6L20.4 20',
  ].flatMap((d) => d.split('M').filter(Boolean).map((s) => s.trim()));

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className="spider-emblem"
    >
      <defs>
        <linearGradient id={`${uid}-red`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff2d40" />
          <stop offset="100%" stopColor="#e01d2f" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="16.5" fill={`url(#${uid}-red)`} />
      <circle cx="18" cy="18" r="16.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <circle cx="18" cy="18" r="13.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" strokeDasharray="3.5 3.5" />
      <path
        d={legs.map((l) => `M${l}`).join(' ')}
        stroke="rgba(255,255,255,0.92)"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="18" cy="20" r="4.4" fill="#fff" />
      <circle cx="18" cy="18" r="2" fill="#fff" />
      <circle cx="18" cy="17.6" r="0.9" fill="#ff2d40" />
    </svg>
  );
}