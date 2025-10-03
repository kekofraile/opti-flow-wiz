import { describe, expect, it } from 'vitest';

import { buildAutoRecommendations } from './recommendations';

describe('buildAutoRecommendations - retinal detachment family rule', () => {
  it('triggers urgent referral when family history and symptoms align', () => {
    const result = buildAutoRecommendations({
      family_dx: ['Desprendimiento de retina'],
      symptoms_list: ['Destellos / “moscas volantes”'],
    });

    expect(
      result.triggeredRules.some((rule) =>
        rule.why.includes('Antecedente familiar + fotopsias')
      )
    ).toBe(true);
    expect(result.actions.some((action) => action.key === 'urgent_referral')).toBe(true);
  });

  it('does not trigger when the family history is missing', () => {
    const result = buildAutoRecommendations({
      symptoms_list: ['Destellos / “moscas volantes”'],
    });

    expect(
      result.triggeredRules.some((rule) =>
        rule.why.includes('Antecedente familiar + fotopsias')
      )
    ).toBe(false);
  });

  it('does not trigger when the symptom is missing', () => {
    const result = buildAutoRecommendations({
      family_dx: ['Desprendimiento de retina'],
    });

    expect(
      result.triggeredRules.some((rule) =>
        rule.why.includes('Antecedente familiar + fotopsias')
      )
    ).toBe(false);
  });
});
