import { QuestionnaireData } from '@/types/questionnaire';
import { AUTO_RECOMMENDATION_RULES, AutoRecommendationRule, RuleCondition, FieldCondition } from '@/data/autoRecommendations';

type RecommendationSeverity = 'info' | 'warning' | 'critical';

type RecommendationActionType = 'diagnostic' | 'management' | 'counseling';

interface RecommendationActionMetadata {
  label: string;
  type: RecommendationActionType;
  severity?: RecommendationSeverity;
  description?: string;
}

export interface AggregatedRecommendationAction extends RecommendationActionMetadata {
  key: string;
  severity: RecommendationSeverity;
  reasons: string[];
}

const ACTION_METADATA = {
  binocular_suite: {
    label: 'Suite binocular completa (cover test, forias, NPC, AA, MAF/BAF, NRA/PRA)',
    type: 'diagnostic',
  },
  tbuts: {
    label: 'Evaluación de película lagrimal (NIBUT/TBUT)',
    type: 'diagnostic',
  },
  staining_cfs: {
    label: 'Tinción corneal con fluoresceína/lisamina',
    type: 'diagnostic',
  },
  schirmer_if_aqueous: {
    label: 'Test de Schirmer si sospecha déficit acuoso',
    type: 'diagnostic',
  },
  meibography: {
    label: 'Evaluación meibomiana / meibografía',
    type: 'diagnostic',
  },
  delay_final_rx_if_unstable: {
    label: 'Posponer graduación final hasta estabilizar superficie',
    type: 'management',
    severity: 'warning',
  },
  urgent_referral: {
    label: 'Derivación urgente para exploración con dilatación',
    type: 'management',
    severity: 'critical',
  },
  contrast_sensitivity: {
    label: 'Sensibilidad al contraste (p. ej., Pelli-Robson)',
    type: 'diagnostic',
  },
  glare_test: {
    label: 'Prueba de deslumbramiento / halos nocturnos',
    type: 'diagnostic',
  },
  lens_AR_counsel: {
    label: 'Consejo sobre tratamientos AR / filtros para conducción nocturna',
    type: 'counseling',
  },
  cataract_check_if_age: {
    label: 'Evaluar cristalino / catarata si procede',
    type: 'diagnostic',
  },
  verify_pd_heights: {
    label: 'Verificar DP monocular y alturas de montaje',
    type: 'management',
  },
  check_pantoscopic_tilt: {
    label: 'Revisar ángulo pantoscópico',
    type: 'management',
  },
  check_vertex_distance: {
    label: 'Comprobar distancia vértice',
    type: 'management',
  },
  check_frame_wrap: {
    label: 'Comprobar envolvente (wrap) del armazón',
    type: 'management',
  },
  blink_rate_check: {
    label: 'Evaluar frecuencia y calidad de parpadeo',
    type: 'counseling',
  },
  topography: {
    label: 'Topografía corneal',
    type: 'diagnostic',
  },
  tomography_if_available: {
    label: 'Tomografía corneal (Scheimpflug/AS-OCT) si disponible',
    type: 'diagnostic',
  },
  tonometry: {
    label: 'Tonometría',
    type: 'diagnostic',
  },
  pachymetry: {
    label: 'Pachimetría (CCT)',
    type: 'diagnostic',
  },
  oct_rnfl: {
    label: 'OCT RNFL / mácula para glaucoma',
    type: 'diagnostic',
  },
  vf_24_2: {
    label: 'Campo visual 24-2',
    type: 'diagnostic',
  },
  oct_rnfl_base: {
    label: 'OCT RNFL de línea base',
    type: 'diagnostic',
  },
  vf_24_2_if_indicated: {
    label: 'Campo visual 24-2 (línea base si procede)',
    type: 'diagnostic',
  },
  retinography_macula: {
    label: 'Retinografía macular',
    type: 'diagnostic',
  },
  oct_macula_if_symptoms: {
    label: 'OCT mácula si hay síntomas o hallazgos',
    type: 'diagnostic',
  },
  retinography: {
    label: 'Retinografía de cribado',
    type: 'diagnostic',
  },
  oct_macula_if_central_symptoms: {
    label: 'OCT mácula si hay síntomas centrales',
    type: 'diagnostic',
  },
  delay_final_rx_if_recent_hyperglycemia: {
    label: 'Posponer Rx final hasta estabilizar glucemia',
    type: 'management',
    severity: 'warning',
  },
  ergonomics_counsel: {
    label: 'Consejo sobre ergonomía y micropausas',
    type: 'counseling',
  },
  vf_10_2: {
    label: 'Campo visual 10-2',
    type: 'diagnostic',
  },
  near_work_distance_check: {
    label: 'Medir distancia real de trabajo cercano',
    type: 'management',
  },
  slit_lamp_lens_check: {
    label: 'Revisión de cristalino en lámpara de hendidura',
    type: 'diagnostic',
  },
} as const satisfies Record<string, RecommendationActionMetadata>;

export type RecommendationActionKey = keyof typeof ACTION_METADATA;

const severityWeight: Record<RecommendationSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

const evaluateFieldCondition = (condition: FieldCondition, data: Partial<QuestionnaireData>): boolean => {
  const value = data[condition.from];

  if (condition.equals !== undefined) {
    if (Array.isArray(value)) {
      return value.includes(condition.equals);
    }
    return value === condition.equals;
  }

  if (condition.includes !== undefined) {
    if (Array.isArray(value)) {
      return value.includes(condition.includes);
    }
    return value === condition.includes;
  }

  if (condition.any_of) {
    if (Array.isArray(value)) {
      return value.some((item) => condition.any_of!.includes(item));
    }
    if (typeof value === 'string') {
      return condition.any_of.includes(value);
    }
    return false;
  }

  if (condition.not_contains) {
    if (Array.isArray(value)) {
      return !value.includes(condition.not_contains);
    }
    if (typeof value === 'string') {
      return value !== condition.not_contains;
    }
  }

  return Boolean(value);
};

const evaluateCondition = (condition: RuleCondition, data: Partial<QuestionnaireData>): boolean => {
  if ('all' in condition) {
    return condition.all.every((inner) => evaluateCondition(inner, data));
  }
  if ('any' in condition) {
    return condition.any.some((inner) => evaluateCondition(inner, data));
  }
  return evaluateFieldCondition(condition, data);
};

const formatLabelFromKey = (key: string) =>
  key
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export interface AutoRecommendationResult {
  triggeredRules: AutoRecommendationRule[];
  actions: AggregatedRecommendationAction[];
}

export const buildAutoRecommendations = (
  data: Partial<QuestionnaireData>
): AutoRecommendationResult => {
  const triggeredRules = AUTO_RECOMMENDATION_RULES.filter((rule) => evaluateCondition(rule.if, data));

  const actionsMap = new Map<string, AggregatedRecommendationAction>();

  triggeredRules.forEach((rule) => {
    rule.then.forEach((actionKey) => {
      const metadata = ACTION_METADATA[actionKey as RecommendationActionKey];
      const baseMetadata = metadata || {
        label: formatLabelFromKey(actionKey),
        type: 'diagnostic' as RecommendationActionType,
        severity: 'info' as RecommendationSeverity,
      };

      const existing = actionsMap.get(actionKey);
      if (!existing) {
        actionsMap.set(actionKey, {
          key: actionKey,
          label: baseMetadata.label,
          type: baseMetadata.type,
          severity: baseMetadata.severity ?? 'info',
          description: baseMetadata.description,
          reasons: [rule.why],
        });
      } else if (!existing.reasons.includes(rule.why)) {
        existing.reasons.push(rule.why);
      }
    });
  });

  const actions = Array.from(actionsMap.values()).sort((a, b) => {
    const severityDiff = severityWeight[a.severity] - severityWeight[b.severity];
    if (severityDiff !== 0) return severityDiff;
    return a.label.localeCompare(b.label, 'es');
  });

  return {
    triggeredRules,
    actions,
  };
};
