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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      client_name: 'Nombre del paciente',
      client_id: 'Identificador / Nº cliente',
      lang: 'Idioma',
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
      ocular_tx_history: 'Cirugías/Tratamientos oculares',
      ocular_tx: 'Tratamientos oculares · Detalles',
      ocular_trauma_history: 'Antecedentes traumáticos oculares',
      ocular_trauma: 'Traumas oculares · Detalles',
      family_dx: 'Antecedentes familiares',
      family_other: 'Otros antecedentes familiares',
      systemic: 'Antecedentes sistémicos',
      systemic_other: 'Otros antecedentes sistémicos',
      allergies: 'Alergias',
      allergy_other: 'Otras alergias',
      medications_any: '¿Medicación con posible impacto ocular?',
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

    type SummaryItem = { label: string; value: string; field: string };
    type SummarySection = {
      title: string;
      items: SummaryItem[];
      alwaysVisible?: boolean;
      narrative?: string[];
    };

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

    const buildGeneralHistoryNarrative = (formData: Partial<QuestionnaireData>): string[] => {
      if (!formData) return [];

      const sentences: string[] = [];

      const screenMap: Record<string, string> = {
        '< 2 h': 'menos de dos horas al día',
        '2–4 h': 'entre dos y cuatro horas diarias',
        '4–8 h': 'entre cuatro y ocho horas diarias',
        '> 8 h': 'más de ocho horas diarias',
      };

      if (formData.screens) {
        const screenSentence = screenMap[formData.screens] ?? formData.screens.toLowerCase();
        sentences.push(`Uso de pantallas ${screenSentence}.`);
      }

      const nearTaskMap: Record<string, string> = {
        'Muchas horas al día': 'durante muchas horas al día',
        '1–2 h al día': 'alrededor de una o dos horas al día',
        'Ocasional': 'de forma ocasional',
        'Casi nunca': 'casi nunca',
      };

      if (formData.near_tasks) {
        const nearSentence = nearTaskMap[formData.near_tasks] ?? formData.near_tasks.toLowerCase();
        sentences.push(`Realiza tareas en visión próxima ${nearSentence}.`);
      }

      if (formData.night_drive) {
        const nightDriveMap: Record<string, string> = {
          'Sí, habitualmente': 'Conduce de noche habitualmente.',
          'A veces': 'Conduce de noche a veces.',
          'Rara vez o nunca': 'No conduce o rara vez conduce de noche.',
        };
        sentences.push(nightDriveMap[formData.night_drive] ?? `Conducción nocturna: ${formData.night_drive}.`);
      }

      if (formData.night_glare) {
        const glareMap: Record<string, string> = {
          'Mucho': 'Refiere mucho deslumbramiento nocturno.',
          'A veces': 'Refiere deslumbramiento nocturno ocasional.',
          'No': 'No refiere deslumbramiento nocturno.',
        };
        sentences.push(glareMap[formData.night_glare] ?? `Deslumbramiento nocturno: ${formData.night_glare}.`);
      }

      if (formData.outdoor) {
        const outdoorMap: Record<string, string> = {
          'Muchas horas': 'Pasa muchas horas al aire libre.',
          'Un par de horas': 'Pasa un par de horas al aire libre.',
          'Muy poco': 'Pasa muy poco tiempo al aire libre.',
        };
        sentences.push(outdoorMap[formData.outdoor] ?? `Tiempo al aire libre: ${formData.outdoor}.`);
      }

      if (formData.photophobia) {
        const photophobiaMap: Record<string, string> = {
          'Sí, mucha': 'Presenta fotofobia marcada.',
          'Un poco': 'Presenta algo de fotofobia.',
          'No': 'No presenta fotofobia.',
        };
        sentences.push(photophobiaMap[formData.photophobia] ?? `Fotofobia: ${formData.photophobia}.`);
      }

      if (formData.sunglasses) {
        const sunglassesMap: Record<string, string> = {
          'Casi siempre': 'Usa gafas de sol casi siempre.',
          'A veces': 'Usa gafas de sol a veces.',
          'Rara vez o nunca': 'Rara vez o nunca usa gafas de sol.',
        };
        sentences.push(sunglassesMap[formData.sunglasses] ?? `Uso de gafas de sol: ${formData.sunglasses}.`);
      }

      return sentences.filter(Boolean);
    };

    type CategoryConfig = {
      title: string;
      fields: (keyof QuestionnaireData | string)[];
      alwaysVisible?: boolean;
      narrativeBuilder?: (data: Partial<QuestionnaireData>) => string[];
    };

    const categoryConfig: CategoryConfig[] = [
      {
        title: 'Identificación del paciente',
        fields: ['client_name', 'client_id'],
        alwaysVisible: true,
      },
      {
        title: 'Motivo de la visita',
        fields: ['reason_list', 'symptoms_list', 'last_exam'],
        alwaysVisible: true,
      },
      {
        title: 'Historia médica / Historia del desarrollo',
        fields: [
          'systemic',
          'systemic_other',
          'medications_any',
          'allergies',
          'allergy_other',
        ],
        alwaysVisible: true,
      },
      {
        title: 'Historia ocular',
        fields: [
          'uses_glasses',
          'glasses_use',
          'progressives',
          'progressive_adapt',
          'glasses_age',
          'glasses_satisfaction',
          'uses_contacts',
          'contacts_freq',
          'contacts_type',
          'contacts_hours',
          'contacts_comfort',
          'ocular_dx',
          'ocular_other',
          'ocular_tx_history',
          'ocular_tx',
          'ocular_trauma_history',
          'ocular_trauma',
        ],
        alwaysVisible: true,
      },
      {
        title: 'Historia familiar',
        fields: ['family_dx', 'family_other'],
        alwaysVisible: true,
      },
      {
        title: 'Historia en general',
        fields: ['screens', 'near_tasks', 'night_drive', 'night_glare', 'outdoor', 'photophobia', 'sunglasses'],
        narrativeBuilder: buildGeneralHistoryNarrative,
        alwaysVisible: true,
      },
      {
        title: 'Polo anterior',
        fields: [],
      },
      {
        title: 'Polo posterior',
        fields: [],
      },
    ];

    const usedFields = new Set<string>();

    const sections = categoryConfig
      .map<SummarySection>(section => {
        section.fields.forEach(field => usedFields.add(field as string));

        const items = section.fields
          .map(field => {
            const rawValue = (data as Partial<QuestionnaireData>)[field as keyof QuestionnaireData];
            const formattedValue = formatValue(rawValue);
            if (!formattedValue) return null;
            return {
              field: field as string,
              label: fieldLabels[field] ?? field,
              value: formattedValue,
            } satisfies SummaryItem;
          })
          .filter(Boolean) as SummaryItem[];

        const narrative = section.narrativeBuilder?.(data) ?? [];

        return {
          title: section.title,
          items,
          alwaysVisible: section.alwaysVisible,
          narrative: narrative.filter(sentence => sentence && sentence.trim().length > 0),
        } satisfies SummarySection;
      })
      .filter(section =>
        section.items.length > 0 || (section.narrative && section.narrative.length > 0) || section.alwaysVisible,
      );

    const additionalItems = (Object.keys(data) as (keyof QuestionnaireData | string)[])
      .filter(field => !usedFields.has(field as string))
      .map(field => {
        const rawValue = (data as Partial<QuestionnaireData>)[field as keyof QuestionnaireData];
        const formattedValue = formatValue(rawValue);
        if (!formattedValue) return null;
        return {
          field: field as string,
          label: fieldLabels[field] ?? field,
          value: formattedValue,
        } satisfies SummaryItem;
      })
      .filter(Boolean) as SummaryItem[];

    if (additionalItems.length) {
      sections.push({
        title: 'Otro',
        items: additionalItems,
      });
    }

    return sections;
  }, [data]);

  const filledFieldCount = useMemo(
    () => summarySections.reduce((acc, section) => acc + section.items.length, 0),
    [summarySections],
  );

  const buildPlainTextSummary = useMemo(() => {
    const lines: string[] = [];
    summarySections.forEach(section => {
      lines.push(section.title);
      if (section.narrative && section.narrative.length > 0) {
        section.narrative.forEach(sentence => {
          lines.push(sentence);
        });
      } else if (section.items.length === 0) {
        lines.push('• Sin datos registrados');
      } else {
        section.items.forEach(item => {
          lines.push(`• ${item.label}: ${item.value}`);
        });
      }
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
        const items = section.narrative && section.narrative.length
          ? `
            <div class="narrative">
              ${section.narrative
                .map(
                  sentence => `
                    <p>${sentence}</p>
                  `,
                )
                .join('')}
            </div>
          `
          : section.items.length
            ? `
              <div class="items">
                ${section.items
                  .map(
                    item => `
                      <div class="item">
                        <div class="label">${item.label}</div>
                        <div class="value">${item.value}</div>
                      </div>
                    `,
                  )
                  .join('')}
              </div>
            `
            : '<p class="empty">Sin datos registrados</p>';
        return `
          <section class="section-card">
            <h2>${section.title}</h2>
            ${items}
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
          :root {
            --emerald-50: #ecfdf5;
            --emerald-100: #d1fae5;
            --emerald-200: #a7f3d0;
            --emerald-500: #10b981;
            --emerald-600: #059669;
            --slate-900: #0f172a;
            --slate-700: #334155;
            --slate-500: #64748b;
            --white: #ffffff;
          }

          * {
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', Arial, sans-serif;
            margin: 0;
            padding: 32px;
            background: linear-gradient(180deg, var(--emerald-50) 0%, #f8fffb 100%);
            color: var(--slate-900);
          }

          .page {
            max-width: 1080px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 28px;
          }

          header {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          h1 {
            font-size: 28px;
            font-weight: 700;
            color: var(--emerald-600);
            margin: 0;
          }

          .intro {
            font-size: 15px;
            color: var(--slate-700);
            margin: 0;
          }

          .summary-card {
            background: rgba(255, 255, 255, 0.85);
            border: 2px solid rgba(16, 185, 129, 0.25);
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 18px 40px rgba(4, 120, 87, 0.12);
            display: flex;
            flex-direction: column;
            gap: 18px;
          }

          .summary-card h2 {
            font-size: 18px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--emerald-600);
            margin: 0;
          }

          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
          }

          .summary-item {
            background: var(--white);
            border: 1px solid rgba(16, 185, 129, 0.2);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 10px 28px rgba(4, 120, 87, 0.1);
          }

          .summary-item .label {
            font-size: 12px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--slate-500);
            margin-bottom: 6px;
          }

          .summary-item .value {
            font-size: 16px;
            font-weight: 600;
            color: var(--slate-900);
          }

          .summary-note {
            font-size: 14px;
            color: var(--slate-500);
            margin: 0;
          }

          .sections-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
          }

          .section-card {
            background: rgba(236, 253, 245, 0.95);
            border: 2px solid rgba(16, 185, 129, 0.3);
            border-radius: 22px;
            padding: 22px 24px;
            box-shadow: 0 20px 44px rgba(4, 120, 87, 0.15);
            display: flex;
            flex-direction: column;
            gap: 18px;
            page-break-inside: avoid;
          }

          .section-card h2 {
            font-size: 18px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--emerald-600);
            margin: 0;
          }

          .items {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .item {
            background: var(--white);
            border: 1px solid rgba(16, 185, 129, 0.28);
            border-radius: 16px;
            padding: 16px 18px;
            box-shadow: 0 14px 30px rgba(4, 120, 87, 0.12);
          }

          .label {
            font-size: 12px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--slate-500);
            font-weight: 600;
            margin-bottom: 8px;
          }

          .value {
            font-size: 17px;
            font-weight: 600;
            color: var(--slate-900);
          }

          .narrative {
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-size: 15px;
            line-height: 1.6;
            color: var(--slate-700);
          }

          .narrative p {
            margin: 0;
          }

          .empty {
            font-size: 14px;
            font-style: italic;
            color: var(--slate-500);
          }

          footer {
            margin-top: 16px;
            font-size: 12px;
            color: var(--slate-500);
            text-align: center;
          }

          @media print {
            body {
              padding: 20mm;
              background: var(--white);
            }

            .summary-card,
            .section-card {
              box-shadow: none;
            }

            .item,
            .summary-item {
              box-shadow: none;
            }

            .sections-grid {
              gap: 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <header>
            <h1>Resumen del cuestionario</h1>
            <p class="intro">Información lista para incorporar a la historia clínica.</p>
          </header>

          <section class="summary-card">
            <h2>Información general</h2>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="label">Fecha de exportación</div>
                <div class="value">${generatedAt}</div>
              </div>
              <div class="summary-item">
                <div class="label">Campos completados</div>
                <div class="value">${filledFieldCount}</div>
              </div>
            </div>
            <p class="summary-note">Revise cada bloque para trasladar la información a la historia clínica.</p>
          </section>

          <div class="sections-grid">
            ${rows}
          </div>

          <footer>
            <p>Exportado desde Opti Flow Wiz.</p>
          </footer>
        </div>
      </body>
    </html>`;
  }, [completionTimestamp, summarySections, filledFieldCount]);

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
      case 7: // Medication (tratamientos sistémicos)
        if (!data.medications_any) {
          toast.error('Por favor indique si sigue tratamiento sistémico con posible impacto ocular');
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
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm print:hidden">
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
      <main className="container max-w-5xl mx-auto px-6 py-8 pb-32 print:hidden">
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
        <DialogContent className="max-w-3xl sm:max-w-4xl overflow-hidden p-0 print-dialog-content">
          <div className="flex max-h-[85vh] flex-col print:block print:max-h-none">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                Cuestionario guardado
              </DialogTitle>
              <DialogDescription>
                Descargue o imprima el resumen para incorporarlo a la historia clínica.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 pb-6 print:overflow-visible print:px-6 print:pb-6">
              <div className="grid gap-6 pr-2 print:gap-4 print:pr-0 print-summary-container">
                <Card className="border-primary/30 bg-primary/5 shadow-sm print-summary-section">
                  <CardHeader className="pb-2 print:p-4 print:pb-2 print:pt-4">
                    <CardTitle className="text-xl font-semibold text-primary print:text-lg">
                      Resumen del cuestionario
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2 text-sm text-muted-foreground print:p-4 print:pt-0 print:text-xs print:gap-1">
                    <p className="text-base text-foreground print:text-sm">
                      Fecha de exportación:{' '}
                      {completionTimestamp
                        ? new Date(completionTimestamp).toLocaleString()
                        : new Date().toLocaleString()}
                    </p>
                    <p className="text-base print:text-sm">
                      Campos completados:{' '}
                      <span className="font-semibold text-foreground">{filledFieldCount}</span>
                    </p>
                    <p className="print:text-sm">
                      Revise cada bloque para traspasar la información rápidamente a la historia clínica.
                    </p>
                  </CardContent>
                </Card>

                <div className="grid gap-5 lg:grid-cols-2 print-summary-grid">
                  {summarySections.map(section => (
                    <Card
                      key={section.title}
                      className="border-2 border-primary/15 bg-card/90 shadow-lg transition hover:border-primary/40 print-summary-section print:border print:border-primary/25 print:bg-white"
                    >
                      <CardHeader className="border-b border-primary/10 bg-primary/5 pb-4 print:p-4 print:pb-2 print:bg-white print:border-primary/20">
                        <CardTitle className="text-lg font-semibold uppercase tracking-wider text-primary print:text-base">
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 p-6 print:p-4 print:space-y-2 print-summary-content">
                        {section.narrative && section.narrative.length > 0 ? (
                          <div className="space-y-3 text-base leading-relaxed text-foreground print:space-y-2 print:text-sm">
                            {section.narrative.map(sentence => (
                              <p key={`${section.title}-${sentence}`}>{sentence}</p>
                            ))}
                          </div>
                        ) : section.items.length > 0 ? (
                          <dl className="grid gap-4 print:gap-2 print-summary-items">
                            {section.items.map(item => (
                              <div
                                key={`${section.title}-${item.label}`}
                                className="rounded-lg border border-border/60 bg-background/80 p-4 shadow-sm print:p-3 print-summary-item"
                              >
                                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground print:text-[11px]">
                                  {item.label}
                                </dt>
                                <dd className="text-lg font-semibold text-foreground print:text-sm">{item.value}</dd>
                              </div>
                            ))}
                          </dl>
                        ) : (
                          <p className="text-sm italic text-muted-foreground print:text-xs">
                            Sin datos registrados en esta sección.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 border-t border-border bg-background px-6 py-4 print:hidden">
              <Button onClick={handlePrint} variant="glassPrimary" className="flex items-center gap-2 px-5">
                <Printer className="h-4 w-4" />
                Imprimir / Guardar PDF
              </Button>
              <Button onClick={handleDownloadTxt} variant="glass" className="flex items-center gap-2 px-5">
                <FileText className="h-4 w-4" />
                Descargar resumen (.txt)
              </Button>
              <Button onClick={handleDownloadJson} variant="glass" className="flex items-center gap-2 px-5">
                <Download className="h-4 w-4" />
                Descargar datos (.json)
              </Button>
              <Button onClick={handleReset} variant="glass" className="px-5">
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
