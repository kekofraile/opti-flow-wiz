import React from 'react';
import { StepWrapper } from '../StepWrapper';
import { ChoiceField } from '../ChoiceField';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Pill } from 'lucide-react';

export const MedicationStep: React.FC = () => {
  const { data, updateField } = useQuestionnaire();

  const handleAnyChange = (value: string | string[]) => {
    const selected = Array.isArray(value) ? value[0] : value;
    const normalized = selected ?? undefined;

    updateField('medications_any', normalized);
  };

  return (
    <StepWrapper
      title="Tratamientos sistémicos"
      subtitle="Indícanos si sigues algún tratamiento médico con posible impacto ocular."
    >
      <div className="flex items-center gap-3 mb-6">
        <Pill className="w-8 h-8 text-primary" />
        <h3 className="text-xl font-semibold">¿Estás en tratamiento?</h3>
      </div>

      <ChoiceField
        label="¿Sigues actualmente (o en los últimos 6 meses) algún tratamiento sistémico con posible impacto ocular?"
        options={['Sí', 'No']}
        value={data.medications_any}
        onChange={handleAnyChange}
      />
    </StepWrapper>
  );
};
