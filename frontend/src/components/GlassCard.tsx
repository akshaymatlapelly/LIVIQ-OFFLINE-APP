import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
  hoverEffect?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  glow = false,
  hoverEffect = true,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-3xl p-6 transition-all duration-300 relative overflow-hidden',
          glow ? 'glass-panel-glow' : 'glass-panel',
          hoverEffect && 'hover:shadow-lg hover:-translate-y-0.5',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
