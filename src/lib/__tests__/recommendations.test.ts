import { describe, it, expect } from 'vitest';

import { buildAutoRecommendations } from '../recommendations';

describe('auto recommendation engine', () => {
  it('includes near work distance check for progressive adaptation issues', () => {
    const result = buildAutoRecommendations({
      uses_glasses: 'Sí',
      progressives: 'Sí',
      progressive_adapt: 'Mala',
    });

    const progressiveRule = result.triggeredRules.find((rule) =>
      rule.then.includes('near_work_distance_check')
    );

    expect(progressiveRule).toBeDefined();
    expect(progressiveRule?.then).toContain('near_work_distance_check');

    const actionKeys = result.actions.map((action) => action.key);
    expect(actionKeys).toContain('near_work_distance_check');
  });
});
