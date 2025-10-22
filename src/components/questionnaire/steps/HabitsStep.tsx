import React from 'react';
import { StepWrapper } from '../StepWrapper';
import { ChoiceField } from '../ChoiceField';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Monitor, Car, Sun } from 'lucide-react';

export const HabitsStep: React.FC = () => {
  const { data, updateField } = useQuestionnaire();

  const drivesAtNight = data.night_drive && ['Sí, habitualmente', 'A veces'].includes(data.night_drive);

  return (
    <StepWrapper
      title="Hábitos y necesidades visuales"
      subtitle="Actividades diarias y exposición visual"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="w-8 h-8 text-primary" />
            <h3 className="text-xl font-semibold">Uso de pantallas</h3>
          </div>

          <ChoiceField
            label="Horas de pantalla al día"
            options={['< 2 h', '2–4 h', '4–8 h', '> 8 h']}
            value={data.screens}
            onChange={(value) => updateField('screens', value as string)}
            required
          />

          <ChoiceField
            label="Tareas de cerca prolongadas (lectura, manualidades, etc.)"
            options={[
              'Muchas horas al día',
              '1–2 h al día',
              'Ocasional',
              'Casi nunca',
            ]}
            value={data.near_tasks}
            onChange={(value) => updateField('near_tasks', value as string)}
            required
          />
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <Car className="w-8 h-8 text-primary" />
            <h3 className="text-xl font-semibold">Conducción</h3>
          </div>

          <ChoiceField
            label="¿Conduce de noche?"
            options={['Sí, habitualmente', 'A veces', 'Rara vez o nunca']}
            value={data.night_drive}
            onChange={(value) => updateField('night_drive', value as string)}
            required
          />

          {drivesAtNight && (
            <ChoiceField
              label="¿Tiene deslumbramiento al conducir de noche?"
              options={['Mucho', 'A veces', 'No']}
              value={data.night_glare}
              onChange={(value) => updateField('night_glare', value as string)}
              required
            />
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <Sun className="w-8 h-8 text-primary" />
            <h3 className="text-xl font-semibold">Exposición solar</h3>
          </div>

          <ChoiceField
            label="Tiempo al aire libre (de día)"
            options={['Muchas horas', 'Un par de horas', 'Muy poco']}
            value={data.outdoor}
            onChange={(value) => updateField('outdoor', value as string)}
            required
          />

          <ChoiceField
            label="Sensibilidad a la luz solar"
            options={['Sí, mucha', 'Un poco', 'No']}
            value={data.photophobia}
            onChange={(value) => updateField('photophobia', value as string)}
            required
          />

          <ChoiceField
            label="Uso de gafas de sol"
            options={['Casi siempre', 'A veces', 'Rara vez o nunca']}
            value={data.sunglasses}
            onChange={(value) => updateField('sunglasses', value as string)}
            required
          />
        </div>
      </div>
    </StepWrapper>
  );
};
