import React, { useState } from 'react';
import { StepWrapper } from '../StepWrapper';
import { ChoiceField } from '../ChoiceField';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Eye } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export const WelcomeStep: React.FC = () => {
  const { data, updateField } = useQuestionnaire();
  const [errors, setErrors] = useState<Record<string, string>>({});

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

      <ChoiceField
        label="Seleccione su idioma / Select your language"
        options={['Español', 'English']}
        value={data.lang}
        onChange={(value) => updateField('lang', value)}
        required
        error={errors.lang}
      />

      <div className="bg-accent rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-accent-foreground">Protección de datos personales</h3>
        <p className="text-sm text-accent-foreground/80 leading-relaxed">
          Los datos proporcionados se utilizarán exclusivamente para mejorar la atención oftalmológica
          y serán tratados conforme al RGPD. Puede ejercer sus derechos de acceso, rectificación y
          supresión contactando con nuestro centro.
        </p>
        
        <div className="flex items-start gap-3 pt-2">
          <Checkbox
            id="consent"
            checked={data.consent || false}
            onCheckedChange={(checked) => updateField('consent', checked)}
            className="mt-1"
          />
          <label
            htmlFor="consent"
            className="text-sm font-medium text-accent-foreground cursor-pointer"
          >
            He leído y acepto la política de privacidad y el tratamiento de mis datos de salud
            <span className="text-destructive ml-1">*</span>
          </label>
        </div>
        
        {errors.consent && (
          <p className="text-destructive text-sm">{errors.consent}</p>
        )}
      </div>
    </StepWrapper>
  );
};
