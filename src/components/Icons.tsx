type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function ArrowDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} {...base}>
      <path d="M8 2.5v11M3.5 9 8 13.5 12.5 9" />
    </svg>
  );
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} {...base}>
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} {...base}>
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </svg>
  );
}

export function ArrowUp({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} {...base}>
      <path d="M8 13.5v-11M3.5 7 8 2.5 12.5 7" />
    </svg>
  );
}
