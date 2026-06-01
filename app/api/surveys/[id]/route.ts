import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConnected } from "@/lib/prisma";
import { auth } from "@/auth";
import { mockSurveys } from "@/lib/mockData";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const dbOk = await isDatabaseConnected();

    if (!dbOk) {
      const mock = mockSurveys.find((s) => s.id === id) || mockSurveys[0];
      return NextResponse.json(mock);
    }

    const survey = await prisma.survey.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { order: "asc" } },
        _count: { select: { responses: true } },
        creator: { select: { name: true, image: true } },
      },
    });

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    return NextResponse.json(survey);
  } catch (error) {
    console.error("[API /surveys/:id GET]", error);
    return NextResponse.json(mockSurveys[0]);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth() as { user?: { id?: string } } | null;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbOk = await isDatabaseConnected();
    if (!dbOk) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    await prisma.survey.delete({ where: { id, creatorId: session.user.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /surveys/:id DELETE]", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
