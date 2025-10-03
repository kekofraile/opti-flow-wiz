import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { QuestionnaireData } from '@/types/questionnaire';

interface QuestionnaireContextType {
  data: Partial<QuestionnaireData>;
  updateField: (field: string, value: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  resetQuestionnaire: () => void;
  lastActivity: number;
  updateActivity: () => void;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

const STORAGE_KEY = 'anamnesis_data';
const INACTIVITY_WARNING = 90000; // 90 seconds
const INACTIVITY_TIMEOUT = 300000; // 5 minutes

interface QuestionnaireProviderProps {
  children: React.ReactNode;
  totalSteps: number;
}

export const QuestionnaireProvider: React.FC<QuestionnaireProviderProps> = ({ children, totalSteps }) => {
  const [data, setData] = useState<Partial<QuestionnaireData>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Update field and auto-save
  const updateField = useCallback((field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    updateActivity();
  }, []);

  // Update last activity
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Inactivity monitor
  useEffect(() => {
    const checkInactivity = setInterval(() => {
      const inactive = Date.now() - lastActivity;
      
      if (inactive > INACTIVITY_TIMEOUT) {
        // Clear data and reset
        localStorage.removeItem(STORAGE_KEY);
        setData({});
        setCurrentStep(0);
        window.location.reload();
      } else if (inactive > INACTIVITY_WARNING) {
        // Show warning (implement toast or modal)
        console.warn('Inactivity warning');
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInactivity);
  }, [lastActivity]);

  const resetQuestionnaire = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData({});
    setCurrentStep(0);
  }, []);

  return (
    <QuestionnaireContext.Provider
      value={{
        data,
        updateField,
        currentStep,
        setCurrentStep,
        totalSteps,
        resetQuestionnaire,
        lastActivity,
        updateActivity,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire must be used within QuestionnaireProvider');
  }
  return context;
};
