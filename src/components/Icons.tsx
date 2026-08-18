interface IconProps {
  className?: string;
  strokeWidth?: number;
}

const base = (className?: string) => className ?? "w-5 h-5";

/* ---------- Logo ---------- */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className ?? "w-9 h-9"}>
      <rect x="1.5" y="1.5" width="37" height="37" rx="10" fill="#F4471F" />
      <rect x="9" y="10" width="7" height="20" rx="3.5" fill="#F5F2EB" />
      <rect x="19.5" y="10" width="7" height="13" rx="3.5" fill="#FFC24B" />
      <rect x="29" y="10" width="3.5" height="8" rx="1.75" fill="#F5F2EB" opacity="0.85" />
    </svg>
  );
}

/* ---------- Feature / UI icons ---------- */
export function IconKanban({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <rect x="3" y="4" width="5.2" height="16" rx="1.6" />
      <rect x="9.4" y="4" width="5.2" height="11" rx="1.6" />
      <rect x="15.8" y="4" width="5.2" height="7" rx="1.6" />
    </svg>
  );
}

export function IconGantt({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M4 6h9M7 12h13M10 18h8" />
      <circle cx="15" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="6" cy="18" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconBolt({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round">
      <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
    </svg>
  );
}

export function IconChart({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16" />
      <path d="M6 16v-5M11 16V7M16 16v-8M21 16V4" />
    </svg>
  );
}

export function IconCalendar({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
      <path d="M4 10.5h16M8.5 3v4M15.5 3v4" />
      <circle cx="9" cy="15" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconShield({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 5.8v5.4c0 4.4 2.9 7.6 7 9.8 4.1-2.2 7-5.4 7-9.8V5.8L12 3Z" />
      <path d="m9 12 2.2 2.2L15.5 9.7" />
    </svg>
  );
}

export function IconGrip({ className, strokeWidth = 2.2 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={base(className)}>
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="15" cy="6" r="1.6" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="9" cy="18" r="1.6" />
      <circle cx="15" cy="18" r="1.6" />
    </svg>
  );
}

export function IconBell({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0-6 6v3.5L4.5 15h15L18 12.5V9a6 6 0 0 0-6-6Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconArrow({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
    </svg>
  );
}

export function IconCheck({ className, strokeWidth = 3 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function IconPlus({ className, strokeWidth = 2.4 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconQuote({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={base(className)}>
      <path d="M9.5 6C6.5 7.5 5 9.8 5 13v5h5.5v-5.5H7.6c0-2 .9-3.4 2.9-4.4L9.5 6Zm9 0c-3 1.5-4.5 3.8-4.5 7v5h5.5v-5.5h-2.9c0-2 .9-3.4 2.9-4.4L18.5 6Z" />
    </svg>
  );
}

export function IconSpark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={base(className)}>
      <path d="M12 2.5c.7 4.9 2.6 7 7.5 7.7-4.9.7-6.8 2.8-7.5 7.6-.7-4.8-2.6-6.9-7.5-7.6 4.9-.7 6.8-2.8 7.5-7.7Z" />
    </svg>
  );
}

/* ---------- Panel view-mode icons ---------- */
export function IconList({ className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M8.5 6h12M8.5 12h12M8.5 18h12" />
      <circle cx="4.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGraph({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="18" cy="9" r="2.4" />
      <circle cx="11" cy="18.5" r="2.4" />
      <path d="M8.2 7 15.7 8.4M7 8.2l2.9 8M16.6 11.2l-3.8 5.4" />
    </svg>
  );
}

export function IconTree({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="4.4" rx="1.4" />
      <rect x="3" y="16.5" width="6" height="4.4" rx="1.4" />
      <rect x="15" y="16.5" width="6" height="4.4" rx="1.4" />
      <path d="M12 7.4v4M12 11.4H6v5M12 11.4h6v5" />
    </svg>
  );
}

/* ---------- Menu icons ---------- */
export function IconDashboard({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <rect x="3.5" y="3.5" width="7" height="9.5" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="5.5" rx="1.8" />
      <rect x="13.5" y="12" width="7" height="8.5" rx="1.8" />
      <rect x="3.5" y="16" width="7" height="4.5" rx="1.8" />
    </svg>
  );
}

export function IconUsers({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
      <path d="M15.5 5.2a3.2 3.2 0 0 1 0 5.6M17.5 14.8c1.6.7 2.7 2.2 3 4.7" />
    </svg>
  );
}

export function IconClock({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2.2" />
    </svg>
  );
}

/* ---------- Social ---------- */
export function IconTelegram({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={base(className)}>
      <path d="M21.5 4.3 18.6 19c-.2 1-.8 1.2-1.7.8l-4.5-3.3-2.2 2.1c-.2.2-.5.5-.9.5l.3-4.6L18 7.1c.4-.3-.1-.5-.6-.2L7.2 13.4l-4.4-1.4c-1-.3-1-1 .2-1.4l17-6.5c.8-.3 1.5.2 1.5 1.2Z" />
    </svg>
  );
}

export function IconInstagram({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconLinkedin({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={base(className)}>
      <path d="M6.5 8.7H3.6V20.4h2.9V8.7ZM5 7.3a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4ZM20.4 13.9c0-3.2-1.7-4.7-4-4.7-1.8 0-2.6 1-3.1 1.7V8.7h-2.9V20.4h2.9v-6.2c0-1.5.3-3 2.2-3s2 1.8 2 3v6.2h2.9v-6.5Z" />
    </svg>
  );
}

export function IconX({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M4 4l16 16M20 4 4 20" />
    </svg>
  );
}
