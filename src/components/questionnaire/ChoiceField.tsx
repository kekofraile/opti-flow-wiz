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
                'touch-target flex items-center justify-between gap-3 px-6 py-4 rounded-xl border-2 transition-all',
                'hover:shadow-md active:scale-[0.98]',
                isSelected
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border bg-card hover:border-primary/50',
                isExclusive && 'font-medium'
              )}
            >
              <span className="text-left flex-1">{option}</span>
              {isSelected && (
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
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
