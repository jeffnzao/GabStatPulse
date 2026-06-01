/**
 * lib/mockData.ts
 * Données fictives gabonaises pour le mode développement.
 * Utilisées automatiquement quand la DB / Supabase ne sont pas configurés.
 */

// ─── Types ────────────────────────────────────────────────────────────────────
export interface MockUser {
  id: string;
  name: string;
  email: string;
  region: string;
  role: "user" | "admin";
  image: string;
  createdAt: string;
}

export interface MockQuestion {
  id: string;
  text: string;
  type: "yes_no" | "single" | "multiple" | "scale" | "rating" | "text";
  options?: string[];
  order: number;
}

export interface MockSurvey {
  id: string;
  title: string;
  description: string;
  category: string;
  region: string;
  status: "active" | "closed";
  createdAt: string;
  endDate: string;
  _count: { responses: number };
  creator: { name: string; image: string };
  questions: MockQuestion[];
}

export interface MockTrend {
  id: string;
  title: string;
  category: string;
  score: number;
  trending: boolean;
  trend_type: "hot" | "rising" | "falling";
  responseCount: number;
}

export interface RegionStat {
  name: string;
  participants: number;
}

export interface MockStats {
  totalSurveys: number;
  totalParticipants: number;
  totalUsers: number;
  regionStats: RegionStat[];
}

export interface GabonIndicator {
  category: string;
  label: string;
  value: number; // pourcentage 0-100
  trend: "up" | "down" | "stable";
  icon: string;
}

// ─── Régions du Gabon ─────────────────────────────────────────────────────────
export const GABON_REGIONS = [
  { name: "Libreville", population: 813000, participants: 4200 },
  { name: "Port-Gentil", population: 136500, participants: 1850 },
  { name: "Franceville", population: 110568, participants: 920 },
  { name: "Oyem", population: 56000, participants: 480 },
  { name: "Moanda", population: 43000, participants: 370 },
  { name: "Mouila", population: 40000, participants: 310 },
  { name: "Lambaréné", population: 38000, participants: 290 },
  { name: "Tchibanga", population: 33000, participants: 240 },
  { name: "Koulamoutou", population: 24000, participants: 190 },
];

// ─── Utilisateurs fictifs ─────────────────────────────────────────────────────
export const mockUsers: MockUser[] = [
  {
    id: "mock-user-1",
    name: "Jean-Baptiste Mboumba",
    email: "jb.mboumba@demo.ga",
    region: "Libreville",
    role: "admin",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jb",
    createdAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "mock-user-2",
    name: "Carine Ndong Ella",
    email: "c.ndong@demo.ga",
    region: "Port-Gentil",
    role: "user",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=carine",
    createdAt: "2025-02-03T10:30:00Z",
  },
  {
    id: "mock-user-3",
    name: "Patrick Ondo Mba",
    email: "p.ondo@demo.ga",
    region: "Franceville",
    role: "user",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=patrick",
    createdAt: "2025-03-12T14:15:00Z",
  },
  {
    id: "mock-user-4",
    name: "Sylvie Bouanga",
    email: "s.bouanga@demo.ga",
    region: "Oyem",
    role: "user",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sylvie",
    createdAt: "2025-03-20T09:00:00Z",
  },
  {
    id: "mock-user-5",
    name: "Michel Nzoghe",
    email: "m.nzoghe@demo.ga",
    region: "Libreville",
    role: "user",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michel",
    createdAt: "2025-04-01T11:45:00Z",
  },
];

// ─── Sondages fictifs ─────────────────────────────────────────────────────────
export const mockSurveys: MockSurvey[] = [
  {
    id: "mock-survey-1",
    title: "Coût de la vie à Libreville en 2026",
    description: "Évaluation du pouvoir d'achat et des dépenses quotidiennes des ménages gabonais.",
    category: "Coût de la vie",
    region: "Libreville",
    status: "active",
    createdAt: "2026-05-01T08:00:00Z",
    endDate: "2026-06-30T23:59:59Z",
    _count: { responses: 1250 },
    creator: { name: "Jean-Baptiste Mboumba", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jb" },
    questions: [
      {
        id: "q1-1",
        text: "Avez-vous remarqué une augmentation du coût de la vie ces 6 derniers mois ?",
        type: "yes_no",
        order: 0,
      },
      {
        id: "q1-2",
        text: "Quel est votre revenu mensuel approximatif ?",
        type: "single",
        options: ["< 200 000 FCFA", "200 000 - 500 000 FCFA", "500 000 - 1 000 000 FCFA", "> 1 000 000 FCFA"],
        order: 1,
      },
      {
        id: "q1-3",
        text: "Quelle est votre plus grande préoccupation financière ?",
        type: "multiple",
        options: ["Alimentation", "Loyer/Habitation", "Transport", "Santé", "Éducation", "Électricité"],
        order: 2,
      },
      {
        id: "q1-4",
        text: "Comment évaluez-vous votre situation économique actuelle ?",
        type: "scale",
        options: ["Très mauvaise", "Mauvaise", "Neutre", "Bonne", "Très bonne"],
        order: 3,
      },
    ],
  },
  {
    id: "mock-survey-2",
    title: "Situation de l'emploi des jeunes gabonais",
    description: "Analyse du chômage et des opportunités pour les 18-35 ans au Gabon.",
    category: "Emploi",
    region: "Gabon",
    status: "active",
    createdAt: "2026-05-05T10:00:00Z",
    endDate: "2026-06-15T23:59:59Z",
    _count: { responses: 890 },
    creator: { name: "Carine Ndong Ella", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=carine" },
    questions: [
      {
        id: "q2-1",
        text: "Êtes-vous actuellement en emploi ?",
        type: "yes_no",
        order: 0,
      },
      {
        id: "q2-2",
        text: "Quel type d'emploi vous intéresse le plus ?",
        type: "multiple",
        options: ["Secteur public", "Secteur privé", "Entrepreneuriat", "Freelance", "Pas de préférence"],
        order: 1,
      },
      {
        id: "q2-3",
        text: "Pensez-vous que les opportunités d'emploi s'améliorent pour les jeunes ?",
        type: "scale",
        options: ["Beaucoup moins", "Moins", "Stable", "Plus", "Beaucoup plus"],
        order: 2,
      },
      {
        id: "q2-4",
        text: "Quel secteur vous semble le plus porteur à Libreville ?",
        type: "single",
        options: ["Pétrole/Énergie", "Tourisme", "Agriculture", "Numérique", "Commerce"],
        order: 3,
      },
    ],
  },
  {
    id: "mock-survey-3",
    title: "Accès à Internet et couverture mobile",
    description: "Qualité du réseau internet et accessibilité au numérique dans les provinces.",
    category: "Internet",
    region: "Gabon",
    status: "active",
    createdAt: "2026-05-10T09:30:00Z",
    endDate: "2026-07-01T23:59:59Z",
    _count: { responses: 2100 },
    creator: { name: "Patrick Ondo Mba", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=patrick" },
    questions: [
      {
        id: "q3-1",
        text: "Avez-vous accès à Internet chez vous ?",
        type: "yes_no",
        order: 0,
      },
      {
        id: "q3-2",
        text: "Quel type de connexion utilisez-vous ?",
        type: "single",
        options: ["Fibre optique", "ADSL", "4G/5G", "Wi-Fi gratuit (café, école)", "Pas de connexion"],
        order: 1,
      },
      {
        id: "q3-3",
        text: "Êtes-vous satisfait de la vitesse de votre connexion ?",
        type: "scale",
        options: ["Très insatisfait", "Insatisfait", "Neutre", "Satisfait", "Très satisfait"],
        order: 2,
      },
      {
        id: "q3-4",
        text: "Combien payez-vous par mois pour Internet ?",
        type: "single",
        options: ["Gratuit", "< 5 000 FCFA", "5 000 - 15 000 FCFA", "15 000 - 30 000 FCFA", "> 30 000 FCFA"],
        order: 3,
      },
    ],
  },
  {
    id: "mock-survey-4",
    title: "Transport et mobilité urbaine",
    description: "État des transports en commun et de l'infrastructure routière gabonaise.",
    category: "Transport",
    region: "Libreville",
    status: "active",
    createdAt: "2026-05-12T14:00:00Z",
    endDate: "2026-06-20T23:59:59Z",
    _count: { responses: 650 },
    creator: { name: "Sylvie Bouanga", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sylvie" },
    questions: [
      {
        id: "q4-1",
        text: "Quel est votre principal moyen de transport ?",
        type: "single",
        options: ["Voiture personnelle", "Taxi", "Bus", "Moto-taxi", "À pied"],
        order: 0,
      },
      {
        id: "q4-2",
        text: "Êtes-vous satisfait des transports en commun ?",
        type: "scale",
        options: ["Très insatisfait", "Insatisfait", "Neutre", "Satisfait", "Très satisfait"],
        order: 1,
      },
      {
        id: "q4-3",
        text: "Quels problèmes rencontrez-vous avec le transport ?",
        type: "multiple",
        options: ["Prix trop élevés", "Manque de fiabilité", "Insécurité", "État des routes", "Embouteillages"],
        order: 2,
      },
      {
        id: "q4-4",
        text: "Pensez-vous qu'il faut développer les transports en commun ?",
        type: "yes_no",
        order: 3,
      },
    ],
  },
  {
    id: "mock-survey-5",
    title: "Accès aux soins de santé en province",
    description: "Disponibilité des centres de santé et médicaments dans les zones rurales.",
    category: "Santé",
    region: "Franceville",
    status: "active",
    createdAt: "2026-05-15T08:00:00Z",
    endDate: "2026-07-15T23:59:59Z",
    _count: { responses: 430 },
    creator: { name: "Michel Nzoghe", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michel" },
    questions: [
      {
        id: "q5-1",
        text: "Avez-vous accès à un centre de santé à proximité ?",
        type: "yes_no",
        order: 0,
      },
      {
        id: "q5-2",
        text: "Êtes-vous satisfait de la qualité des services de santé ?",
        type: "scale",
        options: ["Très insatisfait", "Insatisfait", "Neutre", "Satisfait", "Très satisfait"],
        order: 1,
      },
      {
        id: "q5-3",
        text: "Quel est le principal problème avec les soins de santé ?",
        type: "single",
        options: ["Prix trop élevés", "Manque de médicaments", "Équipements insuffisants", "Compétences limitées", "Distance trop grande"],
        order: 2,
      },
      {
        id: "q5-4",
        text: "Avez-vous eu besoin d'une consultation médicale ce mois-ci ?",
        type: "yes_no",
        order: 3,
      },
    ],
  },
  {
    id: "mock-survey-6",
    title: "Qualité de l'éducation publique",
    description: "Niveau des établissements scolaires et accès à l'éducation de qualité.",
    category: "Éducation",
    region: "Gabon",
    status: "active",
    createdAt: "2026-05-18T11:00:00Z",
    endDate: "2026-07-30T23:59:59Z",
    _count: { responses: 780 },
    creator: { name: "Jean-Baptiste Mboumba", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jb" },
    questions: [
      {
        id: "q6-1",
        text: "Avez-vous des enfants scolarisés ?",
        type: "yes_no",
        order: 0,
      },
      {
        id: "q6-2",
        text: "Êtes-vous satisfait de la qualité de l'éducation ?",
        type: "scale",
        options: ["Très insatisfait", "Insatisfait", "Neutre", "Satisfait", "Très satisfait"],
        order: 1,
      },
      {
        id: "q6-3",
        text: "Quels problèmes affectent l'éducation ?",
        type: "multiple",
        options: ["Manque d'infrastructure", "Sureffectifs", "Manque d'enseignants", "Coûts trop élevés", "Manque de matériel"],
        order: 2,
      },
      {
        id: "q6-4",
        text: "Pensez-vous que l'éducation s'améliore ?",
        type: "single",
        options: ["Beaucoup moins", "Moins", "Stable", "Plus", "Beaucoup plus"],
        order: 3,
      },
    ],
  },
];

// ─── Tendances fictives ───────────────────────────────────────────────────────
export const mockTrends: MockTrend[] = [
  {
    id: "trend-1",
    title: "Coût de la vie à Libreville en 2026",
    category: "Coût de la vie",
    score: 18.5,
    trending: true,
    trend_type: "hot",
    responseCount: 1250,
  },
  {
    id: "trend-2",
    title: "Accès à Internet et couverture mobile",
    category: "Internet",
    score: 14.2,
    trending: true,
    trend_type: "hot",
    responseCount: 2100,
  },
  {
    id: "trend-3",
    title: "Situation de l'emploi des jeunes gabonais",
    category: "Emploi",
    score: 9.8,
    trending: true,
    trend_type: "rising",
    responseCount: 890,
  },
  {
    id: "trend-4",
    title: "Transport et mobilité urbaine",
    category: "Transport",
    score: 6.5,
    trending: true,
    trend_type: "rising",
    responseCount: 650,
  },
  {
    id: "trend-5",
    title: "Qualité de l'éducation publique",
    category: "Éducation",
    score: 3.2,
    trending: false,
    trend_type: "rising",
    responseCount: 780,
  },
];

// ─── Statistiques globales ────────────────────────────────────────────────────
export const mockStats: MockStats = {
  totalSurveys: 24,
  totalParticipants: 8450,
  totalUsers: 3200,
  regionStats: GABON_REGIONS.map((r) => ({
    name: r.name,
    participants: r.participants,
  })),
};

// ─── Indicateurs socio-économiques du Gabon ───────────────────────────────────
export const gabonIndicators: GabonIndicator[] = [
  { category: "Coût de la vie",   label: "Taux d'inflation perçue",      value: 68, trend: "up",     icon: "💰" },
  { category: "Transport",        label: "Satisfaction transport public", value: 42, trend: "stable", icon: "🚗" },
  { category: "Emploi",           label: "Taux d'emploi déclaré",        value: 55, trend: "down",   icon: "💼" },
  { category: "Internet",         label: "Satisfaction connectivité",     value: 71, trend: "up",     icon: "📡" },
  { category: "Santé",            label: "Accès aux soins",              value: 48, trend: "stable", icon: "🏥" },
  { category: "Éducation",        label: "Satisfaction écoles",          value: 59, trend: "up",     icon: "📚" },
  { category: "Sécurité",         label: "Sentiment de sécurité",        value: 63, trend: "up",     icon: "🛡️" },
  { category: "Électricité",      label: "Accès à l'électricité",        value: 74, trend: "up",     icon: "⚡" },
  { category: "Eau",              label: "Accès eau potable",            value: 67, trend: "stable", icon: "💧" },
  { category: "Logement",         label: "Satisfaction logement",        value: 44, trend: "down",   icon: "🏠" },
];

// ─── Données de graphiques ────────────────────────────────────────────────────
export const mockChartDataWeek = [
  { name: "Lun", value: 120 },
  { name: "Mar", value: 158 },
  { name: "Mer", value: 184 },
  { name: "Jeu", value: 226 },
  { name: "Ven", value: 251 },
  { name: "Sam", value: 198 },
  { name: "Dim", value: 173 },
];

export const mockChartDataMonth = [
  { name: "01/05", value: 820 },
  { name: "08/05", value: 1150 },
  { name: "15/05", value: 980 },
  { name: "22/05", value: 1340 },
  { name: "29/05", value: 1580 },
];

export const mockCategoryData = [
  { name: "Coût de la vie", value: 1450 },
  { name: "Emploi",         value: 890 },
  { name: "Transport",      value: 650 },
  { name: "Internet",       value: 2100 },
  { name: "Santé",          value: 430 },
  { name: "Éducation",      value: 780 },
];
