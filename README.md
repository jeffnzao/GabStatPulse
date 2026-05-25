# 🎯 GabStat Pulse

**Plateforme de sondages basée sur les réalités quotidiennes des Gabonais avec statistiques visuelles dynamiques en temps réel**

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

---

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Stack technologique](#stack-technologique)
- [Installation locale](#installation-locale)
- [Configuration](#configuration)
- [Variables d'environnement](#variables-denvironnement)
- [Commandes disponibles](#commandes-disponibles)
- [Structure du projet](#structure-du-projet)
- [Déploiement](#déploiement)
- [Guide de contribution](#guide-de-contribution)

---

## 🚀 Aperçu

GabStat Pulse est une plateforme innovante de collecte et d'analyse de données citoyennes. Elle permet aux Gabonais de :

- 📝 **Participer à des sondages** sur les réalités quotidiennes
- 📊 **Visualiser les statistiques** en temps réel
- 🗺️ **Analyser les tendances** par région
- 🔥 **Suivre les sujets populaires** en tendance
- 🏆 **Gagner des insignes** pour leur engagement

---

## ✨ Fonctionnalités principales

### 1. **Accueil moderne**
- Hero section dynamique
- Statistiques en direct (sondages, participants, tendances)
- Catégories populaires
- Tendances actuelles

### 2. **Génération automatique de sondages**
- Interface intuitive de création
- Sélection de catégories
- Choix des régions cibles
- Durée personnalisable

### 3. **Participation aux sondages**
- Cartes de sondage élégantes
- Formulaires dynamiques
- Prévention des votes multiples
- Support multiple formats (choix unique, multiple, échelle, texte)

### 4. **Dashboard statistiques**
- Graphiques interactifs (barres, courbes, pie charts)
- Filtres par période et région
- Indicateurs de tendances
- Croissance des réponses

### 5. **Carte interactive du Gabon**
- Vue régionale avec statistiques
- Identification des problèmes principaux
- Analyse par zone géographique

### 6. **Système de tendances**
- Calcul dynamique des scores de tendance
- Indicateurs (🔥 Chaud, 📈 Monte, 📉 Baisse)
- Mise à jour en temps réel

### 7. **Profil utilisateur**
- Historique des participations
- Système de badges (Observateur, Analyste, etc.)
- Statistiques personnelles

### 8. **Mode administrateur**
- Création manuelle de sondages
- Modération des contenus
- Export des données (CSV, PDF)
- Gestion globale de la plateforme

---

## 🛠️ Stack technologique

### Frontend
- **Next.js 15** - Framework React moderne avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling utility-first
- **Shadcn UI** - Composants headless accessibles
- **Framer Motion** - Animations fluides
- **Recharts** - Graphiques réactifs
- **React Hook Form + Zod** - Gestion des formulaires avec validation

### Backend
- **Next.js API Routes** - Endpoints serverless
- **Prisma ORM** - Gestion de la base de données
- **NextAuth v5** - Authentification sécurisée

### Base de données
- **PostgreSQL** - Base de données relationnelle
- **Compatible Vercel Postgres et Supabase**

### Authentification
- **NextAuth** - OAuth et Email
- **Google Login**
- **Mode invité limité**

### Stockage
- **Cloudinary** - Gestion des images

### Déploiement
- **Vercel** - Hébergement et déploiement

---

## 📦 Installation locale

### Prérequis
- **Node.js 18+**
- **PostgreSQL 14+**
- **npm ou yarn**

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/votreusername/GabStatPulse.git
cd GabStatPulse
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env.local
```

4. **Initialiser la base de données**
```bash
npx prisma generate
npx prisma migrate dev
```

5. **Générer les données de test**
```bash
npm run db:seed
```

6. **Lancer le serveur de développement**
```bash
npm run dev
```

Accédez à l'application sur `http://localhost:3000`

---

## ⚙️ Configuration

### Prisma
```bash
# Générer le client Prisma
npx prisma generate

# Créer les migrations
npx prisma migrate dev --name "init"

# Voir les données en interface graphique
npx prisma studio
```

### Variables d'environnement requises
Créez un fichier `.env.local` avec :

```env
# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/gabstat_pulse

# NextAuth
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_SECRET=your-secret

# Environnement
NODE_ENV=development
```

---

## 🚀 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lancer le serveur de développement |
| `npm run build` | Construire pour la production |
| `npm run start` | Lancer le serveur de production |
| `npm run lint` | Vérifier les erreurs avec ESLint |
| `npx prisma generate` | Générer le client Prisma |
| `npx prisma migrate dev` | Créer les migrations |
| `npx prisma studio` | Ouvrir l'interface Prisma Studio |
| `npm run db:seed` | Remplir la DB avec des données de test |

---

## 📁 Structure du projet

```
GabStatPulse/
├── app/
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Page d'accueil
│   ├── auth/
│   │   ├── signin/page.tsx      # Connexion
│   │   └── signup/page.tsx      # Inscription
│   ├── surveys/
│   │   ├── page.tsx             # Liste des sondages
│   │   └── [id]/page.tsx        # Détails et participation
│   ├── dashboard/page.tsx       # Tableau de bord
│   ├── profile/page.tsx         # Profil utilisateur
│   ├── admin/page.tsx           # Panel admin
│   └── api/
│       ├── surveys/             # API pour sondages
│       ├── auth/                # API authentification
│       ├── stats/               # API statistiques
│       └── trends/              # API tendances
│
├── components/
│   ├── ui/                      # Composants Shadcn
│   ├── charts/                  # Composants graphiques
│   ├── maps/                    # Carte interactive
│   ├── navbar.tsx               # Navigation
│   └── footer.tsx               # Pied de page
│
├── lib/
│   ├── prisma.ts                # Client Prisma
│   └── utils.ts                 # Utilitaires
│
├── styles/
│   └── globals.css              # Styles globaux
│
├── prisma/
│   ├── schema.prisma            # Schéma BD
│   └── seed.ts                  # Données de test
│
├── types/                       # Définitions TypeScript
├── hooks/                       # Custom React hooks
├── middleware.ts                # Middleware d'authentification
├── auth.ts                      # Configuration NextAuth
├── auth.config.ts               # Configuration d'authentification
├── next.config.ts               # Configuration Next.js
├── tailwind.config.ts           # Configuration Tailwind
├── tsconfig.json                # Configuration TypeScript
├── package.json                 # Dépendances
├── .env.example                 # Variables d'exemple
├── .env.local                   # Variables locales
├── vercel.json                  # Configuration Vercel
└── README.md                    # Ce fichier
```

---

## 🌐 Déploiement

### Déploiement sur Vercel

1. **Installer Vercel CLI**
```bash
npm install -g vercel
```

2. **Se connecter à Vercel**
```bash
vercel login
```

3. **Déployer (staging)**
```bash
vercel
```

4. **Déployer en production**
```bash
vercel --prod
```

### Configuration Vercel

Le fichier `vercel.json` configure automatiquement :
- Framework : Next.js
- Build command : `npm run build`
- Start command : `npm start`

### Variables d'environnement Vercel

Ajouter dans les **Settings** → **Environment Variables** :
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CLOUDINARY_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_SECRET`

---

## 📊 Modèles de données

### User
- ID, email, nom, image, région, rôle
- Sessions, sondages, réponses, badges

### Survey
- ID, titre, description, catégorie, région
- Créateur, questions, réponses, statistiques

### Question
- ID, texte, type, options, ordre
- Réponses

### Response
- ID, utilisateur, région
- Réponses aux questions

### Statistics
- ID, nombre de réponses, taux de participation
- Tendances

---

## 🎨 Design et couleurs

**Palette principale :**
- Vert primaire : `#00D26A`
- Bleu accent : `#0066FF`
- Noir sombre : `#090909`
- Gris neutre : `#1C1C1C`

**Mode sombre par défaut** avec animations Framer Motion

---

## 📱 Responsive Design

- ✅ Mobile (< 640px)
- ✅ Tablette (640px - 1024px)
- ✅ Desktop (> 1024px)

---

## 🔒 Sécurité

- ✅ Hachage bcrypt des mots de passe
- ✅ Tokens JWT sécurisés
- ✅ Middleware d'authentification
- ✅ Validation des données avec Zod
- ✅ Protection CSRF

---

## 📈 Performance

- ✅ Image lazy loading
- ✅ Code splitting automatique
- ✅ CSS minification
- ✅ API caching
- ✅ Compression Gzip
- ✅ SEO optimisé

---

## 🤝 Guide de contribution

1. **Fork le projet**
2. **Créer une branche** : `git checkout -b feature/new-feature`
3. **Committer les changements** : `git commit -m "Add new feature"`
4. **Pusher vers la branche** : `git push origin feature/new-feature`
5. **Ouvrir une Pull Request**

---

## 📝 Licence

MIT - Voir [LICENSE](LICENSE)

---

## 👥 Auteur

**Créé par l'équipe GabStat Pulse**

---

## 📧 Contact

- Email : contact@gabstatpulse.com
- Twitter : [@GabStatPulse](https://twitter.com/gabstatpulse)
- Site web : [gabstatpulse.com](https://gabstatpulse.com)

---

## 🐛 Signaler un bug

Si vous trouvez un bug, veuillez :
1. Ouvrir une **issue GitHub**
2. Décrire le problème en détail
3. Inclure des captures d'écran si possible
4. Mentionner votre OS et navigateur

---

## 🎓 Ressources utiles

- [Documentation Next.js 15](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation NextAuth](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com)

---

**Construisons ensemble les données citoyennes du Gabon ! 🇬🇦**
