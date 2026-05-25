import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stats = await prisma.survey.aggregate({
      _count: true,
    });

    const responses = await prisma.response.aggregate({
      _count: true,
    });

    const users = await prisma.user.aggregate({
      _count: true,
    });

    const regions = await prisma.region.findMany();

    const regionStats = await Promise.all(
      regions.map(async (region) => ({
        name: region.name,
        participants: await prisma.response.count({
          where: { region: region.name },
        }),
      }))
    );

    return NextResponse.json({
      totalSurveys: stats._count,
      totalParticipants: responses._count,
      totalUsers: users._count,
      regionStats,
    });
  } catch (error) {
    console.error("Error fetching global stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
