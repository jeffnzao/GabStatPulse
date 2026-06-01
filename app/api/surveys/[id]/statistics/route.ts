import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConnected } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const dbOk = await isDatabaseConnected();

    if (!dbOk) {
      return NextResponse.json({
        surveyId: id,
        totalResponses: 42,
        participationRate: 68,
        _mock: true,
      });
    }

    const stats = await prisma.statistics.findUnique({ where: { surveyId: id } });
    if (!stats) {
      return NextResponse.json({ surveyId: id, totalResponses: 0, participationRate: 0 });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[API /surveys/:id/statistics]", error);
    return NextResponse.json({ surveyId: id, totalResponses: 0, participationRate: 0 });
  }
}
