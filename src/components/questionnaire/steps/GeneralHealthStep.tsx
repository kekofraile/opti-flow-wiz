import React from 'react';
import { StepWrapper } from '../StepWrapper';
import { ChoiceField } from '../ChoiceField';
import { TextField } from '../TextField';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { HeartPulse } from 'lucide-react';

export const GeneralHealthStep: React.FC = () => {
  const { data, updateField } = useQuestionnaire();

  return (
    <StepWrapper
      title="Salud general"
      subtitle="Condiciones médicas y alergias"
    >
      <div className="flex items-center gap-3 mb-6">
        <HeartPulse className="w-8 h-8 text-primary" />
        <h3 className="text-xl font-semibold">Estado de salud</h3>
      </div>

      <ChoiceField
        label="Condiciones de salud"
        options={[
          'Diabetes',
          'Hipertensión',
          'Colesterol/triglicéridos altos',
          'Problemas de tiroides',
          'Enfermedad autoinmune (p. ej., artritis reumatoide, lupus)',
          'Migrañas crónicas',
          'Ninguna',
        ]}
        value={data.systemic}
        onChange={(value) => updateField('systemic', value as string[])}
        multiple
        exclusiveOptions={['Ninguna']}
      />

      {data.systemic && !data.systemic.includes('Ninguna') && (
        <TextField
          label="Otra condición médica (si aplica)"
          value={data.systemic_other}
          onChange={(value) => updateField('systemic_other', value)}
          placeholder="Especifique si tiene otra condición médica relevante"
        />
      )}

      <ChoiceField
        label="Alergias"
        options={[
          'Ambientales (pólenes, ácaros…)',
          'A medicamentos',
          'A colirios/soluciones de lentillas',
          'Ninguna',
        ]}
        value={data.allergies}
        onChange={(value) => updateField('allergies', value as string[])}
        multiple
        exclusiveOptions={['Ninguna']}
      />

      {data.allergies && !data.allergies.includes('Ninguna') && (
        <TextField
          label="Otra alergia (si aplica)"
          value={data.allergy_other}
          onChange={(value) => updateField('allergy_other', value)}
          placeholder="Especifique si tiene otra alergia relevante"
        />
      )}
    </StepWrapper>
  );
};
