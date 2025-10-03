import { describe, expect, it } from "vitest";

import { buildAutoRecommendations } from "./recommendations";
import { AUTO_RECOMMENDATION_RULES, AutoRecommendationRule } from "@/data/autoRecommendations";
import { QuestionnaireData } from "@/types/questionnaire";

const baseData: Partial<QuestionnaireData> = {
  reason_list: [],
  symptoms_list: [],
  last_exam: "",
  uses_glasses: "No",
  progressives: "No",
  progressive_adapt: "Buena",
  uses_contacts: "No",
  contacts_comfort: "Buena",
  ocular_dx: [],
  family_dx: [],
  systemic: [],
  medications_groups: [],
  medications_hcq_duracion: "0-5 años",
  night_drive: "No",
  night_glare: "Nada",
  screens: "<4 h",
};

const createData = (overrides: Partial<QuestionnaireData>) => ({
  ...baseData,
  ...overrides,
});

const matchesActions = (rule: AutoRecommendationRule, expectedActions: string[]) =>
  expectedActions.length === rule.then.length && expectedActions.every((action) => rule.then.includes(action));

describe("buildAutoRecommendations", () => {
  const scenarios: Array<{
    name: string;
    overrides: Partial<QuestionnaireData>;
    actions: string[];
  }> = [
    {
      name: "symptoms related to headaches trigger binocular and surface workup",
      overrides: { symptoms_list: ["Dolores de cabeza"] },
      actions: ["binocular_suite", "tbuts"],
    },
    {
      name: "dry eye symptoms expand surface protocol",
      overrides: { symptoms_list: ["Sequedad ocular"] },
      actions: ["tbuts", "staining_cfs", "schirmer_if_aqueous", "meibography", "delay_final_rx_if_unstable"],
    },
    {
      name: "photopsia symptoms require urgent referral",
      overrides: { symptoms_list: ['Destellos / “moscas volantes”'] },
      actions: ["urgent_referral"],
    },
    {
      name: "night driving with glare prioritises contrast assessment",
      overrides: { night_drive: "Sí, habitualmente", night_glare: "Mucho" },
      actions: ["contrast_sensitivity", "glare_test", "lens_AR_counsel", "cataract_check_if_age"],
    },
    {
      name: "progressive wearers with adaptation issues require fitting checks",
      overrides: {
        uses_glasses: "Sí",
        progressives: "Sí",
        progressive_adapt: "Mala",
      },
      actions: ["verify_pd_heights", "check_pantoscopic_tilt", "check_vertex_distance", "check_frame_wrap", "binocular_suite"],
    },
    {
      name: "contact lens discomfort warrants surface evaluation",
      overrides: {
        uses_contacts: "Sí",
        contacts_comfort: "Regular",
      },
      actions: ["tbuts", "staining_cfs", "meibography", "blink_rate_check"],
    },
    {
      name: "keratoconus history triggers tomography",
      overrides: { ocular_dx: ["Queratocono"] },
      actions: ["topography", "tomography_if_available"],
    },
    {
      name: "glaucoma diagnosis expands structural monitoring",
      overrides: { ocular_dx: ["Glaucoma"] },
      actions: ["tonometry", "pachymetry", "oct_rnfl", "vf_24_2"],
    },
    {
      name: "family glaucoma history captures baseline",
      overrides: { family_dx: ["Glaucoma"] },
      actions: ["tonometry", "pachymetry", "oct_rnfl_base", "vf_24_2_if_indicated"],
    },
    {
      name: "family history of AMD schedules macular imaging",
      overrides: { family_dx: ["Degeneración macular (DMAE)"] },
      actions: ["retinography_macula", "oct_macula_if_symptoms"],
    },
    {
      name: "diabetes history prompts retinal monitoring",
      overrides: { systemic: ["Diabetes"] },
      actions: ["retinography", "oct_macula_if_central_symptoms", "delay_final_rx_if_recent_hyperglycemia"],
    },
    {
      name: "intense screen use adds ergonomic counselling",
      overrides: { screens: "4–8 h" },
      actions: ["tbuts", "binocular_suite", "ergonomics_counsel"],
    },
    {
      name: "steroid treatments demand pressure control",
      overrides: {
        medications_groups: ["Corticoesteroides (cualquier vía, incluidos colirios esteroides)"],
      },
      actions: ["tonometry", "slit_lamp_lens_check"],
    },
    {
      name: "long-term hydroxychloroquine requires screening",
      overrides: {
        medications_groups: ["Antimaláricos/inmunomoduladores (hidroxicloroquina/cloroquina)"],
        medications_hcq_duracion: "> 5 años",
      },
      actions: ["oct_macula_if_symptoms", "vf_10_2", "retinography_macula"],
    },
    {
      name: "night driving alone flags contrast testing",
      overrides: { night_drive: "A veces", night_glare: "Nada" },
      actions: ["contrast_sensitivity"],
    },
    {
      name: "interest in contact lenses with dryness escalates surface plan",
      overrides: {
        reason_list: ["Interés en lentes de contacto"],
        symptoms_list: ["Sequedad ocular"],
      },
      actions: ["tbuts", "meibography", "staining_cfs", "delay_final_rx_if_unstable"],
    },
    {
      name: "near blur without progressive use checks accommodation",
      overrides: {
        reason_list: ["Renovación de gafas"],
        symptoms_list: ["Visión borrosa de cerca"],
        progressives: "No",
      },
      actions: ["binocular_suite", "near_work_distance_check"],
    },
  ];

  it.each(scenarios)("%s", ({ overrides, actions }) => {
    const expectedRule = AUTO_RECOMMENDATION_RULES.find((rule) => matchesActions(rule, actions));
    expect(expectedRule).toBeDefined();

    const result = buildAutoRecommendations(createData(overrides));
    expect(result.triggeredRules).toContain(expectedRule);
    const actionKeys = result.actions.map((action) => action.key);
    actions.forEach((action) => {
      expect(actionKeys).toContain(action);
    });
  });

  it("aggregates reasons for repeated actions", () => {
    const result = buildAutoRecommendations(
      createData({
        symptoms_list: ["Sequedad ocular", "Dolores de cabeza"],
      })
    );

    const tbutsAction = result.actions.find((action) => action.key === "tbuts");
    expect(tbutsAction).toBeDefined();
    const drynessRule = AUTO_RECOMMENDATION_RULES.find((rule) =>
      matchesActions(rule, ["tbuts", "staining_cfs", "schirmer_if_aqueous", "meibography", "delay_final_rx_if_unstable"])
    );
    const headacheRule = AUTO_RECOMMENDATION_RULES.find((rule) => matchesActions(rule, ["binocular_suite", "tbuts"]));
    expect(drynessRule).toBeDefined();
    expect(headacheRule).toBeDefined();
    expect(tbutsAction?.reasons).toEqual(expect.arrayContaining([drynessRule!.why, headacheRule!.why]));
    expect(tbutsAction?.reasons?.length).toBe(2);
  });

  it("prioritises actions by severity and then alphabetically", () => {
    const result = buildAutoRecommendations(
      createData({
        symptoms_list: ["Sequedad ocular", 'Destellos / “moscas volantes”'],
      })
    );

    const actionKeys = result.actions.map((action) => action.key);
    expect(actionKeys[0]).toBe("urgent_referral");
    const warningIndex = actionKeys.indexOf("delay_final_rx_if_unstable");
    const infoIndices = [
      actionKeys.indexOf("tbuts"),
      actionKeys.indexOf("staining_cfs"),
      actionKeys.indexOf("schirmer_if_aqueous"),
      actionKeys.indexOf("meibography"),
    ];

    expect(warningIndex).toBeGreaterThan(-1);
    infoIndices.forEach((idx) => expect(idx).toBeGreaterThan(-1));
    infoIndices.forEach((idx) => {
      expect(warningIndex).toBeLessThan(idx);
    });
  });
});

