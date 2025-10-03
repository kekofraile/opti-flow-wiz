import React from 'react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';

export const ProgressBar: React.FC = () => {
  const { currentStep, totalSteps } = useQuestionnaire();
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner">
      <div
        className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500 ease-out rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
