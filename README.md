## Mini plateforme de gestion de campagnes publicitaires

Projet fullstack simple pour gérer des campagnes digitales (contexte AdTech) avec :

- **Backend**: Node.js + Express + MongoDB, documentation **Swagger**
- **Frontend**: React + Vite + TypeScript + **Tailwind CSS**


🔗 **Liens du projet**


- 📘 **Documentation Backend (Swagger)**  
  https://adtech-xtay.onrender.com/api-docs

- 🌐 **Application Frontend**  
  https://adtech-vert.vercel.app/

---

### 1. Structure du projet

- **`adtech-backend`**: API REST pour gérer les campagnes
  - `server.js`: bootstrap Express, CORS, connexion MongoDB, Swagger
  - `models/Campaign.js`: schéma Mongoose
  - `services/campaignService.js`: logique métier + validation Joi
  - `controllers/campaignController.js`: contrôleurs fins, orientés HTTP
  - `routes/campaignRoutes.js`: routes REST + documentation Swagger
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

#### Choix techniques backend

- **Express + Mongoose**: stack très standard, lisible en entretien.
- **Pattern service / controller**:
  - `services/campaignService.js`: logique métier, validation, pagination, stats.
  - `controllers`: se concentrent sur les codes HTTP et la forme des réponses.
- **Validation Joi**:
  - Vérifie les champs requis (`name`, `advertiser`, `budget`, `startDate`, `endDate`…)
  - Contrainte métier: `endDate >= startDate`
  - Gère les statuts (`active | paused | finished`) et les valeurs numériques >= 0.
- **Stats**:
  - CTR: protégé contre la division par zéro (0 si pas d’impressions).
  - CPC: 0 si aucun clic.

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

#### Choix techniques frontend

- **React + Vite**: démarrage très rapide, DX simple.
- **Tailwind v4**: permet un design propre en quelques classes utilitaires.
- **React Router**:
  - 3 routes claires: liste, création, détail.
  - Layout simple avec barre de navigation et CTA.
- **Layer API typé** (`src/api.ts`):
  - Centralise l’URL de l’API (`VITE_API_URL`).
  - Types pour `Campaign`, `CampaignStatus`.
  - Erreurs API normalisées (`throw new Error(message)`).