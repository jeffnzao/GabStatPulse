import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma, isDatabaseConnected } from "@/lib/prisma";
import { z } from "zod";

const SignUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  // Champ hérité
  region: z.string().optional(),
  // Nouveaux champs de localisation
  country: z.string().optional(),
  residesInGabon: z.boolean().optional().default(false),
  province: z.string().optional(),
  ville: z.string().optional(),
  commune: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = SignUpSchema.parse(body);

    const dbOk = await isDatabaseConnected();
    if (!dbOk) {
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json(
          {
            id: "mock-" + Date.now(),
            email: data.email,
            name: data.name,
            _mock: true,
            message: "Mode développement — inscription simulée",
          },
          { status: 201 }
        );
      }
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(data.password, 10);

    // Dériver region depuis province ou ville pour la compatibilité
    const legacyRegion = data.province || data.ville || data.region;

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        region: legacyRegion,
        country: data.country,
        residesInGabon: data.residesInGabon ?? false,
        province: data.province,
        ville: data.ville,
        commune: data.commune,
        emailVerified: new Date(),
      },
    });

    const badge = await prisma.badge.findUnique({ where: { name: "Observateur" } });
    if (badge) {
      await prisma.user.update({
        where: { id: user.id },
        data: { badges: { connect: { id: badge.id } } },
      });
    }

    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[API /auth/signup]", error);
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 });
  }
}
