import type { SVGProps } from 'react';

export type IconName =
  | 'spider'
  | 'search'
  | 'calendar'
  | 'clock'
  | 'pin'
  | 'arrowRight'
  | 'arrowLeft'
  | 'chevronDown'
  | 'close'
  | 'menu'
  | 'sun'
  | 'moon'
  | 'check'
  | 'download'
  | 'trash'
  | 'eye'
  | 'users'
  | 'award'
  | 'chat'
  | 'send'
  | 'alert'
  | 'info'
  | 'refresh'
  | 'sparkle'
  | 'shield'
  | 'chevronLeft'
  | 'chevronRight'
  | 'play'
  | 'volume'
  | 'bolt'
  | 'share';

const PATHS: Record<IconName, React.ReactNode> = {
  spider: (
    <>
      <circle cx="12" cy="15" r="4.1" fill="currentColor" />
      <circle cx="12" cy="11" r="2.2" fill="currentColor" />
      {[
        'M8 10.5 L3.5 6.5',
        'M9.6 9.4 L6 3.8',
        'M12 9.2 L12 3.2',
        'M14.4 9.4 L18 3.8',
        'M16 10.5 L20.5 6.5',
        'M8.6 12 L2.8 13.6',
        'M15.4 12 L21.2 13.6',
        'M8.8 14.6 L3.4 18.4',
        'M15.2 14.6 L20.6 18.4',
      ].map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      ))}
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.9" />
      <path d="M16 16l4.2 4.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.5-5.4 6.5-10.5a6.5 6.5 0 10-13 0C5.5 15.6 12 21 12 21z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
  arrowRight: <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  arrowLeft: <path d="M20 12H5m6 6-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  chevronDown: <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  chevronLeft: <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  chevronRight: <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  close: <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  moon: (
    <path d="M20 14.2A8.5 8.5 0 019.8 4a8.5 8.5 0 1010.2 10.2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" opacity="0.5" />
      <path d="M8 12.2l2.6 2.6L16.4 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v11m0 0l-4-4m4 4l4-4M4.5 17v2a2 2 0 002 2h11a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V5a1.5 1.5 0 011.5-1.5h2A1.5 1.5 0 0114.5 5v2M6.5 7l.8 12a2 2 0 002 1.9h5.4a2 2 0 002-1.9l.8-12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 19.5a5.5 5.5 0 0111 0M15.5 5.6a3.2 3.2 0 010 5.9M16.8 14.6a5.5 5.5 0 013.7 4.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.8 13.4L7 21l5-2.6L17 21l-1.8-7.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6.2l.9 1.8 2 .3-1.45 1.4.34 2-1.79-.94-1.79.94.34-2L9.1 8.3l2-.3z" fill="currentColor" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5.5A2.5 2.5 0 016.5 3h11A2.5 2.5 0 0120 5.5V13a2.5 2.5 0 01-2.5 2.5H10l-4.5 3.2v-3.2A2.5 2.5 0 014 13z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 8.5h8M8 11.5h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  send: <path d="M3.5 11.5L20 4l-7.5 16.5-2.5-7z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />,
  alert: (
    <>
      <path d="M12 4L2.5 20h19z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9.5v4.5M12 17.4v.1" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8.2v.1M12 11.5V16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 11-2.3-5.6M20 4v4.5h-4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  sparkle: (
    <path d="M12 3l1.6 4.8L18.5 9.5l-4.9 1.7L12 16l-1.6-4.8L5.5 9.5l4.9-1.7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  ),
  shield: (
    <path d="M12 3l7 2.6v5c0 4.6-3 8.2-7 9.9-4-1.7-7-5.3-7-9.9v-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  ),
  play: (
    <path d="M7 4.5v15l13-7.5-13-7.5z" fill="currentColor" />
  ),
  volume: (
    <>
      <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M15.5 8.5a5 5 0 010 7M19 6a9 9 0 010 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  bolt: (
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 13.5l7 4M15.5 6.5l-7 4" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}