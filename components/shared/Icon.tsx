import type { SVGProps } from 'react';

export type IconName =
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-up-right'
  | 'close'
  | 'heart'
  | 'music'
  | 'music-muted'
  | 'pause'
  | 'play';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  name: IconName;
}

export function Icon({ name, className = '', ...props }: IconProps) {
  const shared = {
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  };

  return (
    <svg
      aria-hidden="true"
      className={`icon${className ? ` ${className}` : ''}`}
      fill="none"
      focusable="false"
      viewBox="0 0 24 24"
      {...props}
    >
      {name === 'arrow-down' && <path d="M12 4v16m-6-6 6 6 6-6" {...shared} />}
      {name === 'arrow-left' && <path d="M20 12H4m6-6-6 6 6 6" {...shared} />}
      {name === 'arrow-up-right' && <path d="M7 17 17 7M8 7h9v9" {...shared} />}
      {name === 'close' && <path d="m6 6 12 12M18 6 6 18" {...shared} />}
      {name === 'heart' && (
        <path
          d="M12 20.2 4.2 12.8C-.3 8.4 2.8 3.4 7.1 4.1A6.1 6.1 0 0 1 12 7.5a6.1 6.1 0 0 1 4.9-3.4c4.3-.7 7.4 4.3 2.9 8.7L12 20.2Z"
          fill="currentColor"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
      )}
      {name === 'music' && (
        <g {...shared}>
          <path d="M9 18V6l10-2v12" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
        </g>
      )}
      {name === 'music-muted' && (
        <g {...shared}>
          <path d="M9 18V6l10-2v12" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
          <path d="M4 4 20 20" strokeWidth="2.2" />
        </g>
      )}
      {name === 'pause' && (
        <g fill="currentColor">
          <rect x="7" y="5" width="3.5" height="14" rx="1" />
          <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
        </g>
      )}
      {name === 'play' && <path d="m8 5 11 7-11 7Z" fill="currentColor" />}
    </svg>
  );
}
