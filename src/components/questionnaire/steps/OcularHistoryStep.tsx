import React from 'react';
import { StepWrapper } from '../StepWrapper';
import { ChoiceField } from '../ChoiceField';
import { TextField } from '../TextField';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Activity } from 'lucide-react';

export const OcularHistoryStep: React.FC = () => {
  const { data, updateField } = useQuestionnaire();

  const hasOcularDx = data.ocular_dx && !data.ocular_dx.includes('Ninguno');
  const ocularTxValues = (data.ocular_tx ?? []).filter(item => item !== 'Ninguno');
  const ocularTraumaValues = (data.ocular_trauma ?? []).filter(item => item !== 'Ninguno');
  const hasOcularTxHistory =
    data.ocular_tx_history === 'Sí' || (!data.ocular_tx_history && ocularTxValues.length > 0);
  const hasOcularTraumaHistory =
    data.ocular_trauma_history === 'Sí' ||
    (!data.ocular_trauma_history && ocularTraumaValues.length > 0);

  const handleOcularTxHistoryChange = (value: string) => {
    updateField('ocular_tx_history', value);
    if (value !== 'Sí') {
      updateField('ocular_tx', []);
    } else if (data.ocular_tx && data.ocular_tx.includes('Ninguno')) {
      updateField('ocular_tx', ocularTxValues);
    }
  };

  const handleOcularTraumaHistoryChange = (value: string) => {
    updateField('ocular_trauma_history', value);
    if (value !== 'Sí') {
      updateField('ocular_trauma', []);
    } else if (data.ocular_trauma && data.ocular_trauma.includes('Ninguno')) {
      updateField('ocular_trauma', ocularTraumaValues);
    }
  };

  return (
    <StepWrapper
      title="Antecedentes oculares personales"
      subtitle="Historial de enfermedades, cirugías y traumas oculares"
    >
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-primary" />
        <h3 className="text-xl font-semibold">Historial ocular</h3>
      </div>

      <ChoiceField
        label="¿Tiene o ha tenido alguna de estas enfermedades oculares?"
        options={[
          'Glaucoma',
          'Cataratas',
          'Degeneración macular (DMAE)',
          'Retinopatía diabética',
          'Desprendimiento/desgarro de retina',
          'Ambliopía (ojo vago)',
          'Estrabismo',
          'Queratocono',
          'Uveítis / inflamación ocular',
          'Ninguno',
        ]}
        value={data.ocular_dx}
        onChange={(value) => updateField('ocular_dx', value)}
        multiple
        exclusiveOptions={['Ninguno']}
      />

      {hasOcularDx && (
        <TextField
          label="Otra enfermedad ocular (si aplica)"
          value={data.ocular_other}
          onChange={(value) => updateField('ocular_other', value)}
          placeholder="Especifique si tiene otra enfermedad ocular"
        />
      )}

      <ChoiceField
        label="¿Se ha sometido a alguna cirugía o tratamiento ocular?"
        options={['Sí', 'No']}
        value={data.ocular_tx_history}
        onChange={handleOcularTxHistoryChange}
        required
      />

      {hasOcularTxHistory && (
        <ChoiceField
          label="¿Qué procedimientos se realizaron?"
          options={[
            'Cirugía de cataratas',
            'Cirugía refractiva (LASIK/PRK)',
            'Tratamiento o cirugía por glaucoma',
            'Láser/Tratamiento retiniano',
            'Inyecciones intraoculares',
            'Otros procedimientos/terapias oculares',
          ]}
          value={ocularTxValues}
          onChange={(value) => updateField('ocular_tx', value)}
          multiple
          required
        />
      )}

      <ChoiceField
        label="¿Ha sufrido alguna lesión o trauma ocular importante?"
        options={['Sí', 'No']}
        value={data.ocular_trauma_history}
        onChange={handleOcularTraumaHistoryChange}
        required
      />

      {hasOcularTraumaHistory && (
        <ChoiceField
          label="¿Qué tipo de trauma ocurrió?"
          options={[
            'Golpe/contusión ocular',
            'Herida penetrante',
            'Quemadura química / radiación',
            'Cuerpo extraño grave',
            'Otro trauma ocular relevante',
          ]}
          value={ocularTraumaValues}
          onChange={(value) => updateField('ocular_trauma', value)}
          multiple
          required
        />
      )}
    </StepWrapper>
  );
};
