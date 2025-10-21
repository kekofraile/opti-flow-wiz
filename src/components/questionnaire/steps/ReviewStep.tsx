import React from 'react';
import { StepWrapper } from '../StepWrapper';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

type SectionEntry = {
  label: string;
  value: string | undefined;
};

type SectionConfig = {
  title: string;
  step: number;
  data: SectionEntry[];
};

export const ReviewStep: React.FC = () => {
  const { data, updateField, setCurrentStep } = useQuestionnaire();

  const ocularTxList = (data.ocular_tx ?? []).filter((item) => item !== 'Ninguno');
  const ocularTraumaList = (data.ocular_trauma ?? []).filter((item) => item !== 'Ninguno');

  const ocularTxDetails =
    data.ocular_tx_history === 'Sí' && ocularTxList.length ? ocularTxList.join(', ') : undefined;
  const ocularTraumaDetails =
    data.ocular_trauma_history === 'Sí' && ocularTraumaList.length
      ? ocularTraumaList.join(', ')
      : undefined;

  const sections: SectionConfig[] = [
    {
      title: 'Motivo de consulta',
      step: 1,
      data: [
        { label: 'Motivos', value: data.reason_list?.join(', ') },
        { label: 'Síntomas', value: data.symptoms_list?.join(', ') },
        { label: 'Último examen', value: data.last_exam },
      ],
    },
    {
      title: 'Gafas',
      step: 2,
      data: [
        { label: 'Usa gafas', value: data.uses_glasses },
        { label: 'Uso', value: data.glasses_use?.join(', ') },
        { label: 'Progresivos', value: data.progressives },
        { label: 'Adaptación progresivos', value: data.progressive_adapt },
        { label: 'Antigüedad', value: data.glasses_age },
        { label: 'Satisfacción', value: data.glasses_satisfaction },
      ],
    },
    {
      title: 'Lentillas',
      step: 3,
      data: [
        { label: 'Usa lentes de contacto', value: data.uses_contacts },
        { label: 'Frecuencia', value: data.contacts_freq },
        { label: 'Tipo', value: data.contacts_type?.join(', ') },
        { label: 'Horas/día', value: data.contacts_hours },
        { label: 'Comodidad', value: data.contacts_comfort },
      ],
    },
    {
      title: 'Historia ocular',
      step: 4,
      data: [
        { label: 'Diagnósticos', value: data.ocular_dx?.join(', ') },
        { label: 'Otros diagnósticos', value: data.ocular_other },
        { label: 'Cirugías/tratamientos previos', value: data.ocular_tx_history },
        ocularTxDetails
          ? { label: 'Detalles cirugía/tratamiento', value: ocularTxDetails }
          : null,
        { label: 'Traumatismos', value: data.ocular_trauma_history },
        ocularTraumaDetails ? { label: 'Detalles traumatismo', value: ocularTraumaDetails } : null,
      ].filter(Boolean) as SectionEntry[],
    },
    {
      title: 'Antecedentes familiares',
      step: 5,
      data: [
        { label: 'Patologías familiares', value: data.family_dx?.join(', ') },
        { label: 'Otros antecedentes', value: data.family_other },
      ],
    },
    {
      title: 'Salud general',
      step: 6,
      data: [
        { label: 'Antecedentes sistémicos', value: data.systemic?.join(', ') },
        { label: 'Otros antecedentes sistémicos', value: data.systemic_other },
        { label: 'Alergias', value: data.allergies?.join(', ') },
        { label: 'Otras alergias', value: data.allergy_other },
      ],
    },
    {
      title: 'Tratamientos sistémicos',
      step: 7,
      data: [
        {
          label: '¿Tratamiento con posible impacto ocular?',
          value: data.medications_any ?? 'Sin indicar',
        },
      ],
    },
    {
      title: 'Hábitos visuales',
      step: 8,
      data: [
        { label: 'Uso de pantallas', value: data.screens },
        { label: 'Tareas en visión próxima', value: data.near_tasks },
        { label: 'Conducción nocturna', value: data.night_drive },
        { label: 'Deslumbramiento nocturno', value: data.night_glare },
        { label: 'Tiempo al aire libre', value: data.outdoor },
        { label: 'Fotofobia', value: data.photophobia },
        { label: 'Uso de gafas de sol', value: data.sunglasses },
      ],
    },
  ];

  const safetyConsiderations = [
    'No suspenda ni modifique medicación sin consultar a su médico.',
    'Solicite atención urgente si aparece dolor ocular intenso o pérdida visual súbita.',
  ];

  return (
    <StepWrapper
      title="Resumen de su información"
      subtitle="Revise y confirme que todos los datos son correctos"
    >
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
                  <div key={`${section.title}-${index}`} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}:</span>
                    <span className="font-medium text-right ml-4">{item.value}</span>
                  </div>
                ))}
              {section.data.every((item) => !item.value) && (
                <p className="text-sm text-muted-foreground">Sin información registrada.</p>
              )}
            </CardContent>
          </Card>
        ))}

        <Card className="border-dashed border-muted-foreground/40">
          <CardHeader>
            <CardTitle className="text-base">Consideraciones de seguridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {safetyConsiderations.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="mt-1 text-base leading-none">•</span>
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="bg-accent rounded-xl p-6 mt-6">
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
