import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConnected } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: surveyId } = await params;

  try {
    // Vérifier l'authentification
    const session = await auth() as { user?: { id?: string } } | null;
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Vérifier la base de données
    const dbOk = await isDatabaseConnected();
    if (!dbOk) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    // Vérifier que l'utilisateur est le créateur du sondage
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      select: { creatorId: true },
    });

    if (!survey || survey.creatorId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - Not survey creator" },
        { status: 403 }
      );
    }

    // Récupérer les filtres de la query
    const { startDate, endDate, anonymousOnly, connectedOnly } = Object.fromEntries(
      req.nextUrl.searchParams.entries()
    );

    // Construire les filtres Prisma
    const whereFilter: any = { surveyId };

    if (startDate || endDate) {
      whereFilter.createdAt = {};
      if (startDate) {
        whereFilter.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        whereFilter.createdAt.lte = new Date(endDate);
      }
    }

    if (anonymousOnly === "true") {
      whereFilter.userId = null;
      whereFilter.anonymousId = { not: null };
    }

    if (connectedOnly === "true") {
      whereFilter.userId = { not: null };
    }

    // Récupérer les réponses
    const responses = await prisma.response.findMany({
      where: whereFilter,
      include: {
        answers: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: responses.length,
      data: responses,
    });
  } catch (error) {
    console.error(`[API /surveys/${surveyId}/responses GET]`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
