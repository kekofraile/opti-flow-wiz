import React from 'react';
import { StepWrapper } from '../StepWrapper';
import { Eye } from 'lucide-react';
export const WelcomeStep: React.FC = () => {
  return (
    <StepWrapper
      title="Bienvenido/a a Todo Óptica"
      subtitle="Complete este cuestionario para ayudarnos a ofrecerle el mejor servicio"
    >
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
          <Eye className="w-10 h-10 text-primary-foreground" />
        </div>
      </div>

      <div className="bg-accent rounded-xl p-6 space-y-3 text-accent-foreground/90">
        <p className="text-base leading-relaxed">
          Gracias por confiar en nosotros. A continuación encontrará una serie de preguntas que nos
          ayudarán a conocer mejor sus necesidades visuales.
        </p>
        <p className="text-sm leading-relaxed">
          Cuando esté preparado/a, haga clic en «Siguiente» para comenzar con el cuestionario.
        </p>
      </div>
    </StepWrapper>
  );
};
