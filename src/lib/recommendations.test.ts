import { describe, expect, it } from 'bun:test';

import { buildAutoRecommendations } from './recommendations';

const SYSTEMIC_REASON =
  'Patologías tiroideas/autoinmunes comprometen superficie ocular y glándulas de Meibomio; evaluar estabilidad y parpadeo.';

describe('systemic auto recommendation rule', () => {
  it('triggers thyroid/autoimmune rule when thyroid problems are reported', () => {
    const result = buildAutoRecommendations({
      systemic: ['Problemas de tiroides'],
    });

    const systemicRule = result.triggeredRules.find((rule) => rule.why === SYSTEMIC_REASON);

    expect(systemicRule).toBeDefined();
    expect(systemicRule?.then).toEqual(
      expect.arrayContaining(['tbuts', 'meibography', 'blink_rate_check'])
    );

    const relevantActions = result.actions.filter((action) =>
      ['tbuts', 'meibography', 'blink_rate_check'].includes(action.key)
    );

    expect(relevantActions).toHaveLength(3);
    relevantActions.forEach((action) => {
      expect(action.reasons).toContain(SYSTEMIC_REASON);
    });
  });

  it('triggers the same rule when autoimmune disease is reported', () => {
    const result = buildAutoRecommendations({
      systemic: ['Enfermedad autoinmune (p. ej., artritis reumatoide, lupus)'],
    });

    const systemicRule = result.triggeredRules.find((rule) => rule.why === SYSTEMIC_REASON);

    expect(systemicRule).toBeDefined();
    expect(systemicRule?.then).toEqual(
      expect.arrayContaining(['tbuts', 'meibography', 'blink_rate_check'])
    );

    ['tbuts', 'meibography', 'blink_rate_check'].forEach((key) => {
      const action = result.actions.find((item) => item.key === key);
      expect(action).toBeDefined();
      expect(action?.reasons).toContain(SYSTEMIC_REASON);
    });
  });
});

