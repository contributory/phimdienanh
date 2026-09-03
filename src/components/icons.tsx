interface IconProps {
  className?: string;
}

const base = (className?: string) => ({
  className: className ?? "h-5 w-5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const IcPlay = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M7 4.8v14.4a.6.6 0 0 0 .92.5l11.2-7.2a.6.6 0 0 0 0-1L7.92 4.3a.6.6 0 0 0-.92.5Z" fill="currentColor" stroke="none" />
  </svg>
);

export const IcPause = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
    <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IcSearch = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.4-4.4" />
  </svg>
);

export const IcChevronL = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
  </svg>
);

export const IcChevronR = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
  </svg>
);

export const IcChevronD = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m5.5 9.5 6.5 6.5 6.5-6.5" />
  </svg>
);

export const IcArrowR = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4 12h15" />
    <path d="m13.5 6 6 6-6 6" />
  </svg>
);

export const IcFilm = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="3.5" y="4" width="17" height="16" rx="2" />
    <path d="M7.5 4v16M16.5 4v16M3.5 9h4M3.5 15h4M16.5 9h4M16.5 15h4" />
  </svg>
);

export const IcTv = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="3" y="7" width="18" height="12" rx="2" />
    <path d="m9 3 3 3.5L15 3" />
    <path d="M9.5 12.2 14 15l-4.5 2.8v-5.6Z" fill="currentColor" stroke="none" />
  </svg>
);

export const IcStar = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path
      d="m12 3.6 2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L12 16.2 6.9 19l1.1-5.6-4.2-3.9 5.7-.7L12 3.6Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

export const IcClock = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IcCalendar = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
);

export const IcGlobe = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.6 2.3 4 5.2 4 8.5s-1.4 6.2-4 8.5c-2.6-2.3-4-5.2-4-8.5s1.4-6.2 4-8.5Z" />
  </svg>
);

export const IcTag = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m12.6 3.5 7.9 7.9a1.5 1.5 0 0 1 0 2.1l-7 7a1.5 1.5 0 0 1-2.1 0l-7.9-7.9V4.5a1 1 0 0 1 1-1h8.1Z" />
    <circle cx="8.3" cy="8.3" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const IcUsers = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3.5 19.5c.6-3.1 2.8-4.8 5.5-4.8s4.9 1.7 5.5 4.8" />
    <path d="M15.5 5.8a3.2 3.2 0 1 1 1.3 6.1M17.6 14.9c1.7.6 2.7 2 3 4" />
  </svg>
);

export const IcX = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IcExternal = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M10 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4" />
    <path d="M14 4h6v6M20 4l-9 9" />
  </svg>
);

export const IcHistory = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4 6v4h4" />
    <path d="M4.3 10A8.5 8.5 0 1 1 3.5 12" />
    <path d="M12 8v4.2l3 1.8" />
  </svg>
);

export const IcRetry = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M20 12a8 8 0 1 1-2.3-5.6" />
    <path d="M20 3.5V8h-4.5" />
  </svg>
);

export const IcAlert = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 4 2.8 19.5a.6.6 0 0 0 .5.9h17.4a.6.6 0 0 0 .5-.9L12 4Z" />
    <path d="M12 10v4.5M12 17.4v.2" />
  </svg>
);

export const IcClapper = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="3" y="9.5" width="18" height="10.5" rx="2" />
    <path d="m3.6 9.3 1.7-4.6a1 1 0 0 1 1.3-.6l13.6 3.4a1 1 0 0 1 .7 1.3l-.4 1.5" />
    <path d="m8.3 4.9 1.6 3.6M12.6 6l1.6 3.5" />
    <path d="M10.5 12.8 14.7 15l-4.2 2.2v-4.4Z" fill="currentColor" stroke="none" />
  </svg>
);

export const IcHome = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m4 11 8-7 8 7" />
    <path d="M6 9.5V20h4.5v-5h3v5H18V9.5" />
  </svg>
);

export const IcMonitor = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="3" y="4.5" width="18" height="12" rx="2" />
    <path d="M9 20h6M12 16.5V20" />
  </svg>
);

export const IcSignal = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M5 18.5v-3M9.5 18.5v-6M14 18.5V8.5M18.5 18.5v-13" />
  </svg>
);

export const IcInfo = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 7.6v.2" />
  </svg>
);

export const IcTrash = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4.5 6.5h15M9.5 6V4.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V6M6.5 6.5l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12" />
    <path d="M10 10.5v6M14 10.5v6" />
  </svg>
);
