import React from 'react';
import { cn } from '@/lib/utils';

interface StepWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  watermark?: boolean;
}

export const StepWrapper: React.FC<StepWrapperProps> = ({
  title,
  subtitle,
  children,
  className,
  watermark = true,
}) => {
  return (
    <div className={cn('relative z-0 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500', className)}>
      {/* Watermark background */}
      {watermark && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-5">
          <img
            src="/logo-todo-optica.svg"
            alt=""
            aria-hidden
            className="max-w-[70%] max-h-[70%] object-contain"
          />
        </div>
      )}

      <div className="mb-8 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>
      
      <div className="space-y-8 relative z-10">
        {children}
      </div>
    </div>
  );
};
