import React from 'react';
import { StepWrapper } from '../StepWrapper';
import { ChoiceField } from '../ChoiceField';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Glasses } from 'lucide-react';
import { cleanUpFields } from '@/lib/utils';

export const GlassesStep: React.FC = () => {
  const { data, updateField } = useQuestionnaire();

  return (
    <StepWrapper
      title="Uso de gafas"
      subtitle="Información sobre su corrección visual actual"
    >
      <div className="flex items-center gap-3 mb-6">
        <Glasses className="w-8 h-8 text-primary" />
        <h3 className="text-xl font-semibold">Gafas graduadas</h3>
      </div>

      <ChoiceField
        label="¿Usa gafas habitualmente?"
        options={['Sí', 'No']}
        value={data.uses_glasses}
        onChange={(value) => {
          updateField('uses_glasses', value as string);
          if (value !== 'Sí') {
            cleanUpFields(updateField, [
              'glasses_use',
              'progressives',
              'progressive_adapt',
              'glasses_age',
              'glasses_satisfaction',
            ]);
          }
        }}
        required
      />

      {data.uses_glasses === 'Sí' && (
        <>
          <ChoiceField
            label="¿Para qué las usa principalmente?"
            options={[
              'Lejos',
              'Cerca',
              'Ordenador y cerca',
              'Para todas las distancias',
            ]}
            value={data.glasses_use}
            onChange={(value) => updateField('glasses_use', value as string[])}
            multiple
            required
          />

          <ChoiceField
            label="¿Usa lentes progresivas (multifocales)?"
            options={['Sí', 'No']}
            value={data.progressives}
            onChange={(value) => {
              updateField('progressives', value as string);
              if (value !== 'Sí') {
                updateField('progressive_adapt', undefined);
              }
            }}
            required
          />

          {data.progressives === 'Sí' && (
            <ChoiceField
              label="¿Cómo ha sido su adaptación a las progresivas?"
              options={['Muy buena', 'Buena', 'Regular', 'Mala']}
              value={data.progressive_adapt}
              onChange={(value) => updateField('progressive_adapt', value as string)}
              required
            />
          )}

          <ChoiceField
            label="¿Cuánto tiempo lleva con sus gafas actuales?"
            options={['< 1 año', '1–2 años', '> 2 años', 'No lo recuerda']}
            value={data.glasses_age}
            onChange={(value) => updateField('glasses_age', value as string)}
            required
          />

          <ChoiceField
            label="¿Cómo califica su visión con sus gafas actuales?"
            options={['Muy buena', 'Aceptable', 'Mejorable', 'Mala']}
            value={data.glasses_satisfaction}
            onChange={(value) => updateField('glasses_satisfaction', value as string)}
            required
          />
        </>
      )}
    </StepWrapper>
  );
};
