import { prisma } from "@/lib/prisma";

/**
 * Calculate trending score based on:
 * - Number of responses
 * - Recency (newer surveys score higher)
 * - Engagement rate
 */
export async function calculateTrendingScores() {
  try {
    const surveys = await prisma.survey.findMany({
      include: {
        _count: {
          select: { responses: true },
        },
      },
    });

    const trends = surveys.map((survey) => {
      const now = new Date();
      const createdAt = new Date(survey.createdAt);
      const ageInDays = Math.max(1, Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));

      // Recency factor (newer = higher score)
      const recencyFactor = Math.exp(-ageInDays / 10);

      // Response rate factor
      const responseCount = survey._count.responses;
      const engagementFactor = Math.log(responseCount + 1);

      // Final trending score
      const score = (engagementFactor * recencyFactor * 100);

      // Determine trend type
      let trend_type: "hot" | "rising" | "falling";
      if (score > 80) {
        trend_type = "hot";
      } else if (score > 40) {
        trend_type = "rising";
      } else {
        trend_type = "falling";
      }

      return {
        id: survey.id,
        title: survey.title,
        category: survey.category,
        score: Math.round(score * 100) / 100,
        trending: score > 50,
        trend_type,
        responseCount,
        ageInDays,
      };
    });

    // Sort by score
    return trends.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error("Error calculating trending scores:", error);
    return [];
  }
}

/**
 * Get top trending surveys
 */
export async function getTopTrends(limit: number = 10) {
  const scores = await calculateTrendingScores();
  return scores.slice(0, limit);
}

/**
 * Format trend indicator
 */
export function getTrendIndicator(trend_type: "hot" | "rising" | "falling"): string {
  switch (trend_type) {
    case "hot":
      return "🔥";
    case "rising":
      return "📈";
    case "falling":
      return "📉";
    default:
      return "📊";
  }
}

/**
 * Get trend description
 */
export function getTrendDescription(trend_type: "hot" | "rising" | "falling"): string {
  switch (trend_type) {
    case "hot":
      return "Sujet chaud";
    case "rising":
      return "Monte rapidement";
    case "falling":
      return "En baisse";
    default:
      return "Normal";
  }
}
