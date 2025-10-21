import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ChoiceFieldProps {
  label: string;
  options: string[];
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  exclusiveOptions?: string[];
  required?: boolean;
  error?: string;
}

export const ChoiceField: React.FC<ChoiceFieldProps> = ({
  label,
  options,
  value,
  onChange,
  multiple = false,
  exclusiveOptions = [],
  required = false,
  error,
}) => {
  const selectedValues = multiple
    ? Array.isArray(value) ? value : []
    : value ? [value as string] : [];

  const handleSelect = (option: string) => {
    if (!multiple) {
      onChange(option);
      return;
    }

    const isExclusive = exclusiveOptions.includes(option);
    const currentValues = Array.isArray(value) ? value : [];

    if (isExclusive) {
      // If selecting an exclusive option, clear others
      onChange([option]);
    } else {
      // If selecting a regular option
      const filtered = currentValues.filter(v => !exclusiveOptions.includes(v));
      
      if (currentValues.includes(option)) {
        // Deselect
        onChange(filtered.filter(v => v !== option));
      } else {
        // Select
        onChange([...filtered, option]);
      }
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);
          const isExclusive = exclusiveOptions.includes(option);
          
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={cn(
                'group touch-target flex items-center justify-between gap-3 px-6 py-4 rounded-2xl border transition-all duration-200',
                'backdrop-blur-xl bg-white/35 border-white/50 text-foreground shadow-[0_18px_45px_-22px_rgba(15,23,42,0.55)] hover:shadow-[0_26px_60px_-25px_rgba(15,23,42,0.65)] hover:bg-white/45 active:scale-[0.99]',
                'dark:bg-white/10 dark:text-white/90 dark:border-white/15 dark:hover:bg-white/15',
                isSelected
                  ? 'border-primary/60 bg-gradient-to-br from-primary/55 via-primary/45 to-primary-glow/60 text-primary-foreground shadow-[0_30px_70px_-25px_rgba(34,197,94,0.6)]'
                  : 'hover:border-primary/40',
                isExclusive && 'font-medium'
              )}
            >
              <span className="text-left flex-1">{option}</span>
              {isSelected && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full border border-white/70 bg-white/80 text-primary shadow-[0_10px_25px_-12px_rgba(34,197,94,0.6)] flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                  <Check className="w-4 h-4 text-primary" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-destructive text-sm mt-2">{error}</p>
      )}
    </div>
  );
};
