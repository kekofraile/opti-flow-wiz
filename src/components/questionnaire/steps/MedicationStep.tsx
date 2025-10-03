import React, { useMemo } from 'react';
import { StepWrapper } from '../StepWrapper';
import { ChoiceField } from '../ChoiceField';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { Pill } from 'lucide-react';
import {
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

const GROUP_DEPENDENCIES: Record<MedicationGroup, (keyof QuestionnaireDataUpdates)[]> = {
  'Antihistamínicos (alergia)': [],
  'Antidepresivos (tricíclicos, ISRS/IRSN, IMAO)': [],
  'Antipsicóticos (típicos/atípicos)': [],
  'Corticoesteroides (cualquier vía, incluidos colirios esteroides)': [
    'medications_cortico_routes',
    'medications_cortico_pio',
  ],
  'Antidiabéticos (insulina, metformina, sulfonilureas, SGLT2, GLP-1, glitazonas)': [
    'medications_antidiabeticos_tipo',
  ],
  'Antihipertensivos (betabloqueantes, diuréticos)': [
    'medications_antihipertensivos_tipo',
  ],
  'Alfa-1 bloqueantes para próstata (p. ej., tamsulosina, alfuzosina, doxazosina)': [
    'medications_tamsulosina_cirugia',
  ],
  'Anticoagulantes/antiagregantes (warfarina/acenocumarol, ACOD; aspirina, clopidogrel, etc.)': [
    'medications_anticoagulante_tipo',
  ],
  'Inhibidores PDE-5 (disfunción eréctil)': [],
  'Anticonvulsivos/neuromoduladores (topiramato, vigabatrina, otros)': [
    'medications_anticonvulsivos_sub',
  ],
  'Antimaláricos/inmunomoduladores (hidroxicloroquina/cloroquina)': [
    'medications_antimalaricos_sub',
    'medications_hcq_duracion',
  ],
  'Antiarrítmicos (amiodarona)': [],
  'Glucósidos cardiacos (digoxina)': [],
  'Bisfosfonatos (alendronato/risedronato/zoledrónico)': [
    'medications_bisfosfonatos_via',
  ],
  'Retinoides sistémicos (isotretinoína)': [],
  'Antituberculosos (etambutol, isoniazida)': [
    'medications_antituberculosos_sub',
  ],
  'Terapia hormonal (tamoxifeno)': [],
  'Otros (no listado)': [],
  'Ninguno': [],
};

export const MedicationStep: React.FC = () => {
  const { data, updateField } = useQuestionnaire();

  const selectedGroups = useMemo(() => {
    if (!data.medications_groups) return [] as MedicationGroup[];
    return (Array.isArray(data.medications_groups) ? data.medications_groups : []) as MedicationGroup[];
  }, [data.medications_groups]);

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

  const handleGroupChange = (value: string | string[]) => {
    const newSelection = (Array.isArray(value) ? value : [value]).filter(Boolean) as MedicationGroup[];

    if (newSelection.includes('Ninguno')) {
      updateField('medications_groups', ['Ninguno']);
      updateField('medications_timing', undefined);
      cleanDependentFields('ALL');
      return;
    }

    const removedGroups = selectedGroups.filter((group) => !newSelection.includes(group));

    updateField('medications_groups', newSelection);

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

  const shouldShowGroup = (group: MedicationGroup) => selectedGroups.includes(group);

  const activeGroups = useMemo(
    () =>
      MEDICATION_GROUPS.filter(
        (group): group is MedicationGroup => group !== 'Ninguno' && selectedGroups.includes(group as MedicationGroup)
      ),
    [selectedGroups]
  );

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
        label="¿Toma actualmente o ha tomado en los últimos 6 meses alguno de estos grupos?"
        options={[...MEDICATION_GROUPS]}
        value={data.medications_groups}
        onChange={handleGroupChange}
        multiple
        exclusiveOptions={['Ninguno']}
      />

      {activeGroups.length > 0 && (
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

      {shouldShowGroup('Corticoesteroides (cualquier vía, incluidos colirios esteroides)') && (
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

      {shouldShowGroup('Antidiabéticos (insulina, metformina, sulfonilureas, SGLT2, GLP-1, glitazonas)') && (
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

      {shouldShowGroup('Antihipertensivos (betabloqueantes, diuréticos)') && (
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

      {shouldShowGroup('Anticonvulsivos/neuromoduladores (topiramato, vigabatrina, otros)') && (
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

      {shouldShowGroup('Antimaláricos/inmunomoduladores (hidroxicloroquina/cloroquina)') && (
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

      {shouldShowGroup('Antituberculosos (etambutol, isoniazida)') && (
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

      {shouldShowGroup('Bisfosfonatos (alendronato/risedronato/zoledrónico)') && (
        <div className="mt-8">
          <ChoiceField
            label="Bisfosfonatos · Vía"
            options={['Oral (alendronato/risedronato…)', 'Intravenoso (zoledrónico…)', 'Desconozco']}
            value={data.medications_bisfosfonatos_via}
            onChange={(value) => updateField('medications_bisfosfonatos_via', value)}
          />
        </div>
      )}

      {shouldShowGroup('Alfa-1 bloqueantes para próstata (p. ej., tamsulosina, alfuzosina, doxazosina)') && (
        <div className="mt-8">
          <ChoiceField
            label="¿Tiene programada cirugía de cataratas?"
            options={['Sí', 'No', 'Desconozco']}
            value={data.medications_tamsulosina_cirugia}
            onChange={(value) => updateField('medications_tamsulosina_cirugia', value)}
          />
        </div>
      )}

      {shouldShowGroup('Anticoagulantes/antiagregantes (warfarina/acenocumarol, ACOD; aspirina, clopidogrel, etc.)') && (
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
