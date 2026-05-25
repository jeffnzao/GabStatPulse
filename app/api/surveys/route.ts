import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const surveys = await prisma.survey.findMany({
      where: { status: "active" },
      include: {
        _count: {
          select: { responses: true },
        },
        creator: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json(surveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Failed to fetch surveys" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      region,
      questions,
      duration,
    } = body;

    if (!title || !category || !questions?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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
          create: questions.map((q: any, idx: number) => ({
            text: q.text,
            type: q.type,
            options: q.options || [],
            order: idx,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(survey, { status: 201 });
  } catch (error) {
    console.error("Error creating survey:", error);
    return NextResponse.json(
      { error: "Failed to create survey" },
      { status: 500 }
    );
  }
}
