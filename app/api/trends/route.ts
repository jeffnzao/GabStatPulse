import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Calculate trending score for surveys
    const recentSurveys = await prisma.survey.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      include: {
        _count: {
          select: { responses: true },
        },
      },
    });

    const trends = recentSurveys.map((survey) => {
      const daysSinceCreation = Math.max(1, Math.floor(
        (Date.now() - survey.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      ));

      const responseRate = survey._count.responses / daysSinceCreation;
      const trendingScore = survey._count.responses * (1 / (daysSinceCreation + 1));

      let trend_type = "rising";
      if (trendingScore < 2) trend_type = "falling";
      else if (trendingScore > 10) trend_type = "hot";

      return {
        id: survey.id,
        title: survey.title,
        category: survey.category,
        score: trendingScore,
        trending: trendingScore > 5,
        trend_type,
        responseCount: survey._count.responses,
      };
    });

    const sortedTrends = trends.sort((a, b) => b.score - a.score).slice(0, 10);

    return NextResponse.json(sortedTrends);
  } catch (error) {
    console.error("Error fetching trends:", error);
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
