import React, { useMemo } from 'react';
import { StepWrapper } from '../StepWrapper';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit, AlertCircle, CheckCircle2, AlertTriangle, AlertOctagon, ClipboardList } from 'lucide-react';
import { MEDICATION_GROUP_LABELS, MEDICATION_GROUPS } from '../medicationConstants';
import { buildAutoRecommendations, AggregatedRecommendationAction } from '@/lib/recommendations';

type NoteSeverity = 'info' | 'warning' | 'critical';

export const ReviewStep: React.FC = () => {
  const { data, updateField, setCurrentStep } = useQuestionnaire();

  const autoRecommendations = useMemo(() => buildAutoRecommendations(data), [data]);
  const autoRecommendationActions = autoRecommendations.actions;
  const diagnosticActions = autoRecommendationActions.filter((action) => action.type === 'diagnostic');
  const managementActions = autoRecommendationActions.filter((action) => action.type === 'management');
  const counselingActions = autoRecommendationActions.filter((action) => action.type === 'counseling');
  const actionSections: { title: string; items: AggregatedRecommendationAction[] }[] = [
    { title: 'Pruebas / exploraciones', items: diagnosticActions },
    { title: 'Gestión y seguimiento', items: managementActions },
    { title: 'Consejos al paciente', items: counselingActions },
  ].filter((section) => section.items.length > 0);
  const hasAutoRecommendations = autoRecommendationActions.length > 0;
  const autoAlertActions = autoRecommendationActions.filter((action) => action.severity !== 'info');

  const {
    ANTIHISTAMINICOS,
    ANTIDEPRESIVOS,
    ANTIPSICOTICOS,
    CORTICOESTEROIDES,
    ALFA_BLOQUEANTES,
    ANTICOAGULANTES,
    INHIBIDORES_PDE5,
    ANTICONVULSIVOS,
    ANTIARRITMICOS,
    GLUCOSIDOS_CARDIACOS,
    BISFOSFONATOS,
    RETINOIDES,
    TERAPIA_HORMONAL,
    NINGUNO,
  } = MEDICATION_GROUP_LABELS;

  const getSeverityIcon = (severity: NoteSeverity) => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="w-5 h-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-300" />;
      default:
        return <AlertCircle className="w-5 h-5 text-primary" />;
    }
  };

  const getSeverityTextClass = (severity: NoteSeverity) => {
    switch (severity) {
      case 'critical':
        return 'text-destructive';
      case 'warning':
        return 'text-amber-600 dark:text-amber-300';
      default:
        return 'text-primary';
    }
  };

  const renderActionSection = (section: { title: string; items: AggregatedRecommendationAction[] }) => (
    <div key={section.title} className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground">{section.title}</h4>
      <div className="space-y-4">
        {section.items.map((action) => (
          <div key={action.key} className="space-y-2">
            <div className="flex items-start gap-3">
              {getSeverityIcon(action.severity)}
              <div>
                <p className={`font-medium ${getSeverityTextClass(action.severity)}`}>{action.label}</p>
                {action.description && (
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                )}
              </div>
            </div>
            {action.reasons.length > 0 && (
              <ul className="ml-8 list-disc space-y-1 text-xs text-muted-foreground">
                {action.reasons.map((reason, index) => (
                  <li key={`${action.key}-reason-${index}`}>{reason}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const hints: { text: string; severity: NoteSeverity }[] = [];

  if (data.screens && ['4–8 h', '> 8 h'].includes(data.screens)) {
    hints.push({
      text: 'Uso intensivo de pantallas: valorar protección/AR y visión intermedia.',
      severity: 'info',
    });
  }

  if (data.night_drive && ['Sí, habitualmente', 'A veces'].includes(data.night_drive)) {
    hints.push({
      text: 'Conducción nocturna: revisar deslumbramiento y contrastes.',
      severity: 'info',
    });
  }

  if (data.photophobia === 'Sí, mucha') {
    hints.push({
      text: 'Alta sensibilidad a la luz: considerar fotocromáticas/polarizadas.',
      severity: 'info',
    });
  }

  autoAlertActions.forEach((action) => {
    const reason = action.reasons[0];
    const baseText = action.description ? `${action.label} — ${action.description}` : action.label;
    const text = reason ? `${baseText}. Motivo: ${reason}` : baseText;
    if (!hints.some((hint) => hint.text === text)) {
      hints.push({ text, severity: action.severity as NoteSeverity });
    }
  });

  const medGroupsRaw = data.medications_groups ?? [];
  const hasMedicationData = data.medications_groups !== undefined;
  const hasNone = medGroupsRaw.includes(NINGUNO);
  const medGroups = hasNone ? [] : medGroupsRaw;
  const orderedMedicationGroups = MEDICATION_GROUPS.filter(
    (group) => group !== NINGUNO && medGroups.includes(group)
  );
  const medicationGroupRowValue = hasNone
    ? NINGUNO
    : orderedMedicationGroups.length
      ? orderedMedicationGroups
          .map((group) => {
            const timing = data.medications_timing?.[group];
            return timing ? `${group} — ${timing}` : group;
          })
          .join('; ')
      : hasMedicationData
        ? 'Sin detallar'
        : 'Sin indicar';

  const medicationNotes: { text: string; severity: NoteSeverity }[] = [];
  const addNote = (text: string, severity: NoteSeverity = 'info') => {
    if (!medicationNotes.some((note) => note.text === text)) {
      medicationNotes.push({ text, severity });
    }
  };

  const drynessGroups = new Set([ANTIHISTAMINICOS, ANTIDEPRESIVOS, ANTIPSICOTICOS]);
  const antihipertensiveDryTypes = data.medications_antihipertensivos_tipo || [];
  if (
    medGroups.some((group) => drynessGroups.has(group)) ||
    antihipertensiveDryTypes.some((type) => ['Betabloqueantes', 'Diuréticos'].includes(type))
  ) {
    addNote('Posible ojo seco/visión borrosa. Valorar DED y estabilidad refractiva.', 'info');
  }

  if (medGroups.includes(CORTICOESTEROIDES)) {
    addNote('Vigilar PIO y catarata subcapsular en uso de corticoesteroides. Programar tonometría y lámpara de hendidura.', 'warning');
    if (data.medications_cortico_routes?.includes('Colirio oftálmico esteroide')) {
      addNote('Medir PIO hoy / próxima visita por uso de colirio esteroide.', 'warning');
    }
  }

  const antidiabeticTypes = data.medications_antidiabeticos_tipo || [];
  if (antidiabeticTypes.includes('Agonistas GLP-1')) {
    addNote('En diabéticos con RD previa, vigilar posible empeoramiento con control glucémico rápido (agonistas GLP-1).', 'info');
  }
  if (antidiabeticTypes.includes('Glitazonas (tiazolidinedionas)')) {
    addNote('Glitazonas: vigilar edema macular si hay RD/DME o síntomas compatibles.', 'warning');
  }
  const hasDiabetes = data.systemic?.includes('Diabetes');
  const hasRetinopathy = data.ocular_dx?.includes('Retinopatía diabética');
  if (
    hasRetinopathy &&
    hasDiabetes &&
    (antidiabeticTypes.includes('Agonistas GLP-1') || antidiabeticTypes.includes('Glitazonas (tiazolidinedionas)'))
  ) {
    addNote('Control funduscopia/mácula y advertir sobre fluctuaciones refractivas ante cambios metabólicos rápidos.', 'warning');
  }

  if (medGroups.includes(ALFA_BLOQUEANTES)) {
    addNote('Alfa-1 bloqueantes: anotar en preoperatorio de catarata por riesgo de IFIS; informar al cirujano.', 'warning');
    if (data.medications_tamsulosina_cirugia === 'Sí') {
      addNote('Avisar al cirujano (IFIS probable en cirugía de catarata con tamsulosina).', 'warning');
    }
  }

  if (medGroups.includes(ANTICOAGULANTES)) {
    addNote('Precaución por tendencia a sangrado ocular; coordinar procedimientos invasivos con el médico prescriptor.', 'warning');
  }

  if (medGroups.includes(INHIBIDORES_PDE5)) {
    addNote('Inhibidores PDE-5: posibles alteraciones del color/fotofobia transitorias; NAION rara, derivar si pérdida visual súbita.', 'info');
  }

  const anticonvulsantSub = data.medications_anticonvulsivos_sub || [];
  if (anticonvulsantSub.includes('Topiramato')) {
    addNote('Topiramato: riesgo de miopía súbita/cierre angular; urgencia si dolor ocular o borrosidad aguda.', 'warning');
    const topiramateActive = data.medications_timing?.[ANTICONVULSIVOS] === 'En curso';
    const topiramateSymptoms = data.symptoms_list?.some((symptom) =>
      ['Visión borrosa de lejos', 'Visión borrosa de cerca', 'Ojos rojos / irritación'].includes(symptom)
    );
    if (topiramateActive && topiramateSymptoms) {
      addNote('Alerta roja: sospecha de cierre angular inducido por topiramato. Evaluar de urgencia.', 'critical');
    }
  }
  if (anticonvulsantSub.includes('Vigabatrina')) {
    addNote('Vigabatrina: riesgo de constricción del campo visual; considerar campimetría si síntomas.', 'warning');
  }

  const antimalaricSub = data.medications_antimalaricos_sub || [];
  if (antimalaricSub.includes('Hidroxicloroquina') || antimalaricSub.includes('Cloroquina')) {
    addNote('Antimaláricos: riesgo de retinopatía macular; mantener cribado según guías.', 'warning');
  }
  if (antimalaricSub.includes('Hidroxicloroquina') && data.medications_hcq_duracion === '> 5 años') {
    addNote('Hidroxicloroquina >5 años: programar cribado anual (CV 10-2, SD-OCT, FAF).', 'warning');
  }

  if (medGroups.includes(ANTIARRITMICOS)) {
    addNote('Amiodarona: verticilata corneal frecuente y neuropatía óptica rara; revisar AV y campos visuales.', 'info');
  }

  if (medGroups.includes(GLUCOSIDOS_CARDIACOS)) {
    addNote('Digoxina: posibles xantopsia, halos y fotopsias; vigilar cambios cromáticos.', 'info');
  }

  if (medGroups.includes(BISFOSFONATOS)) {
    addNote('Bisfosfonatos: vigilar signos de uveítis/escleritis; derivar si ojo rojo doloroso persistente.', 'warning');
  }

  if (medGroups.includes(RETINOIDES)) {
    addNote('Isotretinoína: alto riesgo de ojo seco evaporativo y posible intolerancia a lentes de contacto.', 'warning');
  }

  const antitbSub = data.medications_antituberculosos_sub || [];
  if (antitbSub.includes('Etambutol')) {
    addNote('Etambutol: riesgo de neuritis óptica (discromatopsia rojo-verde, escotoma central).', 'warning');
  }

  if (medGroups.includes(TERAPIA_HORMONAL)) {
    addNote('Tamoxifeno: riesgo de retinopatía cristalina y edema macular; valorar control macular periódico.', 'warning');
  }

  medicationNotes
    .filter((note) => note.severity !== 'info')
    .forEach((note) => {
      if (!hints.some((hint) => hint.text === note.text)) {
        hints.push({ text: note.text, severity: note.severity });
      }
    });

  const medicationSection = {
    title: 'Medicación con posible impacto ocular',
    step: 7,
    data: [
      { label: 'Grupos y momento de uso', value: medicationGroupRowValue },
      { label: 'Corticoesteroides · Vía', value: data.medications_cortico_routes?.join(', ') },
      { label: 'Controles previos de PIO', value: data.medications_cortico_pio },
      { label: 'Antidiabéticos · Tipo', value: antidiabeticTypes.join(', ') || undefined },
      { label: 'Antihipertensivos · Tipo', value: antihipertensiveDryTypes.join(', ') || undefined },
      { label: 'Anticonvulsivos · Subgrupo', value: anticonvulsantSub.join(', ') || undefined },
      { label: 'Antimaláricos/inmunomoduladores', value: antimalaricSub.join(', ') || undefined },
      { label: 'Hidroxicloroquina · Tiempo de uso', value: data.medications_hcq_duracion },
      { label: 'Antituberculosos', value: antitbSub.join(', ') || undefined },
      { label: 'Bisfosfonatos · Vía', value: data.medications_bisfosfonatos_via },
      { label: 'Cirugía de cataratas programada', value: data.medications_tamsulosina_cirugia },
      { label: 'Anticoagulantes/antiagregantes · Tipo', value: data.medications_anticoagulante_tipo },
    ],
  };

  const safetyConsiderations = [
    'No suspenda ni modifique medicación sin consultar a su médico.',
    'Algunos efectos visuales pueden ser transitorios; otros requieren valoración urgente si hay dolor ocular o pérdida visual súbita.',
  ];

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
    medicationSection,
    {
      title: 'Hábitos visuales',
      step: 8,
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
      {hasAutoRecommendations && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="w-5 h-5 text-primary" />
              Pruebas y actuaciones recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            {actionSections.map((section) => renderActionSection(section))}
          </CardContent>
        </Card>
      )}

      {hints.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Recomendaciones personalizadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {hints.map((hint, index) => {
              const severity = hint.severity ?? 'info';
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 text-sm ${getSeverityTextClass(severity)}`}
                >
                  {getSeverityIcon(severity)}
                  <span>{hint.text}</span>
                </div>
              );
            })}
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

        {medicationNotes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notas clínicas automáticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {medicationNotes.map((note, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 text-sm ${getSeverityTextClass(note.severity)}`}
                >
                  {getSeverityIcon(note.severity)}
                  <span>{note.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

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
