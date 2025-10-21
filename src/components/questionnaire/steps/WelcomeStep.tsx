import React from 'react';
import { StepWrapper } from '../StepWrapper';
import { Eye, User, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
export const WelcomeStep: React.FC = () => {
  const { data, updateField } = useQuestionnaire();

  return (
    <StepWrapper
      watermark={false}
      title="Bienvenido/a a Todo Óptica"
      subtitle="Complete este cuestionario para ayudarnos a ofrecerle el mejor servicio"
    >
      {/* Brand logo */}
      <div className="flex justify-center mb-6">
        <img
          src="/logo-todo-optica.svg"
          alt="Todo Óptica"
          className="h-14 md:h-16 w-auto"
        />
      </div>

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

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            <User className="h-4 w-4 text-primary" />
            Nombre del paciente
          </label>
          <Input
            value={data.client_name ?? ''}
            onChange={(event) => updateField('client_name', event.target.value)}
            placeholder="Nombre y apellidos"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            <Hash className="h-4 w-4 text-primary" />
            Número de expediente / cliente
          </label>
          <Input
            value={data.client_id ?? ''}
            onChange={(event) => updateField('client_id', event.target.value)}
            placeholder="ID o referencia interna"
            autoComplete="off"
          />
        </div>
      </div>
    </StepWrapper>
  );
};
