# Audit du parcours utilisateur - GabStat Pulse

## ✅ Parcours 1: Participer à un sondage (Utilisateur anonyme)

### 1. Ouverture du sondage
- **État**: ✅ FONCTIONNEL
- **Bouton Participer**: Cliquable depuis la liste `/surveys`
- **Action**: Redirection vers `/surveys/{id}`
- **Validation**: Le titre du sondage est aussi cliquable

### 2. Affichage des questions
- **État**: ✅ FONCTIONNEL
- **Chargement**: Fetch de `/api/surveys/{id}` 
- **Affichage**: Questions avec leurs options correctement rendues
- **Types supportés**: yes_no, single, multiple, scale, text

### 3. Remplissage des réponses
- **État**: ✅ FONCTIONNEL
- **Validation React Hook Form**: Oui, en temps réel
- **Validation Zod**: Oui, au submit
- **Erreurs affichées**: Oui, avec messages explicites

### 4. Soumission des réponses
- **État**: ✅ FONCTIONNEL
- **Point de terminaison**: POST `/api/surveys/{id}/submit`
- **Payload**:
  ```json
  {
    "surveyId": "...",
    "answers": [
      { "questionId": "...", "value": "..." }
    ]
  }
  ```
- **Vérifications**:
  - ✅ Validation Zod
  - ✅ Vérification du sondage existe
  - ✅ Vérification pas de réponse dupliquée (par anonymousId ou userId)
  - ✅ Sauvegarde de la réponse
  - ✅ Sauvegarde des réponses individuelles
  - ✅ Mise à jour des statistiques (totalResponses)

### 5. Gestion anonyme
- **État**: ✅ FONCTIONNEL
- **anonymousId**: Généré avec `crypto.randomUUID()` 
- **Stockage**: localStorage (clé: `gabstat_pulse_anonymous_id`)
- **Persistance**: Oui, persiste entre les sessions
- **Double participation**: Impossible (vérification unique sur surveyId + anonymousId)

### 6. Message de succès et redirection
- **État**: ✅ FONCTIONNEL
- **Message**: "Merci pour votre participation !"
- **Redirection**: Vers `/surveys` après 3 secondes
- **Animation**: Transitions fluides

---

## ✅ Parcours 2: Participer en tant qu'utilisateur connecté

### 1. Connexion (via NextAuth)
- **État**: ✅ FONCTIONNEL
- **Providers**: Google OAuth configuré
- **Session**: Récupérée sur chaque requête

### 2. Participation
- **État**: ✅ FONCTIONNEL
- **userId**: Automatiquement détecté de la session
- **Vérification double réponse**: Oui, par userId + surveyId
- **Erreur**: "Vous avez déjà répondu à ce sondage"

---

## ✅ Parcours 3: Exporter les résultats

### 1. Accès à la page d'exports
- **État**: ✅ FONCTIONNEL
- **URL**: `/admin/exports`
- **Accès**: Via bouton "Exports" dans `/admin`
- **Authentification**: Requise (NextAuth)

### 2. Sélection du sondage
- **État**: ✅ FONCTIONNEL
- **API**: GET `/api/surveys` retourne tous les sondages
- **Affichage**: Liste triée avec nombre de réponses

### 3. Filtres avancés
- **État**: ✅ FONCTIONNEL
- **Filtres disponibles**:
  - ✅ Date de début
  - ✅ Date de fin
  - ✅ Réponses anonymes uniquement
  - ✅ Utilisateurs connectés uniquement

### 4. Récupération des données
- **État**: ✅ FONCTIONNEL
- **API**: GET `/api/surveys/{id}/responses?...filters`
- **Vérifications**:
  - ✅ Authentification requise
  - ✅ Vérification que l'utilisateur est le créateur
  - ✅ Filtrage par date, type d'utilisateur
- **Données retournées**: 
  - ID, date, utilisateur, email, région, réponses

### 5. Export CSV
- **État**: ✅ FONCTIONNEL
- **Données**: Formatées et téléchargées
- **Format**: CSV avec en-têtes et guillemets échappés
- **Nom du fichier**: `{titre_sondage}_{date}.csv`

### 6. Export Excel (XLSX)
- **État**: ⚠️ À IMPLÉMENTER
- **Dépendance**: `npm install xlsx`
- **Code**: Créé, en attente d'installation

### 7. Export PDF
- **État**: ⚠️ À IMPLÉMENTER  
- **Dépendances**: `npm install jspdf html2canvas`
- **Code**: Créé, en attente d'installation

---

## ✅ Parcours 4: Voir les statistiques

### 1. Dashboard
- **État**: ✅ FONCTIONNEL
- **URL**: `/dashboard`
- **Sélecteur de période**:
  - ✅ Aujourd'hui
  - ✅ 7 jours
  - ✅ 30 jours
  - ✅ 90 jours
  - ✅ Cette année
  - ✅ Personnalisée (date range picker)

### 2. Statistiques temps réel
- **État**: ✅ FONCTIONNEL
- **API**: GET `/api/stats`
- **Données mises à jour**: Après chaque réponse soumise
- **Graphiques**: Recharts configurés

---

## 📊 Table Statistiques

| Fonctionnalité | Status | Notes |
|---|---|---|
| Bouton Participer | ✅ | Redirection fonctionnelle |
| Soumettre réponses | ✅ | API complète avec validation |
| Participation anonyme | ✅ | anonymousId généré et persisté |
| Stockage responses | ✅ | Prisma + optionnel localStorage |
| Double participation | ✅ | Impossible (unique constraints) |
| Export CSV | ✅ | Prêt à l'emploi |
| Export Excel | ⚠️ | Code prêt, dépendance à installer |
| Export PDF | ⚠️ | Code prêt, dépendances à installer |
| Filtres export | ✅ | Date, utilisateur, région |
| Dashboard | ✅ | Sélecteur de période ajouté |
| Page admin/exports | ✅ | Créée et intégrée |

---

## 🔍 Vérifications de sécurité

### Authentification
- ✅ NextAuth session vérifié sur PUT/DELETE/POST
- ✅ Vérification creatorId pour modifications
- ✅ Pas de données personnelles exposées inutilement

### Validation
- ✅ Zod schema vérifié
- ✅ Prisma unique constraints
- ✅ Message d'erreur utilisateur-friendly

### Privacy
- ✅ Participation anonyme possible
- ✅ anonymousId ne lie pas à l'utilisateur
- ✅ Données sensibles filtrées

---

## 📝 Instructions d'installation

Avant de déployer, installer les dépendances optionnelles:

```bash
# Pour Excel export
npm install xlsx

# Pour PDF export  
npm install jspdf html2canvas

# Générer les types Prisma
npm run prisma:generate

# Appliquer les migrations
npm run prisma:migrate
```

---

## 🚀 Commandes de déploiement

```bash
# Build
npm run build

# Tester localement
npm run dev

# Type-check
npm run type-check

# Vérifier la base de données
npm run prisma:studio
```

---

## ✨ Résumé des changements

### Fichiers modifiés
1. `prisma/schema.prisma` - Ajout anonymousId, userId optionnel
2. `app/surveys/page.tsx` - Correction bouton Participer
3. `app/surveys/[id]/page.tsx` - Correction submit API
4. `app/admin/page.tsx` - Lien vers exports
5. `app/dashboard/page.tsx` - Sélecteur de période

### Fichiers créés
1. `hooks/useAnonymousId.ts` - Gestion anonymousId
2. `lib/schemas.ts` - Validation Zod
3. `lib/exportUtils.ts` - Utilitaires export
4. `app/api/surveys/[id]/submit/route.ts` - API soumission
5. `app/api/surveys/[id]/responses/route.ts` - API récupération réponses
6. `app/admin/exports/page.tsx` - Page d'exports
