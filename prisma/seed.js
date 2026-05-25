import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding de la base de données...");

  try {
    // Clean existing data
    console.log("🗑️  Nettoyage des données existantes...");
    await prisma.response.deleteMany();
    await prisma.answer.deleteMany();
    await prisma.question.deleteMany();
    await prisma.survey.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.user.deleteMany();
    await prisma.region.deleteMany();
    await prisma.trend.deleteMany();

    // Create regions (Provinces gabonaises)
    console.log("📍 Création des régions...");
    const regions = await prisma.region.createMany({
      data: [
        { name: "Libreville", population: 850000, latitude: 0.4162, longitude: 9.4673 },
        { name: "Port-Gentil", population: 120000, latitude: -0.7193, longitude: 8.7815 },
        { name: "Franceville", population: 50000, latitude: -1.6333, longitude: 13.5833 },
        { name: "Oyem", population: 60000, latitude: 1.6167, longitude: 11.5833 },
        { name: "Mouila", population: 25000, latitude: -2.0833, longitude: 10.8333 },
        { name: "Lambaréné", population: 8000, latitude: 0.7, longitude: 10.2333 },
        { name: "Koulamoutou", population: 12000, latitude: -0.6167, longitude: 12.35 },
        { name: "Mitzic", population: 3500, latitude: 1.25, longitude: 12.1833 },
      ],
    });
    console.log(`✅ ${regions.count} régions créées`);

    // Create badges
    console.log("🏆 Création des insignes...");
    const badges = await prisma.badge.createMany({
      data: [
        {
          name: "Observateur",
          description: "Premiers pas dans la plateforme",
          icon: "👁️",
        },
        {
          name: "Analyste",
          description: "5 sondages complétés",
          icon: "📊",
        },
        {
          name: "Citoyen engagé",
          description: "25 participations",
          icon: "🙌",
        },
        {
          name: "Influenceur",
          description: "50+ participants à ses sondages",
          icon: "⭐",
        },
        {
          name: "Expert données",
          description: "Données précises et complètes",
          icon: "🔬",
        },
        {
          name: "Champion régional",
          description: "Plus actif dans sa région",
          icon: "🥇",
        },
      ],
    });
    console.log(`✅ ${badges.count} insignes créés`);

    // Create users (Noms gabonais réalistes)
    console.log("👥 Création des utilisateurs...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = await prisma.user.createMany({
      data: [
        {
          email: "alice.mbonda@gabonais.com",
          name: "Alice Mbonda",
          password: hashedPassword,
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
          region: "Libreville",
          role: "user",
          emailVerified: new Date(),
        },
        {
          email: "bob.nzambi@gabonais.com",
          name: "Bob Nzambi",
          password: hashedPassword,
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
          region: "Port-Gentil",
          role: "user",
          emailVerified: new Date(),
        },
        {
          email: "claire.ovono@gabonais.com",
          name: "Claire Ovono",
          password: hashedPassword,
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Claire",
          region: "Franceville",
          role: "user",
          emailVerified: new Date(),
        },
        {
          email: "jean.ondoua@gabonais.com",
          name: "Jean Ondoua",
          password: hashedPassword,
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
          region: "Oyem",
          role: "user",
          emailVerified: new Date(),
        },
        {
          email: "marie.dibango@gabonais.com",
          name: "Marie Dibango",
          password: hashedPassword,
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
          region: "Lambaréné",
          role: "user",
          emailVerified: new Date(),
        },
        {
          email: "pierre.mangue@gabonais.com",
          name: "Pierre Mangué",
          password: hashedPassword,
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre",
          region: "Mouila",
          role: "admin",
          emailVerified: new Date(),
        },
      ],
    });
    console.log(`✅ ${users.count} utilisateurs créés`);

    // Get created users
    const allUsers = await prisma.user.findMany();

    // Assign badges to users
    const observerBadge = await prisma.badge.findUnique({
      where: { name: "Observateur" },
    });
    if (observerBadge) {
      for (const user of allUsers) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            badges: {
              connect: { id: observerBadge.id },
            },
          },
        });
      }
    }

    // Create surveys
    console.log("📋 Création des sondages...");

    const surveyCategories = [
      {
        title: "Coût de la vie au Gabon",
        description:
          "Comment percevez-vous l'évolution du coût de la vie au Gabon en 2026 ?",
        category: "Économie",
        region: "Gabon",
        creator: allUsers[0],
      },
      {
        title: "État de l'emploi",
        description:
          "Quelle est votre situation professionnelle actuelle et les perspectives d'emploi ?",
        category: "Emploi",
        region: "Libreville",
        creator: allUsers[1],
      },
      {
        title: "Transport et mobilité",
        description:
          "Quels sont les principaux défis de transport que vous rencontrez ?",
        category: "Transport",
        region: "Port-Gentil",
        creator: allUsers[2],
      },
      {
        title: "Accès à l'internet",
        description: "Qualité et accessibilité de l'internet au Gabon",
        category: "Internet",
        region: "Gabon",
        creator: allUsers[3],
      },
      {
        title: "Système de santé",
        description:
          "Comment évaluez-vous la qualité des services de santé dans votre région ?",
        category: "Santé",
        region: "Franceville",
        creator: allUsers[4],
      },
      {
        title: "Éducation",
        description:
          "État et qualité du système éducatif au Gabon",
        category: "Éducation",
        region: "Gabon",
        creator: allUsers[0],
      },
    ];

    for (const surveyData of surveyCategories) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 20) + 5);

      const survey = await prisma.survey.create({
        data: {
          title: surveyData.title,
          description: surveyData.description,
          category: surveyData.category,
          region: surveyData.region,
          creatorId: surveyData.creator.id,
          endDate,
          status: "active",
        },
      });

      // Create questions based on survey type
      let questions = [];

      if (surveyData.category === "Économie") {
        questions = [
          {
            text: "Quel est votre revenu mensuel approximatif ?",
            type: "multiple",
            options: [
              "< 200,000 FCFA",
              "200,000 - 500,000 FCFA",
              "500,000 - 1,000,000 FCFA",
              "> 1,000,000 FCFA",
            ],
            order: 1,
          },
          {
            text: "Votre dépense alimentaire mensuelle ?",
            type: "multiple",
            options: [
              "< 100,000 FCFA",
              "100,000 - 200,000 FCFA",
              "200,000 - 300,000 FCFA",
              "> 300,000 FCFA",
            ],
            order: 2,
          },
          {
            text: "Votre plus grande difficulté financière ?",
            type: "multiple",
            options: [
              "Alimentation",
              "Énergie/Électricité",
              "Santé",
              "Transport",
              "Logement",
              "Éducation",
            ],
            order: 3,
          },
          {
            text: "Comment jugez-vous l'évolution des prix ?",
            type: "scale",
            options: ["1", "2", "3", "4", "5"],
            order: 4,
          },
        ];
      } else if (surveyData.category === "Emploi") {
        questions = [
          {
            text: "Êtes-vous actuellement en emploi ?",
            type: "yes_no",
            options: ["Oui", "Non"],
            order: 1,
          },
          {
            text: "Quel secteur vous intéresse le plus ?",
            type: "multiple",
            options: [
              "Secteur public",
              "Secteur privé",
              "Entrepreneuriat",
              "Freelance",
            ],
            order: 2,
          },
          {
            text: "Quelle est votre plus grande attente en matière d'emploi ?",
            type: "text",
            options: [],
            order: 3,
          },
        ];
      } else if (surveyData.category === "Transport") {
        questions = [
          {
            text: "Quel type de transport utilisez-vous principalement ?",
            type: "multiple",
            options: [
              "Voiture personnelle",
              "Transport en commun",
              "Taxi",
              "À pied",
              "Moto",
            ],
            order: 1,
          },
          {
            text: "Satisfaction avec l'état des routes",
            type: "scale",
            options: ["Très insatisfait", "Insatisfait", "Neutre", "Satisfait", "Très satisfait"],
            order: 2,
          },
        ];
      } else {
        questions = [
          {
            text: "Comment évaluez-vous ce service ?",
            type: "scale",
            options: ["1", "2", "3", "4", "5"],
            order: 1,
          },
          {
            text: "Avez-vous des suggestions d'amélioration ?",
            type: "text",
            options: [],
            order: 2,
          },
        ];
      }

      for (const q of questions) {
        await prisma.question.create({
          data: {
            ...q,
            surveyId: survey.id,
          },
        });
      }
    }

    console.log(`✅ ${surveyCategories.length} sondages créés avec questions`);

    // Get all surveys and questions
    const allSurveys = await prisma.survey.findMany({
      include: { questions: true },
    });

    // Create responses from users
    console.log("📝 Création des réponses...");
    let totalResponses = 0;

    for (const survey of allSurveys) {
      // Each user responds to each survey
      for (let i = 0; i < Math.min(allUsers.length, 5); i++) {
        const user = allUsers[i];

        // Check if already responded
        const existing = await prisma.response.findUnique({
          where: {
            surveyId_userId: {
              surveyId: survey.id,
              userId: user.id,
            },
          },
        });

        if (existing) continue;

        const answers = survey.questions.map((q, idx) => {
          let text = "";
          if (q.type === "yes_no") {
            text = Math.random() > 0.5 ? "Oui" : "Non";
          } else if (q.type === "scale") {
            text = q.options[Math.floor(Math.random() * q.options.length)];
          } else if (q.type === "multiple" || q.type === "single") {
            text = q.options[Math.floor(Math.random() * q.options.length)];
          } else {
            text = "Commentaire de test";
          }
          return { questionId: q.id, text };
        });

        await prisma.response.create({
          data: {
            surveyId: survey.id,
            userId: user.id,
            region: user.region,
            answers: {
              create: answers,
            },
          },
        });

        totalResponses++;
      }
    }

    console.log(`✅ ${totalResponses} réponses créées`);

    // Create trends
    console.log("📈 Création des tendances...");
    const trends = [
      {
        title: "Coût de la vie",
        category: "Économie",
        score: 92.5,
        trending: true,
        trend_type: "hot" as const,
      },
      {
        title: "Emploi",
        category: "Emploi",
        score: 78.3,
        trending: true,
        trend_type: "rising" as const,
      },
      {
        title: "Transport",
        category: "Transport",
        score: 65.2,
        trending: false,
        trend_type: "rising" as const,
      },
      {
        title: "Accès Internet",
        category: "Internet",
        score: 55.8,
        trending: false,
        trend_type: "falling" as const,
      },
    ];

    await prisma.trend.createMany({
      data: trends,
    });

    console.log(`✅ ${trends.length} tendances créées`);

    console.log("\n✨ Seeding complété avec succès !");
    console.log(
      `
    📊 Résumé:
    - ${regions.count} régions
    - ${badges.count} insignes
    - ${users.count} utilisateurs
    - ${allSurveys.length} sondages
    - ${totalResponses} réponses
    - ${trends.length} tendances
    `
    );
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
