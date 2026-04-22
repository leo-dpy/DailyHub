# 📊 DailyHub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

**DailyHub** est une Single Page Application (SPA) ultra-moderne conçue comme un tableau de bord personnel interactif. Architecture "No-Backend", 100% de l'interface est générée à la volée côté client grâce à JavaScript et Vite, puis hébergée pour la production via Nginx sous Docker.

![Bento Grid Design](https://img.shields.io/badge/Design-Bento_Box-blueviolet)

---

## 🚀 Fonctionnalités Clés

- **Météo Dynamique** : Température en temps réel et prévisions avec recherche de ville (OpenWeather API). *Mémoire locale active.*
- **Scores de Foot en Direct** : Suivi des ligues européennes majeures avec traduction du statut et timer écoulé (API-Sports).
- **Marchés Financiers** : Ticker des bourses majeures en temps réel (Finnhub API).
- **Sur le Web (News)** : Actualités en direct filtrées, présentées subtilement (NewsAPI).
- **Gestionnaire de Tâches** : "To-do list" épurée avec sauvegarde automatique et persistante (appuyez sur "Entrée" pour interagir).
- **Lecteur Radio de Fond** : Lecteur YouTube invisible intégré pour diffuser de la musique d'ambiance (YouTube Iframe API).
- **Horloge Magistrale** : Horloge à la seconde, accompagnée d'un affichage de la date complète en temps réel.
- **Expérience Immersive** : Bouton natif pour passer le tableau de bord en mode plein-écran en un clic.

---

## 🛠️ Architecture Techniques & Choix

1. **Manipulation Pure du DOM** : L'`index.html` est totalement vide de contenu dur (`<div id="app"></div>`). L'intégralité de l'interface est fabriquée en Vanilla JavaScript via une usine à composants en s'appuyant sur les méthodes du DOM (`document.createElement`, etc).
2. **Asynchrone et APIs** : L'app compile et synchronise plusieurs requêtes `fetch` asynchrones puissantes sans surcharger l'UI (promesses, typage logique).
3. **Persistance des Données** : Implémentation stricte du `localStorage` pour préserver le contexte utilisateur (tasks et choix météo) au travers des rafraîchissements de la fenêtre.
4. **CSS Grid Avancé** : L'UI utilise le concept de **Bento Box** propulsé par la propriété `Grid areas`, assurant un affichage `100vh` net, sans scrolldown superflu.

---

## 📦 Organisation du Monorepo

* 📁 `frontend/` : Contient l'application Javascript, le code source, ses vues, modules et assets. Géré par **Vite**.
* 📁 `ynov/` : Rapport de projet Javascript expliquant les spécificités techniques face aux prérequis (académique).
* 📄 `Dockerfile` / `nginx.conf` : Fichiers racines gérant le packaging conteneurisé destiné au VPS / Coolify.

---

## 💻 Instructions d'Installation (Développement)

Pour faire tourner le projet localement afin de tester l'intégration, vous aurez besoin de `Node.js` et d'une clé API valide de votre choix pour l'implémentation.

```bash
# 1. Créez et configurez vos clés d'APIs dans le fichier `.env` situé à la racine du projet
# 2. Entrez dans le workspace de l'application
cd frontend

# 3. Installez les dépendances nécessaires
npm install

# 4. Lancez l'environnement de développement en direct
npm run dev
```

---

## 🚢 Déploiement en Production (Docker)

Le projet utilise un modèle **Multi-Stage Build** extrêmement optimisé pour être déployé sur un VPS ou Coolify. 
* **Stage 1 (Node)* : Construit l'artefact de développement (Build `dist`).
* **Stage 2 (Nginx)* : Expose les fichiers statiques de façon légère sans conserver les sources ou l'environnement de build, épaulé par la fameuse configuration `nginx.conf` pour gérer le cache et les routes.

---
*Conçu avec agilité pour allier modernité, architecture pure et esthétisme.*
