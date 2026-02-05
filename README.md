## Mini plateforme de gestion de campagnes publicitaires

Projet fullstack simple pour gérer des campagnes digitales (contexte AdTech) avec :

- **Backend**: Node.js + Express + MongoDB, documentation **Swagger**
- **Frontend**: React + Vite + TypeScript + **Tailwind CSS**


🔗 **Liens du projet**

👉 Vous pouvez consulter l’application en ligne et la documentation via les liens suivants :20

- 📘 **Documentation Backend (Swagger)**  
  https://adtech-xtay.onrender.com/api-docs

- 🌐 **Application Frontend**  
  https://adtech-vert.vercel.app/

---

### 1. Structure du projet

- **`adtech-backend`**: API REST pour gérer les campagnes
  - `server.js`: bootstrap Express, CORS, connexion MongoDB, Swagger
  - `models/Campaign.js`: schéma Mongoose
  - `services/campaignService.js`: logique métier pure
  - `controllers/campaignController.js`: contrôleurs fins, orientés HTTP
  - `routes/campaignRoutes.js`: routes REST + documentation Swagger
  - `validations/`: validation centralisée (Joi)
    - `campaignValidation.js`: validation des campagnes
    - `statusValidation.js`: validation des statuts
    - `queryValidation.js`: validation des paramètres de requête
    - `validationUtils.js`: utilitaires de validation
- **`adtech-frontend`**: SPA React
  - `src/App.tsx`: layout général + routing (React Router)
  - `src/pages/CampaignList.tsx`: liste des campagnes + CTR
  - `src/pages/CampaignCreate.tsx`: création de campagne
  - `src/pages/CampaignDetail.tsx`: détail + stats (CTR, CPC) + toggle statut
  - `src/api.ts`: wrapper d’appels API typés
  - `src/components/*`: petites briques UI réutilisables

---

### 2. Backend – Lancer l’API

#### Prérequis

- Node.js (version LTS)
- MongoDB accessible (local ou cloud)

#### Installation

Dans `adtech-backend` :

```bash
cd adtech-backend
npm install
```

Crée un fichier `.env` dans `adtech-backend` avec au minimum :

```bash
MONGO_URI=mongodb://localhost:27017/adtech-db
PORT=5000
```

#### Démarrer le serveur

```bash
npm run start:dev
```

L’API sera disponible sur `http://localhost:5000/api`.

#### Endpoints principaux

- **POST** `/api/campaigns` → créer une campagne
- **GET** `/api/campaigns` → lister les campagnes (avec filtres + pagination légère)
  - Query params:
    - `status` (optional) : `active | paused | finished`
    - `page`, `limit` (optionnels)
- **GET** `/api/campaigns/:id` → détail d’une campagne
- **PATCH** `/api/campaigns/:id/status` → activer / mettre en pause / terminer
- **GET** `/api/campaigns/:id/stats` → retourne:
  - **CTR** (clicks / impressions \* 100)
  - **CPC** (budget / clicks)

#### Documentation Swagger

Une documentation interactive est exposée via Swagger UI :

- URL: `http://localhost:5000/api-docs`

#### Script de seed (campagne d'exemple)

Pour créer rapidement une campagne de démonstration dans la base Mongo, un script est fourni :

```bash
cd adtech-backend
npm run seed
```

Le script `scripts/seedCampaign.js` crée une campagne "Campagne CTV Q2" pour l'annonceur "RetailSpot" avec un budget, des impressions et des clicks afin d'avoir immédiatement des statistiques (CTR, CPC) visibles côté frontend.

Les schémas et endpoints sont décrits avec des commentaires JSDoc dans `routes/campaignRoutes.js`.

---

### 3. Frontend – Lancer l’interface

#### Installation

Dans `adtech-frontend` :

```bash
cd adtech-frontend
npm install
```

Par défaut, le frontend consomme l’API sur `http://localhost:5000/api`.  
Tu peux surcharger via un fichier `.env` dans `adtech-frontend`:

```bash
VITE_API_URL=http://localhost:5000/api
```

#### Démarrer le frontend

```bash
npm run dev
```

Interface disponible sur l’URL affichée par Vite (souvent `http://localhost:5173`).

---

### 4. UX / pages implémentées

- **Liste des campagnes** (`/`)
  - Tableau lisible avec:
    - Nom de la campagne
    - Annonceur
    - Statut (badge coloré)
    - Budget
    - Impressions
    - Clicks
    - **CTR** (calculé côté front)
  - Filtre simple par **statut**.
  - CTA « + Nouvelle campagne ».

- **Création de campagne** (`/campaigns/new`)
  - Formulaire minimal:
    - Nom
    - Annonceur
    - Budget
    - Dates de début / fin
    - Statut initial
    - Impressions & clicks (optionnels, pour seed des stats)
  - Validation basique HTML + validation approfondie côté backend (Joi).
  - En cas de succès: redirection vers la page détail.

- **Détail de campagne** (`/campaigns/:id`)
  - Affiche:
    - Métadonnées de la campagne (nom, annonceur, période, statut)
    - Statistiques agrégées:
      - Budget total
      - Impressions
      - Clicks
      - **CTR** (via `/campaigns/:id/stats`)
      - **CPC** expliqué (budget / clicks)
  - Bouton **Activer / Mettre en pause**:
    - Toggle entre `active` et `paused` via `/campaigns/:id/status`
    - Une campagne `finished` est non modifiable.

---

### 5. Choix techniques

#### Backend

**Stack principale**
- **Node.js + Express** : Stack JavaScript standard, très répandue et facilement maintenable. Express offre une API simple pour créer des routes REST sans surcharge.
- **MongoDB + Mongoose** : Base de données NoSQL flexible pour stocker les campagnes. Mongoose apporte la validation au niveau schéma et une API ODM claire.

**Architecture**
- **Pattern Service / Controller** : Séparation claire des responsabilités
  - `controllers/` : Gestion des requêtes HTTP (codes de statut, format des réponses)
  - `services/` : Logique métier pure, indépendante de Express
  - `models/` : Schémas Mongoose pour la persistance
  - `routes/` : Définition des endpoints + documentation Swagger
  - `validations/` : Validation centralisée et réutilisable (Joi)

**Validation**
- **Joi** : Validation de schémas avec messages d'erreur personnalisés en français
  - Validation des données de campagne (dates, budget, statuts)
  - Validation des paramètres de requête (pagination, filtres)
  - Messages d'erreur clairs pour une meilleure DX
- **Dossier `validations/` dédié** : Organisation claire avec fichiers séparés par domaine
  - `campaignValidation.js` : Schémas de validation des campagnes
  - `statusValidation.js` : Validation des statuts
  - `queryValidation.js` : Validation des query params (pagination, filtres)
  - `validationUtils.js` : Utilitaires partagés (formatage d'erreurs)

**Documentation API**
- **Swagger (swagger-jsdoc + swagger-ui-express)** : Documentation interactive auto-générée depuis les commentaires JSDoc
  - Documentation accessible sur `/api-docs`
  - Schémas OpenAPI 3.0 définis dans les routes
  - Permet de tester l'API directement depuis le navigateur

**Gestion des erreurs**
- Erreurs de validation avec `statusCode: 400` pour distinguer les erreurs client
- Messages d'erreur en français pour une meilleure compréhension
- Gestion centralisée dans les contrôleurs avec try/catch

**Sécurité & CORS**
- **CORS activé** : Permet au frontend de consommer l'API depuis un domaine différent
- **dotenv** : Gestion des variables d'environnement (MONGO_URI, PORT)

**Calculs métier**
- **CTR (Click-Through Rate)** : `(clicks / impressions) * 100` avec protection division par zéro
- **CPC (Cost Per Click)** : `budget / clicks` avec protection division par zéro
- Logique métier isolée dans les services pour faciliter les tests

#### Frontend

**Stack principale**
- **React 19** : Bibliothèque UI moderne avec hooks pour gérer l'état et les effets de bord
- **TypeScript** : Typage statique pour réduire les erreurs et améliorer l'autocomplétion
- **Vite 7** : Build tool ultra-rapide avec HMR (Hot Module Replacement) pour un développement fluide
- **React Router v7** : Routing côté client pour une SPA avec navigation fluide

**Styling**
- **Tailwind CSS v4** : Framework CSS utility-first
  - Design moderne et cohérent avec peu de code
  - Classes utilitaires pour un développement rapide
  - Pas besoin de fichiers CSS séparés, tout dans le JSX
  - Intégration via `@tailwindcss/vite` pour un build optimisé

**Architecture**
- **Structure par pages** : Organisation claire avec `pages/` pour les vues principales
  - `CampaignList.tsx` : Liste avec filtres et calcul CTR
  - `CampaignDetail.tsx` : Détail avec stats (CTR, CPC) et toggle statut
  - `CampaignCreate.tsx` : Formulaire de création
- **Composants réutilisables** : `components/` pour les briques UI
  - `StatCard.tsx` : Carte de statistique avec formatage (currency, percent, integer)
  - `CampaignStatusBadge.tsx` : Badge coloré selon le statut
- **Layer API typé** : `api.ts` centralise tous les appels HTTP
  - Types TypeScript pour `Campaign`, `CampaignStatus`
  - Gestion d'erreurs normalisée
  - Configuration via variable d'environnement `VITE_API_URL`

**Gestion d'état**
- **React Hooks** : `useState` pour l'état local, `useEffect` pour les appels API
- Pas de state management externe (Redux, Zustand) : l'état est simple et local aux composants
- Pour un projet plus complexe, on pourrait introduire React Query pour le cache et la gestion des requêtes

**Validation**
- **Validation HTML5** : Validation basique côté client (required, type, min, max)
- **Validation backend** : Validation approfondie côté serveur avec Joi
- Double validation pour une meilleure UX (feedback immédiat) et sécurité (validation serveur)

**TypeScript**
- Configuration stricte (`strict: true`) pour une meilleure sécurité de type
- Types partagés entre composants et API
- Autocomplétion et détection d'erreurs à la compilation

**Build & Déploiement**
- **Build optimisé** : Vite génère un bundle optimisé pour la production
- **Type checking** : `tsc -b` vérifie les types avant le build
- **ESLint** : Linting pour maintenir la qualité du code

---

### 6. Ce que j'améliorerais avec plus de temps

- *Tests*
  - Backend: tests d’API (ex: Jest + Supertest) pour chaque endpoint clé.
  - Frontend: tests UI simples (React Testing Library) sur les flows principaux.
- *Gestion des dates / fuseaux horaires*
  - Utiliser une lib dédiée (date-fns ou dayjs) et stocker clairement en UTC.
- *Filtres et tri plus riches*
  - Filtrer par annonceur, plage de dates, budget.
  - Tri des colonnes (CTR décroissant, budget, etc.).
- *Pagination réelle côté front*
  - Barre de pagination et conservation de l’état dans l’URL (query params).
- *Gestion d’état*
  - Pour un vrai produit, introduire React Query ou un store léger pour gérer cache et erreurs.
- *Design*
  - Composants UI partagés (boutons, inputs, tableaux) centralisés.
  - Dark / light mode via Tailwind.
