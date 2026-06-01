import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConnected } from "@/lib/prisma";
import { auth } from "@/auth";
import { mockSurveys } from "@/lib/mockData";

export async function GET() {
  try {
    const dbOk = await isDatabaseConnected();

    if (!dbOk) {
      return NextResponse.json(mockSurveys);
    }

    const surveys = await prisma.survey.findMany({
      where: { status: "active" },
      include: {
        _count: { select: { responses: true } },
        creator: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json(surveys);
  } catch (error) {
    console.error("[API /surveys GET] Error:", error);
    return NextResponse.json(mockSurveys);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth() as { user?: { id?: string } } | null;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbOk = await isDatabaseConnected();
    if (!dbOk) {
      return NextResponse.json(
        { error: "Database not available in development mode" },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { title, description, category, region, questions, duration } = body;

    if (!title || !category || !questions?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (parseInt(duration) || 7));

    const survey = await prisma.survey.create({
      data: {
        title,
        description,
        category,
        region: region || "Gabon",
        creatorId: session.user.id,
        endDate,
        questions: {
          create: questions.map((q: { text: string; type: string; options?: string[] }, idx: number) => ({
            text: q.text,
            type: q.type,
            options: q.options || [],
            order: idx,
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json(survey, { status: 201 });
  } catch (error) {
    console.error("[API /surveys POST] Error:", error);
    return NextResponse.json({ error: "Failed to create survey" }, { status: 500 });
  }
}
