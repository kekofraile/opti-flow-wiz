import React from 'react';
import { StepWrapper } from '../StepWrapper';
import { ChoiceField } from '../ChoiceField';
import { TextField } from '../TextField';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Users } from 'lucide-react';

export const FamilyHistoryStep: React.FC = () => {
  const { data, updateField } = useQuestionnaire();

  return (
    <StepWrapper
      title="Antecedentes familiares oculares"
      subtitle="Enfermedades oculares en padres o hermanos"
    >
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-primary" />
        <h3 className="text-xl font-semibold">Historial familiar</h3>
      </div>

      <ChoiceField
        label="En su familia (padres/hermanos), ¿existe...?"
        options={[
          'Glaucoma',
          'Degeneración macular (DMAE)',
          'Desprendimiento de retina',
          'Retinopatía diabética',
          'Cataratas en edad temprana (<60)',
          'Ninguno',
        ]}
        value={data.family_dx}
        onChange={(value) => updateField('family_dx', value as string[])}
        multiple
        exclusiveOptions={['Ninguno']}
      />

      {data.family_dx && !data.family_dx.includes('Ninguno') && (
        <TextField
          label="Otra enfermedad ocular familiar (si aplica)"
          value={data.family_other}
          onChange={(value) => updateField('family_other', value)}
          placeholder="Especifique si hay otra enfermedad ocular en su familia"
        />
      )}
    </StepWrapper>
  );
};
