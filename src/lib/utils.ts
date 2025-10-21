import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { QuestionnaireData } from '@/types/questionnaire';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanUpFields(updateField: (field: string, value: any) => void, fields: (keyof QuestionnaireData)[]) {
  fields.forEach(field => updateField(field, undefined));
}