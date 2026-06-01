import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Gabon Names Database ─────────────────────────────────────────────────────
const gabonNames = {
  male: [
    "Jean", "Pierre", "Paul", "Marc", "Luc", "Jacques", "André", "François",
    "Philippe", "Bernard", "Michel", "Roger", "Denis", "Claude", "Laurent",
    "Alain", "Christian", "Bruno", "Olivier", "Christophe", "Nicolas", "Antoine",
    "Benjamin", "Gabriel", "Samuel", "David", "Alexandre", "Thomas", "Jérôme",
    "Fabrice", "Joël", "Serge", "Yves", "Patrick", "Dominique", "Charles",
    "Emmanuel", "Stéphane", "Frédéric", "Benoît", "Sylvain", "Vincent"
  ],
  female: [
    "Marie", "Anne", "Isabelle", "Christine", "Nicole", "Catherine", "Monique",
    "Véronique", "Chantal", "Danielle", "Claudette", "Bernadette", "Francoise",
    "Martine", "Jacqueline", "Michèle", "Sylvie", "Carole", "Nathalie", "Sophie",
    "Valérie", "Corinne", "Stéphanie", "Fabienne", "Sandrine", "Jessica", "Laure",
    "Alexandra", "Delphine", "Émilie", "Céline", "Mégane", "Valerie", "Pascale"
  ],
  surnames: [
    "Mbonda", "Nzambi", "Ovono", "Ondoua", "Dibango", "Mangué", "Biyoghe",
    "Awono", "Ekollo", "Nkina", "Bessang", "Essomba", "Eyong", "Nguema",
    "Batoum", "Moussavou", "Mébé", "Bounghanda", "Madiakite", "Menyonga",
    "Kella", "Boungou", "Mabika", "Minko", "Dognin", "Akendengue", "Essone",
    "Boudimbou", "Yomba", "Nyonda", "Ndamba", "Tsondou", "Ebongue", "Mbassi"
  ]
};

const surveyCategories = [
  { category: "Économie", emoji: "💰" },
  { category: "Emploi", emoji: "💼" },
  { category: "Santé", emoji: "🏥" },
  { category: "Éducation", emoji: "📚" },
  { category: "Transport", emoji: "🚗" },
  { category: "Internet", emoji: "📡" },
  { category: "Environnement", emoji: "🌍" },
  { category: "Logement", emoji: "🏠" },
  { category: "Agriculture", emoji: "🌾" },
  { category: "Tourisme", emoji: "✈️" },
  { category: "Sports", emoji: "⚽" },
  { category: "Culture", emoji: "🎭" }
];

const gabonRegions = [
  { name: "Libreville", population: 850000, latitude: 0.4162, longitude: 9.4673 },
  { name: "Port-Gentil", population: 120000, latitude: -0.7193, longitude: 8.7815 },
  { name: "Franceville", population: 50000, latitude: -1.6333, longitude: 13.5833 },
  { name: "Oyem", population: 60000, latitude: 1.6167, longitude: 11.5833 },
  { name: "Mouila", population: 25000, latitude: -2.0833, longitude: 10.8333 },
  { name: "Lambaréné", population: 8000, latitude: 0.7, longitude: 10.2333 },
  { name: "Koulamoutou", population: 12000, latitude: -0.6167, longitude: 12.35 },
  { name: "Mitzic", population: 3500, latitude: 1.25, longitude: 12.1833 },
  { name: "Tchibanga", population: 5000, latitude: -2.92, longitude: 11.03 },
  { name: "Gamba", population: 2000, latitude: -2.63, longitude: 9.63 }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getRandomName(gender?: "male" | "female"): string {
  const gen = gender || (Math.random() > 0.5 ? "male" : "female");
  const firstName = gabonNames[gen][Math.floor(Math.random() * gabonNames[gen].length)];
  const surname = gabonNames.surnames[Math.floor(Math.random() * gabonNames.surnames.length)];
  return `${firstName} ${surname}`;
}

function getRandomRegion() {
  return gabonRegions[Math.floor(Math.random() * gabonRegions.length)];
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateSurveyData(creator: any, regionName: string) {
  const surveys: any[] = [];

  // ─── Économie & Finance (50 surveys) ──────────────────────────────────────
  surveys.push({
    title: "Coût de la vie au Gabon 2026",
    description: "Impact de l'inflation sur votre budget mensuel",
    category: "Économie",
    questions: [
      {
        text: "Revenu mensuel approximatif",
        type: "multiple",
        options: ["< 200k FCFA", "200k-500k FCFA", "500k-1M FCFA", "1M-2M FCFA", "> 2M FCFA"]
      },
      { text: "Inflation: situation personnelle", type: "scale", options: ["1", "2", "3", "4", "5"] },
      {
        text: "Plus grande dépense mensuelle",
        type: "multiple",
        options: ["Alimentation", "Loyer", "Transport", "Santé", "Électricité", "Éducation"]
      },
      { text: "Confiance économique personnelle", type: "scale", options: ["1", "2", "3", "4", "5"] }
    ]
  });

  surveys.push({
    title: "Accès au crédit bancaire",
    description: "Facilité d'accès aux crédits et microfinance",
    category: "Économie",
    questions: [
      {
        text: "Avez-vous accès à un compte bancaire ?",
        type: "yes_no"
      },
      {
        text: "Avez-vous déjà demandé un crédit ?",
        type: "yes_no"
      },
      {
        text: "Taux d'intérêt acceptable",
        type: "multiple",
        options: ["< 5%", "5-10%", "10-15%", "15-20%", "> 20%"]
      }
    ]
  });

  surveys.push({
    title: "Commerce électronique au Gabon",
    description: "Pratiques d'achat en ligne et confiance numérique",
    category: "Économie",
    questions: [
      {
        text: "Fréquence d'achat en ligne",
        type: "multiple",
        options: ["Jamais", "Rarement", "Parfois", "Souvent", "Très souvent"]
      },
      {
        text: "Principal obstacle e-commerce",
        type: "multiple",
        options: ["Paiement", "Livraison", "Confiance", "Choix produits", "Prix"]
      }
    ]
  });

  // Add more economy surveys (46 more)...
  for (let i = 0; i < 46; i++) {
    surveys.push({
      title: `Sondage Économique #${i + 4}`,
      description: `Question économique sur les réalités du Gabon`,
      category: "Économie",
      questions: [
        {
          text: "Comment évaluez-vous cette situation ?",
          type: "scale",
          options: ["1", "2", "3", "4", "5"]
        }
      ]
    });
  }

  // ─── Emploi (50 surveys) ──────────────────────────────────────────────────
  surveys.push({
    title: "Situation professionnelle 2026",
    description: "État du marché du travail au Gabon",
    category: "Emploi",
    questions: [
      {
        text: "Êtes-vous employé ?",
        type: "yes_no"
      },
      {
        text: "Type de contrat",
        type: "multiple",
        options: ["CDI", "CDD", "Indépendant", "Stage", "Sans emploi"]
      },
      {
        text: "Satisfaction professionnelle",
        type: "scale",
        options: ["1", "2", "3", "4", "5"]
      }
    ]
  });

  surveys.push({
    title: "Télétravail et flexibilité",
    description: "Adoption du télétravail au Gabon",
    category: "Emploi",
    questions: [
      {
        text: "Pratiquez-vous le télétravail ?",
        type: "yes_no"
      },
      {
        text: "Préférence: télétravail vs bureau",
        type: "multiple",
        options: ["Télétravail complet", "Hybride", "Bureau complet", "Sans préférence"]
      }
    ]
  });

  surveys.push({
    title: "Formation professionnelle",
    description: "Accès à la formation continue",
    category: "Emploi",
    questions: [
      {
        text: "Avez-vous accès à la formation ?",
        type: "yes_no"
      },
      {
        text: "Domaines prioritaires de formation",
        type: "multiple",
        options: ["Digital", "Gestion", "Technique", "Langues", "Leadership"]
      }
    ]
  });

  // Add more employment surveys (47 more)...
  for (let i = 0; i < 47; i++) {
    surveys.push({
      title: `Sondage Emploi #${i + 4}`,
      description: `Question professionnelle`,
      category: "Emploi",
      questions: [
        {
          text: "Votre avis sur cette thématique ?",
          type: "scale",
          options: ["1", "2", "3", "4", "5"]
        }
      ]
    });
  }

  // ─── Santé (40 surveys) ───────────────────────────────────────────────────
  surveys.push({
    title: "Accès aux services de santé",
    description: "Qualité et accessibilité des soins",
    category: "Santé",
    questions: [
      {
        text: "Avez-vous accès à un médecin ?",
        type: "yes_no"
      },
      {
        text: "Évaluation des services de santé",
        type: "scale",
        options: ["1", "2", "3", "4", "5"]
      }
    ]
  });

  // Add more health surveys (39 more)...
  for (let i = 0; i < 39; i++) {
    surveys.push({
      title: `Sondage Santé #${i + 2}`,
      description: `Question de santé publique`,
      category: "Santé",
      questions: [
        {
          text: "Comment jugez-vous cet aspect ?",
          type: "scale",
          options: ["1", "2", "3", "4", "5"]
        }
      ]
    });
  }

  // ─── Éducation (40 surveys) ───────────────────────────────────────────────
  surveys.push({
    title: "Système éducatif gabonais",
    description: "Qualité et accessibilité de l'éducation",
    category: "Éducation",
    questions: [
      {
        text: "Niveau d'études",
        type: "multiple",
        options: ["Primaire", "Secondaire", "Bac", "Bac+2", "Bac+3", "Bac+5"]
      },
      {
        text: "Satisfaction système éducatif",
        type: "scale",
        options: ["1", "2", "3", "4", "5"]
      }
    ]
  });

  for (let i = 0; i < 39; i++) {
    surveys.push({
      title: `Sondage Éducation #${i + 2}`,
      description: `Question éducative`,
      category: "Éducation",
      questions: [
        {
          text: "Votre perception ?",
          type: "scale",
          options: ["1", "2", "3", "4", "5"]
        }
      ]
    });
  }

  // ─── Transport (35 surveys) ──────────────────────────────────────────────
  surveys.push({
    title: "Mobilité urbaine",
    description: "Transport et accessibilité",
    category: "Transport",
    questions: [
      {
        text: "Principal moyen de transport",
        type: "multiple",
        options: ["Voiture personnelle", "Taxi", "Bus", "Moto-taxi", "À pied"]
      },
      {
        text: "Satisfaction transport public",
        type: "scale",
        options: ["1", "2", "3", "4", "5"]
      }
    ]
  });

  for (let i = 0; i < 34; i++) {
    surveys.push({
      title: `Sondage Transport #${i + 2}`,
      description: `Question transport`,
      category: "Transport",
      questions: [
        {
          text: "Évaluation ?",
          type: "scale",
          options: ["1", "2", "3", "4", "5"]
        }
      ]
    });
  }

  // ─── Internet & Digital (30 surveys) ──────────────────────────────────────
  surveys.push({
    title: "Accès Internet au Gabon",
    description: "Qualité et prix de la connexion",
    category: "Internet",
    questions: [
      {
        text: "Type de connexion",
        type: "multiple",
        options: ["Fibre", "ADSL", "4G/5G", "Satellite", "Pas de connexion"]
      },
      {
        text: "Débit satisfaisant ?",
        type: "yes_no"
      }
    ]
  });

  for (let i = 0; i < 29; i++) {
    surveys.push({
      title: `Sondage Internet #${i + 2}`,
      description: `Question digital`,
      category: "Internet",
      questions: [
        {
          text: "Avis ?",
          type: "scale",
          options: ["1", "2", "3", "4", "5"]
        }
      ]
    });
  }

  // ─── Other Categories (15 surveys each) ────────────────────────────────────
  const otherCategories = [
    { name: "Environnement", desc: "Question environnementale" },
    { name: "Logement", desc: "Question immobilière" },
    { name: "Agriculture", desc: "Question agricole" },
    { name: "Tourisme", desc: "Question touristique" },
    { name: "Culture", desc: "Question culturelle" }
  ];

  for (const cat of otherCategories) {
    for (let i = 0; i < 15; i++) {
      surveys.push({
        title: `Sondage ${cat.name} #${i + 1}`,
        description: cat.desc,
        category: cat.name,
        questions: [
          {
            text: "Comment percevez-vous cela ?",
            type: "scale",
            options: ["1", "2", "3", "4", "5"]
          }
        ]
      });
    }
  }

  return surveys;
}

// ─── Seeding Function ─────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Début du seeding de la base de données...");

  try {
    // Clean existing data
    console.log("🗑️  Nettoyage des données existantes...");
    await prisma.statistics.deleteMany();
    await prisma.response.deleteMany();
    await prisma.answer.deleteMany();
    await prisma.question.deleteMany();
    await prisma.survey.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.user.deleteMany();
    await prisma.region.deleteMany();

    // Create regions
    console.log("📍 Création des régions...");
    await prisma.region.createMany({ data: gabonRegions });
    console.log(`✅ ${gabonRegions.length} régions créées`);

    // Create badges
    console.log("🏆 Création des insignes...");
    const badges = await prisma.badge.createMany({
      data: [
        { name: "Observateur", description: "Premiers pas dans la plateforme", icon: "👁️" },
        { name: "Analyste", description: "5 sondages complétés", icon: "📊" },
        { name: "Citoyen engagé", description: "25 participations", icon: "🙌" },
        { name: "Influenceur", description: "50+ participants à ses sondages", icon: "⭐" },
        { name: "Expert données", description: "Données précises et complètes", icon: "🔬" },
        { name: "Champion régional", description: "Plus actif dans sa région", icon: "🥇" }
      ]
    });
    console.log(`✅ ${badges.count} insignes créés`);

    // Create users (100+ users)
    console.log("👥 Création des utilisateurs...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const userCount = 120;

    const userData = [];
    for (let i = 0; i < userCount; i++) {
      const gender = i % 2 === 0 ? "male" : "female";
      const region = getRandomRegion();
      userData.push({
        email: `user${i}@gabonais.local`,
        name: getRandomName(gender),
        password: hashedPassword,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
        region: region.name,
        residesInGabon: Math.random() > 0.2,
        role: i === 0 ? "admin" : "user",
        emailVerified: new Date()
      });
    }

    const usersResult = await prisma.user.createMany({ data: userData });
    const allUsers = await prisma.user.findMany();
    console.log(`✅ ${allUsers.length} utilisateurs créés`);

    // Assign badges randomly
    const badgesList = await prisma.badge.findMany();
    for (const user of allUsers.slice(0, Math.min(50, allUsers.length))) {
      const randomBadges = badgesList
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1);
      
      for (const badge of randomBadges) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            badges: { connect: { id: badge.id } }
          }
        });
      }
    }

    // Create surveys with questions
    console.log("📋 Création des sondages et questions...");
    const firstUser = allUsers[0];
    const surveyData = generateSurveyData(firstUser, "Gabon");

    let surveyCount = 0;
    for (const surveyDef of surveyData) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30) + 7);

      const survey = await prisma.survey.create({
        data: {
          title: surveyDef.title,
          description: surveyDef.description,
          category: surveyDef.category,
          region: getRandomRegion().name,
          creatorId: getRandomElement(allUsers).id,
          status: Math.random() > 0.3 ? "active" : "closed",
          endDate,
          questions: {
            create: surveyDef.questions.map((q: any, idx: number) => ({
              text: q.text,
              type: q.type,
              order: idx,
              options: q.options || []
            }))
          }
        },
        include: { questions: true }
      });

      // Create responses for 30-70% of users
      const respondentCount = Math.floor(allUsers.length * (Math.random() * 0.4 + 0.3));
      const respondents = allUsers.sort(() => Math.random() - 0.5).slice(0, respondentCount);

      for (const respondent of respondents) {
        try {
          const response = await prisma.response.create({
            data: {
              surveyId: survey.id,
              userId: respondent.id,
              region: respondent.region || "Gabon",
              answers: {
                create: survey.questions.map((q: any) => ({
                  questionId: q.id,
                  text: q.options?.[Math.floor(Math.random() * (q.options?.length || 1))] || "Oui"
                }))
              }
            }
          });
        } catch (err) {
          // Skip duplicate responses
        }
      }

      // Create statistics
      const responseCount = await prisma.response.count({
        where: { surveyId: survey.id }
      });

      if (responseCount > 0) {
        await prisma.statistics.create({
          data: {
            surveyId: survey.id,
            totalResponses: responseCount,
            participationRate: (responseCount / allUsers.length) * 100,
            trends: JSON.stringify({ category: surveyDef.category, momentum: "stable" })
          }
        });
      }

      surveyCount++;
      if (surveyCount % 50 === 0) {
        console.log(`  ⏳ ${surveyCount} sondages créés...`);
      }
    }

    console.log(`✅ ${surveyCount} sondages avec questions et réponses créés`);

    console.log("\n🎉 ───────────────────────────────────────────────────────");
    console.log(`✅ Seeding complété avec succès !`);
    console.log(`   • ${allUsers.length} utilisateurs`);
    console.log(`   • ${surveyCount} sondages`);
    console.log(`   • ${gabonRegions.length} régions`);
    console.log("🎉 ───────────────────────────────────────────────────────\n");

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
