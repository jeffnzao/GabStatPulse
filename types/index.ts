/**
 * types/index.ts — Déclarations TypeScript globales pour GabStat Pulse
 */

// ─── Env — toutes les vars sont optionnelles pour ne pas bloquer le build ─────
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL?: string;
      NEXTAUTH_SECRET?: string;
      NEXTAUTH_URL?: string;
      AUTH_SECRET?: string;
      GOOGLE_CLIENT_ID?: string;
      GOOGLE_CLIENT_SECRET?: string;
      NEXT_PUBLIC_SUPABASE_URL?: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
      SUPABASE_SECRET_KEY?: string;
      SUPABASE_JWT_SECRET?: string;
      CLOUDINARY_NAME?: string;
      CLOUDINARY_API_KEY?: string;
      CLOUDINARY_SECRET?: string;
    }
  }
}

// ─── NextAuth session augmentation ───────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id?: string;
  }

  interface JWT {
    id?: string;
  }
}

// ─── Survey Types ─────────────────────────────────────────────────────────────
export type QuestionType = "yes_no" | "single" | "multiple" | "scale" | "rating" | "text";

export interface SurveyQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  order: number;
}

export interface SurveyCreator {
  id?: string;
  name?: string;
  image?: string;
  email?: string;
}

export interface SurveyStats {
  responses: number;
  participationRate?: number;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  category: string;
  region: string;
  status: "active" | "closed" | "draft";
  createdAt: string;
  endDate: string;
  creatorId: string;
  creator?: SurveyCreator;
  questions: SurveyQuestion[];
  _count?: { responses: number };
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId?: string;
  region?: string;
  createdAt: string;
  answers: {
    questionId: string;
    text: string;
  }[];
}

export interface SurveyAnswer {
  questionId: string;
  text: string | string[];
}

export {};

