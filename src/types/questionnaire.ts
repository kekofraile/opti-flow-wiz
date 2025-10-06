export interface QuestionnaireData {
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

  // Medication impact
  medications_any?: string;
  medications_groups?: string[];
  medications_timing?: Record<string, string>;
  medications_cortico_routes?: string[];
  medications_cortico_pio?: string;
  medications_antidiabeticos_tipo?: string[];
  medications_antihipertensivos_tipo?: string[];
  medications_anticonvulsivos_sub?: string[];
  medications_antimalaricos_sub?: string[];
  medications_hcq_duracion?: string;
  medications_antituberculosos_sub?: string[];
  medications_bisfosfonatos_via?: string;
  medications_tamsulosina_cirugia?: string;
  medications_anticoagulante_tipo?: string;

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
