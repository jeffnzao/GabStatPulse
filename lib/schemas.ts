import { z } from "zod";

/**
 * Schéma de validation pour une réponse à une question
 */
export const SurveyAnswerSchema = z.object({
  questionId: z.string().cuid("ID de question invalide"),
  value: z.union([
    z.string().min(1, "La réponse ne peut pas être vide"),
    z.array(z.string()).min(1, "Sélectionnez au moins une option"),
  ]),
});

/**
 * Schéma de validation pour la soumission complète d'un sondage
 */
export const SurveySubmissionSchema = z.object({
  surveyId: z.string().cuid("ID de sondage invalide"),
  answers: z.array(SurveyAnswerSchema).min(1, "Au moins une réponse requise"),
  anonymousId: z.string().optional(),
  region: z.string().optional(),
});

export type SurveyAnswerInput = z.infer<typeof SurveyAnswerSchema>;
export type SurveySubmissionInput = z.infer<typeof SurveySubmissionSchema>;
