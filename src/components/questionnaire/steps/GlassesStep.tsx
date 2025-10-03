import React from 'react';
import { StepWrapper } from '../StepWrapper';
import { ChoiceField } from '../ChoiceField';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Glasses } from 'lucide-react';

export const GlassesStep: React.FC = () => {
  const { data, updateField } = useQuestionnaire();

  const usesGlasses = data.uses_glasses === 'Sí';
  const usesProgressives = data.progressives === 'Sí';

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
        onChange={(value) => updateField('uses_glasses', value)}
        required
      />

      {usesGlasses && (
        <>
          <ChoiceField
            label="¿Para qué las usa principalmente?"
            options={[
              'Lejos',
              'Cerca',
              'Ordenador (intermedia)',
              'Todo el tiempo',
              'Solo en ocasiones',
            ]}
            value={data.glasses_use}
            onChange={(value) => updateField('glasses_use', value)}
            multiple
            required
          />

          <ChoiceField
            label="¿Usa lentes progresivas (multifocales)?"
            options={['Sí', 'No']}
            value={data.progressives}
            onChange={(value) => updateField('progressives', value)}
            required
          />

          {usesProgressives && (
            <ChoiceField
              label="¿Cómo ha sido su adaptación a las progresivas?"
              options={['Muy buena', 'Buena', 'Regular', 'Mala']}
              value={data.progressive_adapt}
              onChange={(value) => updateField('progressive_adapt', value)}
              required
            />
          )}

          <ChoiceField
            label="¿Cuánto tiempo lleva con sus gafas actuales?"
            options={['< 1 año', '1–2 años', '> 2 años', 'No lo recuerda']}
            value={data.glasses_age}
            onChange={(value) => updateField('glasses_age', value)}
            required
          />

          <ChoiceField
            label="¿Cómo califica su visión con sus gafas actuales?"
            options={['Muy buena', 'Aceptable', 'Mejorable', 'Mala']}
            value={data.glasses_satisfaction}
            onChange={(value) => updateField('glasses_satisfaction', value)}
            required
          />
        </>
      )}
    </StepWrapper>
  );
};
