import { describe, expect, it } from 'vitest';

import { buildAutoRecommendations } from './recommendations';

const CONTACT_LENS_SURFACE_ACTIONS = [
  'tbuts',
  'staining_cfs',
  'meibography',
  'blink_rate_check',
];

describe('buildAutoRecommendations', () => {
  it('returns ocular surface actions when contact lens comfort is low', () => {
    const result = buildAutoRecommendations({
      uses_contacts: 'Sí',
      contacts_comfort: 'Mala',
    });

    const actionKeys = result.actions.map((action) => action.key);

    expect(result.triggeredRules).toHaveLength(1);
    expect(actionKeys).toHaveLength(CONTACT_LENS_SURFACE_ACTIONS.length);
    CONTACT_LENS_SURFACE_ACTIONS.forEach((action) => {
      expect(actionKeys).toContain(action);
    });
  });

  it('returns ocular surface actions when contact lens wear exceeds eight hours', () => {
    const result = buildAutoRecommendations({
      uses_contacts: 'Sí',
      contacts_comfort: 'Buena',
      contacts_hours: '> 8 h',
    });

    const actionKeys = result.actions.map((action) => action.key);

    expect(result.triggeredRules).toHaveLength(1);
    expect(actionKeys).toHaveLength(CONTACT_LENS_SURFACE_ACTIONS.length);
    CONTACT_LENS_SURFACE_ACTIONS.forEach((action) => {
      expect(actionKeys).toContain(action);
    });
  });
});
