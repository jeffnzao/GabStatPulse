import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const statistics = await prisma.statistics.findUnique({
      where: { surveyId: params.id },
    });

    if (!statistics) {
      return NextResponse.json(
        { error: "Statistics not found" },
        { status: 404 }
      );
    }

    // Get response distribution
    const responses = await prisma.response.findMany({
      where: { surveyId: params.id },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    // Calculate distributions
    const questions = await prisma.question.findMany({
      where: { surveyId: params.id },
    });

    const distributions: any = {};

    for (const question of questions) {
      const answers = responses
        .flatMap((r) => r.answers)
        .filter((a) => a.questionId === question.id);

      if (question.type === "multiple" || question.type === "single") {
        const distribution: Record<string, number> = {};
        answers.forEach((a) => {
          distribution[a.text] = (distribution[a.text] || 0) + 1;
        });
        distributions[question.id] = distribution;
      }
    }

    return NextResponse.json({
      ...statistics,
      distributions,
      totalParticipants: responses.length,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
