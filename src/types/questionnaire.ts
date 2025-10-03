export interface QuestionnaireData {
  // Welcome
  lang: string;
  consent: boolean;

  // Reason
  reason_list: string[];
  symptoms_list?: string[];
  last_exam: string;

  // Glasses
  uses_glasses: string;
  glasses_use?: string[];
  progressives?: string;
  progressive_adapt?: string;
  glasses_age?: string;
  glasses_satisfaction?: string;

  // Contacts
  uses_contacts: string;
  contacts_freq?: string;
  contacts_type?: string[];
  contacts_hours?: string;
  contacts_comfort?: string;

  // Ocular history
  ocular_dx?: string[];
  ocular_other?: string;
  ocular_tx?: string[];
  ocular_trauma?: string[];

  // Family history
  family_dx?: string[];
  family_other?: string;

  // General health
  systemic?: string[];
  systemic_other?: string;
  allergies?: string[];
  allergy_other?: string;

  // Habits
  screens: string;
  near_tasks: string;
  night_drive: string;
  night_glare?: string;
  outdoor: string;
  photophobia: string;
  sunglasses: string;

  // Review
  final_consent: boolean;
  signature?: string;
}

export interface FieldDefinition {
  id: string;
  type: 'choice' | 'text' | 'boolean' | 'signature';
  label: string;
  multiple?: boolean;
  required: boolean;
  options?: string[];
  show_if?: {
    from: string;
    equals?: string;
    any_of?: string[];
    not_contains?: string;
  };
  exclusive_options?: string[];
}

export interface StepDefinition {
  id: string;
  title: string;
  type: string;
  fields: FieldDefinition[];
}
