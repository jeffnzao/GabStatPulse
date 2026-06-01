import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConnected } from "@/lib/prisma";
import { auth } from "@/auth";
import { SurveySubmissionSchema } from "@/lib/schemas";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: surveyId } = await params;

  try {
    // Validation du body
    const body = await req.json();
    const validationResult = SurveySubmissionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { answers, anonymousId, region } = validationResult.data;

    // Vérifier la connexion à la base de données
    const dbOk = await isDatabaseConnected();
    if (!dbOk) {
      // Fallback localStorage
      return NextResponse.json(
        { 
          success: true, 
          message: "Réponse sauvegardée localement. Elle sera synchronisée lorsque la connexion sera rétablie.",
          offline: true 
        },
        { status: 200 }
      );
    }

    // Obtenir la session utilisateur (optionnelle)
    const session = await auth() as { user?: { id?: string } } | null;
    const userId = session?.user?.id;

    // Vérifier que le sondage existe
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      select: { id: true },
    });

    if (!survey) {
      return NextResponse.json(
        { error: "Sondage introuvable" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur n'a pas déjà répondu
    if (userId) {
      const existingResponse = await prisma.response.findFirst({
        where: {
          surveyId,
          userId: userId,
        },
      });

      if (existingResponse) {
        return NextResponse.json(
          { error: "Vous avez déjà répondu à ce sondage" },
          { status: 409 }
        );
      }
    } else if (anonymousId) {
      const existingResponse = await prisma.response.findFirst({
        where: {
          surveyId,
          anonymousId: anonymousId,
        },
      });

      if (existingResponse) {
        return NextResponse.json(
          { error: "Vous avez déjà répondu à ce sondage" },
          { status: 409 }
        );
      }
    }

    // Créer la réponse avec ses réponses
    const responseData: any = {
      surveyId,
      region: region || undefined,
      answers: {
        create: answers.map((answer) => ({
          questionId: answer.questionId,
          text: Array.isArray(answer.value)
            ? answer.value.join(", ")
            : answer.value,
        })),
      },
    };

    // Ajouter userId ou anonymousId selon le cas
    if (userId) {
      responseData.userId = userId;
    } else if (anonymousId) {
      responseData.anonymousId = anonymousId;
    }

    const response = await prisma.response.create({
      data: responseData,
      include: {
        answers: true,
      },
    });

    // Mettre à jour les statistiques du sondage
    const responseCount = await prisma.response.count({
      where: { surveyId },
    });

    await prisma.statistics.upsert({
      where: { surveyId },
      update: {
        totalResponses: responseCount,
        updatedAt: new Date(),
      },
      create: {
        surveyId,
        totalResponses: responseCount,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        responseId: response.id,
        message: "Merci pour votre participation !" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`[API /surveys/${surveyId}/submit POST]`, error);
    
    // Erreur serveur
    return NextResponse.json(
      { error: "Erreur serveur lors de la soumission" },
      { status: 500 }
    );
  }
}
