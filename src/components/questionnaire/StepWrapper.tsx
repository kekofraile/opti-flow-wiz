import React from 'react';
import { cn } from '@/lib/utils';

interface StepWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const StepWrapper: React.FC<StepWrapperProps> = ({
  title,
  subtitle,
  children,
  className,
}) => {
  return (
    <div className={cn('animate-in fade-in slide-in-from-right-4 duration-500', className)}>
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>
      
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );
};
