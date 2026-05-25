import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean up
  await prisma.response.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.survey.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();
  await prisma.region.deleteMany();

  // Create regions
  const regions = await prisma.region.createMany({
    data: [
      { name: "Libreville", population: 850000, latitude: 0.4162, longitude: 9.4673 },
      { name: "Port-Gentil", population: 120000, latitude: -0.7193, longitude: 8.7815 },
      { name: "Franceville", population: 50000, latitude: -1.6333, longitude: 13.5833 },
      { name: "Oyem", population: 60000, latitude: 1.6167, longitude: 11.5833 },
      { name: "Mouila", population: 25000, latitude: -2.0833, longitude: 10.8333 },
      { name: "Lambaréné", population: 8000, latitude: 0.7, longitude: 10.2333 },
    ],
  });

  // Create badges
  const badges = await prisma.badge.createMany({
    data: [
      { name: "Observateur", description: "Premiers pas dans la plateforme", icon: "👁️" },
      { name: "Analyste", description: "5 sondages complétés", icon: "📊" },
      { name: "Citoyen engagé", description: "25 participations", icon: "🙌" },
      { name: "Influenceur", description: "50+ participants à ses sondages", icon: "⭐" },
    ],
  });

  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await prisma.user.createMany({
    data: [
      {
        email: "alice@gabonais.local",
        name: "Alice Mbonda",
        password: hashedPassword,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        region: "Libreville",
        emailVerified: new Date(),
      },
      {
        email: "bob@gabonais.local",
        name: "Bob Nzambi",
        password: hashedPassword,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        region: "Port-Gentil",
        emailVerified: new Date(),
      },
      {
        email: "claire@gabonais.local",
        name: "Claire Ovono",
        password: hashedPassword,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Claire",
        region: "Franceville",
        emailVerified: new Date(),
      },
    ],
  });

  // Create surveys
  const survey1 = await prisma.survey.create({
    data: {
      title: "Coût de la vie au Gabon",
      description: "Sondage sur le coût de la vie et les difficultés financières des Gabonais",
      category: "Économie",
      region: "Libreville",
      creatorId: users[0]?.id,
      status: "active",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const survey2 = await prisma.survey.create({
    data: {
      title: "État de l'emploi 2026",
      description: "Situation d'emploi et opportunités professionnelles",
      category: "Emploi",
      region: "Gabon",
      creatorId: users[1]?.id,
      status: "active",
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Create questions for survey1
  await prisma.question.createMany({
    data: [
      {
        surveyId: survey1.id,
        text: "Quel est votre revenu mensuel approximatif ?",
        type: "multiple",
        order: 1,
        options: ["< 200,000 FCFA", "200,000 - 500,000 FCFA", "500,000 - 1,000,000 FCFA", "> 1,000,000 FCFA"],
      },
      {
        surveyId: survey1.id,
        text: "Votre dépense alimentaire mensuelle ?",
        type: "multiple",
        order: 2,
        options: ["< 100,000 FCFA", "100,000 - 200,000 FCFA", "200,000 - 300,000 FCFA", "> 300,000 FCFA"],
      },
      {
        surveyId: survey1.id,
        text: "Votre plus grande difficulté financière ?",
        type: "multiple",
        order: 3,
        options: ["Alimentation", "Énergie/Électricité", "Santé", "Transport", "Logement", "Éducation"],
      },
      {
        surveyId: survey1.id,
        text: "Comment jugez-vous l'évolution des prix ?",
        type: "scale",
        order: 4,
        options: ["1", "2", "3", "4", "5"],
      },
    ],
  });

  // Create questions for survey2
  await prisma.question.createMany({
    data: [
      {
        surveyId: survey2.id,
        text: "Êtes-vous actuellement en emploi ?",
        type: "yes_no",
        order: 1,
      },
      {
        surveyId: survey2.id,
        text: "Quel secteur vous intéresse le plus ?",
        type: "multiple",
        order: 2,
        options: ["Secteur public", "Secteur privé", "Entrepreneuriat", "Freelance", "Pas de préférence"],
      },
    ],
  });

  // Create responses (answers from users)
  const questions1 = await prisma.question.findMany({
    where: { surveyId: survey1.id },
  });

  for (const user of users) {
    const response = await prisma.response.create({
      data: {
        surveyId: survey1.id,
        userId: user.id,
        region: user.region,
        answers: {
          create: questions1.map((q, idx) => ({
            questionId: q.id,
            text: ["200,000 - 500,000 FCFA", "100,000 - 200,000 FCFA", "Alimentation", "3"][idx] || "",
          })),
        },
      },
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
