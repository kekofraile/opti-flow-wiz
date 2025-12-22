import { describe, expect, it } from 'vitest';
import { validateStepData } from './Index';
import { QuestionnaireData } from '@/types/questionnaire';

type PartialData = Partial<QuestionnaireData>;

describe('validateStepData', () => {
  it('returns valid for steps without validation rules', () => {
    const result = validateStepData(0, {});
    expect(result).toEqual({ valid: true });
  });

  it('validates reason step requirements', () => {
    const emptyResult = validateStepData(1, {});
    expect(emptyResult).toEqual({ valid: false, messageKey: 'requiredFields' });

    const filledData: PartialData = { reason_list: ['test'], last_exam: '2024' };
    const filledResult = validateStepData(1, filledData);
    expect(filledResult).toEqual({ valid: true });
  });

  it('validates glasses step including conditional progressive adaptation', () => {
    const missingGlasses = validateStepData(2, {});
    expect(missingGlasses).toEqual({ valid: false, messageKey: 'requiredFields' });

    const missingProgressiveAdaptation: PartialData = {
      uses_glasses: 'Sí',
      glasses_use: ['Cerca'],
      progressives: 'Sí',
      glasses_age: '1 año',
      glasses_satisfaction: 'Alta',
    };
    expect(validateStepData(2, missingProgressiveAdaptation)).toEqual({
      valid: false,
      messageKey: 'requiredFields',
    });

    const validData: PartialData = {
      uses_glasses: 'Sí',
      glasses_use: ['Cerca'],
      progressives: 'No',
      glasses_age: '1 año',
      glasses_satisfaction: 'Alta',
    };
    expect(validateStepData(2, validData)).toEqual({ valid: true });

    const noGlassesData: PartialData = { uses_glasses: 'No' };
    expect(validateStepData(2, noGlassesData)).toEqual({ valid: true });
  });

  it('validates contacts step when user wears contacts', () => {
    const missingContacts = validateStepData(3, {});
    expect(missingContacts).toEqual({ valid: false, messageKey: 'requiredFields' });

    const wearingContacts: PartialData = {
      uses_contacts: 'Sí',
      contacts_freq: 'Diario',
      contacts_hours: '8',
      contacts_comfort: 'Cómodo',
      contacts_type: ['Blandas'],
    };
    expect(validateStepData(3, wearingContacts)).toEqual({ valid: true });

    const notWearingContacts: PartialData = { uses_contacts: 'No' };
    expect(validateStepData(3, notWearingContacts)).toEqual({ valid: true });
  });

  it('validates medication step', () => {
    const missingMedication = validateStepData(7, {});
    expect(missingMedication).toEqual({ valid: false, messageKey: 'medicationRequired' });

    const providedMedication: PartialData = { medications_any: 'No' };
    expect(validateStepData(7, providedMedication)).toEqual({ valid: true });
  });

  it('validates habits step including conditional night glare', () => {
    const missingHabits = validateStepData(8, {});
    expect(missingHabits).toEqual({ valid: false, messageKey: 'requiredFields' });

    const needsNightGlare: PartialData = {
      screens: '4–8 h',
      near_tasks: 'Muchas horas al día',
      night_drive: 'Sí, habitualmente',
      outdoor: 'Muchas horas',
      photophobia: 'No',
      sunglasses: 'Casi siempre',
    };
    expect(validateStepData(8, needsNightGlare)).toEqual({ valid: false, messageKey: 'requiredFields' });

    const validHabits: PartialData = {
      screens: '4–8 h',
      near_tasks: 'Muchas horas al día',
      night_drive: 'A veces',
      night_glare: 'No',
      outdoor: 'Muchas horas',
      photophobia: 'No',
      sunglasses: 'Casi siempre',
    };
    expect(validateStepData(8, validHabits)).toEqual({ valid: true });
  });

  it('validates review step consent', () => {
    const missingConsent = validateStepData(9, {});
    expect(missingConsent).toEqual({ valid: false, messageKey: 'consentRequired' });

    const providedConsent: PartialData = { final_consent: true };
    expect(validateStepData(9, providedConsent)).toEqual({ valid: true });
  });
});
