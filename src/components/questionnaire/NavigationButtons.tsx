import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';

interface NavigationButtonsProps {
  onNext: () => void;
  onBack: () => void;
  canGoNext: boolean;
  isLastStep?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onNext,
  onBack,
  canGoNext,
  isLastStep = false,
}) => {
  const { currentStep } = useQuestionnaire();
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50 print:hidden">
      <div className="container max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="glass"
            size="lg"
            onClick={onBack}
            disabled={isFirstStep}
            className="touch-target min-w-[120px] px-6 font-semibold"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Atrás
          </Button>

          <Button
            variant="glassPrimary"
            size="lg"
            onClick={onNext}
            disabled={!canGoNext}
            className="touch-target min-w-[140px] px-8 font-semibold"
          >
            {isLastStep ? 'Enviar' : 'Siguiente'}
            {!isLastStep && <ChevronRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
