# 📚 Guide d'Installation GabStatPulse

## Table des matières
1. [Prérequis](#prérequis)
2. [Installation rapide](#installation-rapide)
3. [Installation détaillée](#installation-détaillée)
4. [Configuration](#configuration)
5. [Démarrage](#démarrage)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Prérequis

### Système requis
- **Windows, macOS ou Linux**
- **RAM minimum**: 4 GB
- **Espace disque**: 2 GB

### Logiciels obligatoires
- **Node.js 18+** ([Télécharger](https://nodejs.org/))
- **PostgreSQL 14+** ([Télécharger](https://www.postgresql.org/download/))
- **Git** ([Télécharger](https://git-scm.com/))
- **npm** (inclus avec Node.js)

### Comptes requis
- **Google Cloud** (pour OAuth) - [Console Google](https://console.cloud.google.com/)
- **Cloudinary** (optionnel) - [Créer un compte](https://cloudinary.com/)
- **Vercel** (optionnel, pour déploiement) - [Créer un compte](https://vercel.com/)

---

## ⚡ Installation rapide (5 minutes)

```bash
# 1. Cloner le repository
git clone https://github.com/votreusername/GabStatPulse.git
cd GabStatPulse

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env.local
# ✏️ Éditer .env.local avec vos configurations

# 4. Initialiser la base de données
npx prisma migrate dev
npm run db:seed

# 5. Lancer l'application
npm run dev
```

Accédez à http://localhost:3000

---

## 📋 Installation détaillée

### Étape 1: Préparer l'environnement

#### Windows
```powershell
# Vérifier les versions
node --version      # v18.0.0 minimum
npm --version       # 9.0.0 minimum
git --version

# Installer PostgreSQL (via Microsoft Store ou exe)
```

#### macOS
```bash
# Installer via Homebrew
brew install node postgresql git

# Vérifier les installations
node --version
npm --version
pg_config --version
```

#### Linux (Ubuntu/Debian)
```bash
# Installer les dépendances
sudo apt-get update
sudo apt-get install -y nodejs npm postgresql git

# Vérifier les installations
node --version
npm --version
psql --version
```

### Étape 2: Cloner le repository

```bash
# Via HTTPS
git clone https://github.com/votreusername/GabStatPulse.git

# Ou via SSH
git clone git@github.com:votreusername/GabStatPulse.git

# Naviguer dans le dossier
cd GabStatPulse
```

### Étape 3: Installer les dépendances

```bash
# Installer les packages Node
npm install

# Cela peut prendre 2-5 minutes

# Vérifier l'installation
npm list --depth=0
```

### Étape 4: Créer la base de données PostgreSQL

#### Via interface pgAdmin (recommandé)

1. Ouvrir pgAdmin (livré avec PostgreSQL)
2. Créer une nouvelle base de données
   - Nom: `gabstat_pulse`
   - Owner: `postgres`

#### Via terminal

```bash
# Depuis votre terminal
psql -U postgres

# Dans la console psql
CREATE DATABASE gabstat_pulse;
\l  # Lister les bases (vérifier la création)
\q  # Quitter
```

### Étape 5: Configurer les variables d'environnement

1. **Créer le fichier `.env.local`**
```bash
cp .env.example .env.local
```

2. **Éditer `.env.local`** avec vos configurations:

```env
# Base de données
DATABASE_URL=postgresql://postgres:password@localhost:5432/gabstat_pulse

# NextAuth
NEXTAUTH_SECRET=generate-a-32-character-random-string-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optionnel)
# 1. Aller à https://console.cloud.google.com/
# 2. Créer un projet
# 3. Créer des identifiants OAuth
# 4. Copier client ID et secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary (optionnel)
# 1. Créer un compte sur https://cloudinary.com/
# 2. Copier vos credentials du dashboard
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_SECRET=your-secret

# Environnement
NODE_ENV=development
```

3. **Générer un secret NEXTAUTH_SECRET**
```bash
# Depuis la ligne de commande
openssl rand -base64 32

# Ou utiliser un générateur en ligne (pour dev seulement)
# https://generate-secret.vercel.app/32
```

### Étape 6: Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate dev

# Semer les données de test
npm run db:seed
```

Cela crée:
- ✅ La structure de la base de données
- ✅ 6 utilisateurs de test
- ✅ 6 régions gabonaises
- ✅ 20+ insignes
- ✅ 6+ sondages avec questions
- ✅ Plusieurs réponses de test

---

## 🚀 Démarrage

### Développement

```bash
# Mode développement avec rechargement automatique
npm run dev

# L'application démarre sur http://localhost:3000
```

### Production

```bash
# Construire pour la production
npm run build

# Lancer le serveur de production
npm start
```

### Accès à l'interface Prisma Studio

```bash
# Pour explorer/modifier les données
npx prisma studio

# S'ouvre sur http://localhost:5555
```

---

## ⚙️ Configuration avancée

### Configuration Google OAuth

1. **Créer un projet Google Cloud**
   - Accédez à [Google Cloud Console](https://console.cloud.google.com/)
   - Cliquez sur le sélecteur de projet
   - Cliquez sur "NEW PROJECT"
   - Entrez "GabStatPulse"

2. **Créer les identifiants OAuth**
   - Allez à "APIs & Services" → "Credentials"
   - Cliquez sur "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Sélectionnez "Web application"
   - Ajoutez les origins autorisées:
     - `http://localhost:3000`
     - `http://localhost:3000/api/auth/callback/google`
   - Créer et copier Client ID et Secret

3. **Ajouter à `.env.local`**
```env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

### Configuration Cloudinary (optionnel)

1. **Créer un compte Cloudinary**
   - Accédez à [Cloudinary.com](https://cloudinary.com/)
   - Créez un compte gratuit
   - Allez au Dashboard

2. **Copier les credentials**
   - Cloud Name: visible sur le dashboard
   - API Key: dans Settings → Security
   - API Secret: dans Settings → Security

3. **Ajouter à `.env.local`**
```env
CLOUDINARY_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_SECRET=xxx
```

---

## 🧪 Tester l'installation

### Utilisateurs de test (seeding)

Après `npm run db:seed`, vous pouvez vous connecter avec:

| Email | Mot de passe |
|-------|-------------|
| alice.mbonda@gabonais.com | password123 |
| bob.nzambi@gabonais.com | password123 |
| claire.ovono@gabonais.com | password123 |
| pierre.mangue@gabonais.com | password123 (Admin) |

### Vérifier l'installation

```bash
# 1. Vérifier Node.js
node --version

# 2. Vérifier les dépendances
npm list --depth=0

# 3. Vérifier la base de données
npx prisma studio
# Doit ouvrir l'interface Prisma

# 4. Tester le serveur
npm run dev
# Doit démarrer sans erreur sur http://localhost:3000
```

---

## 🐛 Troubleshooting

### Erreur: "Cannot find module"

```bash
# Solution: Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur: "Database connection failed"

```bash
# Solution 1: Vérifier que PostgreSQL est en cours d'exécution
# Windows: Services → PostgreSQL
# macOS: brew services list
# Linux: systemctl status postgresql

# Solution 2: Vérifier la DATABASE_URL dans .env.local
# Format correct: postgresql://username:password@localhost:5432/dbname

# Solution 3: Créer la base de données
psql -U postgres -c "CREATE DATABASE gabstat_pulse;"
```

### Erreur: "Port 3000 already in use"

```bash
# Solution 1: Utiliser un autre port
npm run dev -- -p 3001

# Solution 2: Tuer le processus sur le port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Erreur: "NEXTAUTH_SECRET not set"

```bash
# Solution: Générer un secret
openssl rand -base64 32

# Puis ajouter à .env.local
NEXTAUTH_SECRET=votre-secret-généré
```

### Erreur: "Google OAuth callback failed"

```bash
# Vérifier dans Google Cloud Console:
# 1. Authorized JavaScript origins include http://localhost:3000
# 2. Authorized redirect URIs include http://localhost:3000/api/auth/callback/google
```

---

## 📚 Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer le serveur de dev |
| `npm run build` | Construire pour la production |
| `npm start` | Démarrer le serveur de production |
| `npm run lint` | Vérifier les erreurs ESLint |
| `npx prisma generate` | Générer le client Prisma |
| `npx prisma migrate dev` | Créer une migration |
| `npx prisma studio` | Ouvrir Prisma Studio |
| `npm run db:seed` | Remplir avec des données de test |
| `npm test` | Exécuter les tests |

---

## 🎯 Prochaines étapes

1. **Explorez l'application**
   - Accédez à http://localhost:3000
   - Connectez-vous avec les utilisateurs de test
   - Testez les fonctionnalités

2. **Configurez Google OAuth** (optionnel)
   - Suivez les étapes de configuration
   - Testez la connexion Google

3. **Déployez sur Vercel**
   - Voir [DEPLOYMENT.md](DEPLOYMENT.md)

4. **Configurez le domaine personnalisé**
   - Voir la documentation Vercel

---

## 💬 Support

- **Documentation**: [README.md](README.md)
- **Issues**: Ouvrez une issue sur GitHub
- **Email**: contact@gabstatpulse.com

---

**Installation réussie ? 🎉 Commencez à construire !**
