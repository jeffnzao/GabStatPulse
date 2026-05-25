#!/usr/bin/env node

/**
 * Configuration Verification Script for GabStatPulse
 * Vérifie que tout est correctement configuré
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
}

const checks: CheckResult[] = [];

// Helper functions
function checkFileExists(filePath: string): boolean {
  return fs.existsSync(path.join(__dirname, filePath));
}

function checkEnvVariable(varName: string): boolean {
  return process.env[varName] !== undefined;
}

function checkJsonValid(filePath: string): boolean {
  try {
    const content = fs.readFileSync(path.join(__dirname, filePath), "utf-8");
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

// Run checks
console.log("🔍 Vérification de la configuration GabStatPulse...\n");

// 1. Check essential files
checks.push({
  name: "package.json exists",
  passed: checkFileExists("package.json"),
  message: "✅ package.json trouvé",
});

checks.push({
  name: "tsconfig.json exists",
  passed: checkFileExists("tsconfig.json"),
  message: "✅ tsconfig.json trouvé",
});

checks.push({
  name: "next.config.ts exists",
  passed: checkFileExists("next.config.ts"),
  message: "✅ next.config.ts trouvé",
});

checks.push({
  name: "prisma/schema.prisma exists",
  passed: checkFileExists("prisma/schema.prisma"),
  message: "✅ prisma/schema.prisma trouvé",
});

checks.push({
  name: "auth.config.ts exists",
  passed: checkFileExists("auth.config.ts"),
  message: "✅ auth.config.ts trouvé",
});

// 2. Check JSON files
checks.push({
  name: "package.json is valid JSON",
  passed: checkJsonValid("package.json"),
  message: "✅ package.json est un JSON valide",
});

checks.push({
  name: "tsconfig.json is valid JSON",
  passed: checkJsonValid("tsconfig.json"),
  message: "✅ tsconfig.json est un JSON valide",
});

checks.push({
  name: ".eslintrc.json is valid JSON",
  passed: checkJsonValid(".eslintrc.json"),
  message: "✅ .eslintrc.json est un JSON valide",
});

// 3. Check environment files
checks.push({
  name: ".env.example exists",
  passed: checkFileExists(".env.example"),
  message: "✅ .env.example trouvé",
});

checks.push({
  name: ".env.local exists",
  passed: checkFileExists(".env.local"),
  message: "⚠️  .env.local trouvé (assurez-vous que c'est local seulement)",
});

// 4. Check critical directories
const dirs = ["app", "components", "lib", "prisma", "styles", "public"];
dirs.forEach((dir) => {
  checks.push({
    name: `${dir}/ directory exists`,
    passed: fs.existsSync(path.join(__dirname, dir)),
    message: `✅ ${dir}/ trouvé`,
  });
});

// 5. Check API routes
const apiRoutes = [
  "app/api/surveys/route.ts",
  "app/api/surveys/[id]/route.ts",
  "app/api/surveys/[id]/statistics/route.ts",
  "app/api/trends/route.ts",
  "app/api/stats/route.ts",
];

apiRoutes.forEach((route) => {
  checks.push({
    name: `API route: ${route}`,
    passed: checkFileExists(route),
    message: `✅ ${route} trouvé`,
  });
});

// 6. Check pages
const pages = [
  "app/page.tsx",
  "app/layout.tsx",
  "app/surveys/page.tsx",
  "app/dashboard/page.tsx",
  "app/profile/page.tsx",
];

pages.forEach((page) => {
  checks.push({
    name: `Page: ${page}`,
    passed: checkFileExists(page),
    message: `✅ ${page} trouvé`,
  });
});

// 7. Check components
const components = [
  "components/navbar.tsx",
  "components/footer.tsx",
  "components/ui/button.tsx",
  "components/ui/input.tsx",
  "components/ui/card.tsx",
  "components/charts/index.tsx",
];

components.forEach((component) => {
  checks.push({
    name: `Component: ${component}`,
    passed: checkFileExists(component),
    message: `✅ ${component} trouvé`,
  });
});

// Print results
console.log("📋 Résultats de la vérification:\n");

const passed = checks.filter((c) => c.passed).length;
const total = checks.length;

checks.forEach((check) => {
  console.log(`${check.passed ? "✅" : "❌"} ${check.message}`);
});

console.log(`\n📊 Résumé: ${passed}/${total} vérifications réussies\n`);

// Summary
if (passed === total) {
  console.log("🎉 Configuration vérifiée avec succès !");
  console.log("✨ L'application est prête au développement et au déploiement.\n");
  process.exit(0);
} else {
  console.log("⚠️  Certaines vérifications ont échoué.");
  console.log(`   ${total - passed} fichier(s) manquant(s) ou invalide(s).\n`);
  process.exit(1);
}
