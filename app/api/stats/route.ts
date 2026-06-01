import { NextResponse } from "next/server";
import { prisma, isDatabaseConnected } from "@/lib/prisma";
import { mockStats } from "@/lib/mockData";

export async function GET() {
  try {
    const dbOk = await isDatabaseConnected();

    if (!dbOk) {
      // Mode développement sans DB → retourne des données mock
      return NextResponse.json(mockStats);
    }

    const [surveys, responses, users, regions] = await Promise.all([
      prisma.survey.aggregate({ _count: true }),
      prisma.response.aggregate({ _count: true }),
      prisma.user.aggregate({ _count: true }),
      prisma.region.findMany(),
    ]);

    const regionStats = await Promise.all(
      regions.map(async (region: { name: string }) => ({
        name: region.name,
        participants: await prisma.response.count({
          where: { region: region.name },
        }),
      }))
    );

    return NextResponse.json({
      totalSurveys: surveys._count,
      totalParticipants: responses._count,
      totalUsers: users._count,
      regionStats,
    });
  } catch (error) {
    console.error("[API /stats] Error:", error);
    // Fallback gracieux → données mock plutôt que 500
    return NextResponse.json(mockStats);
  }
}
