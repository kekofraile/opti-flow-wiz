import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TextFieldProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  error,
  placeholder,
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-lg font-semibold">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-lg py-6 px-6 rounded-xl"
      />
      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
    </div>
  );
};
