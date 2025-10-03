import { describe, expect, it } from 'vitest';

import { AUTO_RECOMMENDATION_RULES, AutoRecommendationRule } from './autoRecommendations';

describe('AUTO_RECOMMENDATION_RULES specification', () => {
  const expectedRules: AutoRecommendationRule[] = [
    {
      if: { from: 'symptoms_list', any_of: ['Dolores de cabeza', 'Dificultad de enfoque / fatiga visual'] },
      then: ['binocular_suite', 'tbuts'],
      why: 'Alta asociación de DES y anomalías acomodativas/vergenciales en usuarios de pantallas; evaluar BV y superficie antes de prescribir.',
      evidence: ['turn0search29', 'turn2search2', 'turn0search13'],
    },
    {
      if: { from: 'symptoms_list', any_of: ['Sequedad ocular', 'Ojos rojos / irritación'] },
      then: ['tbuts', 'staining_cfs', 'schirmer_if_aqueous', 'meibography', 'delay_final_rx_if_unstable'],
      why: 'TFOS DEWS II: secuencia diagnóstica y priorizar estabilizar película antes de la RX fina.',
      evidence: ['turn0search0', 'turn0search8', 'turn0search32'],
    },
    {
      if: { from: 'symptoms_list', any_of: ['Destellos / “moscas volantes”'] },
      then: ['urgent_referral'],
      why: 'PVD sintomático: riesgo de desgarro; precisa dilatación y/o IO.',
      evidence: ['turn1search17', 'turn1search13', 'turn1search5'],
    },
    {
      if: {
        all: [
          { from: 'night_drive', any_of: ['Sí, habitualmente', 'A veces'] },
          { from: 'night_glare', any_of: ['Mucho', 'A veces'] },
        ],
      },
      then: ['contrast_sensitivity', 'glare_test', 'lens_AR_counsel', 'cataract_check_if_age'],
      why: 'La sensibilidad al contraste predice mejor el rendimiento nocturno que la AV alto contraste.',
      evidence: ['turn4search11', 'turn1search14', 'turn1search6'],
    },
    {
      if: {
        all: [
          { from: 'uses_glasses', equals: 'Sí' },
          { from: 'progressives', equals: 'Sí' },
          { from: 'progressive_adapt', any_of: ['Regular', 'Mala'] },
        ],
      },
      then: [
        'verify_pd_heights',
        'check_pantoscopic_tilt',
        'check_vertex_distance',
        'check_frame_wrap',
        'binocular_suite',
      ],
      why: 'Errores de medida (DP/alturas/angulo/VD/wrap) degradan la performance; problemas de vergencia dificultan adaptación.',
      evidence: ['turn1search3', 'turn1search15'],
    },
    {
      if: {
        all: [
          { from: 'uses_contacts', equals: 'Sí' },
          { from: 'contacts_comfort', any_of: ['Regular', 'Mala'] },
        ],
      },
      then: ['tbuts', 'staining_cfs', 'meibography', 'blink_rate_check'],
      why: 'LC se asocia a cambios meibomianos y DED; evaluar y tratar superficie para mejorar tolerancia.',
      evidence: ['turn3search13', 'turn3search25', 'turn3search1'],
    },
    {
      if: { from: 'ocular_dx', any_of: ['Queratocono'] },
      then: ['topography', 'tomography_if_available'],
      why: 'La combinación topografía/tomografía mejora detección de KC subclínico.',
      evidence: ['turn1search0'],
    },
    {
      if: { from: 'ocular_dx', any_of: ['Glaucoma'] },
      then: ['tonometry', 'pachymetry', 'oct_rnfl', 'vf_24_2'],
      why: 'CCT modula lectura de PIO y riesgo; RNFL en OCT es clave para diagnóstico/seguimiento.',
      evidence: ['turn6search16', 'turn0search26'],
    },
    {
      if: { from: 'family_dx', any_of: ['Glaucoma'] },
      then: ['tonometry', 'pachymetry', 'oct_rnfl_base', 'vf_24_2_if_indicated'],
      why: 'Antecedente familiar eleva riesgo; incorporar CCT y línea base estructural/funcional.',
      evidence: ['turn6search11', 'turn6search9'],
    },
    {
      if: { from: 'family_dx', any_of: ['Degeneración macular (DMAE)'] },
      then: ['retinography_macula', 'oct_macula_if_symptoms'],
      why: 'Imagen macular de base y OCT si hay metamorfopsias/drusas.',
      evidence: ['turn4search12', 'turn4search2'],
    },
    {
      if: { from: 'systemic', any_of: ['Diabetes'] },
      then: ['retinography', 'oct_macula_if_central_symptoms', 'delay_final_rx_if_recent_hyperglycemia'],
      why: 'Cribado de RD en AP es viable; hiperglucemia fluctúa la refracción.',
      evidence: ['turn0search19', 'turn0search3'],
    },
    {
      if: { from: 'screens', any_of: ['> 8 h', '4–8 h'] },
      then: ['tbuts', 'binocular_suite', 'ergonomics_counsel'],
      why: 'DES + anomalías acomodativas/vergenciales frecuentes con uso intensivo de pantallas.',
      evidence: ['turn0search5', 'turn0search29'],
    },
    {
      if: {
        all: [
          {
            from: 'medications_groups',
            includes: 'Corticoesteroides (cualquier vía, incluidos colirios esteroides)',
          },
        ],
      },
      then: ['tonometry', 'slit_lamp_lens_check'],
      why: 'Corticoides elevan PIO y favorecen catarata subcapsular; medir PIO y revisar cristalino.',
      evidence: ['turn6search18'],
    },
    {
      if: {
        all: [
          {
            from: 'medications_groups',
            includes: 'Antimaláricos/inmunomoduladores (hidroxicloroquina/cloroquina)',
          },
          { from: 'medications_hcq_duracion', any_of: ['> 5 años'] },
        ],
      },
      then: ['oct_macula_if_symptoms', 'vf_10_2', 'retinography_macula'],
      why: 'Cribado anual por riesgo de retinopatía por hidroxicloroquina tras 5 años.',
      evidence: ['turn0search0', 'turn0search8'],
    },
    {
      if: { from: 'night_drive', any_of: ['Sí, habitualmente', 'A veces'] },
      then: ['contrast_sensitivity'],
      why: 'Métrica útil para aptitud nocturna y monitorizar beneficio tras intervención.',
      evidence: ['turn4search11'],
    },
    {
      if: {
        all: [
          { from: 'reason_list', any_of: ['Interés en lentes de contacto'] },
          { from: 'symptoms_list', any_of: ['Sequedad ocular'] },
        ],
      },
      then: ['tbuts', 'meibography', 'staining_cfs', 'delay_final_rx_if_unstable'],
      why: 'Optimiza superficie antes de adaptar LC para evitar fracaso por DED.',
      evidence: ['turn0search0', 'turn3search25'],
    },
    {
      if: {
        all: [
          { from: 'reason_list', any_of: ['Renovación de gafas'] },
          { from: 'symptoms_list', any_of: ['Visión borrosa de cerca'] },
          { from: 'progressives', equals: 'No' },
        ],
      },
      then: ['binocular_suite', 'near_work_distance_check'],
      why: 'Descartar insuficiencia acomodativa/vergencial y ajustar adición/distancia de trabajo.',
      evidence: ['turn2search11', 'turn2search14'],
    },
  ];

  it('matches the provided recommendation engine specification', () => {
    expect(AUTO_RECOMMENDATION_RULES).toEqual(expectedRules);
  });

  it('contains only unique rule/action combinations', () => {
    const seen = new Set<string>();

    for (const rule of AUTO_RECOMMENDATION_RULES) {
      const signature = JSON.stringify({ if: rule.if, then: rule.then });
      expect(seen.has(signature)).toBe(false);
      seen.add(signature);
    }
  });
});
