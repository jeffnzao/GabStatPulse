/**
 * lib/trends.ts — Calcul des scores de tendance
 */

interface SurveyForTrend {
  id: string;
  title: string;
  category: string;
  createdAt: Date;
  _count: { responses: number };
}

export function calculateTrends(surveys: SurveyForTrend[]) {
  return surveys
    .map((survey: SurveyForTrend) => {
      const daysSince = Math.max(
        1,
        Math.floor((Date.now() - survey.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      );
      const score = survey._count.responses * (1 / (daysSince + 1));
      const trend_type: "hot" | "rising" | "falling" =
        score > 10 ? "hot" : score > 5 ? "rising" : "falling";

      return {
        id: survey.id,
        title: survey.title,
        category: survey.category,
        score,
        trending: score > 5,
        trend_type,
        responseCount: survey._count.responses,
      };
    })
    .sort((a: { score: number }, b: { score: number }) => b.score - a.score);
}
