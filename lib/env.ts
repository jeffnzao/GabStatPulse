/**
 * lib/env.ts
 * Validation et fallback des variables d'environnement.
 * Ne fait JAMAIS échouer npm run dev — utilise des valeurs mock en dev.
 */

const isDev = process.env.NODE_ENV !== "production";

function getEnvVar(key: string, fallback: string): string {
  const value = process.env[key];

  if (!value || value === "" || value.startsWith("mock-") || value.startsWith("demo-")) {
    if (isDev) {
      console.warn(`\x1b[33m[ENV WARNING]\x1b[0m ${key} missing or using mock value → using development fallback`);
    }
    return value || fallback;
  }

  return value;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const AUTH_SECRET = getEnvVar("AUTH_SECRET", "temporary-auth-secret-for-dev-only");
export const NEXTAUTH_URL = getEnvVar("NEXTAUTH_URL", "http://localhost:3000");
export const NEXTAUTH_SECRET = getEnvVar("NEXTAUTH_SECRET", "temporary-nextauth-secret-dev");

// ─── Google OAuth ─────────────────────────────────────────────────────────────
export const GOOGLE_CLIENT_ID = getEnvVar("GOOGLE_CLIENT_ID", "mock-google-client-id");
export const GOOGLE_CLIENT_SECRET = getEnvVar("GOOGLE_CLIENT_SECRET", "mock-google-secret");

/**
 * true si Google OAuth est réellement configuré (pas mock)
 * Utilisé pour afficher/masquer le bouton "Se connecter avec Google"
 */
export const GOOGLE_OAUTH_ENABLED =
  !!process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== "mock-google-client-id" &&
  !process.env.GOOGLE_CLIENT_ID.startsWith("mock-");

// ─── Supabase ────────────────────────────────────────────────────────────────
export const NEXT_PUBLIC_SUPABASE_URL = getEnvVar(
  "NEXT_PUBLIC_SUPABASE_URL",
  "https://demo.supabase.co"
);
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = getEnvVar(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "demo-anon-key"
);
export const SUPABASE_SECRET_KEY = getEnvVar("SUPABASE_SECRET_KEY", "demo-secret");
export const SUPABASE_JWT_SECRET = getEnvVar("SUPABASE_JWT_SECRET", "demo-jwt");

/**
 * true si Supabase est réellement configuré
 * Si false → les API routes utilisent mockData automatiquement
 */
export const SUPABASE_ENABLED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo.supabase.co");

// ─── Database ────────────────────────────────────────────────────────────────
export const DATABASE_URL = getEnvVar(
  "DATABASE_URL",
  "postgresql://localhost:5432/gabstat_dev"
);

export const DATABASE_ENABLED =
  !!process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("localhost:5432/gabstat_dev");

// ─── Cloudinary ───────────────────────────────────────────────────────────────
export const CLOUDINARY_NAME = getEnvVar("CLOUDINARY_NAME", "mock-cloudinary");
export const CLOUDINARY_API_KEY = getEnvVar("CLOUDINARY_API_KEY", "mock-cloudinary-key");
export const CLOUDINARY_SECRET = getEnvVar("CLOUDINARY_SECRET", "mock-cloudinary-secret");

export const CLOUDINARY_ENABLED =
  !!process.env.CLOUDINARY_NAME &&
  process.env.CLOUDINARY_NAME !== "mock-cloudinary";

// ─── Résumé dev ───────────────────────────────────────────────────────────────
if (isDev) {
  const status = {
    "Google OAuth": GOOGLE_OAUTH_ENABLED ? "✅ Configuré" : "⚠️  Mock (bouton masqué)",
    "Supabase":     SUPABASE_ENABLED     ? "✅ Configuré" : "⚠️  Demo (données mock)",
    "Database":     DATABASE_ENABLED     ? "✅ Configuré" : "⚠️  Local fallback",
    "Cloudinary":   CLOUDINARY_ENABLED   ? "✅ Configuré" : "⚠️  Mock (images locales)",
  };
  console.log("\n\x1b[36m[GabStat Pulse — ENV STATUS]\x1b[0m");
  Object.entries(status).forEach(([k, v]) => console.log(`  ${v}  ${k}`));
  console.log("");
}
