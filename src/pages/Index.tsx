import React, { useEffect, useMemo, useState } from 'react';
import { QuestionnaireProvider, useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { ProgressBar } from '@/components/questionnaire/ProgressBar';
import { NavigationButtons } from '@/components/questionnaire/NavigationButtons';
import { WelcomeStep } from '@/components/questionnaire/steps/WelcomeStep';
import { ReasonStep } from '@/components/questionnaire/steps/ReasonStep';
import { GlassesStep } from '@/components/questionnaire/steps/GlassesStep';
import { ContactsStep } from '@/components/questionnaire/steps/ContactsStep';
import { OcularHistoryStep } from '@/components/questionnaire/steps/OcularHistoryStep';
import { FamilyHistoryStep } from '@/components/questionnaire/steps/FamilyHistoryStep';
import { GeneralHealthStep } from '@/components/questionnaire/steps/GeneralHealthStep';
import { HabitsStep } from '@/components/questionnaire/steps/HabitsStep';
import { MedicationStep } from '@/components/questionnaire/steps/MedicationStep';
import { ReviewStep } from '@/components/questionnaire/steps/ReviewStep';
import { CheckCircle2, Download, FileText, Printer, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QuestionnaireData } from '@/types/questionnaire';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  WelcomeStep,
  ReasonStep,
  GlassesStep,
  ContactsStep,
  OcularHistoryStep,
  FamilyHistoryStep,
  GeneralHealthStep,
  MedicationStep,
  HabitsStep,
  ReviewStep,
];

const QuestionnaireContent: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    data,
    totalSteps,
    updateActivity,
    resetQuestionnaire,
  } = useQuestionnaire();
  const CurrentStepComponent = steps[currentStep];
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [completionTimestamp, setCompletionTimestamp] = useState<string | null>(null);

  const summarySections = useMemo(() => {
    const fieldLabels: Record<keyof QuestionnaireData | string, string> = {
      lang: 'Idioma',
      consent: 'Consentimiento inicial',
      reason_list: 'Motivos de consulta',
      symptoms_list: 'Síntomas asociados',
      last_exam: 'Último examen visual',
      uses_glasses: '¿Usa gafas?',
      glasses_use: 'Uso de las gafas',
      progressives: 'Progresivos',
      progressive_adapt: 'Adaptación a progresivos',
      glasses_age: 'Antigüedad de las gafas',
      glasses_satisfaction: 'Satisfacción con las gafas',
      uses_contacts: '¿Usa lentes de contacto?',
      contacts_freq: 'Frecuencia de uso LC',
      contacts_type: 'Tipo de LC',
      contacts_hours: 'Horas diarias de uso LC',
      contacts_comfort: 'Comodidad con LC',
      ocular_dx: 'Diagnósticos oculares',
      ocular_other: 'Otro diagnóstico ocular',
      ocular_tx: 'Tratamientos oculares',
      ocular_trauma: 'Antecedentes traumáticos',
      family_dx: 'Antecedentes familiares',
      family_other: 'Otros antecedentes familiares',
      systemic: 'Antecedentes sistémicos',
      systemic_other: 'Otros antecedentes sistémicos',
      allergies: 'Alergias',
      allergy_other: 'Otras alergias',
      medications_groups: 'Medicaciones relevantes',
      medications_timing: 'Horario/observaciones medicación',
      medications_cortico_routes: 'Vías de administración corticoides',
      medications_cortico_pio: 'Control de PIO con corticoides',
      medications_antidiabeticos_tipo: 'Antidiabéticos',
      medications_antihipertensivos_tipo: 'Antihipertensivos',
      medications_anticonvulsivos_sub: 'Anticonvulsivos',
      medications_antimalaricos_sub: 'Antipalúdicos',
      medications_hcq_duracion: 'Duración hidroxicloroquina',
      medications_antituberculosos_sub: 'Antituberculosos',
      medications_bisfosfonatos_via: 'Bisfosfonatos',
      medications_tamsulosina_cirugia: 'Cirugía con tamsulosina',
      medications_anticoagulante_tipo: 'Tipo de anticoagulante',
      screens: 'Uso de pantallas',
      near_tasks: 'Tareas en visión próxima',
      night_drive: 'Conducción nocturna',
      night_glare: 'Deslumbramiento nocturno',
      outdoor: 'Actividades al aire libre',
      photophobia: 'Fotofobia',
      sunglasses: 'Uso de gafas de sol',
      final_consent: 'Confirmación final',
      signature: 'Firma digital',
    };

    const sections: { title: string; fields: (keyof QuestionnaireData | string)[] }[] = [
      { title: 'Datos iniciales', fields: ['lang', 'consent'] },
      { title: 'Motivo de consulta', fields: ['reason_list', 'symptoms_list', 'last_exam'] },
      {
        title: 'Uso de gafas',
        fields: [
          'uses_glasses',
          'glasses_use',
          'progressives',
          'progressive_adapt',
          'glasses_age',
          'glasses_satisfaction',
        ],
      },
      {
        title: 'Lentes de contacto',
        fields: ['uses_contacts', 'contacts_freq', 'contacts_type', 'contacts_hours', 'contacts_comfort'],
      },
      {
        title: 'Historial ocular',
        fields: ['ocular_dx', 'ocular_other', 'ocular_tx', 'ocular_trauma'],
      },
      { title: 'Historial familiar', fields: ['family_dx', 'family_other'] },
      {
        title: 'Salud general y alergias',
        fields: ['systemic', 'systemic_other', 'allergies', 'allergy_other'],
      },
      {
        title: 'Medicaciones con impacto visual',
        fields: [
          'medications_groups',
          'medications_timing',
          'medications_cortico_routes',
          'medications_cortico_pio',
          'medications_antidiabeticos_tipo',
          'medications_antihipertensivos_tipo',
          'medications_anticonvulsivos_sub',
          'medications_antimalaricos_sub',
          'medications_hcq_duracion',
          'medications_antituberculosos_sub',
          'medications_bisfosfonatos_via',
          'medications_tamsulosina_cirugia',
          'medications_anticoagulante_tipo',
        ],
      },
      {
        title: 'Hábitos visuales',
        fields: ['screens', 'near_tasks', 'night_drive', 'night_glare', 'outdoor', 'photophobia', 'sunglasses'],
      },
      { title: 'Confirmación final', fields: ['final_consent', 'signature'] },
    ];

    const formatValue = (value: unknown): string => {
      if (value === undefined || value === null) return '';
      if (typeof value === 'boolean') return value ? 'Sí' : 'No';
      if (Array.isArray(value)) return value.length ? value.join(', ') : '';
      if (typeof value === 'object') {
        const entries = Object.entries(value as Record<string, unknown>);
        return entries.length ? entries.map(([key, val]) => `${key}: ${val}`).join(' | ') : '';
      }
      return String(value);
    };

    return sections
      .map(section => {
        const items = section.fields
          .map(field => {
            const rawValue = (data as Partial<QuestionnaireData>)[field as keyof QuestionnaireData];
            const formattedValue = formatValue(rawValue);
            if (!formattedValue) return null;
            return {
              label: fieldLabels[field] ?? field,
              value: formattedValue,
            };
          })
          .filter(Boolean) as { label: string; value: string }[];

        if (!items.length) return null;
        return {
          title: section.title,
          items,
        };
      })
      .filter(Boolean) as { title: string; items: { label: string; value: string }[] }[];
  }, [data]);

  const buildPlainTextSummary = useMemo(() => {
    const lines: string[] = [];
    summarySections.forEach(section => {
      lines.push(section.title);
      section.items.forEach(item => {
        lines.push(`• ${item.label}: ${item.value}`);
      });
      lines.push('');
    });
    return lines.join('\n').trim();
  }, [summarySections]);

  const buildPrintableHtml = useMemo(() => {
    const generatedAt = completionTimestamp
      ? new Date(completionTimestamp).toLocaleString()
      : new Date().toLocaleString();
    const rows = summarySections
      .map(section => {
        const items = section.items
          .map(item => `<tr><td class="label">${item.label}</td><td>${item.value}</td></tr>`)
          .join('');
        return `
          <section>
            <h2>${section.title}</h2>
            <table>${items}</table>
          </section>
        `;
      })
      .join('');

    return `<!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <title>Resumen cuestionario</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; margin: 24px; color: #111827; }
          h1 { font-size: 24px; margin-bottom: 8px; }
          h2 { font-size: 18px; margin-top: 24px; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; }
          td { border: 1px solid #d1d5db; padding: 8px; vertical-align: top; }
          td.label { width: 35%; font-weight: 600; background: #f3f4f6; }
          footer { margin-top: 32px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <h1>Resumen del cuestionario</h1>
        <p>Generado: ${generatedAt}</p>
        ${rows}
        <footer>
          <p>Exportado desde Opti Flow Wiz.</p>
        </footer>
      </body>
    </html>`;
  }, [completionTimestamp, summarySections]);

  const handleDownloadJson = () => {
    const exportPayload = {
      generatedAt: completionTimestamp ?? new Date().toISOString(),
      data,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cuestionario-optica-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Resumen descargado en formato JSON');
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([buildPlainTextSummary || 'Sin datos disponibles'], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cuestionario-optica-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Resumen descargado en formato texto');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('No se pudo abrir la ventana de impresión. Verifique su navegador.');
      return;
    }
    printWindow.document.write(buildPrintableHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleReset = () => {
    resetQuestionnaire();
    setShowCompletionDialog(false);
    setCompletionTimestamp(null);
    toast.success('Cuestionario listo para un nuevo paciente');
  };

  useEffect(() => {
    // Track user activity
    const handleActivity = () => updateActivity();
    
    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [updateActivity]);

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 0: // Welcome
        if (!data.consent) {
          toast.error('Por favor complete todos los campos obligatorios');
          return false;
        }
        break;
      case 1: // Reason
        if (!data.reason_list || data.reason_list.length === 0 || !data.last_exam) {
          toast.error('Por favor complete todos los campos obligatorios');
          return false;
        }
        break;
      case 2: // Glasses
        if (!data.uses_glasses) {
          toast.error('Por favor complete todos los campos obligatorios');
          return false;
        }

        if (data.uses_glasses === 'Sí') {
          if (!data.glasses_use || data.glasses_use.length === 0) {
            toast.error('Por favor complete todos los campos obligatorios');
            return false;
          }

          if (!data.progressives) {
            toast.error('Por favor complete todos los campos obligatorios');
            return false;
          }

          if (data.progressives === 'Sí' && !data.progressive_adapt) {
            toast.error('Por favor complete todos los campos obligatorios');
            return false;
          }

          if (!data.glasses_age || !data.glasses_satisfaction) {
            toast.error('Por favor complete todos los campos obligatorios');
            return false;
          }
        }
        break;
      case 3: // Contacts
        if (!data.uses_contacts) {
          toast.error('Por favor complete todos los campos obligatorios');
          return false;
        }

        if (data.uses_contacts === 'Sí') {
          if (!data.contacts_freq || !data.contacts_hours || !data.contacts_comfort) {
            toast.error('Por favor complete todos los campos obligatorios');
            return false;
          }

          if (!data.contacts_type || data.contacts_type.length === 0) {
            toast.error('Por favor complete todos los campos obligatorios');
            return false;
          }
        }
        break;
      case 8: // Habits
        if (!data.screens || !data.near_tasks || !data.night_drive || !data.outdoor || !data.photophobia || !data.sunglasses) {
          toast.error('Por favor complete todos los campos obligatorios');
          return false;
        }

        if (['Sí, habitualmente', 'A veces'].includes(data.night_drive) && !data.night_glare) {
          toast.error('Por favor complete todos los campos obligatorios');
          return false;
        }
        break;
      case 9: // Review
        if (!data.final_consent) {
          toast.error('Debe confirmar que la información es correcta');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep === steps.length - 1) {
      const timestamp = new Date().toISOString();
      setCompletionTimestamp(timestamp);
      toast.success('Cuestionario completado correctamente');
      setShowCompletionDialog(true);
    } else {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('Guardado', {
        icon: <Save className="w-4 h-4" />,
        duration: 1000,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted kiosk-mode">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Todo Óptica
            </h1>
            <div className="text-sm text-muted-foreground">
              Paso {currentStep + 1} de {totalSteps}
            </div>
          </div>
          <ProgressBar />
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-5xl mx-auto px-6 py-8 pb-32">
        <CurrentStepComponent />
      </main>

      {/* Navigation */}
      <NavigationButtons
        onNext={handleNext}
        onBack={handleBack}
        canGoNext={true}
        isLastStep={currentStep === steps.length - 1}
      />

      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="max-w-3xl sm:max-w-4xl overflow-hidden p-0">
          <div className="flex max-h-[85vh] flex-col">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                Cuestionario guardado
              </DialogTitle>
              <DialogDescription>
                Descargue o imprima el resumen para incorporarlo a la historia clínica.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="grid gap-6 pr-2">
                <Card>
                  <CardContent className="py-4">
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        Fecha de exportación:{' '}
                        {completionTimestamp
                          ? new Date(completionTimestamp).toLocaleString()
                          : new Date().toLocaleString()}
                      </p>
                      <p>Campos completados: {summarySections.reduce((acc, section) => acc + section.items.length, 0)}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  {summarySections.map(section => (
                    <Card key={section.title}>
                      <CardContent className="py-4 space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                        <dl className="grid gap-2 text-sm">
                          {section.items.map(item => (
                            <div key={item.label} className="grid gap-1">
                              <dt className="font-medium text-muted-foreground">{item.label}</dt>
                              <dd className="text-foreground">{item.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 border-t border-border bg-background px-6 py-4">
              <Button onClick={handlePrint} variant="secondary" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Imprimir / Guardar PDF
              </Button>
              <Button onClick={handleDownloadTxt} variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Descargar resumen (.txt)
              </Button>
              <Button onClick={handleDownloadJson} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Descargar datos (.json)
              </Button>
              <Button onClick={handleReset} variant="ghost">
                Reiniciar cuestionario
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Index = () => {
  return (
    <QuestionnaireProvider totalSteps={steps.length}>
      <QuestionnaireContent />
    </QuestionnaireProvider>
  );
};

export default Index;
