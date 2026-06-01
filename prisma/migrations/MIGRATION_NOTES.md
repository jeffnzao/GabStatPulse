# Migration Prisma - Ajout de la participation anonyme

Cette migration ajoute le support pour les réponses anonymes à GabStat Pulse.

## Changements

- Rend `userId` optionnel dans le modèle `Response`
- Ajoute le champ `anonymousId` optionnel pour identifier les utilisateurs anonymes
- Ajoute les contraintes `@@unique` pour empêcher les réponses dupliquées

## Instructions

Pour appliquer cette migration, exécutez:

```bash
npm run prisma:migrate
```

Ou si vous déployez sur une nouvelle base de données:

```bash
npx prisma db push
```

## Rollback

Pour annuler la migration (si nécessaire):

```bash
npx prisma migrate resolve --rolled-back
```
