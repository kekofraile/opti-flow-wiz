import React, { useMemo } from 'react';
import { StepWrapper } from '../StepWrapper';
import { ChoiceField } from '../ChoiceField';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Pill } from 'lucide-react';
import {
  MEDICATION_GROUP_LABELS,
  MEDICATION_GROUPS,
  MEDICATION_TIMING_OPTIONS,
  MedicationGroup,
  MedicationTimingOption,
} from '../medicationConstants';

interface QuestionnaireDataUpdates {
  medications_groups?: string[];
  medications_timing?: Record<string, MedicationTimingOption> | undefined;
  medications_cortico_routes?: string[] | undefined;
  medications_cortico_pio?: string | undefined;
  medications_antidiabeticos_tipo?: string[] | undefined;
  medications_antihipertensivos_tipo?: string[] | undefined;
  medications_anticonvulsivos_sub?: string[] | undefined;
  medications_antimalaricos_sub?: string[] | undefined;
  medications_antituberculosos_sub?: string[] | undefined;
  medications_bisfosfonatos_via?: string | undefined;
  medications_hcq_duracion?: string | undefined;
  medications_tamsulosina_cirugia?: string | undefined;
  medications_anticoagulante_tipo?: string | undefined;
}

const DEPENDENT_FIELDS: (keyof QuestionnaireDataUpdates)[] = [
  'medications_cortico_routes',
  'medications_cortico_pio',
  'medications_antidiabeticos_tipo',
  'medications_antihipertensivos_tipo',
  'medications_anticonvulsivos_sub',
  'medications_antimalaricos_sub',
  'medications_antituberculosos_sub',
  'medications_bisfosfonatos_via',
  'medications_hcq_duracion',
  'medications_tamsulosina_cirugia',
  'medications_anticoagulante_tipo',
];

const {
  ANTIHISTAMINICOS,
  ANTIDEPRESIVOS,
  ANTIPSICOTICOS,
  CORTICOESTEROIDES,
  ANTIDIABETICOS,
  ANTIHIPERTENSIVOS,
  ALFA_BLOQUEANTES,
  ANTICOAGULANTES,
  INHIBIDORES_PDE5,
  ANTICONVULSIVOS,
  ANTIMALARICOS,
  ANTIARRITMICOS,
  GLUCOSIDOS_CARDIACOS,
  BISFOSFONATOS,
  RETINOIDES,
  ANTITUBERCULOSOS,
  TERAPIA_HORMONAL,
  OTROS,
  NINGUNO,
} = MEDICATION_GROUP_LABELS;

const GROUP_DEPENDENCIES: Record<MedicationGroup, (keyof QuestionnaireDataUpdates)[]> = {
  [ANTIHISTAMINICOS]: [],
  [ANTIDEPRESIVOS]: [],
  [ANTIPSICOTICOS]: [],
  [CORTICOESTEROIDES]: ['medications_cortico_routes', 'medications_cortico_pio'],
  [ANTIDIABETICOS]: ['medications_antidiabeticos_tipo'],
  [ANTIHIPERTENSIVOS]: ['medications_antihipertensivos_tipo'],
  [ALFA_BLOQUEANTES]: ['medications_tamsulosina_cirugia'],
  [ANTICOAGULANTES]: ['medications_anticoagulante_tipo'],
  [INHIBIDORES_PDE5]: [],
  [ANTICONVULSIVOS]: ['medications_anticonvulsivos_sub'],
  [ANTIMALARICOS]: ['medications_antimalaricos_sub', 'medications_hcq_duracion'],
  [ANTIARRITMICOS]: [],
  [GLUCOSIDOS_CARDIACOS]: [],
  [BISFOSFONATOS]: ['medications_bisfosfonatos_via'],
  [RETINOIDES]: [],
  [ANTITUBERCULOSOS]: ['medications_antituberculosos_sub'],
  [TERAPIA_HORMONAL]: [],
  [OTROS]: [],
  [NINGUNO]: [],
};

export const MedicationStep: React.FC = () => {
  const { data, updateField } = useQuestionnaire();

  const selectedGroups = useMemo(() => {
    if (data.medications_any !== 'Sí') return [] as MedicationGroup[];
    if (!data.medications_groups) return [] as MedicationGroup[];
    return (Array.isArray(data.medications_groups) ? data.medications_groups : []) as MedicationGroup[];
  }, [data.medications_any, data.medications_groups]);

  const cleanDependentFields = (groupsToClear: MedicationGroup[] | 'ALL') => {
    const fieldsToClear = new Set<keyof QuestionnaireDataUpdates>();

    if (groupsToClear === 'ALL') {
      DEPENDENT_FIELDS.forEach((field) => fieldsToClear.add(field));
    } else {
      groupsToClear.forEach((group) => {
        GROUP_DEPENDENCIES[group].forEach((field) => fieldsToClear.add(field));
      });
    }

    fieldsToClear.forEach((field) => updateField(field, undefined));
  };

  const handleAnyChange = (value: string | string[]) => {
    const selected = Array.isArray(value) ? value[0] : value;
    const normalized = selected ?? undefined;

    updateField('medications_any', normalized);

    if (normalized !== 'Sí') {
      updateField('medications_groups', undefined);
      updateField('medications_timing', undefined);
      cleanDependentFields('ALL');
    }
  };

  const handleGroupChange = (value: string | string[]) => {
    if (data.medications_any !== 'Sí') return;

    const newSelection = (Array.isArray(value) ? value : [value]).filter(Boolean) as MedicationGroup[];

    if (newSelection.includes(NINGUNO)) {
      updateField('medications_groups', [NINGUNO]);
      updateField('medications_timing', undefined);
      cleanDependentFields('ALL');
      return;
    }

    const removedGroups = selectedGroups.filter((group) => !newSelection.includes(group));

    updateField('medications_groups', newSelection.length > 0 ? newSelection : undefined);

    if (removedGroups.length > 0) {
      const currentTiming = { ...(data.medications_timing || {}) };
      removedGroups.forEach((group) => {
        delete currentTiming[group];
      });
      updateField('medications_timing', Object.keys(currentTiming).length > 0 ? currentTiming : undefined);
      cleanDependentFields(removedGroups);
    }
  };

  const handleTimingChange = (group: MedicationGroup, option: string | string[]) => {
    const selected = Array.isArray(option) ? option[0] : option;
    const newTiming = {
      ...(data.medications_timing || {}),
      [group]: selected as MedicationTimingOption,
    };
    updateField('medications_timing', newTiming);
  };

  const shouldShowGroup = (group: MedicationGroup) => data.medications_any === 'Sí' && selectedGroups.includes(group);

  const activeGroups = useMemo(
    () =>
      data.medications_any === 'Sí'
        ? MEDICATION_GROUPS.filter(
            (group): group is MedicationGroup => group !== NINGUNO && selectedGroups.includes(group as MedicationGroup)
          )
        : [],
    [data.medications_any, selectedGroups]
  );

  const showMedicationDetails = data.medications_any === 'Sí';

  return (
    <StepWrapper
      title="Medicación con posible impacto ocular"
      subtitle="Seleccione los grupos de fármacos pertinentes y aportaremos alertas útiles en gabinete"
    >
      <div className="flex items-center gap-3 mb-6">
        <Pill className="w-8 h-8 text-primary" />
        <h3 className="text-xl font-semibold">Tratamientos sistémicos y riesgo ocular</h3>
      </div>

      <ChoiceField
        label="¿Toma actualmente o ha tomado en los últimos 6 meses medicación sistémica con posible impacto ocular?"
        options={['Sí', 'No']}
        value={data.medications_any}
        onChange={handleAnyChange}
      />

      {showMedicationDetails && (
        <ChoiceField
          label="Seleccione los grupos que aplica"
          options={[...MEDICATION_GROUPS]}
          value={data.medications_groups}
          onChange={handleGroupChange}
          multiple
          exclusiveOptions={[NINGUNO]}
        />
      )}

      {showMedicationDetails && activeGroups.length > 0 && (
        <div className="mt-8 space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Momento de uso</h4>
          <p className="text-sm text-muted-foreground">
            Indique el periodo de uso para cada grupo seleccionado.
          </p>
          <div className="space-y-6">
            {activeGroups.map((group) => (
              <ChoiceField
                key={group}
                label={group}
                options={[...MEDICATION_TIMING_OPTIONS]}
                value={data.medications_timing?.[group]}
                onChange={(value) => handleTimingChange(group, value)}
              />
            ))}
          </div>
        </div>
      )}

      {shouldShowGroup(CORTICOESTEROIDES) && (
        <div className="mt-8 space-y-6">
          <ChoiceField
            label="Corticoesteroides · Vía"
            options={[
              'Colirio oftálmico esteroide',
              'Vía oral/inyectable',
              'Inhalador',
              'Intranasal',
              'Crema periocular',
              'Desconozco',
            ]}
            value={data.medications_cortico_routes}
            onChange={(value) => updateField('medications_cortico_routes', value)}
            multiple
            exclusiveOptions={['Desconozco']}
          />

          <ChoiceField
            label="¿Controles previos de PIO?"
            options={['Sí', 'No', 'Desconozco']}
            value={data.medications_cortico_pio}
            onChange={(value) => updateField('medications_cortico_pio', value)}
          />
        </div>
      )}

      {shouldShowGroup(ANTIDIABETICOS) && (
        <div className="mt-8">
          <ChoiceField
            label="Antidiabéticos · Tipo"
            options={[
              'Insulina',
              'Metformina',
              'Sulfonilureas',
              'Inhibidores SGLT2',
              'Agonistas GLP-1',
              'Glitazonas (tiazolidinedionas)',
              'Otros (no listado)',
            ]}
            value={data.medications_antidiabeticos_tipo}
            onChange={(value) => updateField('medications_antidiabeticos_tipo', value)}
            multiple
          />
        </div>
      )}

      {shouldShowGroup(ANTIHIPERTENSIVOS) && (
        <div className="mt-8">
          <ChoiceField
            label="Antihipertensivos · Tipo"
            options={['Betabloqueantes', 'Diuréticos', 'Otros (no listado)']}
            value={data.medications_antihipertensivos_tipo}
            onChange={(value) => updateField('medications_antihipertensivos_tipo', value)}
            multiple
          />
        </div>
      )}

      {shouldShowGroup(ANTICONVULSIVOS) && (
        <div className="mt-8">
          <ChoiceField
            label="Anticonvulsivos · Subgrupo"
            options={['Topiramato', 'Vigabatrina', 'Otros (no listado)']}
            value={data.medications_anticonvulsivos_sub}
            onChange={(value) => updateField('medications_anticonvulsivos_sub', value)}
            multiple
          />
        </div>
      )}

      {shouldShowGroup(ANTIMALARICOS) && (
        <div className="mt-8 space-y-6">
          <ChoiceField
            label="Antimaláricos/inmunomoduladores"
            options={['Hidroxicloroquina', 'Cloroquina', 'Otros (no listado)']}
            value={data.medications_antimalaricos_sub}
            onChange={(value) => {
              updateField('medications_antimalaricos_sub', value);
              const selected = Array.isArray(value) ? value : value ? [value] : [];
              if (!selected.includes('Hidroxicloroquina')) {
                updateField('medications_hcq_duracion', undefined);
              }
            }}
            multiple
          />

          {data.medications_antimalaricos_sub?.includes('Hidroxicloroquina') && (
            <ChoiceField
              label="Hidroxicloroquina · Tiempo de uso"
              options={['< 1 año', '1–5 años', '> 5 años', 'Desconozco']}
              value={data.medications_hcq_duracion}
              onChange={(value) => updateField('medications_hcq_duracion', value)}
            />
          )}
        </div>
      )}

      {shouldShowGroup(ANTITUBERCULOSOS) && (
        <div className="mt-8">
          <ChoiceField
            label="Antituberculosos"
            options={['Etambutol', 'Isoniazida', 'Otros (no listado)']}
            value={data.medications_antituberculosos_sub}
            onChange={(value) => updateField('medications_antituberculosos_sub', value)}
            multiple
          />
        </div>
      )}

      {shouldShowGroup(BISFOSFONATOS) && (
        <div className="mt-8">
          <ChoiceField
            label="Bisfosfonatos · Vía"
            options={['Oral (alendronato/risedronato…)', 'Intravenoso (zoledrónico…)', 'Desconozco']}
            value={data.medications_bisfosfonatos_via}
            onChange={(value) => updateField('medications_bisfosfonatos_via', value)}
          />
        </div>
      )}

      {shouldShowGroup(ALFA_BLOQUEANTES) && (
        <div className="mt-8">
          <ChoiceField
            label="¿Tiene programada cirugía de cataratas?"
            options={['Sí', 'No', 'Desconozco']}
            value={data.medications_tamsulosina_cirugia}
            onChange={(value) => updateField('medications_tamsulosina_cirugia', value)}
          />
        </div>
      )}

      {shouldShowGroup(ANTICOAGULANTES) && (
        <div className="mt-8">
          <ChoiceField
            label="Anticoagulantes/antiagregantes · Tipo"
            options={[
              'Anticoagulante clásico (warfarina/acenocumarol)',
              'ACOD (apixabán/dabigatrán/edoxabán/rivaroxabán)',
              'Antiagregante (aspirina/clopidogrel)',
              'Desconozco',
            ]}
            value={data.medications_anticoagulante_tipo}
            onChange={(value) => updateField('medications_anticoagulante_tipo', value)}
          />
        </div>
      )}
    </StepWrapper>
  );
};
