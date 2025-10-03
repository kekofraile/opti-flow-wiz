export const MEDICATION_GROUP_LABELS = {
  ANTIHISTAMINICOS: 'Antihistamínicos (alergia)',
  ANTIDEPRESIVOS: 'Antidepresivos (tricíclicos, ISRS/IRSN, IMAO)',
  ANTIPSICOTICOS: 'Antipsicóticos (típicos/atípicos)',
  CORTICOESTEROIDES: 'Corticoesteroides (cualquier vía, incluidos colirios esteroides)',
  ANTIDIABETICOS: 'Antidiabéticos (insulina, metformina, sulfonilureas, SGLT2, GLP-1, glitazonas)',
  ANTIHIPERTENSIVOS: 'Antihipertensivos (betabloqueantes, diuréticos)',
  ALFA_BLOQUEANTES: 'Alfa-1 bloqueantes para próstata (p. ej., tamsulosina, alfuzosina, doxazosina)',
  ANTICOAGULANTES: 'Anticoagulantes/antiagregantes (warfarina/acenocumarol, ACOD; aspirina, clopidogrel, etc.)',
  INHIBIDORES_PDE5: 'Inhibidores PDE-5 (disfunción eréctil)',
  ANTICONVULSIVOS: 'Anticonvulsivos/neuromoduladores (topiramato, vigabatrina, otros)',
  ANTIMALARICOS: 'Antimaláricos/inmunomoduladores (hidroxicloroquina/cloroquina)',
  ANTIARRITMICOS: 'Antiarrítmicos (amiodarona)',
  GLUCOSIDOS_CARDIACOS: 'Glucósidos cardiacos (digoxina)',
  BISFOSFONATOS: 'Bisfosfonatos (alendronato/risedronato/zoledrónico)',
  RETINOIDES: 'Retinoides sistémicos (isotretinoína)',
  ANTITUBERCULOSOS: 'Antituberculosos (etambutol, isoniazida)',
  TERAPIA_HORMONAL: 'Terapia hormonal (tamoxifeno)',
  OTROS: 'Otros (no listado)',
  NINGUNO: 'Ninguno',
} as const;

export const MEDICATION_GROUPS = [
  MEDICATION_GROUP_LABELS.ANTIHISTAMINICOS,
  MEDICATION_GROUP_LABELS.ANTIDEPRESIVOS,
  MEDICATION_GROUP_LABELS.ANTIPSICOTICOS,
  MEDICATION_GROUP_LABELS.CORTICOESTEROIDES,
  MEDICATION_GROUP_LABELS.ANTIDIABETICOS,
  MEDICATION_GROUP_LABELS.ANTIHIPERTENSIVOS,
  MEDICATION_GROUP_LABELS.ALFA_BLOQUEANTES,
  MEDICATION_GROUP_LABELS.ANTICOAGULANTES,
  MEDICATION_GROUP_LABELS.INHIBIDORES_PDE5,
  MEDICATION_GROUP_LABELS.ANTICONVULSIVOS,
  MEDICATION_GROUP_LABELS.ANTIMALARICOS,
  MEDICATION_GROUP_LABELS.ANTIARRITMICOS,
  MEDICATION_GROUP_LABELS.GLUCOSIDOS_CARDIACOS,
  MEDICATION_GROUP_LABELS.BISFOSFONATOS,
  MEDICATION_GROUP_LABELS.RETINOIDES,
  MEDICATION_GROUP_LABELS.ANTITUBERCULOSOS,
  MEDICATION_GROUP_LABELS.TERAPIA_HORMONAL,
  MEDICATION_GROUP_LABELS.OTROS,
  MEDICATION_GROUP_LABELS.NINGUNO,
] as const;

export type MedicationGroup = typeof MEDICATION_GROUPS[number];

export const MEDICATION_TIMING_OPTIONS = [
  'En curso',
  'En los últimos 6 meses',
  'Hace > 6 meses',
  'Desconozco',
] as const;

export type MedicationTimingOption = typeof MEDICATION_TIMING_OPTIONS[number];
