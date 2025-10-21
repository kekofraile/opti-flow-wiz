import React from 'react';
import { StepWrapper } from '../StepWrapper';
import { ChoiceField } from '../ChoiceField';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';

export const ReasonStep: React.FC = () => {
  const { data, updateField } = useQuestionnaire();

  return (
    <StepWrapper
      title="Motivo de su visita"
      subtitle="Ayúdenos a entender qué le trae a nuestro centro"
    >
      <ChoiceField
        label="¿Cuál es el motivo principal de su consulta?"
        options={[
          'Revisión rutinaria',
          'Renovación de gafas',
          'Molestias o problemas de visión',
          'Interés en lentes de contacto',
        ]}
        value={data.reason_list}
        onChange={(value) => updateField('reason_list', value)}
        multiple
        required
      />

      {data.reason_list?.includes('Molestias o problemas de visión') && (
        <ChoiceField
          label="¿Qué síntomas presenta?"
          options={[
            'Visión borrosa de lejos',
            'Visión borrosa de cerca',
            'Dificultad de enfoque / fatiga visual',
            'Dolores de cabeza',
            'Ojos rojos / irritación',
            'Sequedad ocular',
            'Destellos / "moscas volantes"',
            'Sensibilidad a la luz',
            'Ninguno',
          ]}
          value={data.symptoms_list}
          onChange={(value) => updateField('symptoms_list', value)}
          multiple
          exclusiveOptions={['Ninguno']}
        />
      )}

      <ChoiceField
        label="¿Cuándo fue su último examen completo de la vista?"
        options={[
          'En el último año',
          'Hace 1–2 años',
          'Hace más de 2 años',
          'Nunca',
        ]}
        value={data.last_exam}
        onChange={(value) => updateField('last_exam', value)}
        required
      />
    </StepWrapper>
  );
};
