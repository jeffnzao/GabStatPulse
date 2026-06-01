import { NextResponse } from "next/server";
import { prisma, isDatabaseConnected } from "@/lib/prisma";
import { mockTrends } from "@/lib/mockData";

interface SurveyWithCount {
  id: string;
  title: string;
  category: string;
  createdAt: Date;
  _count: { responses: number };
}

export async function GET() {
  try {
    const dbOk = await isDatabaseConnected();

    if (!dbOk) {
      return NextResponse.json(mockTrends);
    }

    const recentSurveys: SurveyWithCount[] = await prisma.survey.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      include: {
        _count: { select: { responses: true } },
      },
    });

    const trends = recentSurveys
      .map((survey: SurveyWithCount) => {
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
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, 10);

    return NextResponse.json(trends);
  } catch (error) {
    console.error("[API /trends] Error:", error);
    return NextResponse.json(mockTrends);
  }
}
