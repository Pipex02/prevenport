import type { FC, ReactNode } from 'react';
import clsx from 'clsx';

type BadgeIntent = 'neutral' | 'success' | 'warning' | 'danger';

type BadgeProps = {
  children: ReactNode;
  intent?: BadgeIntent;
  className?: string;
};

const intentStyles: Record<BadgeIntent, string> = {
  neutral: 'bg-slate-700/40 text-slate-200 border border-slate-500/40',
  success: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40',
  warning: 'bg-amber-500/10 text-amber-200 border border-amber-500/40',
  danger: 'bg-rose-500/10 text-rose-200 border border-rose-500/40',
};

export const Badge: FC<BadgeProps> = ({ children, intent = 'neutral', className }) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-sm',
      intentStyles[intent],
      className,
    )}
  >
    {children}
  </span>
);
