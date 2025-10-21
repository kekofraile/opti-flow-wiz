import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { QuestionnaireData } from '@/types/questionnaire';
import { toast } from 'sonner';

interface QuestionnaireContextType {
  data: Partial<QuestionnaireData>; // Consider using a more specific type if possible
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
const INACTIVITY_WARNING = 240000; // 4 minutes
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
  const updateField = useCallback(
    <K extends keyof QuestionnaireData>(field: K, value: QuestionnaireData[K]) => {
      setData(prev => ({ ...prev, [field]: value }));
      updateActivity();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Update last activity
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Inactivity monitor
  const resetQuestionnaire = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData({});
    setCurrentStep(0);
  }, []);

  useEffect(() => {
    const checkInactivity = setInterval(() => {
      const inactive = Date.now() - lastActivity;
      
      if (inactive > INACTIVITY_TIMEOUT) {
        resetQuestionnaire();
        toast.error('Sesión finalizada por inactividad', {
          description: 'El cuestionario se ha reiniciado para proteger su privacidad.',
        });
      } else if (inactive > INACTIVITY_WARNING) {
        toast.warning('¿Sigues ahí?', {
          description: `Tu sesión se cerrará pronto por inactividad. Haz clic en cualquier lugar para continuar.`,
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInactivity);
  }, [lastActivity]);
  

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
