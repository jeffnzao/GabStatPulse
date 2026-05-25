# 🚀 Guide de déploiement sur Vercel

GabStatPulse est optimisé pour le déploiement sur Vercel. Ce guide vous aidera à déployer votre application en quelques minutes.

---

## Table des matières

1. [Déploiement initial](#déploiement-initial)
2. [Configuration des variables d'environnement](#configuration-des-variables-denvironnement)
3. [Configuration de la base de données](#configuration-de-la-base-de-données)
4. [Domaine personnalisé](#domaine-personnalisé)
5. [CI/CD et déploiements automatiques](#cicd-et-déploiements-automatiques)
6. [Monitoring et logs](#monitoring-et-logs)
7. [Optimisations](#optimisations)

---

## 🎯 Déploiement initial

### Option 1: Via l'interface Vercel (Recommandé)

#### Étape 1: Préparer le repository GitHub

```bash
# Initialiser Git (si non fait)
git init

# Ajouter tous les fichiers
git add .

# Committer
git commit -m "Initial commit: GabStatPulse application"

# Créer un repository sur GitHub
# https://github.com/new

# Ajouter la remote
git remote add origin https://github.com/votreusername/GabStatPulse.git
git branch -M main
git push -u origin main
```

#### Étape 2: Déployer sur Vercel

1. **Accédez à [vercel.com](https://vercel.com/)**
   - Créez un compte (ou connectez-vous)
   - Cliquez sur "New Project"

2. **Importer le repository**
   - Sélectionnez "Import Git Repository"
   - Connectez GitHub
   - Sélectionnez "GabStatPulse"

3. **Configurer le projet**
   - Framework: Next.js (détecté automatiquement)
   - Root Directory: ./ (par défaut)
   - Build Command: `npm run build`
   - Output Directory: .next

4. **Ajouter les variables d'environnement**
   - Voir section suivante

5. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez 3-5 minutes

### Option 2: Via Vercel CLI

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Se connecter à Vercel
vercel login

# 3. Déployer en staging
vercel

# 4. Répondre aux questions:
# - Set up and deploy? Yes
# - Which scope? Your team
# - Link to existing project? No
# - Project name? gabstatpulse
# - Directory: ./

# 5. Déployer en production
vercel --prod
```

---

## ⚙️ Configuration des variables d'environnement

### Via l'interface Vercel

1. **Aller à Settings → Environment Variables**
2. **Ajouter chaque variable:**

```
DATABASE_URL = postgresql://user:password@host:5432/database
NEXTAUTH_SECRET = your-secret-key-min-32-chars
NEXTAUTH_URL = https://yourdomain.vercel.app
GOOGLE_CLIENT_ID = your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = your-client-secret
CLOUDINARY_NAME = your-cloud-name
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_SECRET = your-secret
NODE_ENV = production
```

### Important: Ajouter les secrets pour production

```bash
# Via CLI
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... pour chaque variable

# Puis redéployer
vercel --prod
```

---

## 🗄️ Configuration de la base de données

### Option 1: Vercel Postgres (Recommandé)

**Avantages:**
- ✅ Intégration Vercel native
- ✅ Backups automatiques
- ✅ Monitoring inclus
- ✅ Pas de configuration supplémentaire

**Setup:**

1. Dans Vercel Dashboard → Settings → Storage
2. Créer une nouvelle base Postgres
3. La DATABASE_URL est automatiquement ajoutée aux variables

### Option 2: Supabase

1. **Créer un compte Supabase** (https://supabase.com/)
2. **Créer un nouveau projet**
3. **Copier la connection string** depuis Settings → Database
4. **Ajouter à Vercel Environment Variables**

### Option 3: PostgreSQL externe

Pour tout autre provider PostgreSQL:

1. Obtenir la connection string
2. L'ajouter à Vercel Environment Variables

### Initialiser la base de données en production

```bash
# Localement, exécuter les migrations
npx prisma migrate deploy

# Ou générer les données de test
npm run db:seed
```

---

## 🌐 Domaine personnalisé

### Ajouter votre propre domaine

1. **Aller à Settings → Domains**
2. **Cliquer sur "Add Domain"**
3. **Entrer votre domaine**
   - Exemple: `gabstatpulse.com`

4. **Configurer les DNS**
   - Vercel fournit les enregistrements à ajouter
   - Allez chez votre registraire (GoDaddy, Namecheap, etc.)
   - Ajouter les enregistrements CNAME/A fournis

5. **Vérifier la configuration**
   - Cliquez sur "Verify"
   - Peut prendre 24-48 heures

### Configuration HTTPS

- Automatique avec les domaines Vercel
- Certificat SSL gratuit inclus

---

## 🔄 CI/CD et déploiements automatiques

### Déploiements automatiques

**Par défaut, chaque push vers `main` déploie en production**

Désactiver les déploiements automatiques:

1. Settings → Git
2. Décocher "Deploy on push"

### Déploiement de branche

```bash
# Créer une branche de feature
git checkout -b feature/nouvelle-fonctionnalite

# Faire vos changements
git commit -am "Add new feature"
git push origin feature/nouvelle-fonctionnalite

# Vercel crée automatiquement une URL de preview
# Exemple: https://gabstatpulse-git-feature-xxx.vercel.app
```

### Merges et déploiements

```bash
# Merger dans main déclenche le déploiement en production
git checkout main
git pull
git merge feature/nouvelle-fonctionnalite
git push origin main

# Production déployée en 2-5 minutes
```

---

## 📊 Monitoring et logs

### Voir les logs

1. **Dashboard Vercel**
   - Sélectionnez le projet
   - Allez à "Deployments"
   - Cliquez sur un déploiement
   - Onglet "Logs"

2. **Logs en temps réel**
   - Onglet "Functions"
   - Voir les exécutions des API Routes

### Erreurs courantes

**Error: "PostgreSQL connection timeout"**
- Vérifier que la DATABASE_URL est correcte
- Vérifier que le serveur PostgreSQL est accessible

**Error: "NEXTAUTH_SECRET not set"**
- Ajouter NEXTAUTH_SECRET aux Environment Variables
- Redéployer

**Error: "Import not found"**
- Vérifier que tous les fichiers sont pushés
- Recompiler: `npm run build` localement

### Métriques de performance

1. **Analytics** (Dashboard Vercel)
   - Temps de réponse moyen
   - Erreurs 5xx
   - Trafic

2. **Web Vitals**
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
   - First Input Delay (FID)

---

## 🚀 Optimisations

### 1. Optimisation des images

```typescript
// Déjà configuré dans next.config.ts
// Images Cloudinary optimisées automatiquement
```

### 2. Compression et caching

```javascript
// vercel.json configure:
// - Compression Gzip
// - Cache-Control headers
// - Minification
```

### 3. CDN global

- Vercel distribue automatiquement sur un CDN global
- Accélère la livraison depuis n'importe quel endroit du monde

### 4. Serverless functions

Les API Routes sont optimisées pour Vercel:
- Démarrage instantané
- Pas de serveur à gérer
- Scaling automatique

### 5. Database connection pooling

Avec Vercel Postgres:
- Connection pooling automatique
- Réutilisation des connexions
- Performances optimisées

---

## 📈 Mettre à jour en production

### Mettre à jour le code

```bash
# Faire les changements
git commit -am "Update feature"

# Push vers main
git push origin main

# Vercel redéploie automatiquement
```

### Mettre à jour les dépendances

```bash
# Localement
npm update

# Tester
npm run build
npm run dev

# Committer
git add package.json package-lock.json
git commit -m "Update dependencies"
git push origin main
```

### Migrer la base de données en production

```bash
# Localement, créer la migration
npx prisma migrate dev --name "descriptive-name"

# Cela crée les fichiers dans prisma/migrations/

# Push le code
git push origin main

# Après le déploiement Vercel, exécuter:
vercel env pull .env.production.local
npx prisma migrate deploy --skip-generate
```

---

## 🆘 Dépannage

### Les variables d'environnement ne sont pas définies

```bash
# Vérifier dans Vercel Dashboard
# Settings → Environment Variables

# Redéployer après modification
vercel --prod
```

### Le déploiement échoue

```bash
# Voir les logs d'erreur
# Dashboard → Deployments → [déploiement] → Logs

# Problèmes courants:
# 1. npm run build échoue localement?
# 2. Variables d'environnement manquantes?
# 3. Base de données inaccessible?
```

### Performance lente

```bash
# Vérifier les métriques
# Dashboard → Analytics

# Optimisations:
# 1. Vérifier les images (lazy load)
# 2. Réduire les dépendances
# 3. Utiliser le cache
# 4. Vérifier les appels API
```

---

## 📞 Support Vercel

- **Documentation**: https://vercel.com/docs
- **Help**: https://vercel.com/help
- **Community**: https://github.com/vercel/next.js/discussions

---

## Checklist de déploiement

- [ ] Repository GitHub créé et poussé
- [ ] Compte Vercel créé
- [ ] Projet importé depuis GitHub
- [ ] Variables d'environnement configurées
- [ ] Base de données Postgres configurée
- [ ] Build local réussi (`npm run build`)
- [ ] Tests locaux passés (`npm run dev`)
- [ ] Premier déploiement réussi
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Monitoring activé
- [ ] Backups activés

---

**Déploiement réussi ! 🎉 Votre application est en ligne.**

Pour les mises à jour ultérieures, simple `git push` suffit !
