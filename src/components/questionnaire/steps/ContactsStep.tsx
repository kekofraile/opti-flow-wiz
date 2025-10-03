import React from 'react';
import { StepWrapper } from '../StepWrapper';
import { ChoiceField } from '../ChoiceField';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Contact } from 'lucide-react';

export const ContactsStep: React.FC = () => {
  const { data, updateField } = useQuestionnaire();

  const usesContacts = data.uses_contacts === 'Sí';

  return (
    <StepWrapper
      title="Lentes de contacto"
      subtitle="Información sobre su uso de lentillas"
    >
      <div className="flex items-center gap-3 mb-6">
        <Contact className="w-8 h-8 text-primary" />
        <h3 className="text-xl font-semibold">Lentillas</h3>
      </div>

      <ChoiceField
        label="¿Usa lentes de contacto (lentillas)?"
        options={['Sí', 'No']}
        value={data.uses_contacts}
        onChange={(value) => updateField('uses_contacts', value)}
        required
      />

      {usesContacts && (
        <>
          <ChoiceField
            label="Frecuencia de uso"
            options={[
              'Diario',
              'Varias veces por semana',
              'Ocasional',
              'Ya no las uso',
            ]}
            value={data.contacts_freq}
            onChange={(value) => updateField('contacts_freq', value)}
            required
          />

          <ChoiceField
            label="Tipo de lentillas"
            options={[
              'Blandas desechables',
              'Semirrígidas (RGP)',
              'Tóricas',
              'Multifocales',
              'No lo sé',
            ]}
            value={data.contacts_type}
            onChange={(value) => updateField('contacts_type', value)}
            multiple
            required
          />

          <ChoiceField
            label="Horas de uso al día"
            options={['< 4 h', '4–8 h', '> 8 h']}
            value={data.contacts_hours}
            onChange={(value) => updateField('contacts_hours', value)}
            required
          />

          <ChoiceField
            label="Comodidad"
            options={['Muy buena', 'Buena', 'Regular', 'Mala']}
            value={data.contacts_comfort}
            onChange={(value) => updateField('contacts_comfort', value)}
            required
          />
        </>
      )}
    </StepWrapper>
  );
};
