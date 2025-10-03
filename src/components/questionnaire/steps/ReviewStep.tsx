import React from 'react';
import { StepWrapper } from '../StepWrapper';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ReviewStep: React.FC = () => {
  const { data, updateField, setCurrentStep } = useQuestionnaire();

  const hints = [];
  
  if (data.screens && ['4–8 h', '> 8 h'].includes(data.screens)) {
    hints.push({
      icon: <AlertCircle className="w-5 h-5" />,
      text: 'Uso intensivo de pantallas: valorar protección/AR y visión intermedia.',
    });
  }

  if (data.night_drive && ['Sí, habitualmente', 'A veces'].includes(data.night_drive)) {
    hints.push({
      icon: <AlertCircle className="w-5 h-5" />,
      text: 'Conducción nocturna: revisar deslumbramiento y contrastes.',
    });
  }

  if (data.photophobia === 'Sí, mucha') {
    hints.push({
      icon: <AlertCircle className="w-5 h-5" />,
      text: 'Alta sensibilidad a la luz: considerar fotocromáticas/polarizadas.',
    });
  }

  const sections = [
    {
      title: 'Motivo de consulta',
      step: 1,
      data: [
        { label: 'Motivo', value: data.reason_list?.join(', ') },
        { label: 'Síntomas', value: data.symptoms_list?.join(', ') },
        { label: 'Último examen', value: data.last_exam },
      ],
    },
    {
      title: 'Gafas',
      step: 2,
      data: [
        { label: 'Usa gafas', value: data.uses_glasses },
        { label: 'Uso principal', value: data.glasses_use?.join(', ') },
        { label: 'Progresivas', value: data.progressives },
        { label: 'Satisfacción', value: data.glasses_satisfaction },
      ],
    },
    {
      title: 'Lentillas',
      step: 3,
      data: [
        { label: 'Usa lentillas', value: data.uses_contacts },
        { label: 'Frecuencia', value: data.contacts_freq },
        { label: 'Tipo', value: data.contacts_type?.join(', ') },
      ],
    },
    {
      title: 'Antecedentes oculares',
      step: 4,
      data: [
        { label: 'Enfermedades', value: data.ocular_dx?.join(', ') },
        { label: 'Cirugías/Tratamientos', value: data.ocular_tx?.join(', ') },
        { label: 'Traumas', value: data.ocular_trauma?.join(', ') },
      ],
    },
    {
      title: 'Antecedentes familiares',
      step: 5,
      data: [
        { label: 'Enfermedades familiares', value: data.family_dx?.join(', ') },
      ],
    },
    {
      title: 'Salud general',
      step: 6,
      data: [
        { label: 'Condiciones', value: data.systemic?.join(', ') },
        { label: 'Alergias', value: data.allergies?.join(', ') },
      ],
    },
    {
      title: 'Hábitos visuales',
      step: 7,
      data: [
        { label: 'Horas de pantalla', value: data.screens },
        { label: 'Conduce de noche', value: data.night_drive },
        { label: 'Tiempo al aire libre', value: data.outdoor },
        { label: 'Uso de gafas de sol', value: data.sunglasses },
      ],
    },
  ];

  return (
    <StepWrapper
      title="Resumen de su información"
      subtitle="Revise y confirme que todos los datos son correctos"
    >
      {hints.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Recomendaciones personalizadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {hints.map((hint, index) => (
              <div key={index} className="flex items-start gap-3 text-sm text-primary">
                {hint.icon}
                <span>{hint.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(section.step)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {section.data
                .filter((item) => item.value)
                .map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}:</span>
                    <span className="font-medium text-right ml-4">{item.value}</span>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-accent rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Checkbox
            id="final_consent"
            checked={data.final_consent || false}
            onCheckedChange={(checked) => updateField('final_consent', checked)}
            className="mt-1"
          />
          <label
            htmlFor="final_consent"
            className="text-sm font-medium text-accent-foreground cursor-pointer"
          >
            Confirmo que toda la información proporcionada es correcta y completa
            <span className="text-destructive ml-1">*</span>
          </label>
        </div>
      </div>
    </StepWrapper>
  );
};
