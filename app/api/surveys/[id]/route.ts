import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const survey = await prisma.survey.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { responses: true },
        },
        creator: {
          select: { name: true, image: true },
        },
      },
    });

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    return NextResponse.json(survey);
  } catch (error) {
    console.error("Error fetching survey:", error);
    return NextResponse.json(
      { error: "Failed to fetch survey" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid answers format" },
        { status: 400 }
      );
    }

    // Check if user already responded
    const existingResponse = await prisma.response.findUnique({
      where: {
        surveyId_userId: {
          surveyId: params.id,
          userId: session.user.id,
        },
      },
    });

    if (existingResponse) {
      return NextResponse.json(
        { error: "You have already responded to this survey" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const response = await prisma.response.create({
      data: {
        surveyId: params.id,
        userId: session.user.id,
        region: user?.region,
        answers: {
          create: answers.map((answer: any) => ({
            questionId: answer.questionId,
            text: answer.text,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    // Update survey statistics
    await updateSurveyStatistics(params.id);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error submitting response:", error);
    return NextResponse.json(
      { error: "Failed to submit response" },
      { status: 500 }
    );
  }
}

async function updateSurveyStatistics(surveyId: string) {
  const responses = await prisma.response.count({
    where: { surveyId },
  });

  await prisma.statistics.upsert({
    where: { surveyId },
    update: {
      totalResponses: responses,
    },
    create: {
      surveyId,
      totalResponses: responses,
    },
  });
}
