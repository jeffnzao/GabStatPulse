# GabStat Pulse 🇬🇦

> Plateforme de sondages basée sur les réalités quotidiennes des Gabonais.

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances (génère aussi Prisma client automatiquement)
npm install

# 2. Copier les variables d'environnement
cp .env.example .env.local

# 3. Lancer le serveur de développement
npm run dev
```

L'application démarre sur [http://localhost:3000](http://localhost:3000).

> **Note** : L'app fonctionne immédiatement en mode développement avec des données fictives.
> Aucune clé API réelle n'est requise pour démarrer.

---

## 🔑 Remplacer les clés temporaires

Le projet utilise des valeurs mock en développement. Pour activer les vraies fonctionnalités,
remplacez les valeurs dans votre `.env.local` :

### Base de données — Supabase
1. Créez un projet sur [https://supabase.com](https://supabase.com)
2. Allez dans **Project Settings → Database → Connection string**
3. Remplacez `DATABASE_URL` dans `.env.local`

```env
DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres"
```

Puis initialisez la base :
```bash
npx prisma migrate dev --name init
```

### Google OAuth
1. Allez sur [https://console.cloud.google.com](https://console.cloud.google.com)
2. Sélectionnez votre projet `gabstatpulse`
3. **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
4. Type : **Web application**
5. Redirect URI autorisé : `http://localhost:3000/api/auth/callback/google`
6. Copiez le Client ID et le Secret dans `.env.local` :

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-secret"
```

> Le bouton "Se connecter avec Google" apparaît **automatiquement** une fois ces clés configurées.

### Cloudinary (upload d'images)
1. Créez un compte sur [https://cloudinary.com](https://cloudinary.com)
2. Dans le dashboard, copiez votre **Cloud name**, **API Key** et **API Secret**

```env
CLOUDINARY_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_SECRET="your-api-secret"
```

---

## 🧩 Architecture

```
gabstat-pulse/
├── app/                    # Routes Next.js 15 (App Router)
│   ├── api/                # API Routes avec fallback mock
│   ├── auth/               # Pages d'authentification
│   ├── dashboard/          # Tableau de bord
│   └── surveys/            # Liste et détail des sondages
├── components/             # Composants React réutilisables
│   ├── charts/             # Graphiques Recharts
│   └── ui/                 # Composants UI (Button, Card, Input...)
├── lib/
│   ├── env.ts              # ⭐ Validation env + fallbacks automatiques
│   ├── mockData.ts         # ⭐ Données fictives gabonaises
│   ├── prisma.ts           # Client Prisma avec gestion d'erreur
│   └── utils.ts            # Utilitaires
├── prisma/
│   └── schema.prisma       # Schéma base de données
└── types/                  # Types TypeScript globaux
```

## 🛡️ Mode développement intelligent

Le projet ne crashe **jamais** à cause d'une clé manquante :

| Service       | Clé absente → comportement                    |
|---------------|-----------------------------------------------|
| Google OAuth  | Bouton Google masqué automatiquement          |
| Supabase/DB   | Données mock JSON retournées par les API      |
| Cloudinary    | Images locales dans `/public` utilisées       |
| IA / LLM      | Templates internes pour générer les questions |

## 🚀 Déploiement Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel deploy

# Configurer les env vars en production
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
```

**Important** : Sur Vercel, `NEXTAUTH_URL` doit pointer vers votre domaine de production :
```env
NEXTAUTH_URL="https://gabstatpulse.vercel.app"
```

## 📦 Commandes utiles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run type-check   # Vérification TypeScript sans compiler
npx prisma studio    # Interface graphique pour la DB
npx prisma migrate dev --name init  # Initialiser la DB
```
